#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

const TEMPLATE_DIR = path.join(__dirname, '..', 'templates')
const TARGET_DIR = process.cwd()

const FILES_TO_COPY: { src: string; dest: string; description: string }[] = [
  {
    src: 'knowledge.example.md',
    dest: 'chatbot/knowledge.md',
    description: 'Knowledge base template',
  },
  {
    src: 'config.example.yaml',
    dest: 'chatbot/config.yaml',
    description: 'Bot configuration',
  },
  {
    src: 'env.example',
    dest: '.env.local',
    description: 'Environment variables',
  },
]

function init() {
  console.log('\n🚀 Initializing project-channeltalk...\n')

  for (const file of FILES_TO_COPY) {
    const srcPath = path.join(TEMPLATE_DIR, file.src)
    const destPath = path.join(TARGET_DIR, file.dest)
    const destDir = path.dirname(destPath)

    // 디렉토리 생성
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }

    // 이미 존재하면 건너뛰기
    if (fs.existsSync(destPath)) {
      console.log(`  ⏭  ${file.dest} (already exists)`)
      continue
    }

    // 복사
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath)
      console.log(`  ✅ ${file.dest} — ${file.description}`)
    } else {
      console.log(`  ⚠️  Template not found: ${file.src}`)
    }
  }

  console.log(`
✨ Done! Next steps:

  1. Edit .env.local with your ANTHROPIC_API_KEY
  2. Edit chatbot/knowledge.md with your FAQ
  3. Edit chatbot/config.yaml to customize your bot
  4. Add <ChatWidgetWrapper /> to your layout.tsx
  5. Run: npm run dev
`)
}

init()
