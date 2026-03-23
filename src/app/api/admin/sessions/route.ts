import { NextRequest, NextResponse } from 'next/server'
import { getAllSessions, getSessionsByFilter } from '@/api/session-store'
import { getCostStats } from '@/api/cost-tracker'

export async function GET(req: NextRequest) {
  // 간단한 비밀번호 인증
  const password = req.headers.get('x-admin-password')
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const searchParams = req.nextUrl.searchParams
  const filter = searchParams.get('filter')

  let sessions
  if (filter === 'unanswered') {
    sessions = await getSessionsByFilter({ has_fallback: true })
  } else if (filter) {
    sessions = await getSessionsByFilter(JSON.parse(filter))
  } else {
    sessions = await getAllSessions()
  }

  const costStats = getCostStats()

  return NextResponse.json({ sessions, costStats })
}
