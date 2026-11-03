import { ArrowUpRight, AudioLines, ChartNoAxesCombined, ScanLine } from 'lucide-react'
import { Link } from 'react-router'
import { content } from '../../content'
import type { Project } from '../../content/types'
import { Badge } from '../../components/ui/Badge'

/** A topic illustration, never a screenshot or a claimed project result. */
export function ProjectPreview({ project }: { project: Project }) {
  const Icon = project.categories.includes('Computer Vision') ? ScanLine
    : project.categories.includes('Deep Learning') ? AudioLines : ChartNoAxesCombined
  const documented = project.technologyClaims.length > 0
  return <article className="project-preview" aria-labelledby={`preview-${project.slug}`}>
    <div className={`project-illustration${documented ? ' illustration-cyan' : ''}`} aria-hidden="true"><span className="illustration-ring" /><Icon size={44} strokeWidth={1.2} /><span className="illustration-corner">SG / PROJECT</span></div>
    <div className="project-preview-body">
      <p className="project-topic">Topic: {project.categories.join(' / ')}</p>
      <h3 id={`preview-${project.slug}`}>{project.title}</h3>
      <p className="project-summary">{project.summary}</p>
      <div className="project-tags">{project.technologyClaims.map(claim => <Badge key={claim.skillId}>{content.skills.items.find(skill => skill.id === claim.skillId)!.name}</Badge>)}</div>
      <p className="project-evidence">{project.evidence.level}</p>
      <Link className="text-link project-preview-link" to={`/projects/${project.slug}`} aria-label={`${content.home.projects.previewAction}: ${project.title}`}>{content.home.projects.previewAction}<ArrowUpRight size={16} aria-hidden="true" /></Link>
    </div>
  </article>
}
