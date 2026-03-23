import { createClient } from 'redis'
import type { ChatSession, ChatMessage, SessionMetadata } from '../lib/types'

// Phase 2: Redis (Upstash) 기반 세션 저장
// 세션 키: chat:session:{sessionId}
// 세션 목록: chat:session_ids (sorted set, score = created_at timestamp)
// TTL: 30일

const SESSION_PREFIX = 'chat:session:'
const SESSION_INDEX = 'chat:session_ids'
const SESSION_TTL = 60 * 60 * 24 * 30 // 30일 (초)

// Redis 클라이언트 싱글턴
let client: ReturnType<typeof createClient> | null = null

async function getClient() {
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL })
    client.on('error', (err) => console.error('Redis error:', err))
    await client.connect()
  }
  if (!client.isOpen) {
    await client.connect()
  }
  return client
}

export function generateSessionId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 8)
  return `s_${date}_${rand}`
}

export async function getSession(sessionId: string): Promise<ChatSession | null> {
  const redis = await getClient()
  const data = await redis.get(`${SESSION_PREFIX}${sessionId}`)
  if (!data) return null
  return JSON.parse(data) as ChatSession
}

export async function createSession(sessionId: string, metadata?: SessionMetadata): Promise<ChatSession> {
  const redis = await getClient()
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
  await redis.set(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(session), { EX: SESSION_TTL })
  await redis.zAdd(SESSION_INDEX, { score: Date.now(), value: sessionId })
  return session
}

export async function addMessage(sessionId: string, message: ChatMessage): Promise<void> {
  const session = await getSession(sessionId)
  if (!session) return

  session.messages.push(message)
  if (message.role === 'user') {
    session.message_count++
  }
  const redis = await getClient()
  await redis.set(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(session), { EX: SESSION_TTL })
}

export async function updateSession(sessionId: string, updates: Partial<ChatSession>): Promise<void> {
  const session = await getSession(sessionId)
  if (!session) return

  Object.assign(session, updates)
  const redis = await getClient()
  await redis.set(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(session), { EX: SESSION_TTL })
}

export async function getAllSessions(): Promise<ChatSession[]> {
  const redis = await getClient()
  // 최신순으로 세션 ID 목록 가져오기 (최대 200개)
  const sessionIds = await redis.zRange(SESSION_INDEX, 0, 199, { REV: true })
  if (!sessionIds.length) return []

  const keys = sessionIds.map((id) => `${SESSION_PREFIX}${id}`)
  const values = await redis.mGet(keys)

  return values
    .filter((v): v is string => v !== null)
    .map((v) => JSON.parse(v) as ChatSession)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function getSessionsByFilter(filter: {
  language?: string
  converted_to?: string | null
  has_fallback?: boolean
  date_from?: string
  date_to?: string
}): Promise<ChatSession[]> {
  const all = await getAllSessions()
  let result = all

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
