import { timingSafeEqual } from 'crypto'
import { getAllSessions, getSessionsByFilter } from './session-store'
import { getCostStats } from './cost-tracker'

// 관리자 로그인 시도 rate limiting (IP 기반, 인메모리)
const adminAttempts = new Map<string, { count: number; firstAttempt: number }>()
const MAX_ADMIN_ATTEMPTS = 5
const ADMIN_LOCKOUT_MS = 15 * 60 * 1000 // 15분

function checkAdminAuth(req: Request): Response | null {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

  // Rate limiting 체크
  const attempt = adminAttempts.get(ip)
  if (attempt) {
    if (Date.now() - attempt.firstAttempt > ADMIN_LOCKOUT_MS) {
      adminAttempts.delete(ip)
    } else if (attempt.count >= MAX_ADMIN_ATTEMPTS) {
      return Response.json({ error: 'too_many_attempts' }, { status: 429 })
    }
  }

  const password = req.headers.get('x-admin-password') || ''
  const expected = process.env.ADMIN_PASSWORD || ''

  if (!password || !expected) {
    recordFailedAttempt(ip)
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  // Timing-safe 비교
  const passwordBuf = Buffer.from(password)
  const expectedBuf = Buffer.from(expected)
  if (passwordBuf.length !== expectedBuf.length || !timingSafeEqual(passwordBuf, expectedBuf)) {
    recordFailedAttempt(ip)
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  // 인증 성공 시 시도 횟수 초기화
  adminAttempts.delete(ip)
  return null
}

function recordFailedAttempt(ip: string) {
  const attempt = adminAttempts.get(ip)
  if (attempt) {
    attempt.count++
  } else {
    adminAttempts.set(ip, { count: 1, firstAttempt: Date.now() })
  }
}

export function createAdminHandler() {
  async function GET(req: Request) {
    const authError = checkAdminAuth(req)
    if (authError) return authError

    const url = new URL(req.url)
    const filter = url.searchParams.get('filter')

    let sessions
    if (filter === 'unanswered') {
      sessions = await getSessionsByFilter({ has_fallback: true })
    } else if (filter) {
      try {
        const parsed = JSON.parse(filter)
        sessions = await getSessionsByFilter(parsed)
      } catch {
        return Response.json({ error: 'invalid_filter' }, { status: 400 })
      }
    } else {
      sessions = await getAllSessions()
    }

    const costStats = await getCostStats()
    return Response.json({ sessions, costStats })
  }

  return { GET }
}
