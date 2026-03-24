import { anthropic } from '@ai-sdk/anthropic'
import { streamText, createUIMessageStreamResponse } from 'ai'
import { loadConfig } from '../lib/config-loader'
import { loadKnowledge } from '../lib/knowledge-loader'
import { buildSystemPrompt } from './system-prompt'
import { filterInput, filterOutput } from './input-filter'
import { checkBudget, calculateCost, recordCost, recordSession } from './cost-tracker'
import { getSession, createSession, addMessage, updateSession, generateSessionId, isValidSessionId } from './session-store'
import type { Language, SessionMetadata } from '../lib/types'

interface ChatHandlerOptions {
  knowledgePath?: string
  configPath?: string
}

export function createChatHandler(options?: ChatHandlerOptions) {
  const config = loadConfig(options?.configPath)
  const knowledge = loadKnowledge(options?.knowledgePath)
  const systemPromptText = buildSystemPrompt(config, knowledge)

  async function POST(req: Request) {
    try {
      const rawIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
      const ip = rawIp // 원본 IP (rate limiting용)
      const anonymizedIp = anonymizeIp(rawIp) // 익명화 IP (세션 저장용)

      // 비용 안전장치 체크
      const budgetCheck = await checkBudget(config.cost_safety, ip)
      if (!budgetCheck.allowed) {
        return Response.json(
          { error: 'budget_exceeded', reason: budgetCheck.reason },
          { status: 429 }
        )
      }

      const userAgent = req.headers.get('user-agent') || ''
      const country = req.headers.get('x-vercel-ip-country') || ''
      const city = req.headers.get('x-vercel-ip-city') || ''

      const body = await req.json()
      const { messages, sessionId: incomingSessionId, metadata: clientMetadata } = body

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return Response.json({ error: 'invalid_messages' }, { status: 400 })
      }

      // 최신 사용자 메시지 추출 (UIMessage에서 텍스트 추출)
      const lastMessage = messages[messages.length - 1]
      const lastUserText = extractText(lastMessage)

      if (lastMessage.role === 'user' && lastUserText) {
        const filterResult = filterInput(lastUserText, config)
        if (!filterResult.allowed) {
          return Response.json(
            { error: 'input_filtered', reason: filterResult.reason },
            { status: 400 }
          )
        }
      }

      // 세션 관리 (H-5, H-6: 세션 ID 검증 + IP 바인딩)
      let sessionId = incomingSessionId
      let session = null

      if (sessionId) {
        // H-6: 세션 ID 형식 검증
        if (!isValidSessionId(sessionId)) {
          sessionId = null
        } else {
          session = await getSession(sessionId)
          // H-5: IP 바인딩 검증 — 익명화 IP가 다르면 세션 무효화
          if (session && session.metadata?.ip && session.metadata.ip !== anonymizedIp) {
            session = null
            sessionId = null
          }
        }
      }

      if (!session) {
        sessionId = generateSessionId()
        const { device, browser, os } = parseUserAgent(userAgent)
        const metadata: SessionMetadata = {
          page_url: clientMetadata?.page_url,
          referrer: clientMetadata?.referrer,
          ip: anonymizedIp,
          user_agent: userAgent,
          device,
          browser,
          os,
          country: country || undefined,
          city: city || undefined,
          visit_count: clientMetadata?.visit_count || 1,
          first_visit_at: clientMetadata?.first_visit_at,
        }
        session = await createSession(sessionId, metadata)
        await recordSession()
      }

      // 메시지 한도 체크
      if (session.message_count >= config.limits.max_messages_per_session) {
        return Response.json(
          {
            error: 'session_limit',
            sessionId,
            message_count: session.message_count,
          },
          { status: 429 }
        )
      }

      // 사용자 메시지 저장
      const now = new Date().toISOString()
      if (lastUserText) {
        await addMessage(sessionId, {
          role: 'user',
          content: lastUserText,
          timestamp: now,
        })
        await updateSession(sessionId, { last_message_at: now })
      }

      // 언어 감지
      const language = detectLanguage(lastUserText || '')
      if (session.language !== language) {
        await updateSession(sessionId, { language })
      }

      // 퍼널 상태 계산
      const nextCount = session.message_count + 1
      let funnelState = 'normal'
      if (nextCount >= config.limits.hard_redirect_after) {
        funnelState = 'hard_redirect'
      } else if (nextCount >= config.limits.soft_cta_after) {
        funnelState = 'soft_cta'
      }

      // 대화 메시지를 모델 형식으로 변환
      const modelMessages = messages
        .filter((m: { role: string }) => m.role === 'user' || m.role === 'assistant')
        .map((m: { role: string; content?: string; parts?: Array<{ type: string; text?: string }> }) => ({
          role: m.role as 'user' | 'assistant',
          content: extractText(m) || '',
        }))

      // AI 호출 (prompt caching 적용)
      const result = streamText({
        model: anthropic(config.cost_safety.model || 'claude-haiku-4-5-20251001'),
        system: [
          {
            role: 'system' as const,
            content: systemPromptText,
            providerOptions: {
              anthropic: { cacheControl: { type: 'ephemeral' } },
            },
          },
        ],
        messages: modelMessages,
        onFinish: async (event) => {
          let responseText = event.text

          // 출력 필터링
          responseText = filterOutput(responseText)

          // 후속 질문 파싱
          let followUpQuestions: string[] = []
          const jsonMatch = responseText.match(/```json\s*\n?([\s\S]*?)\n?\s*```/)
          if (jsonMatch) {
            try {
              const parsed = JSON.parse(jsonMatch[1])
              followUpQuestions = parsed.follow_up_questions || []
            } catch {
              // JSON 파싱 실패 무시
            }
          }

          // 폴백 감지
          const fallbackEn = config.service.fallback_message.en.toLowerCase()
          const fallbackKo = config.service.fallback_message.ko
          const isFallback =
            responseText.toLowerCase().includes(fallbackEn) ||
            responseText.includes(fallbackKo)

          if (isFallback) {
            await updateSession(sessionId!, {
              fallback_count: (session!.fallback_count || 0) + 1,
            })
          }

          // 응답 저장
          await addMessage(sessionId!, {
            role: 'assistant',
            content: responseText,
            timestamp: new Date().toISOString(),
            follow_up_questions: followUpQuestions,
          })

          // 비용 기록
          if (event.usage) {
            const cost = calculateCost({
              inputTokens: event.usage.inputTokens || 0,
              outputTokens: event.usage.outputTokens || 0,
              cacheReadTokens: event.usage.inputTokenDetails?.cacheReadTokens || 0,
              cacheWriteTokens: event.usage.inputTokenDetails?.cacheWriteTokens || 0,
            })
            await recordCost(cost)
            await updateSession(sessionId!, {
              cost_usd: (session!.cost_usd || 0) + cost,
            })
          }
        },
      })

      return createUIMessageStreamResponse({
        stream: result.toUIMessageStream(),
        headers: {
          'x-session-id': sessionId!,
          'x-message-count': String(nextCount),
          'x-funnel-state': funnelState,
        },
      })
    } catch (error) {
      console.error('Chat handler error:', error)
      return Response.json({ error: 'internal_error' }, { status: 500 })
    }
  }

  return { POST }
}

// UIMessage에서 텍스트 추출 (parts 또는 content 지원)
function extractText(message: { content?: string; parts?: Array<{ type: string; text?: string }> }): string | null {
  if (message.parts) {
    const textParts = message.parts
      .filter((p) => p.type === 'text' && p.text)
      .map((p) => p.text!)
    if (textParts.length > 0) return textParts.join('')
  }
  if (typeof message.content === 'string') return message.content
  return null
}

function detectLanguage(text: string): Language {
  const koreanChars = text.match(/[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/g)
  if (koreanChars && koreanChars.length > text.length * 0.1) {
    return 'ko'
  }
  return 'en'
}

function anonymizeIp(ip: string): string {
  if (ip === 'unknown') return ip
  // IPv4: 마지막 옥텟을 0으로 마스킹 (203.0.113.42 → 203.0.113.0)
  if (ip.includes('.')) {
    const parts = ip.split('.')
    parts[parts.length - 1] = '0'
    return parts.join('.')
  }
  // IPv6: 마지막 4그룹을 제거
  if (ip.includes(':')) {
    const parts = ip.split(':')
    return parts.slice(0, 4).join(':') + '::0'
  }
  return ip
}

function parseUserAgent(ua: string): { device: string; browser: string; os: string } {
  // Device
  let device = 'desktop'
  if (/tablet|ipad/i.test(ua)) device = 'tablet'
  else if (/mobile|iphone|android.*mobile/i.test(ua)) device = 'mobile'

  // Browser
  let browser = 'Unknown'
  if (/edg\//i.test(ua)) browser = 'Edge'
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome'
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox'
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari'
  else if (/opera|opr\//i.test(ua)) browser = 'Opera'

  // OS
  let os = 'Unknown'
  if (/windows/i.test(ua)) os = 'Windows'
  else if (/macintosh|mac os/i.test(ua)) os = 'macOS'
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS'
  else if (/android/i.test(ua)) os = 'Android'
  else if (/linux/i.test(ua)) os = 'Linux'

  return { device, browser, os }
}
