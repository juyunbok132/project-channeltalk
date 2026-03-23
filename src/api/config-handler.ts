import { loadConfig } from '../lib/config-loader'

interface ConfigHandlerOptions {
  configPath?: string
}

export function createConfigHandler(options?: ConfigHandlerOptions) {
  async function GET() {
    const config = loadConfig(options?.configPath)
    const clientConfig = {
      bot: config.bot,
      service: { name: config.service.name },
      cta: config.cta,
      presets: config.presets,
      email_form: config.email_form,
      limits: config.limits,
      brand_color: config.brand_color,
      language: config.language,
    }
    return Response.json(clientConfig)
  }

  return { GET }
}
