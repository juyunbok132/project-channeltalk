'use client'

interface FollowUpButtonsProps {
  questions: string[]
  onSelect: (text: string) => void
}

export function FollowUpButtons({ questions, onSelect }: FollowUpButtonsProps) {
  if (!questions.length) return null

  return (
    <div className="flex flex-col gap-1.5 mb-3 ml-10">
      {questions.map((q, i) => (
        <button
          key={i}
          onClick={() => onSelect(q)}
          className="text-left text-xs px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-colors text-gray-600"
        >
          {q}
        </button>
      ))}
    </div>
  )
}
