import type { ChatSession, ChatMessage } from '../lib/types'

// Phase 1: 인메모리 세션 저장
// Phase 2: Vercel KV로 교체
const sessions = new Map<string, ChatSession>()

export function generateSessionId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 8)
  return `s_${date}_${rand}`
}

export async function getSession(sessionId: string): Promise<ChatSession | null> {
  return sessions.get(sessionId) || null
}

export async function createSession(sessionId: string, metadata?: { page_url?: string; referrer?: string }): Promise<ChatSession> {
  const session: ChatSession = {
    session_id: sessionId,
    created_at: new Date().toISOString(),
    language: 'en',
    message_count: 0,
    fallback_count: 0,
    converted_to: null,
    messages: [],
    email_submitted: null,
    metadata: metadata || {},
    cost_usd: 0,
  }
  sessions.set(sessionId, session)
  return session
}

export async function addMessage(sessionId: string, message: ChatMessage): Promise<void> {
  const session = sessions.get(sessionId)
  if (!session) return

  session.messages.push(message)
  if (message.role === 'user') {
    session.message_count++
  }
  sessions.set(sessionId, session)
}

export async function updateSession(sessionId: string, updates: Partial<ChatSession>): Promise<void> {
  const session = sessions.get(sessionId)
  if (!session) return

  Object.assign(session, updates)
  sessions.set(sessionId, session)
}

export async function getAllSessions(): Promise<ChatSession[]> {
  return Array.from(sessions.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export async function getSessionsByFilter(filter: {
  language?: string
  converted_to?: string | null
  has_fallback?: boolean
  date_from?: string
  date_to?: string
}): Promise<ChatSession[]> {
  let result = Array.from(sessions.values())

  if (filter.language) {
    result = result.filter((s) => s.language === filter.language)
  }
  if (filter.converted_to !== undefined) {
    result = result.filter((s) => s.converted_to === filter.converted_to)
  }
  if (filter.has_fallback) {
    result = result.filter((s) => s.fallback_count > 0)
  }
  if (filter.date_from) {
    result = result.filter((s) => s.created_at >= filter.date_from!)
  }
  if (filter.date_to) {
    result = result.filter((s) => s.created_at <= filter.date_to!)
  }

  return result.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}
