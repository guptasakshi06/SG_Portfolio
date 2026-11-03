import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { navigation } from '../../app/navigation'
import { TopBar } from './TopBar'
import { DesktopSidebar } from './DesktopSidebar'
import { MobileNavigation } from './MobileNavigation'
import { Footer } from './Footer'
import { CommandPalette } from '../../features/search/CommandPalette'
import { isSearchShortcut } from '../../features/search/search'
import type { SearchEntry } from '../../features/search/search'
import '../../styles/search.css'

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchForRoute, setSearchForRoute] = useState<string | null>(null)
  const searchFocus = useRef<{ targetId: string | null } | null>(null)
  const [collapsed, setCollapsed] = useState(() => !window.matchMedia('(min-width: 1200px)').matches)
  const [openForRoute, setOpenForRoute] = useState<string | null>(null)
  const menuRef = useRef<HTMLButtonElement>(null)
  const mainRef = useRef<HTMLElement>(null)
  const previousPath = useRef(location.pathname)
  const currentPage = navigation.find(item => item.path === location.pathname || (item.path !== '/' && location.pathname.startsWith(`${item.path}/`)))
  const pageLabel = currentPage?.id === 'projects' && location.pathname !== '/projects' ? 'Project details' : currentPage?.label ?? 'Page not found'
  const menuOpen = openForRoute === location.key

  const searchOpen = searchForRoute === location.key
  // Forget a dismissed location so Back/Forward cannot reopen an old palette.
  if (searchForRoute !== null && searchForRoute !== location.key) setSearchForRoute(null)

  useEffect(() => {
    function shortcut(event: globalThis.KeyboardEvent) {
      const target = event.target instanceof HTMLElement ? event.target : null
      const editing = Boolean(target?.isContentEditable || target?.closest('input, textarea, select, [role="textbox"], [role="combobox"]'))
      if (!isSearchShortcut(event, editing) || document.querySelector('dialog[open]')) return
      event.preventDefault()
      setSearchForRoute(location.key)
    }
    document.addEventListener('keydown', shortcut)
    return () => document.removeEventListener('keydown', shortcut)
  }, [location.key])

  function chooseSearch(entry: SearchEntry) {
    const url = new URL(entry.href, window.location.origin)
    searchFocus.current = { targetId: url.hash ? decodeURIComponent(url.hash.slice(1)) : url.pathname === '/skills' && url.searchParams.has('skill') ? 'skill-detail-title' : null }
    setSearchForRoute(null)
    navigate(entry.href)
  }

  useEffect(() => {
    const requested = searchFocus.current
    if (previousPath.current === location.pathname && !requested) return
    searchFocus.current = null
    previousPath.current = location.pathname
    // Run after the closing dialog has returned focus to its trigger.
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
      const target = requested?.targetId ? document.getElementById(requested.targetId) : null
      if (target) {
        target.setAttribute('tabindex', '-1')
        target.focus({ preventScroll: true })
        target.scrollIntoView({ block: 'start' })
      } else mainRef.current?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [location.pathname, location.key])

  return <div className={`app-shell${collapsed ? ' sidebar-collapsed' : ''}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    <TopBar pageLabel={pageLabel} menuOpen={menuOpen} menuRef={menuRef} onMenuOpen={() => setOpenForRoute(location.key)} searchOpen={searchOpen} onSearchOpen={() => setSearchForRoute(location.key)} />
    <div className="shell-body"><DesktopSidebar collapsed={collapsed} onToggle={() => setCollapsed(value => !value)} /><div className="workspace-column"><main ref={mainRef} id="main" tabIndex={-1} className="workspace">{children}</main><Footer /></div></div>
    {searchOpen ? <CommandPalette onClose={() => setSearchForRoute(null)} onChoose={chooseSearch} /> : null}
    <MobileNavigation open={menuOpen} onClose={() => setOpenForRoute(null)} />
  </div>
}
