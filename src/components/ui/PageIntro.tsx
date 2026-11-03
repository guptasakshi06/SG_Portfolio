import type { ReactNode } from 'react'

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <div className="page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{children ? <div className="lead">{children}</div> : null}</div>
}

export function FoundationNotice({ children }: { children: ReactNode }) {
  return <aside className="foundation-notice"><span className="status-marker" aria-hidden="true" /><p>{children}</p></aside>
}
