'use client'

import type { ChatSession } from '../../lib/types'
import { Badge } from '../ui/badge'

interface ChatListProps {
  sessions: ChatSession[]
  selectedId: string | null
  onSelect: (session: ChatSession) => void
}

export function ChatList({ sessions, selectedId, onSelect }: ChatListProps) {
  if (!sessions.length) {
    return <p className="text-gray-500 text-sm p-4">No conversations yet.</p>
  }

  return (
    <div className="divide-y divide-gray-100">
      {sessions.map((session) => {
        const firstUserMsg = session.messages.find((m) => m.role === 'user')
        const preview = firstUserMsg?.content.slice(0, 60) || 'No messages'

        return (
          <button
            key={session.session_id}
            onClick={() => onSelect(session)}
            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
              selectedId === session.session_id ? 'bg-indigo-50' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">
                {new Date(session.created_at).toLocaleString()}
              </span>
              <div className="flex gap-1">
                <Badge variant="outline" className="text-xs">
                  {session.language.toUpperCase()}
                </Badge>
                {session.fallback_count > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {session.fallback_count} unanswered
                  </Badge>
                )}
                {session.converted_to && (
                  <Badge className="text-xs bg-green-100 text-green-800">
                    {session.converted_to}
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-800 truncate">{preview}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {session.message_count} messages · ${session.cost_usd.toFixed(4)}
            </p>
          </button>
        )
      })}
    </div>
  )
}
