import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { NavigationLinks } from './NavigationLinks'

export function MobileNavigation({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current!
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    const desktop = window.matchMedia('(min-width: 768px)')
    const closeOnDesktop = () => { if (desktop.matches) dialog.close() }
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      desktop.removeEventListener('change', closeOnDesktop)
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (previousFocus?.getClientRects().length) previousFocus.focus()
    }
  }, [open])

  function containFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return
    const controls = dialogRef.current!.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    const first = controls[0]
    const last = controls[controls.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }

  return <dialog ref={dialogRef} id="mobile-navigation" className="mobile-drawer" aria-labelledby="navigation-title" onClose={onClose} onKeyDown={containFocus}>
    <div className="drawer-heading"><div><p className="sidebar-caption">SG / PORTFOLIO</p><h2 id="navigation-title">Explore the portfolio</h2></div><button autoFocus className="icon-button" aria-label="Close navigation" onClick={onClose}><X size={22} aria-hidden="true" /></button></div>
    <NavigationLinks onNavigate={onClose} />
    <p className="drawer-note">Get to know Sakshi, explore her work, and start a conversation.</p>
  </dialog>
}
