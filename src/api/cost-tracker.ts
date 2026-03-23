import { createClient } from 'redis'
import type { CostSafetyConfig } from '../lib/types'

// Haiku 4.5 가격 (per 1M tokens)
const PRICING = {
  input: 1.0,
  output: 5.0,
  cache_write: 1.25,
  cache_read: 0.1,
}

// Redis 키 패턴
// cost:daily:{YYYY-MM-DD} -> number (string)
// cost:monthly:{YYYY-MM} -> number (string)
// cost:sessions:{YYYY-MM-DD} -> number
// Rate limiting은 인메모리 유지 (단기 데이터, Redis 호출 최소화)

const requestsPerMinute = new Map<string, number[]>()

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

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function monthKey(): string {
  return new Date().toISOString().slice(0, 7)
}

export function calculateCost(usage: {
  inputTokens: number
  outputTokens: number
  cacheWriteTokens?: number
  cacheReadTokens?: number
}): number {
  const inputCost = (usage.inputTokens / 1_000_000) * PRICING.input
  const outputCost = (usage.outputTokens / 1_000_000) * PRICING.output
  const cacheWriteCost = ((usage.cacheWriteTokens || 0) / 1_000_000) * PRICING.cache_write
  const cacheReadCost = ((usage.cacheReadTokens || 0) / 1_000_000) * PRICING.cache_read
  return inputCost + outputCost + cacheWriteCost + cacheReadCost
}

export async function recordCost(cost: number): Promise<void> {
  const redis = await getClient()
  const day = todayKey()
  const month = monthKey()
  await Promise.all([
    redis.incrByFloat(`cost:daily:${day}`, cost),
    redis.incrByFloat(`cost:monthly:${month}`, cost),
  ])
  // 일별 키는 48시간 후 만료, 월별 키는 35일 후 만료
  await Promise.all([
    redis.expire(`cost:daily:${day}`, 60 * 60 * 48),
    redis.expire(`cost:monthly:${month}`, 60 * 60 * 24 * 35),
  ])
}

export async function recordSession(): Promise<void> {
  const redis = await getClient()
  const day = todayKey()
  await redis.incr(`cost:sessions:${day}`)
  await redis.expire(`cost:sessions:${day}`, 60 * 60 * 48)
}

export interface BudgetCheckResult {
  allowed: boolean
  reason?: 'daily_limit' | 'monthly_limit' | 'kill_switch' | 'session_limit' | 'rate_limit'
  dailyCost?: number
  monthlyCost?: number
}

export async function checkBudget(config: CostSafetyConfig, ip?: string): Promise<BudgetCheckResult> {
  const redis = await getClient()
  const day = todayKey()
  const month = monthKey()

  const [dailyStr, monthlyStr, sessionStr] = await Promise.all([
    redis.get(`cost:daily:${day}`),
    redis.get(`cost:monthly:${month}`),
    redis.get(`cost:sessions:${day}`),
  ])

  const dailyCost = parseFloat(dailyStr || '0')
  const monthlyCost = parseFloat(monthlyStr || '0')
  const sessionCount = parseInt(sessionStr || '0', 10)

  if (monthlyCost >= config.kill_switch_usd) {
    return { allowed: false, reason: 'kill_switch', dailyCost, monthlyCost }
  }

  if (monthlyCost >= config.monthly_budget_usd) {
    return { allowed: false, reason: 'monthly_limit', dailyCost, monthlyCost }
  }

  if (dailyCost >= config.daily_budget_usd) {
    return { allowed: false, reason: 'daily_limit', dailyCost, monthlyCost }
  }

  if (sessionCount >= config.max_sessions_per_day) {
    return { allowed: false, reason: 'session_limit', dailyCost, monthlyCost }
  }

  // IP 기반 분당 제한 (인메모리 — 단기 데이터)
  if (ip) {
    const now = Date.now()
    const timestamps = requestsPerMinute.get(ip) || []
    const recentTimestamps = timestamps.filter((t) => now - t < 60_000)
    if (recentTimestamps.length >= config.rate_limit_per_minute) {
      return { allowed: false, reason: 'rate_limit', dailyCost, monthlyCost }
    }
    recentTimestamps.push(now)
    requestsPerMinute.set(ip, recentTimestamps)
  }

  return { allowed: true, dailyCost, monthlyCost }
}

export async function getCostStats(): Promise<{
  dailyCost: number
  monthlyCost: number
  dailySessions: number
}> {
  const redis = await getClient()
  const [dailyStr, monthlyStr, sessionsStr] = await Promise.all([
    redis.get(`cost:daily:${todayKey()}`),
    redis.get(`cost:monthly:${monthKey()}`),
    redis.get(`cost:sessions:${todayKey()}`),
  ])
  return {
    dailyCost: parseFloat(dailyStr || '0'),
    monthlyCost: parseFloat(monthlyStr || '0'),
    dailySessions: parseInt(sessionsStr || '0', 10),
  }
}
