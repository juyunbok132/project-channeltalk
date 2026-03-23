'use client'

import type { ChatSession } from '../../lib/types'
import { Badge } from '../ui/badge'

interface ChatDetailProps {
  session: ChatSession
}

export function ChatDetail({ session }: ChatDetailProps) {
  return (
    <div className="p-4">
      {/* 세션 정보 */}
      <div className="mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-sm font-semibold text-gray-800">Session {session.session_id}</h2>
          <Badge variant="outline" className="text-xs">{session.language.toUpperCase()}</Badge>
        </div>
        <div className="text-xs text-gray-500 space-y-0.5">
          <p>Started: {new Date(session.created_at).toLocaleString()}</p>
          <p>Messages: {session.message_count} · Unanswered: {session.fallback_count}</p>
          <p>Cost: ${session.cost_usd.toFixed(4)}</p>
          {session.email_submitted && <p>Email: {session.email_submitted}</p>}
          {session.converted_to && <p>Converted: {session.converted_to}</p>}
        </div>
      </div>

      {/* 대화 내역 */}
      <div className="space-y-3">
        {session.messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-900 rounded-bl-md'
              }`}
            >
              <p className="whitespace-pre-wrap">
                {msg.content.replace(/```json\s*\n?[\s\S]*?\n?\s*```/g, '').trim()}
              </p>
              <p className="text-xs opacity-60 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
