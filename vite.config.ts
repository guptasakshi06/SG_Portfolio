import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { injectMetadata, pageMetadata } from './src/app/metadata.ts'

export default defineConfig({ plugins: [react(), tailwindcss(), {
  name: 'sg-initial-metadata',
  transformIndexHtml: { order: 'post', handler: (html, context) => injectMetadata(html, pageMetadata(new URL(context.originalUrl ?? '/', 'http://localhost').pathname)) },
}] })
