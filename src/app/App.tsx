import { Link, NavLink, Route, Routes } from 'react-router'
import { navigation } from './navigation'
import { FoundationPage } from '../pages/FoundationPage'
import { ProjectPage } from '../pages/ProjectPage'
import { NotFoundPage } from '../pages/NotFoundPage'

/** S01 route scaffold. S02 replaces this simple header/nav with the workspace shell. */
export function App() {
  return (
    <div className="foundation">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="foundation-header">
        <Link className="identity" to="/" aria-label="SG — Sakshi Gupta, Home">
          <span className="monogram" aria-hidden="true">SG<span>.</span></span>
          <span>SAKSHI GUPTA<span className="identity-subtitle">Data Science Portfolio</span></span>
        </Link>
        <span className="build-label">Foundation preview</span>
      </header>
      <nav className="foundation-nav" aria-label="Main navigation">
        {navigation.map(item => <NavLink key={item.id} to={item.path} end={item.path === '/'}>{item.label}</NavLink>)}
      </nav>
      <main id="main" tabIndex={-1} className="workspace">
        <Routes>
          {navigation.map(item => <Route key={item.id} path={item.path} element={<FoundationPage page={item} />} />)}
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="foundation-footer"><span>SG · Sakshi Gupta</span><span>Turning data into meaningful insights.</span></footer>
    </div>
  )
}
