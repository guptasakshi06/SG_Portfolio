import { Link, useParams, useSearchParams } from 'react-router'
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react'
import { content } from '../content'
import { PageIntro } from '../components/ui/PageIntro'
import { NotFoundPage } from './NotFoundPage'
import { catalogSearch, readCatalogFilters } from '../features/projects/catalog'
import { ProjectSources } from '../features/projects/ProjectSources'
import { ProjectTechnologies } from '../features/projects/ProjectTechnologies'
import { ProjectTechnicalDetails } from '../features/projects/ProjectTechnicalDetails'
import { isSafeExternalUrl } from '../lib/links'
import '../styles/projects.css'
import '../styles/notebook.css'

export function ProjectPage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const search = catalogSearch(readCatalogFilters(params))
  const index = content.projects.findIndex(item => item.slug === slug)
  const project = content.projects[index]
  if (!project) return <NotFoundPage project />
  const previous = content.projects[index - 1]
  const next = content.projects[index + 1]
  return <article className="project-detail">
    <title>{`${project.title} · SG`}</title>
    <Link className="text-link back-link" to={`/projects${search}`}><ArrowLeft size={16} aria-hidden="true" />{search ? 'Back to filtered projects' : 'All projects'}</Link>
    <PageIntro eyebrow={project.categories.join(' / ')} title={project.title}><p>{project.summary}</p></PageIntro>
    <div className="project-evidence-banner"><FileText size={18} aria-hidden="true" /><p>{project.evidence.level}</p></div>
    <div className="project-overview-layout">
      <section className="project-overview" aria-labelledby="overview-title"><p className="eyebrow">The plain-language overview</p><h2 id="overview-title">The idea, before the details.</h2>
        <div className="overview-questions">{[
          ['What is it?', project.summary],
          ['What problem does it address?', project.problem ?? 'The specific problem statement has not been supplied yet. The description above introduces the topic only.'],
          ['Why does it matter?', project.whyItMatters ?? 'Project-specific context and intended benefits have not been supplied yet. No impact is claimed.'],
          ['What did I build?', project.whatIBuilt ?? 'Implementation details have not been supplied yet. Methods and completed features cannot be established from the title alone.'],
        ].map(([question, answer]) => <div key={question}><h3>{question}</h3><p>{answer}</p></div>)}</div>
      </section>
      <aside className="project-detail-aside" aria-label="Project tools and links"><h2>Tools & access</h2><ProjectTechnologies project={project} /><p className="detail-category-note">{project.categoryNote}</p><ProjectSources project={project} />
        <div className="detail-missing"><h3>Still to document</h3><ul>{project.evidence.missing.map(item => <li key={item}>{item}</li>)}</ul></div>
      </aside>
    </div>
    <section className="project-evidence-notes" aria-labelledby="evidence-title"><h2 id="evidence-title">Sources & boundaries</h2><ul>{project.evidence.limitations.map(note => <li key={note}>{note}</li>)}</ul>
      <details className="detail-source-disclosure"><summary>Read source attribution</summary>{project.evidence.sources.map(source => <div key={source.source}><p>{isSafeExternalUrl(source.source) ? <a href={source.source} target="_blank" rel="noopener noreferrer">Reviewed README (opens in a new tab)</a> : <strong>{source.source}</strong>}</p><p>{source.note}</p></div>)}</details>
    </section>
    <ProjectTechnicalDetails key={project.slug} project={project} />
    <nav className="project-sequence" aria-label="Explore more projects">
      {previous ? <Link to={`/projects/${previous.slug}${search}`} rel="prev"><span><ArrowLeft size={16} aria-hidden="true" />Previous project</span><strong>{previous.title}</strong></Link> : <Link to={`/projects${search}`}><span><ArrowLeft size={16} aria-hidden="true" />Browse the collection</span><strong>{search ? 'Return to filtered projects' : 'View all projects'}</strong></Link>}
      {next ? <Link to={`/projects/${next.slug}${search}`} rel="next"><span>Next project<ArrowRight size={16} aria-hidden="true" /></span><strong>{next.title}</strong></Link> : <Link to={`/projects${search}`}><span>Back to the collection<ArrowRight size={16} aria-hidden="true" /></span><strong>{search ? 'Return to filtered projects' : 'View all projects'}</strong></Link>}
    </nav>
  </article>
}
