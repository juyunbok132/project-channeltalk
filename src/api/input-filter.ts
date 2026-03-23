import type { AppConfig } from '../lib/types'

export interface FilterResult {
  allowed: boolean
  reason?: string
}

export function filterInput(input: string, config: AppConfig): FilterResult {
  // 1. 빈 입력 체크
  const trimmed = input.trim()
  if (!trimmed) {
    return { allowed: false, reason: 'empty_input' }
  }

  // 2. 길이 제한
  if (trimmed.length > config.limits.max_input_length) {
    return { allowed: false, reason: 'too_long' }
  }

  // 3. 금지 키워드 차단 (대소문자 무시)
  const lower = trimmed.toLowerCase()
  for (const keyword of config.security.blocked_keywords) {
    if (lower.includes(keyword.toLowerCase())) {
      return { allowed: false, reason: 'blocked_keyword' }
    }
  }

  return { allowed: true }
}

/**
 * AI 응답에서 system prompt 노출 여부 필터링
 */
export function filterOutput(output: string): string {
  const sensitivePatterns = [
    /\[KNOWLEDGE\]/gi,
    /\[END KNOWLEDGE\]/gi,
    /system prompt/gi,
    /## RULES/gi,
  ]

  let filtered = output
  for (const pattern of sensitivePatterns) {
    filtered = filtered.replace(pattern, '[REDACTED]')
  }

  return filtered
}
