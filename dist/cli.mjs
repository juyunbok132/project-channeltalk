#!/usr/bin/env node

// src/cli.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var TEMPLATE_DIR = path.join(__dirname, "..", "templates");
var TARGET_DIR = process.cwd();
var FILES_TO_COPY = [
  {
    src: "knowledge.example.md",
    dest: "chatbot/knowledge.md",
    description: "Knowledge base template"
  },
  {
    src: "config.example.yaml",
    dest: "chatbot/config.yaml",
    description: "Bot configuration"
  },
  {
    src: "env.example",
    dest: ".env.local",
    description: "Environment variables"
  }
];
var API_ROUTES = [
  {
    dest: "src/app/api/chat/route.ts",
    content: `import { createChatHandler } from 'project-channeltalk/api'

export const { POST } = createChatHandler()
`,
    description: "Chat API route"
  },
  {
    dest: "src/app/api/config/route.ts",
    content: `import { createConfigHandler } from 'project-channeltalk/api'

export const { GET } = createConfigHandler()
`,
    description: "Config API route"
  },
  {
    dest: "src/app/api/admin/sessions/route.ts",
    content: `import { createAdminHandler } from 'project-channeltalk/api'

export const { GET } = createAdminHandler()
`,
    description: "Admin API route"
  }
];
function init() {
  console.log("\nInitializing project-channeltalk...\n");
  for (const file of FILES_TO_COPY) {
    const srcPath = path.join(TEMPLATE_DIR, file.src);
    const destPath = path.join(TARGET_DIR, file.dest);
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    if (fs.existsSync(destPath)) {
      console.log(`  [skip] ${file.dest} (already exists)`);
      continue;
    }
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  [created] ${file.dest} -- ${file.description}`);
    } else {
      console.log(`  [warn] Template not found: ${file.src}`);
    }
  }
  for (const route of API_ROUTES) {
    const destPath = path.join(TARGET_DIR, route.dest);
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    if (fs.existsSync(destPath)) {
      console.log(`  [skip] ${route.dest} (already exists)`);
      continue;
    }
    fs.writeFileSync(destPath, route.content);
    console.log(`  [created] ${route.dest} -- ${route.description}`);
  }
  console.log(`
Done! Next steps:

  1. Edit .env.local with your ANTHROPIC_API_KEY and ADMIN_PASSWORD
  2. Edit chatbot/knowledge.md with your FAQ
  3. Edit chatbot/config.yaml to customize your bot
  4. Add to your layout.tsx:

     import { ChatWidgetWrapper } from 'project-channeltalk/react'
     import 'project-channeltalk/styles.css'

     // Inside your layout:
     <ChatWidgetWrapper />

  5. Add to your globals.css (Tailwind v4):

     @source "../node_modules/project-channeltalk/dist";

  6. Run: npm run dev
`);
}
init();
