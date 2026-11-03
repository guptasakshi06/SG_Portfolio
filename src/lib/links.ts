/** Owner links use HTTPS only. Never accept credentials, protocol-relative or executable URLs. */
export function isSafeExternalUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return value === value.trim() && url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password
  } catch { return false }
}

export function emailHref(value: string | null): string | null {
  return value && /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
    ? `mailto:${encodeURIComponent(value)}` : null
}

export function isSafeAssetPath(value: string): boolean {
  return /^\/(?!\/)[a-zA-Z0-9/_-]+\.[a-zA-Z0-9]+$/.test(value) && !value.includes('..')
}

export function resumeHref(resume: { path: string; version: string } | null): string | null {
  return resume && isSafeAssetPath(resume.path) && resume.version.trim()
    ? `${resume.path}?v=${encodeURIComponent(resume.version)}` : null
}
