import { NextResponse } from 'next/server'
import { loadConfig } from '@/lib/config-loader'

export async function GET() {
  const config = loadConfig()
  // API 키 등 민감 정보 제외, 프론트엔드에 필요한 설정만 전달
  const clientConfig = {
    bot: config.bot,
    service: { name: config.service.name },
    cta: config.cta,
    presets: config.presets,
    email_form: config.email_form,
    limits: config.limits,
    brand_color: config.brand_color,
  }
  return NextResponse.json(clientConfig)
}
