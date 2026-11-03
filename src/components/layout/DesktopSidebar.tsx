import { PanelLeftClose, PanelLeftOpen, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { NavigationLinks } from './NavigationLinks'

export function DesktopSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return <aside className={`desktop-sidebar${collapsed ? ' is-collapsed' : ''}`} aria-label="Portfolio navigation">
    <div className="sidebar-heading"><span className="sidebar-caption">EXPLORE</span><button className="icon-button sidebar-toggle" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed} aria-controls="desktop-navigation" onClick={onToggle}>{collapsed ? <PanelLeftOpen size={19} aria-hidden="true" /> : <PanelLeftClose size={19} aria-hidden="true" />}</button></div>
    <div id="desktop-navigation"><NavigationLinks collapsed={collapsed} /></div>
    <div className="sidebar-note"><span className="sidebar-caption">HAVE SOMETHING IN MIND?</span><Link to="/contact" className="sidebar-contact" aria-label="Let’s connect" title={collapsed ? 'Let’s connect' : undefined}><span>Let’s connect</span><ArrowUpRight size={18} aria-hidden="true" /></Link></div>
    <p className="sidebar-signature"><span className="signature-dot" aria-hidden="true" /><span>Curiosity. Analysis. Insight.</span></p>
  </aside>
}
