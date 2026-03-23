'use client'

import type { PresetQuestion, Language } from '../../lib/types'

interface PresetButtonsProps {
  presets: PresetQuestion[]
  language: Language
  onSelect: (text: string) => void
  brandColor?: string
}

export function PresetButtons({ presets, language, onSelect, brandColor }: PresetButtonsProps) {
  if (!presets.length) return null

  return (
    <div className="flex flex-col gap-2 mb-4">
      {presets.map((preset, i) => (
        <button
          key={i}
          onClick={() => onSelect(preset[language])}
          className="text-left text-sm px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-colors"
          style={{ '--brand': brandColor || '#6366f1' } as React.CSSProperties}
        >
          {preset[language]}
        </button>
      ))}
    </div>
  )
}
