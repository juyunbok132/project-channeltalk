'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import type { UIMessage } from 'ai'
import { ChatMessage } from './ChatMessage'
import { PresetButtons } from './PresetButtons'
import { FollowUpButtons } from './FollowUpButtons'
import { EmailForm } from './EmailForm'
import { CTABanner } from './CTABanner'
import type { AppConfig, Language } from '../../lib/types'

interface ChatWidgetProps {
  config: AppConfig
  apiEndpoint?: string
}

type FunnelState = 'normal' | 'soft_cta' | 'hard_redirect' | 'blocked'

function getTextFromMessage(message: UIMessage): string {
  if (message.parts) {
    return message.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p) => p.text)
      .join('')
  }
  return ''
}

export function ChatWidget({ config, apiEndpoint = '/api/chat' }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [language, setLanguage] = useState<Language>(config.language?.default || 'en')
  const [funnelState, setFunnelState] = useState<FunnelState>('normal')
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([])
  const [showPresets, setShowPresets] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: apiEndpoint }),
    onFinish: ({ message }: { message: UIMessage }) => {
      const text = getTextFromMessage(message)
      // 첫 AI 응답 후 프리셋 질문 표시
      setShowPresets(true)
      // 후속 질문 파싱
      const jsonMatch = text.match(/```json\s*\n?([\s\S]*?)\n?\s*```/)
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1])
          setFollowUpQuestions(parsed.follow_up_questions || [])
        } catch {
          setFollowUpQuestions([])
        }
      }
    },
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  // 스크롤 자동 하단 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, followUpQuestions])

  const doSendMessage = useCallback(
    (text: string) => {
      setFollowUpQuestions([])
      setInputValue('')

      // 언어 감지
      const koreanChars = text.match(/[\uAC00-\uD7AF]/g)
      if (koreanChars && koreanChars.length > 0) {
        setLanguage('ko')
      } else {
        setLanguage('en')
      }

      setMessageCount((c) => c + 1)
      sendMessage({
        text,
      }, {
        body: { sessionId },
      })
    },
    [sendMessage, sessionId]
  )

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return
    doSendMessage(inputValue.trim())
  }

  const isBlocked = messageCount >= config.limits.max_messages_per_session

  // 퍼널 상태 계산
  useEffect(() => {
    if (messageCount >= config.limits.hard_redirect_after) {
      setFunnelState('hard_redirect')
    } else if (messageCount >= config.limits.soft_cta_after) {
      setFunnelState('soft_cta')
    } else {
      setFunnelState('normal')
    }
  }, [messageCount, config.limits])

  return (
    <>
      {/* 플로팅 버블 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform z-50"
          style={{ backgroundColor: config.brand_color }}
          aria-label="Open chat"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* 채팅 패널 */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200">
          {/* 헤더 */}
          <div
            className="flex items-center gap-3 px-4 py-3 text-white"
            style={{ backgroundColor: config.brand_color }}
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
              {config.bot.avatar ? (
                <img src={config.bot.avatar} alt={config.bot.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold">
                  {config.bot.name[0]}
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{config.bot.name}</p>
              <p className="text-xs opacity-80">Online</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* 메시지 영역 */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
            {/* 인사말 */}
            {messages.length === 0 && (
              <div className="mb-4">
                <ChatMessage
                  role="assistant"
                  content={config.bot.greeting[language]}
                  botName={config.bot.name}
                  botAvatar={config.bot.avatar}
                  brandColor={config.brand_color}
                />
              </div>
            )}

            {/* 프리셋 버튼 */}
            {showPresets && (
              <PresetButtons
                presets={config.presets}
                language={language}
                onSelect={doSendMessage}
                brandColor={config.brand_color}
              />
            )}

            {/* 대화 메시지 */}
            {messages.map((msg, i) => {
              const text = getTextFromMessage(msg)
              if (!text) return null

              return (
                <div key={msg.id}>
                  <ChatMessage
                    role={msg.role as 'user' | 'assistant'}
                    content={text}
                    botName={config.bot.name}
                    botAvatar={config.bot.avatar}
                    brandColor={config.brand_color}
                  />
                  {/* 마지막 assistant 메시지 뒤에 후속 질문 */}
                  {msg.role === 'assistant' &&
                    i === messages.length - 1 &&
                    !isLoading &&
                    followUpQuestions.length > 0 && (
                      <FollowUpButtons questions={followUpQuestions} onSelect={doSendMessage} />
                    )}
                </div>
              )
            })}

            {/* 로딩 표시 */}
            {isLoading && (
              <div className="flex gap-2 mb-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                  <div
                    className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: config.brand_color }}
                  >
                    {config.bot.name[0]}
                  </div>
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* 하드 리다이렉트: 이메일 폼 */}
            {funnelState === 'hard_redirect' && config.email_form.enabled && (
              <div className="mt-4">
                <EmailForm
                  config={config.email_form}
                  language={language}
                  brandColor={config.brand_color}
                  onSubmit={(data) => {
                    fetch('/api/chat-email', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(data),
                    })
                  }}
                />
              </div>
            )}
          </div>

          {/* 소프트 CTA */}
          {funnelState === 'soft_cta' && (
            <CTABanner cta={config.cta} language={language} brandColor={config.brand_color} />
          )}

          {/* 입력 영역 */}
          <div className="border-t border-gray-100 px-4 py-3">
            {isBlocked ? (
              <div className="text-center text-sm text-gray-500 py-2">
                {language === 'ko'
                  ? '대화 한도에 도달했습니다.'
                  : 'You have reached the message limit.'}
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    language === 'ko' ? '메시지를 입력하세요...' : 'Type a message...'
                  }
                  disabled={isLoading || funnelState === 'hard_redirect'}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50"
                  style={{ '--tw-ring-color': config.brand_color } as React.CSSProperties}
                  maxLength={config.limits.max_input_length}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 rounded-lg text-white disabled:opacity-50 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: config.brand_color }}
                  aria-label="Send"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
