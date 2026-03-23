'use client'

import { useState } from 'react'
import type { EmailFormConfig, Language } from '../../lib/types'

interface EmailFormProps {
  config: EmailFormConfig
  language: Language
  brandColor?: string
  onSubmit: (data: Record<string, string>) => void
}

export function EmailForm({ config, language, brandColor, onSubmit }: EmailFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <p className="text-green-800 text-sm">{config.success_message[language]}</p>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setSubmitted(true)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      {config.fields.map((field) => (
        <div key={field.name}>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {field.label[language]}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          <input
            type={field.type}
            required={field.required}
            placeholder={field.placeholder?.[language] || ''}
            value={formData[field.name] || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1"
            style={{ '--tw-ring-color': brandColor || '#6366f1' } as React.CSSProperties}
          />
        </div>
      ))}
      <button
        type="submit"
        className="w-full py-2 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90"
        style={{ backgroundColor: brandColor || '#6366f1' }}
      >
        {config.submit_text[language]}
      </button>
    </form>
  )
}
