import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import { navigation } from '../../app/navigation'
import { TopBar } from './TopBar'
import { DesktopSidebar } from './DesktopSidebar'
import { MobileNavigation } from './MobileNavigation'
import { Footer } from './Footer'

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(() => !window.matchMedia('(min-width: 1200px)').matches)
  const [openForRoute, setOpenForRoute] = useState<string | null>(null)
  const menuRef = useRef<HTMLButtonElement>(null)
  const mainRef = useRef<HTMLElement>(null)
  const previousRoute = useRef(location.key)
  const currentPage = navigation.find(item => item.path === location.pathname || (item.path !== '/' && location.pathname.startsWith(`${item.path}/`)))
  const pageLabel = currentPage?.id === 'projects' && location.pathname !== '/projects' ? 'Project details' : currentPage?.label ?? 'Page not found'
  const menuOpen = openForRoute === location.key

  useEffect(() => {
    if (previousRoute.current === location.key) return
    previousRoute.current = location.key
    // Run after the closing dialog has returned focus to its trigger.
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
      mainRef.current?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [location.key])

  return <div className={`app-shell${collapsed ? ' sidebar-collapsed' : ''}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    <TopBar pageLabel={pageLabel} menuOpen={menuOpen} menuRef={menuRef} onMenuOpen={() => setOpenForRoute(location.key)} />
    <div className="shell-body"><DesktopSidebar collapsed={collapsed} onToggle={() => setCollapsed(value => !value)} /><div className="workspace-column"><main ref={mainRef} id="main" tabIndex={-1} className="workspace">{children}</main><Footer /></div></div>
    <MobileNavigation open={menuOpen} onClose={() => setOpenForRoute(null)} />
  </div>
}
