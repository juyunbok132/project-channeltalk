import { A as AppConfig } from './types-C9uvwL4W.js';
export { B as BotConfig, C as CTAButton, a as CTAConfig, b as ChatMessage, c as ChatSession, d as CostSafetyConfig, E as EmailFormConfig, e as EmailFormField, F as FollowUpSuggestions, L as Language, f as LimitsConfig, P as PresetQuestion, S as SecurityConfig, g as ServiceConfig } from './types-C9uvwL4W.js';

declare function loadConfig(configPath?: string): AppConfig;
declare function clearConfigCache(): void;

declare function loadKnowledge(knowledgePath?: string): string;
declare function clearKnowledgeCache(): void;

export { AppConfig, clearConfigCache, clearKnowledgeCache, loadConfig, loadKnowledge };
