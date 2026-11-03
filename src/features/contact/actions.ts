import type { Profile } from '../../content/types'
import { emailHref, isSafeExternalUrl, resumeHref } from '../../lib/links'

export type ProfileActionKind = 'github' | 'linkedin' | 'email' | 'resume' | 'resume-open'
export type ResumeStatus = 'checking' | 'available' | 'unavailable'

/** One destination contract for every public action surface. */
export function profileActionHref(profile: Profile, kind: ProfileActionKind, status: ResumeStatus): string | null {
  if (kind === 'email') return emailHref(profile.email)
  if (kind === 'github' || kind === 'linkedin') {
    const value = profile.socials[kind]
    return value && isSafeExternalUrl(value) ? value : null
  }
  return status === 'available' && profile.resume?.path.endsWith('.pdf') && /^[a-zA-Z0-9_-]+\.pdf$/.test(profile.resume.downloadName)
    ? resumeHref(profile.resume) : null
}

/** Reject 404s, offline requests and HTML history fallbacks that return HTTP 200. */
export async function checkResume(href: string, signal?: AbortSignal, request: typeof fetch = fetch): Promise<boolean> {
  try {
    const response = await request(href, { signal, cache: 'no-cache', redirect: 'error' })
    if (!response.ok || !response.headers.get('content-type')?.split(';')[0].trim().match(/^application\/pdf$/i)) return false
    const bytes = new Uint8Array(await response.arrayBuffer())
    return new TextDecoder().decode(bytes.subarray(0, 5)) === '%PDF-'
  } catch { return false }
}
