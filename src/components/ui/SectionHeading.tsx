import type { ReactNode } from 'react'

export function SectionHeading({ id, eyebrow, title, children, action }: {
  id: string; eyebrow: string; title: string; children?: ReactNode; action?: ReactNode
}) {
  return <div className="section-heading">
    <div><p className="eyebrow">{eyebrow}</p><h2 id={id}>{title}</h2>{children ? <div className="section-description">{children}</div> : null}</div>
    {action}
  </div>
}
