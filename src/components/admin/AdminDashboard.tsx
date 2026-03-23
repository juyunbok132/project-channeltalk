'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChatList } from './ChatList'
import { ChatDetail } from './ChatDetail'
import { UnansweredList } from './UnansweredList'
import type { ChatSession } from '../../lib/types'

interface AdminDashboardProps {
  password: string
  apiEndpoint?: string
}

type Tab = 'conversations' | 'unanswered' | 'cost'

export function AdminDashboard({ password, apiEndpoint = '/api/admin/sessions' }: AdminDashboardProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [tab, setTab] = useState<Tab>('conversations')
  const [costStats, setCostStats] = useState({ dailyCost: 0, monthlyCost: 0, dailySessions: 0 })

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

  const tabs: { key: Tab; label: string }[] = [
    { key: 'conversations', label: 'Conversations' },
    { key: 'unanswered', label: 'Unanswered' },
    { key: 'cost', label: 'Cost' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
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
      <div className="max-w-7xl mx-auto p-6">
        {tab === 'conversations' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 대화 목록 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700">
                  Conversations ({sessions.length})
                </h2>
              </div>
              <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
                <ChatList
                  sessions={sessions}
                  selectedId={selectedSession?.session_id || null}
                  onSelect={setSelectedSession}
                />
              </div>
            </div>

            {/* 대화 상세 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700">Detail</h2>
              </div>
              <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
                {selectedSession ? (
                  <ChatDetail session={selectedSession} />
                ) : (
                  <p className="text-gray-500 text-sm p-4">
                    Select a conversation to view details.
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
