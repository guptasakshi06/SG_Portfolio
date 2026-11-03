import { Download, ExternalLink } from 'lucide-react'
import { content } from '../../content'
import type { Profile } from '../../content/types'
import { isSafeExternalUrl, resumeHref } from '../../lib/links'

/** One configured/unconfigured rendering contract for shared portfolio actions. */
export function ProfileActions({ profile = content.profile }: { profile?: Profile }) {
  const resume = resumeHref(profile.resume)
  return <div className="profile-actions" aria-label="Profiles and resume">
    {(['github', 'linkedin'] as const).map(kind => {
      const label = kind === 'github' ? 'GitHub' : 'LinkedIn'
      const url = profile.socials[kind]
      return url && isSafeExternalUrl(url)
        ? <a key={kind} className="profile-link" href={url} target="_blank" rel="noopener noreferrer" aria-label={`${label} profile (opens in a new tab)`}>{label}<ExternalLink size={13} aria-hidden="true" /></a>
        : <span key={kind} className="profile-link unavailable-action" aria-disabled="true">{label} unavailable</span>
    })}
    {resume && profile.resume
      ? <a className="resume-link" href={resume} download={profile.resume.downloadName} aria-label="Download Sakshi Gupta’s resume (PDF)"><Download size={17} aria-hidden="true" /><span>Resume</span></a>
      : <span className="resume-link unavailable-action" aria-disabled="true">Resume unavailable</span>}
  </div>
}
