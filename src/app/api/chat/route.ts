import { createChatHandler } from '@/api/chat-handler'

export const { POST } = createChatHandler({
  knowledgePath: './chatbot/knowledge.md',
  configPath: './chatbot/config.yaml',
})
