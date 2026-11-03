import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { content } from '../../content'
import { resumeHref } from '../../lib/links'
import { checkResume } from './actions'
import type { ResumeStatus } from './actions'
import { ResumeContext } from './resume-context'

/** A single shared check per app mount; no repeated request per resume button. */
export function ResumeProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ResumeStatus>('checking')
  useEffect(() => {
    let disposed = false
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 10000)
    const href = resumeHref(content.profile.resume)
    void (href ? checkResume(href, controller.signal) : Promise.resolve(false)).then(available => {
      if (!disposed && !controller.signal.aborted) setStatus(available ? 'available' : 'unavailable')
    }).finally(() => window.clearTimeout(timeout))
    // A timed-out check must also leave the checking state.
    controller.signal.addEventListener('abort', () => { if (!disposed) setStatus('unavailable') }, { once: true })
    return () => { disposed = true; window.clearTimeout(timeout); controller.abort() }
  }, [])
  return <ResumeContext value={status}>{children}</ResumeContext>
}
