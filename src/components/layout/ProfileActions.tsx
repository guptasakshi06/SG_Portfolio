import { content } from '../../content'
import type { Profile } from '../../content/types'
import { ProfileAction } from './ProfileAction'

/** One configured/unconfigured rendering contract for shared portfolio actions. */
export function ProfileActions({ profile = content.profile }: { profile?: Profile }) {
  return <div className="profile-actions" aria-label="Profiles and resume">
    {(['github', 'linkedin'] as const).map(kind => <ProfileAction key={kind} kind={kind} profile={profile} className="profile-link" />)}
    <ProfileAction kind="resume" profile={profile} className="resume-link" />
  </div>
}
