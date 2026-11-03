import { ArrowUpRight, AudioLines, ChartNoAxesCombined, ScanLine } from 'lucide-react'
import { Link } from 'react-router'
import { content } from '../../content'
import type { Project } from '../../content/types'
import { Badge } from '../../components/ui/Badge'
import { ProjectSources } from './ProjectSources'
import { ProjectTechnologies } from './ProjectTechnologies'

/** A topic illustration, never a screenshot or a claimed project result. */
export function ProjectPreview({ project, catalogSearch }: { project: Project; catalogSearch?: string }) {
  const Icon = project.categories.includes('Computer Vision') ? ScanLine
    : project.categories.includes('Deep Learning') ? AudioLines : ChartNoAxesCombined
  const documented = project.technologyClaims.length > 0
  const catalog = catalogSearch !== undefined
  const Heading = catalog ? 'h2' : 'h3'
  const action = catalog ? 'View project overview' : content.home.projects.previewAction
  return <article className={`project-preview${catalog ? ' catalog-card' : ''}`} aria-labelledby={`preview-${project.slug}`}>
    <div className={`project-illustration${documented ? ' illustration-cyan' : ''}`} aria-hidden="true"><span className="illustration-ring" /><Icon size={44} strokeWidth={1.2} /><span className="illustration-corner">SG / PROJECT</span></div>
    <div className="project-preview-body">
      <p className="project-topic">Topic: {project.categories.join(' / ')}</p>
      <Heading id={`preview-${project.slug}`}>{project.title}</Heading>
      <p className="project-summary">{project.summary}</p>
      {catalog ? <ProjectTechnologies project={project} /> : <div className="project-tags">{project.technologyClaims.map(claim => <Badge key={claim.skillId}>{content.skills.items.find(skill => skill.id === claim.skillId)!.name}</Badge>)}</div>}
      <p className="project-evidence">{project.evidence.level}</p>
      {catalog ? <details className="project-source-notes"><summary>Source notes & limitations</summary><p>{project.categoryNote}</p>{project.evidence.limitations.map(note => <p key={note}>{note}</p>)}</details> : null}
      <Link className="text-link project-preview-link" to={`/projects/${project.slug}${catalogSearch ?? ''}`} aria-label={`${action}: ${project.title}`}>{action}<ArrowUpRight size={16} aria-hidden="true" /></Link>
      {catalog ? <ProjectSources project={project} /> : null}
    </div>
  </article>
}
