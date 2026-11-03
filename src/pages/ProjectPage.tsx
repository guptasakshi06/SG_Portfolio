import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { content } from '../content'
import { FoundationNotice, PageIntro } from '../components/ui/PageIntro'
import { NotFoundPage } from './NotFoundPage'

export function ProjectPage() {
  const { slug } = useParams()
  const project = content.projects.find(item => item.slug === slug)
  if (!project) return <NotFoundPage project />
  return <>
    <title>{`${project.title} · SG`}</title>
    <Link className="text-link back-link" to="/projects"><ArrowLeft size={16} aria-hidden="true" /> All projects</Link>
    <PageIntro eyebrow={project.categories.join(' / ')} title={project.title}><p>{project.summary}</p></PageIntro>
    <section className="content-panel"><h2>Project preview</h2><p>{project.whatIBuilt ?? 'Implementation details have not been supplied yet.'}</p><p className="muted-label">{project.evidence.level}</p></section>
    <FoundationNotice>Detailed project overviews and technical notebooks are planned for S05. Dataset and evaluation details will be added when supported by project evidence.</FoundationNotice>
  </>
}
