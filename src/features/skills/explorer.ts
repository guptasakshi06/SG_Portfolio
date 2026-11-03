import type { Project, Skill } from '../../content/types'

/** Canonical URL contract for the explorer and future search results. */
export function skillHref(skillId: string): string {
  return `/skills?${new URLSearchParams({ skill: skillId })}`
}

export function readSkillSelection(params: URLSearchParams, skills: Skill[]) {
  const id = params.get('skill')
  return { skill: skills.find(skill => skill.id === id) ?? null, unknown: id !== null && !skills.some(skill => skill.id === id) }
}

/** Categories, titles and proposed tools are never evidence of skill use. */
export function relatedProjects(projects: Project[], skillId: string) {
  return projects.flatMap(project => {
    const claim = project.technologyClaims.find(item => item.skillId === skillId)
    return claim ? [{ project, source: claim.source }] : []
  })
}
