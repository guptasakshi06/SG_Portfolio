import type { RefObject } from 'react'
import { Link } from 'react-router'
import { Menu } from 'lucide-react'
import { content } from '../../content'
import { ProfileActions } from './ProfileActions'

export function TopBar({ pageLabel, menuOpen, menuRef, onMenuOpen }: {
  pageLabel: string; menuOpen: boolean; menuRef: RefObject<HTMLButtonElement | null>; onMenuOpen: () => void
}) {
  return <header className="topbar">
    <div className="topbar-identity">
      <button ref={menuRef} className="icon-button mobile-menu-trigger" aria-label="Open navigation" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={onMenuOpen}><Menu size={21} aria-hidden="true" /></button>
      <Link className="identity" to="/" aria-label="SG — Sakshi Gupta, Home">
        <span className="monogram" aria-hidden="true">SG<span>.</span></span>
        <span className="identity-name">SAKSHI GUPTA<span className="identity-subtitle">Data Science Portfolio</span></span>
      </Link>
    </div>
    <div className="workspace-context">
      <p className="workspace-breadcrumb"><span>Portfolio</span><span aria-hidden="true">/</span><span className="current-page">{pageLabel}</span></p>
      <p className="availability"><span className="availability-dot" aria-hidden="true" />{content.profile.availability.label}</p>
    </div>
    <ProfileActions />
  </header>
}
