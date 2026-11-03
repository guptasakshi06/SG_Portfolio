import { useRef } from 'react'
import { useSearchParams } from 'react-router'
import { content } from '../content'
import type { Skill } from '../content/types'
import { PageIntro } from '../components/ui/PageIntro'
import { SkillDetail } from '../features/skills/SkillDetail'
import { SkillGroups } from '../features/skills/SkillGroups'
import { readSkillSelection, relatedProjects } from '../features/skills/explorer'
import '../styles/skills.css'

export function SkillsPage() {
  const [params, setParams] = useSearchParams()
  const { skill, unknown } = readSkillSelection(params, content.skills.items)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const copy = content.skillsPage
  function select(next: Skill | null) {
    const nextParams = new URLSearchParams(params)
    nextParams.delete('skill')
    if (next && next.id !== skill?.id) nextParams.set('skill', next.id)
    setParams(nextParams, { preventScrollReset: true })
  }
  function readDetails() {
    headingRef.current?.focus({ preventScroll: true })
    headingRef.current?.scrollIntoView({ block: 'start' })
  }
  function clearSelection() {
    select(null)
    headingRef.current?.focus({ preventScroll: true })
  }
  return <div className="skills-page">
    <title>Skills & Technologies · SG</title>
    <PageIntro eyebrow={copy.eyebrow} title={copy.title}><p>{copy.introduction}</p></PageIntro>
    <div className="skills-overview"><p><strong>{content.skills.items.length} skills & tools</strong><span aria-hidden="true"> / </span>{content.skills.groups.length} areas to explore</p><p>{copy.inventoryNote}</p></div>
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{skill ? `${skill.name} selected. ${skill.explanation} ${relatedProjects(content.projects, skill.id).length} documented related projects. Use Read ${skill.name} details for the full description.` : unknown ? copy.unknownDescription : 'No skill selected.'}</p>
    <div className="skills-explorer">
      <SkillDetail skill={skill} unknown={unknown} headingRef={headingRef} onClear={clearSelection} />
      <SkillGroups selected={skill} onSelect={select} onReadDetails={readDetails} />
    </div>
  </div>
}
