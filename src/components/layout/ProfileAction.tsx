import { Download, ExternalLink, Mail } from 'lucide-react'
import { content } from '../../content'
import type { Profile } from '../../content/types'
import { emailHref, isSafeExternalUrl, resumeHref } from '../../lib/links'

export type ProfileActionKind = 'github' | 'linkedin' | 'email' | 'resume'

/** All profile action surfaces share safe destinations and an honest missing state. */
export function ProfileAction({ kind, profile = content.profile, className = 'text-link', label }: {
  kind: ProfileActionKind; profile?: Profile; className?: string; label?: string
}) {
  const name = { github: 'GitHub', linkedin: 'LinkedIn', email: 'Email', resume: 'Resume' }[kind]
  const social = kind === 'github' || kind === 'linkedin'
  const value = social ? profile.socials[kind] : null
  const href = social ? (value && isSafeExternalUrl(value) ? value : null)
    : kind === 'email' ? emailHref(profile.email) : resumeHref(profile.resume)
  const Icon = social ? ExternalLink : kind === 'email' ? Mail : Download

  if (!href) return <span className={`${className} unavailable-action`} aria-disabled="true">{name} unavailable</span>
  return <a className={className} href={href}
    target={social ? '_blank' : undefined} rel={social ? 'noopener noreferrer' : undefined}
    download={kind === 'resume' ? profile.resume?.downloadName : undefined}
    aria-label={social ? `${name} profile (opens in a new tab)` : kind === 'resume' ? `Download ${profile.name}’s resume (PDF)` : undefined}>
    {kind === 'resume' ? <Icon size={17} aria-hidden="true" /> : null}
    <span>{label ?? name}</span>
    {kind !== 'resume' ? <Icon size={social ? 13 : 17} aria-hidden="true" /> : null}
  </a>
}
