import { lazy, Suspense, useState } from 'react'
import { BookOpen, ChevronDown } from 'lucide-react'
import type { Project } from '../../content/types'
const NotebookViewer = lazy(() => import('../notebook/NotebookViewer'))

export function ProjectTechnicalDetails({ project }: { project: Project }) {
  const [opened, setOpened] = useState(false)
  return <details className="project-technical" onToggle={event => setOpened(event.currentTarget.open)}>
    <summary><BookOpen size={22} aria-hidden="true" /><span>Explore Technical Details<small>Optional · approach, sources and what’s still unknown</small></span><ChevronDown className="disclosure-chevron" size={20} aria-hidden="true" /></summary>
    {opened ? <Suspense fallback={<p className="notebook-loading" role="status">Loading technical notes…</p>}><NotebookViewer project={project} /></Suspense> : null}
  </details>
}
