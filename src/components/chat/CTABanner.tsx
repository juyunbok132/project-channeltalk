'use client'

import type { CTAConfig, Language } from '../../lib/types'

interface CTABannerProps {
  cta: CTAConfig
  language: Language
  brandColor?: string
}

export function CTABanner({ cta, language, brandColor }: CTABannerProps) {
  return (
    <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
      <a
        href={cta.primary.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center py-2.5 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90"
        style={{ backgroundColor: brandColor || '#6366f1' }}
      >
        {cta.primary.text[language]}
      </a>
      {cta.secondary && (
        <a
          href={cta.secondary.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-2 text-sm text-gray-600 hover:text-gray-800 mt-1"
        >
          {cta.secondary.text[language]}
        </a>
      )}
    </div>
  )
}
