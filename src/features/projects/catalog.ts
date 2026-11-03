import type { Project, Skill } from '../../content/types'

export const projectCategories = ['All', 'Data Science', 'Machine Learning', 'Deep Learning', 'Data Analytics', 'NLP', 'Computer Vision'] as const
export type ProjectCategory = typeof projectCategories[number]
export interface CatalogFilters { category: ProjectCategory; query: string }

export function readCatalogFilters(params: URLSearchParams): CatalogFilters {
  const category = projectCategories.find(item => item === params.get('category')) ?? 'All'
  return { category, query: params.get('q') ?? '' }
}

/** Only known catalog parameters travel with a detail link or return action. */
export function catalogSearch(filters: CatalogFilters): string {
  const params = new URLSearchParams()
  if (filters.category !== 'All') params.set('category', filters.category)
  if (filters.query) params.set('q', filters.query)
  return params.size ? `?${params}` : ''
}

export function filterProjects(projects: Project[], skills: Skill[], filters: CatalogFilters): Project[] {
  const terms = filters.query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean)
  return projects.filter(project => {
    if (filters.category !== 'All' && !project.categories.includes(filters.category)) return false
    const technologies = project.technologyClaims.map(claim => skills.find(skill => skill.id === claim.skillId)?.name ?? '')
    // Pending methods and proposed technologies must never become search evidence.
    const text = [project.title, project.summary, project.problem ?? '', ...project.categories, ...technologies].join(' ').toLocaleLowerCase()
    return terms.every(term => text.includes(term))
  })
}
