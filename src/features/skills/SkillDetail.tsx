import type { RefObject } from 'react'
import { ArrowRight, Compass } from 'lucide-react'
import { Link } from 'react-router'
import { content } from '../../content'
import type { Skill } from '../../content/types'
import { isSafeExternalUrl } from '../../lib/links'
import { relatedProjects, skillHref } from './explorer'

export function SkillDetail({ skill, unknown, headingRef, onClear }: {
  skill: Skill | null; unknown: boolean; headingRef: RefObject<HTMLHeadingElement | null>; onClear: () => void
}) {
  const copy = content.skillsPage
  const projects = skill ? relatedProjects(content.projects, skill.id) : []
  return <section className="skill-detail" id="skill-detail" aria-labelledby="skill-detail-title">
    <div className="skill-detail-heading">
      <p className="eyebrow">{copy.detailEyebrow}</p>
      {skill || unknown ? <button type="button" className="skill-clear" onClick={onClear}>{copy.clearLabel}</button> : null}
    </div>
    <h2 id="skill-detail-title" tabIndex={-1} ref={headingRef}>{skill?.name ?? (unknown ? copy.unknownTitle : copy.chooseTitle)}</h2>
    {skill ? <>
      <p className="skill-explanation">{skill.explanation}</p>
      <dl className="skill-source"><dt>{copy.sourceLabel}</dt><dd>{skill.source}</dd></dl>
      <Link className="text-link skill-permalink" to={skillHref(skill.id)}>Link to {skill.name} <ArrowRight size={15} aria-hidden="true" /></Link>
      <div className="skill-related">
        <h3>{copy.relatedTitle} <span>({projects.length})</span></h3>
        <p className="skill-evidence-note">{copy.relatedNote}</p>
        {projects.length ? <ul className="skill-related-list">{projects.map(({ project, source }) => <li key={project.id}>
          <h4><Link to={`/projects/${project.slug}`}>{project.title}<ArrowRight size={16} aria-hidden="true" /></Link></h4>
          <p>{project.summary}</p>
          <p className="skill-project-source">{isSafeExternalUrl(source) ? <a href={source} target="_blank" rel="noopener noreferrer">{skill.name} listed in {project.title} README <span aria-hidden="true">↗</span></a> : `${skill.name} listed in ${source}`}</p>
          <details><summary>{copy.contextLabel}</summary><ul>{project.evidence.limitations.map(note => <li key={note}>{note}</li>)}</ul></details>
        </li>)}</ul> : <div className="skill-empty"><Compass size={23} aria-hidden="true" /><h4>{copy.emptyTitle}</h4><p>{copy.emptyDescription}</p></div>}
      </div>
    </> : <p className="skill-explanation">{unknown ? copy.unknownDescription : copy.chooseDescription}</p>}
    <div className="skill-detail-actions"><Link className="text-link" to="/projects">{copy.allProjectsLabel}<ArrowRight size={16} aria-hidden="true" /></Link><a className="text-link" href="#skill-groups-title">{copy.browseLabel}</a></div>
  </section>
}
