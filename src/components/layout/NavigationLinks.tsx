import { NavLink } from 'react-router'
import { navigation } from '../../app/navigation'

export function NavigationLinks({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  return <nav aria-label="Main navigation" className={collapsed ? 'workspace-nav is-collapsed' : 'workspace-nav'}>
    {navigation.map(({ id, path, label, icon: Icon }) => <NavLink key={id} to={path} end={path === '/'} className="nav-item" aria-label={label} title={collapsed ? label : undefined} onClick={onNavigate}>
      <Icon size={20} aria-hidden="true" /><span className="nav-label">{label}</span><span className="active-indicator" aria-hidden="true" />
    </NavLink>)}
  </nav>
}
