// project-channeltalk — Main entry point
// Types + utilities

export type {
  AppConfig,
  BotConfig,
  CTAConfig,
  CTAButton,
  PresetQuestion,
  EmailFormConfig,
  EmailFormField,
  LimitsConfig,
  CostSafetyConfig,
  SecurityConfig,
  ServiceConfig,
  ChatMessage,
  ChatSession,
  SessionMetadata,
  Language,
  FollowUpSuggestions,
} from './lib/types'

export { loadConfig, clearConfigCache } from './lib/config-loader'
export { loadKnowledge, clearKnowledgeCache } from './lib/knowledge-loader'
