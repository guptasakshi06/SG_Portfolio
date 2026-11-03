import type { PortfolioContent } from '../content/types'
import { emailHref, isSafeAssetPath, isSafeExternalUrl, resumeHref } from './links'

export const projectCategories = ['Data Science', 'Machine Learning', 'Deep Learning', 'Data Analytics', 'NLP', 'Computer Vision']

/** Compile-time contracts catch shape errors; this checks cross-record and unsafe-value errors. */
export function validateContent(content: PortfolioContent): string[] {
  const errors: string[] = []
  const required = (value: string, label: string) => {
    if (typeof value !== 'string' || !value.trim()) errors.push(`${label}: a nonempty label is required`)
  }
  const unique = (values: string[], label: string) => {
    if (new Set(values).size !== values.length) errors.push(`${label}: duplicate values`)
  }
  const external = (value: string | null, label: string) => {
    if (value !== null && !isSafeExternalUrl(value)) errors.push(`${label}: expected a safe HTTPS URL or null`)
  }
  const identities = (items: { id: string }[], label: string) => {
    unique(items.map(item => item.id), label)
    items.forEach(item => {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id)) errors.push(`${label}: invalid ID ${item.id}`)
    })
  }
  const { profile, projects, skills } = content
  for (const key of ['name', 'role', 'intro', 'tagline', 'description'] as const) required(profile[key], `profile.${key}`)
  required(profile.availability.label, 'profile.availability.label')
  profile.about.forEach(value => required(value, 'profile.about'))
  profile.focusAreas.forEach(value => required(value, 'profile.focusAreas'))
  if (profile.email !== null && !emailHref(profile.email)) errors.push('profile.email: invalid email')
  Object.entries(profile.socials).forEach(([key, value]) => external(value, `profile.socials.${key}`))
  if (profile.resume) {
    if (!resumeHref(profile.resume) || !profile.resume.path.endsWith('.pdf')) errors.push('profile.resume: invalid PDF path or version')
    if (!/^[a-zA-Z0-9_-]+\.pdf$/.test(profile.resume.downloadName)) errors.push('profile.resume: invalid download name')
    required(profile.resume.source, 'profile.resume.source')
    if (!/^[a-f0-9]{64}$/.test(profile.resume.sha256)) errors.push('profile.resume: invalid SHA-256')
  }
  identities(skills.groups, 'skill groups')
  identities(skills.items, 'skills')
  const groupIds = new Set(skills.groups.map(group => group.id))
  const skillIds = new Set(skills.items.map(skill => skill.id))
  skills.groups.forEach(group => required(group.name, `group ${group.id}`))
  skills.items.forEach(skill => {
    required(skill.name, `skill ${skill.id}.name`)
    required(skill.explanation, `skill ${skill.id}.explanation`)
    required(skill.source, `skill ${skill.id}.source`)
    if (!skill.groups.length || skill.groups.some(id => !groupIds.has(id))) errors.push(`skill ${skill.id}: unknown or absent group`)
    unique(skill.groups, `skill ${skill.id} groups`)
  })
  identities(projects, 'projects')
  unique(projects.map(project => project.slug), 'project slugs')
  unique(projects.flatMap(project => project.featuredOrder === null ? [] : [String(project.featuredOrder)]), 'featured order')
  projects.forEach(project => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) errors.push(`invalid project slug: ${project.slug}`)
    for (const key of ['title', 'summary', 'categoryNote'] as const) required(project[key], `${project.slug}.${key}`)
    for (const key of ['problem', 'whyItMatters', 'whatIBuilt'] as const) {
      if (project[key] !== null) required(project[key], `${project.slug}.${key}`)
    }
    if (!project.categories.length || project.categories.some(category => !projectCategories.includes(category))) errors.push(`${project.slug}: invalid browse category`)
    unique(project.categories, `${project.slug} categories`)
    if (project.featuredOrder !== null && (!Number.isInteger(project.featuredOrder) || project.featuredOrder < 1)) errors.push(`${project.slug}: invalid featured order`)
    unique(project.technologyClaims.map(claim => claim.skillId), `${project.slug} technology claims`)
    project.technologyClaims.forEach(claim => {
      if (!skillIds.has(claim.skillId)) errors.push(`${project.slug}: unknown skill ${claim.skillId}`)
      required(claim.source, `${project.slug} technology source`)
    })
    Object.entries(project.links).forEach(([key, value]) => external(value, `${project.slug}.${key}`))
    if (project.thumbnail !== null && !isSafeAssetPath(project.thumbnail)) errors.push(`${project.slug}: invalid thumbnail asset path`)
    required(project.evidence.level, `${project.slug} evidence level`)
    if (!project.evidence.sources.length) errors.push(`${project.slug}: missing source attribution`)
    project.evidence.sources.forEach(claim => {
      required(claim.source, `${project.slug} evidence source`)
      required(claim.note, `${project.slug} evidence note`)
    })
    identities(project.technicalSections, `${project.slug} technical sections`)
    project.technicalSections.forEach(section => {
      required(section.title, `${project.slug} section title`)
      section.blocks.forEach(block => {
        required(block.provenance, `${project.slug} block provenance`)
        if (block.type === 'chart' && ![...content.experiments.actual, ...content.experiments.illustrative].some(entry => entry.id === block.experimentId && entry.sample === block.sample)) errors.push(`${project.slug}: unknown chart or mismatched sample marker`)
      })
    })
  })
  identities(content.achievements, 'achievements')
  content.achievements.forEach(item => {
    required(item.name, `achievement ${item.id}`)
    required(item.description, `achievement ${item.id} description`)
    required(item.source, `achievement ${item.id} source`)
    external(item.evidenceUrl, `achievement ${item.id} evidence`)
    if (item.year !== null && (!Number.isInteger(item.year) || item.year < 1900)) errors.push(`achievement ${item.id}: invalid year`)
  })
  identities(content.education, 'education')
  content.education.forEach(item => {
    for (const key of ['degree', 'institution', 'location', 'expectedEnd', 'source'] as const) required(item[key], `education ${key}`)
  })
  identities(content.experience, 'experience')
  content.experience.forEach(item => {
    for (const key of ['organization', 'role', 'start', 'end', 'summary', 'source'] as const) required(item[key], `experience ${key}`)
    item.contributions.forEach(value => required(value, 'experience contribution'))
  })
  const { actual, illustrative } = content.experiments
  identities([...actual, ...illustrative], 'experiments')
  actual.forEach(item => { if (item.sample) errors.push(`${item.id}: sample in actual results`) })
  illustrative.forEach(item => { if (!item.sample) errors.push(`${item.id}: missing sample marker`) })
  required(content.experiments.emptyMessage, 'experiments empty message')
  ;[...actual, ...illustrative].forEach(item => {
    for (const key of ['title', 'provenance', 'description', 'axisUnits', 'accessibleSummary'] as const) required(item[key], `${item.id}.${key}`)
    if (!item.legend.length || item.data.some(row => row.values.length !== item.legend.length || row.values.some(value => !Number.isFinite(value)))) errors.push(`${item.id}: inconsistent chart values or legend`)
  })
  return errors
}
