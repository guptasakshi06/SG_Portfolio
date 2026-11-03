import { Route, Routes } from 'react-router'
import { navigation } from './navigation'
import { FoundationPage } from '../pages/FoundationPage'
import { ProjectPage } from '../pages/ProjectPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { AppShell } from '../components/layout/AppShell'
import { HomePage } from '../pages/HomePage'
import { ProjectsPage } from '../pages/ProjectsPage'

export function App() {
  return <AppShell>
    <Routes>
      {navigation.map(item => <Route key={item.id} path={item.path} element={item.id === 'home' ? <HomePage /> : item.id === 'projects' ? <ProjectsPage /> : <FoundationPage page={item} />} />)}
      <Route path="/projects/:slug" element={<ProjectPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </AppShell>
}
