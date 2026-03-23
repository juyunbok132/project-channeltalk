import type { ChatSession } from './types'

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function downloadCsv(filename: string, csvContent: string) {
  const bom = '\uFEFF' // UTF-8 BOM for Excel compatibility
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** 개별 세션의 대화 내용을 CSV로 다운로드 */
export function downloadSessionCsv(session: ChatSession) {
  const header = 'timestamp,role,content'
  const rows = session.messages.map((msg) =>
    [
      msg.timestamp,
      msg.role,
      escapeCsvField(msg.content.replace(/```json\s*\n?[\s\S]*?\n?\s*```/g, '').trim()),
    ].join(',')
  )
  const csv = [header, ...rows].join('\n')
  downloadCsv(`chat_${session.session_id}.csv`, csv)
}

/** 전체 세션 목록을 요약 CSV로 다운로드 */
export function downloadAllSessionsCsv(sessions: ChatSession[]) {
  const header = [
    'session_id',
    'created_at',
    'language',
    'email',
    'country',
    'city',
    'device',
    'browser',
    'os',
    'page_url',
    'referrer',
    'visit_count',
    'message_count',
    'fallback_count',
    'converted_to',
    'cost_usd',
  ].join(',')

  const rows = sessions.map((s) => {
    const m = s.metadata || {}
    return [
      s.session_id,
      s.created_at,
      s.language,
      escapeCsvField(s.email_submitted || ''),
      m.country || '',
      m.city || '',
      m.device || '',
      m.browser || '',
      m.os || '',
      escapeCsvField(m.page_url || ''),
      escapeCsvField(m.referrer || ''),
      m.visit_count || '',
      s.message_count,
      s.fallback_count,
      s.converted_to || '',
      s.cost_usd.toFixed(4),
    ].join(',')
  })

  const csv = [header, ...rows].join('\n')
  const date = new Date().toISOString().slice(0, 10)
  downloadCsv(`sessions_${date}.csv`, csv)
}
