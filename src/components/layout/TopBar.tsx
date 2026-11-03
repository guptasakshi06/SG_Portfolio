import type { RefObject } from 'react'
import { Link } from 'react-router'
import { Menu, Search } from 'lucide-react'
import { content } from '../../content'
import { ProfileActions } from './ProfileActions'

export function TopBar({ pageLabel, menuOpen, menuRef, onMenuOpen, onSearchOpen, searchOpen }: {
  pageLabel: string; menuOpen: boolean; menuRef: RefObject<HTMLButtonElement | null>; onMenuOpen: () => void; onSearchOpen: () => void; searchOpen: boolean
}) {
  return <header className="topbar">
    <div className="topbar-identity">
      <button ref={menuRef} className="icon-button mobile-menu-trigger" aria-label="Open navigation" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={onMenuOpen}><Menu size={21} aria-hidden="true" /></button>
      <Link className="identity" to="/" aria-label="SG — Sakshi Gupta, Home">
        <span className="monogram" aria-hidden="true">SG<span>.</span></span>
        <span className="identity-name">SAKSHI GUPTA<span className="identity-subtitle">Data Science Portfolio</span></span>
      </Link>
    </div>
    <div className="workspace-context"><div className="workspace-context-copy">
      <p className="workspace-breadcrumb"><span>Portfolio</span><span aria-hidden="true">/</span><span className="current-page">{pageLabel}</span></p>
      <p className="availability"><span className="availability-dot" aria-hidden="true" />{content.profile.availability.label}</p></div>
      <button type="button" className="search-trigger" aria-label="Search portfolio" aria-keyshortcuts="Control+K Meta+K" aria-haspopup="dialog" aria-expanded={searchOpen} onClick={onSearchOpen}><Search size={19} aria-hidden="true" /><span className="search-trigger-label">Search</span><kbd aria-hidden="true">Ctrl / ⌘ K</kbd></button>
    </div>
    <ProfileActions />
  </header>
}
