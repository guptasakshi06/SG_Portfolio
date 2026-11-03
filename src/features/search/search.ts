import { navigation } from '../../app/navigation'
import type { PortfolioContent } from '../../content/types'
import { skillHref } from '../skills/explorer'

export const searchGroups = ['Pages', 'Projects', 'Skills', 'Portfolio'] as const
export type SearchGroup = typeof searchGroups[number]
export interface SearchEntry {
  id: string; group: SearchGroup; title: string; description: string; href: string; keywords: string
}

/** Explicit public fields only: no source records, private configuration or sample metrics. */
export function buildSearchIndex(data: PortfolioContent): SearchEntry[] {
  const pageCopy: Record<string, { description: string; keywords?: string }> = {
    home: { description: data.profile.description, keywords: `${data.profile.name} ${data.profile.role} ${data.profile.tagline}` },
    about: { description: data.profilePages.about.introduction, keywords: `${data.profile.about.join(' ')} ${data.profile.focusAreas.join(' ')}` },
    projects: { description: data.home.projects.description },
    experiments: { description: data.experiments.page.introduction, keywords: 'ML LAB research notes statistical experiments lessons' },
    skills: { description: data.skillsPage.introduction },
    education: { description: data.profilePages.education.introduction },
    achievements: { description: data.profilePages.achievements.introduction },
    contact: { description: data.profile.availability.label, keywords: 'email GitHub LinkedIn resume contact opportunities internships full-time' },
  }
  const skillNames = new Map(data.skills.items.map(skill => [skill.id, skill.name]))
  return [
    ...navigation.map(page => ({ id: `page-${page.id}`, group: 'Pages' as const, title: page.label, href: page.path, description: pageCopy[page.id].description, keywords: pageCopy[page.id].keywords ?? '' })),
    ...data.projects.map(project => ({
      id: `project-${project.id}`, group: 'Projects' as const, title: project.title, href: `/projects/${project.slug}`,
      description: project.summary,
      keywords: [project.problem, project.whyItMatters, project.whatIBuilt, ...project.categories,
        ...project.technologyClaims.map(claim => skillNames.get(claim.skillId))].filter(Boolean).join(' '),
    })),
    ...data.skills.items.map(skill => ({
      id: `skill-${skill.id}`, group: 'Skills' as const, title: skill.name, href: skillHref(skill.id), description: skill.explanation,
      keywords: data.skills.groups.filter(group => skill.groups.includes(group.id)).map(group => group.name).join(' '),
    })),
    ...data.education.map(item => ({
      id: `education-${item.id}`, group: 'Portfolio' as const, title: item.degree, href: `/education#education-${item.id}`,
      description: `${item.institution} · ${item.location}`, keywords: `education expected graduation ${item.expectedEnd.slice(0, 4)}`,
    })),
    ...data.experience.map(item => ({
      id: `experience-${item.id}`, group: 'Portfolio' as const, title: `${item.organization} · ${item.role}`, href: `/about#experience-${item.id}`,
      description: item.summary, keywords: [...item.technologies, ...item.contributions, 'internship experience'].join(' '),
    })),
    ...data.achievements.map(item => ({
      id: `achievement-${item.id}`, group: 'Portfolio' as const, title: item.name, href: `/achievements#achievement-${item.id}`,
      description: item.description, keywords: `achievement ${item.year ?? ''}`,
    })),
    ...data.profilePages.about.approach.map(item => ({
      id: `approach-${item.id}`, group: 'Portfolio' as const, title: item.title, href: '/about#about-approach', description: item.text, keywords: 'approach',
    })),
    { id: 'learning', group: 'Portfolio', title: data.profilePages.about.learningTitle, href: '/about#about-learning', description: data.profilePages.about.learningDescription, keywords: 'learning practice' },
  ]
}

function normalize(text: string) { return text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, ' ') }

/** Every term must match. Rank within stable, understandable groups; retain the full result set. */
export function searchPortfolio(index: SearchEntry[], query: string): SearchEntry[] {
  const normalized = normalize(query)
  if (!normalized) return index.filter(entry => entry.group === 'Pages')
  const terms = normalized.split(' ')
  return index.flatMap((entry, order) => {
    const title = normalize(entry.title)
    const description = normalize(entry.description)
    const all = `${title} ${description} ${normalize(entry.keywords)}`
    if (!terms.every(term => all.includes(term))) return []
    const score = title === normalized ? 100 : title.startsWith(normalized) ? 60 : title.includes(normalized) ? 40 :
      terms.reduce((sum, term) => sum + (title.includes(term) ? 10 : description.includes(term) ? 3 : 1), 0)
    return [{ entry, score, order }]
  }).sort((a, b) => searchGroups.indexOf(a.entry.group) - searchGroups.indexOf(b.entry.group) || b.score - a.score || a.order - b.order)
    .map(result => result.entry)
}

export function nextResultIndex(current: number, direction: 1 | -1, count: number) {
  return count ? (current + direction + count) % count : 0
}

/** Keep native editing, composition, modified shortcuts and other modal dialogs undisturbed. */
export function isSearchShortcut(event: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey' | 'repeat' | 'isComposing' | 'defaultPrevented'>, editing: boolean) {
  return !editing && !event.defaultPrevented && !event.isComposing && !event.repeat && !event.altKey && !event.shiftKey &&
    (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k'
}
