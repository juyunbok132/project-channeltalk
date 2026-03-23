'use client'

import { cn } from '../../lib/utils'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  botName?: string
  botAvatar?: string
  brandColor?: string
}

export function ChatMessage({ role, content, botName, botAvatar, brandColor }: ChatMessageProps) {
  // JSON 블록 제거 (후속 질문)
  const displayContent = content.replace(/```json\s*\n?[\s\S]*?\n?\s*```/g, '').trim()

  return (
    <div className={cn('flex gap-2 mb-3', role === 'user' ? 'justify-end' : 'justify-start')}>
      {role === 'assistant' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-200">
          {botAvatar ? (
            <img src={botAvatar} alt={botName || 'Bot'} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: brandColor || '#6366f1' }}
            >
              {(botName || 'B')[0]}
            </div>
          )}
        </div>
      )}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          role === 'user'
            ? 'text-white rounded-br-md'
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        )}
        style={role === 'user' ? { backgroundColor: brandColor || '#6366f1' } : undefined}
      >
        <p className="whitespace-pre-wrap">{displayContent}</p>
      </div>
    </div>
  )
}
