import { Link } from 'react-router'
import { FlaskConical, NotebookPen } from 'lucide-react'
import { content } from '../content'
import { PageIntro } from '../components/ui/PageIntro'
import { LabDemo } from '../features/experiments/LabDemo'
import { DataTable } from '../features/experiments/DataTable'
import { experimentView } from '../features/experiments/demo'
import '../styles/experiments.css'

export function ExperimentsPage() {
  const { experiments } = content
  const { page } = experiments
  return <div className="experiments-page">
    <PageIntro eyebrow={page.eyebrow} title={page.title}><p>{page.introduction}</p></PageIntro>
    <section className="lab-actual content-panel" aria-labelledby="actual-title"><FlaskConical size={22} aria-hidden="true" /><div><h2 id="actual-title">{page.actualTitle}</h2>
      {experiments.actual.length ? experiments.actual.map(item => <article key={item.id}><h3>{item.title}</h3><p>{item.description}</p><p>{item.accessibleSummary}</p><DataTable sample={false} provenance={item.provenance} view={experimentView(item)} /></article>) : <><p>{experiments.emptyMessage}</p><Link className="text-link" to="/projects">Explore documented projects</Link></>}
    </div></section>
    <LabDemo />
    <section className="lab-notes content-panel" aria-labelledby="notes-title"><NotebookPen size={22} aria-hidden="true" /><div><h2 id="notes-title">{page.notesTitle}</h2>{experiments.notes.length ? experiments.notes.map(note => <article key={note.id}><p className="lab-sample-label">{note.kind.replaceAll('-', ' ')}</p><h3>{note.title}</h3><p>{note.text}</p><p>Source: {note.provenance}</p></article>) : <p>{page.notesEmpty}</p>}</div></section>
  </div>
}
