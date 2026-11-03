import { content } from '../../content'
import type { Project } from '../../content/types'
import { Badge } from '../../components/ui/Badge'

export function ProjectTechnologies({ project }: { project: Project }) {
  const sources = [...new Set(project.technologyClaims.map(claim => claim.source))]
  if (!sources.length) return <p className="project-technology-missing">Technology details to be added</p>
  return <div className="project-technology-groups">{sources.map(source => <div key={source}>
    <p className="project-technology-label">{source.includes('/README.md') ? 'README-listed tools' : source}</p>
    <div className="project-tags">{project.technologyClaims.filter(claim => claim.source === source).map(claim => <Badge key={claim.skillId}>{content.skills.items.find(skill => skill.id === claim.skillId)!.name}</Badge>)}</div>
  </div>)}</div>
}
