export interface SourceClaim { source: string; note: string }
export interface Resume { path: string; downloadName: string; version: string; source: string; sha256: string }
export interface Profile {
  name: string; role: string; intro: string; tagline: string; description: string
  about: string[]; focusAreas: string[]; availability: { label: string; immediateStartConfirmed: boolean }
  email: string | null; socials: { github: string | null; linkedin: string | null }
  resume: Resume | null
}
export interface Skill { id: string; name: string; groups: string[]; explanation: string; source: string }
export interface SkillCatalog { groups: { id: string; name: string }[]; items: Skill[] }
export type NotebookBlock =
  | { type: 'text'; text: string; provenance: string; sample: boolean }
  | { type: 'code'; language: string; code: string; provenance: string; sample: boolean }
  | { type: 'table'; caption: string; columns: string[]; rows: string[][]; provenance: string; sample: boolean }
  | { type: 'chart'; experimentId: string; provenance: string; sample: boolean }
  | { type: 'callout'; title: string; text: string; provenance: string; sample: boolean }
export interface Project {
  id: string; slug: string; title: string; summary: string
  problem: string | null; whyItMatters: string | null; whatIBuilt: string | null
  categories: string[]; categoryNote: string; featuredOrder: number | null
  technologyClaims: { skillId: string; source: string }[]
  proposedTechnologies: string[]
  links: { repository: string | null; demo: string | null }; thumbnail: string | null
  technicalSections: { id: string; title: string; blocks: NotebookBlock[] }[]
  evidence: { level: string; sources: SourceClaim[]; limitations: string[]; missing: string[] }
}
export interface Achievement { id: string; name: string; description: string; year: number | null; evidenceUrl: string | null; source: string }
export interface Education { id: string; degree: string; institution: string; location: string; start: string | null; expectedEnd: string; cpi: number | null; source: string }
export interface Experience { id: string; organization: string; role: string; start: string; end: string; summary: string; technologies: string[]; contributions: string[]; source: string; limitations: string }
export interface Experiment {
  id: string; title: string; sample: boolean; provenance: string; description: string
  axisUnits: string; legend: string[]; accessibleSummary: string
  data: { label: string; values: number[] }[]
}
export interface LabDemo {
  title: string; notice: string; provenance: string; description: string; comparisonId: string
  accuracyExplanation: string; lossExplanation: string; matrixExplanation: string
  models: { id: string; name: string; lossId: string; matrixId: string; validationSize: number }[]
}
export interface Experiments {
  actual: Experiment[]; illustrative: Experiment[]; emptyMessage: string
  page: { eyebrow: string; title: string; introduction: string; actualTitle: string; notesTitle: string; notesEmpty: string }
  notes: { id: string; title: string; text: string; provenance: string; kind: 'statistical-experiment' | 'research-note' | 'lesson' }[]
  demo: LabDemo
}
export interface NotebookContent {
  topics: { id: string; title: string; pending: string }[]
  example: { title: string; description: string; blocks: NotebookBlock[] }
}
export interface ProfilePages {
  about: {
    eyebrow: string; title: string; introduction: string; interestsTitle: string; interestsDescription: string
    approachTitle: string; approach: { id: string; title: string; text: string }[]
    learningTitle: string; learningDescription: string; experienceTitle: string; experienceEyebrow: string; educationTitle: string
  }
  education: { eyebrow: string; title: string; introduction: string; interestsTitle: string; interestsDescription: string }
  achievements: { eyebrow: string; title: string; introduction: string; evidenceNote: string; missingEvidence: string; evidenceLabel: string; undatedLabel: string }
  nextSteps: { title: string; description: string; projectsLabel: string; contactLabel: string }
}
export interface PortfolioContent {
  contact: Record<'eyebrow' | 'title' | 'introduction' | 'emailTitle' | 'emailDescription' | 'emailLabel' | 'emailNote' | 'profilesTitle' | 'githubDescription' | 'linkedinDescription' | 'resumeTitle' | 'resumeDescription' | 'resumeNote' | 'resumeMissing' | 'nextTitle' | 'nextDescription' | 'projectsLabel', string>
  skillsPage: Record<'eyebrow' | 'title' | 'introduction' | 'groupsTitle' | 'instructions' | 'inventoryNote' | 'chooseTitle' | 'chooseDescription' | 'unknownTitle' | 'unknownDescription' | 'clearLabel' | 'detailEyebrow' | 'sourceLabel' | 'relatedTitle' | 'relatedNote' | 'emptyTitle' | 'emptyDescription' | 'allProjectsLabel' | 'browseLabel' | 'contextLabel', string>
  profilePages: ProfilePages
  notebook: NotebookContent
  home: {
    hero: { exploreLabel: string; resumeLabel: string }
    highlights: { selected: string; selectedDescription: string; interests: string; education: string }
    projects: { eyebrow: string; title: string; description: string; action: string; previewAction: string }
    achievements: { eyebrow: string; title: string; action: string }
    skills: { eyebrow: string; title: string; description: string; action: string; ids: string[] }
    about: { eyebrow: string; title: string; action: string }
    contact: { eyebrow: string; title: string; description: string; emailLabel: string; action: string }
  }
  profile: Profile; projects: Project[]; skills: SkillCatalog; achievements: Achievement[]
  education: Education[]; experience: Experience[]; experiments: Experiments
}
