import { getAllSessions, getSessionsByFilter } from './session-store'
import { getCostStats } from './cost-tracker'

export function createAdminHandler() {
  async function GET(req: Request) {
    const password = req.headers.get('x-admin-password')
    if (password !== process.env.ADMIN_PASSWORD) {
      return Response.json({ error: 'unauthorized' }, { status: 401 })
    }

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
