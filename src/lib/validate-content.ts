import type { NotebookBlock, PortfolioContent } from '../content/types'
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
  const month = (value: string, label: string) => {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) errors.push(`${label}: expected YYYY-MM with a valid month`)
  }
  const identities = (items: { id: string }[], label: string) => {
    unique(items.map(item => item.id), label)
    items.forEach(item => {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id)) errors.push(`${label}: invalid ID ${item.id}`)
    })
  }
  const notebookBlocks = (blocks: NotebookBlock[], label: string) => {
    blocks.forEach(block => {
      required(block.provenance, `${label} block provenance`)
      if (typeof block.sample !== 'boolean') errors.push(`${label}: missing boolean sample marker`)
      switch (block.type) {
        case 'text': required(block.text, `${label} text`); break
        case 'callout': required(block.title, `${label} callout title`); required(block.text, `${label} callout text`); break
        case 'code': required(block.code, `${label} code`); required(block.language, `${label} code language`); break
        case 'table':
          required(block.caption, `${label} table caption`)
          if (!block.columns.length || !block.rows.length || block.rows.some(row => row.length !== block.columns.length)) errors.push(`${label}: inconsistent table columns/rows`)
          block.columns.forEach(column => required(column, `${label} column heading`))
          break
        case 'chart':
          if (![...content.experiments.actual, ...content.experiments.illustrative].some(entry => entry.id === block.experimentId && entry.sample === block.sample)) errors.push(`${label}: unknown chart or mismatched sample marker`)
          break
        default: errors.push(`${label}: unsupported notebook block`)
      }
    })
  }
  identities(content.notebook.topics, 'notebook topics')
  content.notebook.topics.forEach(topic => {
    required(topic.title, 'notebook topic title')
    required(topic.pending, 'notebook topic pending text')
  })
  required(content.notebook.example.title, 'notebook example title')
  required(content.notebook.example.description, 'notebook example description')
  if (!content.notebook.example.blocks.length || content.notebook.example.blocks.some(block => !block.sample)) errors.push('notebook example: every block must be marked illustrative')
  notebookBlocks(content.notebook.example.blocks, 'notebook example')
  const { profile, projects, skills } = content
  Object.entries(content.skillsPage).forEach(([key, value]) => required(value, `skillsPage.${key}`))
  Object.entries(content.profilePages).forEach(([section, copy]) => {
    Object.entries(copy).forEach(([key, value]) => {
      if (typeof value === 'string') required(value, `profilePages.${section}.${key}`)
    })
  })
  identities(content.profilePages.about.approach, 'profile approach')
  content.profilePages.about.approach.forEach(item => {
    required(item.title, `profile approach ${item.id} title`)
    required(item.text, `profile approach ${item.id} text`)
  })
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
  unique(content.home.skills.ids, 'home skill selection')
  content.home.skills.ids.forEach(id => {
    if (!skillIds.has(id)) errors.push(`home: unknown skill ${id}`)
  })
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
      notebookBlocks(section.blocks, project.slug)
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
    month(item.expectedEnd, `education ${item.id} expectedEnd`)
    if (item.start !== null) {
      month(item.start, `education ${item.id} start`)
      if (item.start > item.expectedEnd) errors.push(`education ${item.id}: start follows expected end`)
    }
  })
  identities(content.experience, 'experience')
  content.experience.forEach(item => {
    for (const key of ['organization', 'role', 'start', 'end', 'summary', 'source'] as const) required(item[key], `experience ${key}`)
    month(item.start, `experience ${item.id} start`)
    month(item.end, `experience ${item.id} end`)
    if (item.start > item.end) errors.push(`experience ${item.id}: start follows end`)
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
