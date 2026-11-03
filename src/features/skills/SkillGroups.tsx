import { Braces, ChartColumn, ChartNoAxesCombined, Database, Network, Sigma, Wrench, Workflow, Check, type LucideIcon } from 'lucide-react'
import { content } from '../../content'
import type { Skill } from '../../content/types'

const groupIcons: Record<string, LucideIcon> = {
  programming: Braces, analysis: ChartNoAxesCombined, statistics: Sigma, ml: Workflow,
  dl: Network, databases: Database, visualization: ChartColumn, tools: Wrench,
}

export function SkillGroups({ selected, onSelect, onReadDetails }: {
  selected: Skill | null; onSelect: (skill: Skill) => void; onReadDetails: () => void
}) {
  return <section className="skill-groups" aria-labelledby="skill-groups-title" id="skill-groups">
    <h2 id="skill-groups-title" tabIndex={-1}>{content.skillsPage.groupsTitle}</h2>
    <p className="skill-instructions">{content.skillsPage.instructions}</p>
    <div className="skill-group-list">{content.skills.groups.map(group => {
      const Icon = groupIcons[group.id] ?? Braces
      const skills = content.skills.items.filter(skill => skill.groups.includes(group.id))
      return <section className="skill-group" key={group.id} aria-labelledby={`skill-group-${group.id}`}>
        <h3 id={`skill-group-${group.id}`}><Icon size={19} aria-hidden="true" />{group.name}<span className="skill-group-count">{skills.length}</span></h3>
        <ul>{skills.map(skill => <li key={skill.id}>
          <button type="button" className="skill-choice" aria-pressed={selected?.id === skill.id} aria-controls="skill-detail" onClick={() => onSelect(skill)}>
            {skill.name}{selected?.id === skill.id ? <Check size={14} aria-hidden="true" /> : null}
          </button>
        </li>)}</ul>
        {selected?.groups.includes(group.id) ? <button type="button" className="text-link skill-read-details" onClick={onReadDetails}>Read {selected.name} details <span aria-hidden="true">↑</span></button> : null}
      </section>
    })}</div>
  </section>
}
