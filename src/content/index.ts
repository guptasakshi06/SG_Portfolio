import profile from './profile.json'
import projects from './projects.json'
import skills from './skills.json'
import achievements from './achievements.json'
import education from './education.json'
import experience from './experience.json'
import experiments from './experiments.json'
import home from './home.json'
import type { PortfolioContent } from './types'
import { validateContent } from '../lib/validate-content'

export const content: PortfolioContent = { home, profile, projects, skills, achievements, education, experience, experiments }
const errors = validateContent(content)
if (errors.length) throw new Error(`Invalid portfolio content:\n${errors.join('\n')}`)
