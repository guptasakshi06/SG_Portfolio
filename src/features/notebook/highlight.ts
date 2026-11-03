import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import python from '@shikijs/langs/python'
import sql from '@shikijs/langs/sql'
import json from '@shikijs/langs/json'
import darkPlus from '@shikijs/themes/dark-plus'

// This entire module is dynamically imported only when a code block is mounted.
const highlighter = createHighlighterCore({
  themes: [darkPlus], langs: [python, sql, json], engine: createJavaScriptRegexEngine(),
})
export async function highlightCode(code: string, language: string) {
  const instance = await highlighter
  const lang = ({ py: 'python', python: 'python', sql: 'sql', json: 'json' } as Record<string, string>)[language] ?? 'text'
  return instance.codeToTokens(code, { lang, theme: 'dark-plus' }).tokens
}
