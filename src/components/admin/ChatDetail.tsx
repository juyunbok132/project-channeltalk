'use client'

import type { ChatSession } from '../../lib/types'

interface ChatDetailProps {
  session: ChatSession
}

export function ChatDetail({ session }: ChatDetailProps) {
  return (
    <div className="p-4">
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
