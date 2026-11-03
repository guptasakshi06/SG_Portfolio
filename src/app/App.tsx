import { Route, Routes } from 'react-router'
import { navigation } from './navigation'
import { FoundationPage } from '../pages/FoundationPage'
import { ProjectPage } from '../pages/ProjectPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { AppShell } from '../components/layout/AppShell'

export function App() {
  return <AppShell>
    <Routes>
      {navigation.map(item => <Route key={item.id} path={item.path} element={<FoundationPage page={item} />} />)}
      <Route path="/projects/:slug" element={<ProjectPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </AppShell>
}
