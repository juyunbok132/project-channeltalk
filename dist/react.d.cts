import * as react_jsx_runtime from 'react/jsx-runtime';

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
    model: string;
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
interface LanguageConfig {
    default: Language;
    supported: Language[];
    auto_detect: boolean;
    switch_button: boolean;
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
    language: LanguageConfig;
}
type Language = 'en' | 'ko';

interface ChatWidgetProps {
    config: AppConfig;
    apiEndpoint?: string;
}
declare function ChatWidget({ config, apiEndpoint }: ChatWidgetProps): react_jsx_runtime.JSX.Element;

interface ChatWidgetWrapperProps {
    config?: AppConfig;
    configEndpoint?: string;
    chatEndpoint?: string;
}
declare function ChatWidgetWrapper({ config: directConfig, configEndpoint, chatEndpoint, }: ChatWidgetWrapperProps): react_jsx_runtime.JSX.Element | null;

interface AdminDashboardProps {
    password: string;
    apiEndpoint?: string;
}
declare function AdminDashboard({ password, apiEndpoint }: AdminDashboardProps): react_jsx_runtime.JSX.Element;

interface AdminLoginProps {
    onLogin: (password: string) => void;
}
declare function AdminLogin({ onLogin }: AdminLoginProps): react_jsx_runtime.JSX.Element;

export { AdminDashboard, AdminLogin, type AppConfig, ChatWidget, ChatWidgetWrapper };
