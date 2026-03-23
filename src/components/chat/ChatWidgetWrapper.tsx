'use client'

import { useEffect, useState } from 'react'
import { ChatWidget } from './ChatWidget'
import type { AppConfig } from '../../lib/types'

interface ChatWidgetWrapperProps {
  config?: AppConfig
  configEndpoint?: string
  chatEndpoint?: string
}

export function ChatWidgetWrapper({
  config: directConfig,
  configEndpoint = '/api/config',
  chatEndpoint,
}: ChatWidgetWrapperProps) {
  const [config, setConfig] = useState<AppConfig | null>(directConfig || null)

  useEffect(() => {
    if (directConfig) return
    fetch(configEndpoint)
      .then((res) => res.json())
      .then((data) => setConfig(data as AppConfig))
      .catch(console.error)
  }, [directConfig, configEndpoint])

  if (!config) return null

  return <ChatWidget config={config} apiEndpoint={chatEndpoint} />
}
