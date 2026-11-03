import { useEffect, useState } from 'react'
import type { ThemedToken } from 'shiki/core'

export function CodeBlock({ code, language }: { code: string; language: string }) {
  const [result, setResult] = useState<{ code: string; language: string; tokens: ThemedToken[][] } | null>(null)
  useEffect(() => {
    let active = true
    import('./highlight').then(module => module.highlightCode(code, language)).then(tokens => {
      if (active) setResult({ code, language, tokens })
    }).catch(() => { /* The readable plain-code fallback remains available offline. */ })
    return () => { active = false }
  }, [code, language])
  const tokens = result?.code === code && result.language === language ? result.tokens : null
  return <div className="notebook-code">
    <div className="notebook-code-label"><span>{language}</span><span>Read-only · does not execute</span></div>
    <pre className="notebook-scroll" tabIndex={0} role="region" aria-label={`${language} code; scroll horizontally if needed`}><code>{tokens ? tokens.map((line, i) => <span className="code-line" key={i}>{line.map((token, j) => <span key={j} style={{ color: token.color }}>{token.content}</span>)}{i < tokens.length - 1 ? '\n' : ''}</span>) : code}</code></pre>
  </div>
}
