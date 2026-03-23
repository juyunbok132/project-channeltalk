import { defineConfig } from 'tsup'

export default defineConfig([
  // Main entry (types + utilities) + API entry (server-side)
  {
    entry: {
      index: 'src/index.ts',
      api: 'src/api.ts',
    },
    tsconfig: 'tsconfig.build.json',
    format: ['esm', 'cjs'],
    dts: true,
    splitting: true,
    external: [
      'react', 'react-dom', 'next',
      'ai', '@ai-sdk/react', '@ai-sdk/anthropic',
      'fs', 'path',
    ],
    outExtension: ({ format }) => ({
      js: format === 'esm' ? '.mjs' : '.cjs',
    }),
    clean: true,
    onSuccess: 'cp src/styles/variables.css dist/styles.css',
  },
  // React entry (client components)
  {
    entry: { react: 'src/react.ts' },
    tsconfig: 'tsconfig.build.json',
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    external: [
      'react', 'react-dom', 'next',
      'ai', '@ai-sdk/react', '@ai-sdk/anthropic',
    ],
    banner: { js: '"use client";' },
    outExtension: ({ format }) => ({
      js: format === 'esm' ? '.mjs' : '.cjs',
    }),
  },
  // CLI
  {
    entry: { cli: 'src/cli.ts' },
    tsconfig: 'tsconfig.build.json',
    format: ['esm'],
    target: 'node18',
    banner: { js: '#!/usr/bin/env node' },
    outExtension: () => ({ js: '.mjs' }),
    external: ['fs', 'path', 'url'],
  },
])
