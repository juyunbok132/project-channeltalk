import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import type { AppConfig } from './types'

let cachedConfig: AppConfig | null = null

const DEFAULT_CONFIG: AppConfig = {
  bot: {
    name: 'Assistant',
    avatar: '/avatar.png',
    tone: 'friendly',
    greeting: { en: 'Hi! How can I help?', ko: '안녕하세요! 무엇을 도와드릴까요?' },
  },
  service: {
    name: 'Our Service',
    fallback_message: {
      en: "I don't have information about that. Let me connect you with our team.",
      ko: '해당 내용에 대한 정보가 없습니다. 담당자에게 연결해 드리겠습니다.',
    },
  },
  cta: {
    primary: {
      text: { en: 'Get started →', ko: '시작하기 →' },
      url: '/get-started',
    },
  },
  presets: [],
  email_form: {
    enabled: true,
    fields: [
      {
        name: 'email',
        type: 'email',
        required: true,
        label: { en: 'Email', ko: '이메일' },
        placeholder: { en: 'your@email.com', ko: 'your@email.com' },
      },
    ],
    submit_text: { en: 'Submit', ko: '제출하기' },
    success_message: {
      en: "Thank you! We'll get back to you soon.",
      ko: '감사합니다! 곧 연락드리겠습니다.',
    },
  },
  limits: {
    max_messages_per_session: 10,
    soft_cta_after: 3,
    hard_redirect_after: 7,
    max_input_length: 500,
  },
  cost_safety: {
    monthly_budget_usd: 30,
    daily_budget_usd: 1.0,
    kill_switch_usd: 27,
    max_sessions_per_day: 50,
    rate_limit_per_minute: 5,
  },
  security: {
    blocked_keywords: [],
  },
  brand_color: '#6366f1',
  language: {
    default: 'en',
    supported: ['en', 'ko'],
    auto_detect: false,
    switch_button: false,
  },
}

export function loadConfig(configPath?: string): AppConfig {
  if (cachedConfig) return cachedConfig

  const resolvedPath = configPath || path.join(/* turbopackIgnore: true */ process.cwd(), 'chatbot', 'config.yaml')

  if (!fs.existsSync(resolvedPath)) {
    console.warn(`Config file not found at ${resolvedPath}, using defaults`)
    cachedConfig = DEFAULT_CONFIG
    return cachedConfig
  }

  const raw = fs.readFileSync(resolvedPath, 'utf-8')
  const parsed = yaml.load(raw) as Record<string, unknown>

  const merged = deepMerge(DEFAULT_CONFIG as unknown as Record<string, unknown>, parsed) as unknown as AppConfig

  // preset_questions (yaml) → presets (code) 변환
  const pq = parsed.preset_questions as Record<string, string[]> | undefined
  if (pq) {
    const enList = pq.en || []
    const koList = pq.ko || []
    const maxLen = Math.max(enList.length, koList.length)
    merged.presets = Array.from({ length: maxLen }, (_, i) => ({
      en: enList[i] || '',
      ko: koList[i] || '',
    }))
  }

  cachedConfig = merged
  return cachedConfig
}

export function clearConfigCache() {
  cachedConfig = null
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target }
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(
        target[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>
      )
    } else {
      result[key] = source[key]
    }
  }
  return result
}
