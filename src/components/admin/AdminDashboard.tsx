'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ChatList } from './ChatList'
import { ChatDetail } from './ChatDetail'
import { SessionInfo } from './SessionInfo'
import { UnansweredList } from './UnansweredList'
import { downloadAllSessionsCsv } from '../../lib/csv-export'
import type { ChatSession } from '../../lib/types'

interface AdminDashboardProps {
  password: string
  apiEndpoint?: string
}

type Tab = 'conversations' | 'unanswered' | 'cost'

// 최소/최대 너비 (px)
const MIN_LEFT = 220
const MIN_CENTER = 300
const MIN_RIGHT = 240

function ResizeHandle({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="w-1.5 cursor-col-resize flex-shrink-0 group relative"
    >
      <div className="absolute inset-y-0 -left-1 -right-1" />
      <div className="h-full w-0.5 mx-auto bg-gray-200 group-hover:bg-indigo-400 group-active:bg-indigo-600 transition-colors rounded-full" />
    </div>
  )
}

export function AdminDashboard({ password, apiEndpoint = '/api/admin/sessions' }: AdminDashboardProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [tab, setTab] = useState<Tab>('conversations')
  const [costStats, setCostStats] = useState({ dailyCost: 0, monthlyCost: 0, dailySessions: 0 })

  // 리사이즈 상태
  const containerRef = useRef<HTMLDivElement>(null)
  const [leftWidth, setLeftWidth] = useState(280)
  const [rightWidth, setRightWidth] = useState(320)
  const dragging = useRef<'left' | 'right' | null>(null)
  const dragStartX = useRef(0)
  const dragStartWidth = useRef(0)

  const fetchSessions = useCallback(
    async (filter?: string) => {
      const url = filter
        ? `${apiEndpoint}?filter=${encodeURIComponent(filter)}`
        : apiEndpoint
      const res = await fetch(url, {
        headers: { 'x-admin-password': password },
      })
      if (res.ok) {
        const data = await res.json()
        setSessions(data.sessions)
        setCostStats(data.costStats)
      }
    },
    [password]
  )

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  // 드래그 핸들러
  const handleMouseDown = useCallback((side: 'left' | 'right', e: React.MouseEvent) => {
    e.preventDefault()
    dragging.current = side
    dragStartX.current = e.clientX
    dragStartWidth.current = side === 'left' ? leftWidth : rightWidth
  }, [leftWidth, rightWidth])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return
      const containerWidth = containerRef.current.offsetWidth
      const delta = e.clientX - dragStartX.current

      if (dragging.current === 'left') {
        const newLeft = Math.max(MIN_LEFT, dragStartWidth.current + delta)
        const maxLeft = containerWidth - rightWidth - MIN_CENTER - 12 // 12 = handle widths
        setLeftWidth(Math.min(newLeft, maxLeft))
      } else {
        const newRight = Math.max(MIN_RIGHT, dragStartWidth.current - delta)
        const maxRight = containerWidth - leftWidth - MIN_CENTER - 12
        setRightWidth(Math.min(newRight, maxRight))
      }
    }

    const handleMouseUp = () => {
      dragging.current = null
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [leftWidth, rightWidth])

  const tabs: { key: Tab; label: string }[] = [
    { key: 'conversations', label: 'Conversations' },
    { key: 'unanswered', label: 'Unanswered' },
    { key: 'cost', label: 'Cost' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        {tab === 'conversations' && sessions.length > 0 && (
          <button
            onClick={() => downloadAllSessionsCsv(sessions)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            CSV 전체 다운로드
          </button>
        )}
      </header>

      {/* 탭 */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key)
                if (t.key === 'unanswered') fetchSessions('unanswered')
                else fetchSessions()
              }}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="mx-auto p-6" style={{ maxWidth: '1600px' }}>
        {tab === 'conversations' && (
          <div ref={containerRef} className="flex" style={{ userSelect: dragging.current ? 'none' : undefined }}>
            {/* 대화 목록 */}
            <div
              className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-shrink-0"
              style={{ width: leftWidth }}
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700">
                  Conversations ({sessions.length})
                </h2>
              </div>
              <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
                <ChatList
                  sessions={sessions}
                  selectedId={selectedSession?.session_id || null}
                  onSelect={setSelectedSession}
                />
              </div>
            </div>

            {/* 좌측 리사이즈 핸들 */}
            <ResizeHandle onMouseDown={(e) => handleMouseDown('left', e)} />

            {/* 대화 상세 (가운데 - flex-1로 남은 공간 차지) */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-1" style={{ minWidth: MIN_CENTER }}>
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700">Detail</h2>
              </div>
              <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
                {selectedSession ? (
                  <ChatDetail session={selectedSession} />
                ) : (
                  <p className="text-gray-500 text-sm p-4">
                    Select a conversation to view details.
                  </p>
                )}
              </div>
            </div>

            {/* 우측 리사이즈 핸들 */}
            <ResizeHandle onMouseDown={(e) => handleMouseDown('right', e)} />

            {/* 세션 정보 패널 */}
            <div
              className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-shrink-0"
              style={{ width: rightWidth }}
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700">Session Info</h2>
              </div>
              <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
                {selectedSession ? (
                  <SessionInfo session={selectedSession} />
                ) : (
                  <p className="text-gray-500 text-sm p-4">
                    Select a conversation to view session info.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'unanswered' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700">
                Unanswered Questions
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Add these to knowledge.md to improve your chatbot
              </p>
            </div>
            <UnansweredList sessions={sessions} />
          </div>
        )}

        {tab === 'cost' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-500">Today&apos;s Cost</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${costStats.dailyCost.toFixed(4)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-500">Monthly Cost</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${costStats.monthlyCost.toFixed(4)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-500">Today&apos;s Sessions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {costStats.dailySessions}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
