'use client'

import type { ChatSession } from '../../lib/types'
import { downloadSessionCsv } from '../../lib/csv-export'

interface SessionInfoProps {
  session: ChatSession
}

function formatDuration(startIso: string, endIso?: string): string {
  if (!endIso) return '-'
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime()
  if (ms < 0) return '-'
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (minutes === 0) return `${seconds}초`
  return `${minutes}분 ${seconds}초`
}

function getLastMessageTime(session: ChatSession): string | undefined {
  if (session.last_message_at) return session.last_message_at
  const msgs = session.messages
  if (msgs.length > 0) return msgs[msgs.length - 1].timestamp
  return undefined
}

function InfoRow({ label, value }: { label: string; value: string | number | undefined | null }) {
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium text-right max-w-[60%] truncate">
        {value || '-'}
      </span>
    </div>
  )
}

export function SessionInfo({ session }: SessionInfoProps) {
  const meta = session.metadata || {}
  const lastMsg = getLastMessageTime(session)
  const duration = formatDuration(session.created_at, lastMsg)

  const visitLabel = meta.visit_count
    ? meta.visit_count === 1
      ? '첫 방문'
      : `재방문 (${meta.visit_count}회째)`
    : '-'

  const locationLabel = [meta.country, meta.city].filter(Boolean).join(' · ') || undefined

  const deviceLabel = [meta.device, meta.browser, meta.os]
    .filter(Boolean)
    .join(' / ') || undefined

  // page_url에서 path만 추출
  let pageLabel = meta.page_url
  if (pageLabel) {
    try {
      pageLabel = new URL(pageLabel).pathname
    } catch {
      // URL 파싱 실패 시 원본 사용
    }
  }

  // referrer에서 도메인만 추출
  let referrerLabel = meta.referrer
  if (referrerLabel) {
    try {
      referrerLabel = new URL(referrerLabel).hostname
    } catch {
      // URL 파싱 실패 시 원본 사용
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* 고객 정보 */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          고객 정보
        </h3>
        <div className="divide-y divide-gray-50">
          <InfoRow label="이메일" value={session.email_submitted} />
          <InfoRow label="국가 / 도시" value={locationLabel} />
          <InfoRow label="기기 / 브라우저" value={deviceLabel} />
          <InfoRow label="접속 페이지" value={pageLabel} />
          <InfoRow label="유입 경로" value={referrerLabel} />
          <InfoRow label="방문 이력" value={visitLabel} />
          {meta.first_visit_at && (
            <InfoRow
              label="최초 방문"
              value={new Date(meta.first_visit_at).toLocaleDateString()}
            />
          )}
        </div>
      </div>

      {/* 세션 통계 */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          세션 통계
        </h3>
        <div className="divide-y divide-gray-50">
          <InfoRow
            label="시작"
            value={new Date(session.created_at).toLocaleString()}
          />
          {lastMsg && (
            <InfoRow
              label="마지막 메시지"
              value={new Date(lastMsg).toLocaleString()}
            />
          )}
          <InfoRow label="지속 시간" value={duration} />
          <InfoRow
            label="메시지"
            value={`${session.message_count}개 (사용자) / ${session.messages.length}개 (전체)`}
          />
          <InfoRow label="폴백" value={`${session.fallback_count}회`} />
          <InfoRow
            label="전환"
            value={session.converted_to ? `✅ ${session.converted_to}` : '없음'}
          />
          <InfoRow label="비용" value={`$${session.cost_usd.toFixed(4)}`} />
        </div>
      </div>

      {/* CSV 다운로드 */}
      <button
        onClick={() => downloadSessionCsv(session)}
        className="w-full py-2.5 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        이 세션 CSV 다운로드
      </button>
    </div>
  )
}
