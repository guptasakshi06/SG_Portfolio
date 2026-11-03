import { Download, ExternalLink, FileText, Mail } from 'lucide-react'
import { content } from '../../content'
import type { Profile } from '../../content/types'
import { profileActionHref } from '../../features/contact/actions'
import type { ProfileActionKind } from '../../features/contact/actions'
import { useResumeStatus } from '../../features/contact/resume-context'
export type { ProfileActionKind } from '../../features/contact/actions'

/** Shared configured, checking and unavailable actions; absent values never create links. */
export function ProfileAction({ kind, profile = content.profile, className = 'text-link', label }: {
  kind: ProfileActionKind; profile?: Profile; className?: string; label?: string
}) {
  const status = useResumeStatus()
  const name = { github: 'GitHub', linkedin: 'LinkedIn', email: 'Email', resume: 'Resume', 'resume-open': 'Resume' }[kind]
  const social = kind === 'github' || kind === 'linkedin'
  const resume = kind === 'resume' || kind === 'resume-open'
  const newTab = social || kind === 'resume-open'
  const href = profileActionHref(profile, kind, status)
  const Icon = social ? ExternalLink : kind === 'email' ? Mail : kind === 'resume-open' ? FileText : Download

  if (!href) return <span className={`${className} unavailable-action`} aria-disabled="true">{resume && profile.resume && status === 'checking' ? 'Checking resume…' : `${name} unavailable`}</span>
  return <a className={className} href={href}
    target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined}
    download={kind === 'resume' ? profile.resume?.downloadName : undefined}
    aria-label={social ? `${name} profile (opens in a new tab)` : resume ? `${kind === 'resume' ? 'Download' : 'Read'} ${profile.name}’s resume (PDF)${newTab ? ' (opens in a new tab)' : ''}` : undefined}>
    {resume ? <Icon size={17} aria-hidden="true" /> : null}
    <span>{label ?? name}</span>
    {!resume ? <Icon size={social ? 13 : 17} aria-hidden="true" /> : null}
  </a>
}
