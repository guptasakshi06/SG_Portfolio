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
  | { type: 'table'; columns: string[]; rows: string[][]; provenance: string; sample: boolean }
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
export interface Experiments { actual: Experiment[]; illustrative: Experiment[]; emptyMessage: string }
export interface PortfolioContent {
  profile: Profile; projects: Project[]; skills: SkillCatalog; achievements: Achievement[]
  education: Education[]; experience: Experience[]; experiments: Experiments
}
