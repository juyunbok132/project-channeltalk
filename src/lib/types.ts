// project-channeltalk 타입 정의

export interface BotConfig {
  name: string
  avatar: string
  tone: 'friendly' | 'professional' | 'casual'
  greeting: {
    en: string
    ko: string
  }
}

export interface CTAButton {
  text: { en: string; ko: string }
  url: string
}

export interface CTAConfig {
  primary: CTAButton
  secondary?: CTAButton
}

export interface PresetQuestion {
  en: string
  ko: string
}

export interface EmailFormField {
  name: string
  type: 'text' | 'email' | 'tel'
  required: boolean
  label: { en: string; ko: string }
  placeholder?: { en: string; ko: string }
}

export interface EmailFormConfig {
  enabled: boolean
  fields: EmailFormField[]
  submit_text: { en: string; ko: string }
  success_message: { en: string; ko: string }
}

export interface LimitsConfig {
  max_messages_per_session: number
  soft_cta_after: number
  hard_redirect_after: number
  max_input_length: number
}

export interface CostSafetyConfig {
  monthly_budget_usd: number
  daily_budget_usd: number
  kill_switch_usd: number
  max_sessions_per_day: number
  rate_limit_per_minute: number
}

export interface SecurityConfig {
  blocked_keywords: string[]
}

export interface ServiceConfig {
  name: string
  fallback_message: {
    en: string
    ko: string
  }
}

export interface AppConfig {
  bot: BotConfig
  service: ServiceConfig
  cta: CTAConfig
  presets: PresetQuestion[]
  email_form: EmailFormConfig
  limits: LimitsConfig
  cost_safety: CostSafetyConfig
  security: SecurityConfig
  brand_color: string
}

// 세션 관련 타입
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  follow_up_questions?: string[]
}

export interface ChatSession {
  session_id: string
  created_at: string
  language: 'en' | 'ko'
  message_count: number
  fallback_count: number
  converted_to: 'email' | 'get-started' | null
  messages: ChatMessage[]
  email_submitted: string | null
  metadata: {
    page_url?: string
    referrer?: string
  }
  cost_usd: number
}

export type Language = 'en' | 'ko'

// 후속 질문 JSON 구조
export interface FollowUpSuggestions {
  follow_up_questions: string[]
}
