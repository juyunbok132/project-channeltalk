'use client'

import type { ChatSession } from '../../lib/types'

interface UnansweredListProps {
  sessions: ChatSession[]
}

export function UnansweredList({ sessions }: UnansweredListProps) {
  // 폴백이 발생한 세션에서 폴백 메시지 직전의 사용자 질문 추출
  const unansweredQuestions: { question: string; sessionId: string; date: string }[] = []

  for (const session of sessions) {
    for (let i = 0; i < session.messages.length; i++) {
      const msg = session.messages[i]
      if (msg.role === 'assistant') {
        // 폴백 메시지 패턴 감지
        const content = msg.content.toLowerCase()
        if (
          content.includes("don't have information") ||
          content.includes('담당자에게 연결') ||
          content.includes('정보가 없습니다')
        ) {
          // 직전 사용자 메시지
          const prevMsg = session.messages[i - 1]
          if (prevMsg && prevMsg.role === 'user') {
            unansweredQuestions.push({
              question: prevMsg.content,
              sessionId: session.session_id,
              date: prevMsg.timestamp,
            })
          }
        }
      }
    }
  }

  if (!unansweredQuestions.length) {
    return <p className="text-gray-500 text-sm p-4">No unanswered questions found.</p>
  }

  return (
    <div className="divide-y divide-gray-100">
      {unansweredQuestions.map((item, i) => (
        <div key={i} className="px-4 py-3">
          <p className="text-sm text-gray-800">&ldquo;{item.question}&rdquo;</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(item.date).toLocaleString()} · {item.sessionId}
          </p>
        </div>
      ))}
    </div>
  )
}
