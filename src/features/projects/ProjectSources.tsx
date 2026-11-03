import { ExternalLink, CodeXml } from 'lucide-react'
import type { Project } from '../../content/types'
import { isSafeExternalUrl } from '../../lib/links'

export function ProjectSources({ project }: { project: Project }) {
  return <div className="project-source-actions">
    {(['repository', 'demo'] as const).map(kind => {
      const url = project.links[kind]
      const label = kind === 'repository' ? 'Repository' : 'Live demo'
      const Icon = kind === 'repository' ? CodeXml : ExternalLink
      return url && isSafeExternalUrl(url)
        ? <a key={kind} className="text-link" href={url} target="_blank" rel="noopener noreferrer" aria-label={`${label}: ${project.title} (opens in a new tab)`}><Icon size={15} aria-hidden="true" />{label}<ExternalLink size={12} aria-hidden="true" /></a>
        : <span key={kind} className="project-source-missing">{label} not provided</span>
    })}
  </div>
}
