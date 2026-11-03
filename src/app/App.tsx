import { Route, Routes } from 'react-router'
import type { ReactElement } from 'react'
import { navigation, type PageId } from './navigation'
import { FoundationPage } from '../pages/FoundationPage'
import { ProjectPage } from '../pages/ProjectPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { AppShell } from '../components/layout/AppShell'
import { HomePage } from '../pages/HomePage'
import { ProjectsPage } from '../pages/ProjectsPage'
import { AboutPage } from '../pages/AboutPage'
import { EducationPage } from '../pages/EducationPage'
import { AchievementsPage } from '../pages/AchievementsPage'
import { SkillsPage } from '../pages/SkillsPage'
import { ExperimentsPage } from '../pages/ExperimentsPage'

const routePages: Partial<Record<PageId, ReactElement>> = { home: <HomePage />, projects: <ProjectsPage />, about: <AboutPage />, education: <EducationPage />, achievements: <AchievementsPage />, skills: <SkillsPage />, experiments: <ExperimentsPage /> }

export function App() {
  return <AppShell>
    <Routes>
      {navigation.map(item => <Route key={item.id} path={item.path} element={routePages[item.id] ?? <FoundationPage page={item} />} />)}
      <Route path="/projects/:slug" element={<ProjectPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </AppShell>
}
