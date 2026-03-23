interface BotConfig {
    name: string;
    avatar: string;
    tone: 'friendly' | 'professional' | 'casual';
    greeting: {
        en: string;
        ko: string;
    };
}
interface CTAButton {
    text: {
        en: string;
        ko: string;
    };
    url: string;
}
interface CTAConfig {
    primary: CTAButton;
    secondary?: CTAButton;
}
interface PresetQuestion {
    en: string;
    ko: string;
}
interface EmailFormField {
    name: string;
    type: 'text' | 'email' | 'tel';
    required: boolean;
    label: {
        en: string;
        ko: string;
    };
    placeholder?: {
        en: string;
        ko: string;
    };
}
interface EmailFormConfig {
    enabled: boolean;
    fields: EmailFormField[];
    submit_text: {
        en: string;
        ko: string;
    };
    success_message: {
        en: string;
        ko: string;
    };
}
interface LimitsConfig {
    max_messages_per_session: number;
    soft_cta_after: number;
    hard_redirect_after: number;
    max_input_length: number;
}
interface CostSafetyConfig {
    monthly_budget_usd: number;
    daily_budget_usd: number;
    kill_switch_usd: number;
    max_sessions_per_day: number;
    rate_limit_per_minute: number;
}
interface SecurityConfig {
    blocked_keywords: string[];
}
interface ServiceConfig {
    name: string;
    fallback_message: {
        en: string;
        ko: string;
    };
}
interface AppConfig {
    bot: BotConfig;
    service: ServiceConfig;
    cta: CTAConfig;
    presets: PresetQuestion[];
    email_form: EmailFormConfig;
    limits: LimitsConfig;
    cost_safety: CostSafetyConfig;
    security: SecurityConfig;
    brand_color: string;
}
interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    follow_up_questions?: string[];
}
interface ChatSession {
    session_id: string;
    created_at: string;
    language: 'en' | 'ko';
    message_count: number;
    fallback_count: number;
    converted_to: 'email' | 'get-started' | null;
    messages: ChatMessage[];
    email_submitted: string | null;
    metadata: {
        page_url?: string;
        referrer?: string;
    };
    cost_usd: number;
}
type Language = 'en' | 'ko';
interface FollowUpSuggestions {
    follow_up_questions: string[];
}

export type { AppConfig as A, BotConfig as B, CTAButton as C, EmailFormConfig as E, FollowUpSuggestions as F, Language as L, PresetQuestion as P, SecurityConfig as S, CTAConfig as a, ChatMessage as b, ChatSession as c, CostSafetyConfig as d, EmailFormField as e, LimitsConfig as f, ServiceConfig as g };
