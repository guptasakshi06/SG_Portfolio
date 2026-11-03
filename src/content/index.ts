import profile from './profile.json'
import contact from './contact.json'
import projects from './projects.json'
import skills from './skills.json'
import achievements from './achievements.json'
import education from './education.json'
import experience from './experience.json'
import experiments from './experiments.json'
import home from './home.json'
import notebook from './notebook.json'
import profilePages from './profile-pages.json'
import skillsPage from './skills-page.json'
import type { NotebookContent, Project } from './types'
import type { PortfolioContent } from './types'
import { validateContent } from '../lib/validate-content'

export const content: PortfolioContent = { contact, skillsPage, profilePages, home, profile, projects: projects as Project[], notebook: notebook as NotebookContent, skills, achievements, education, experience, experiments }
const errors = validateContent(content)
if (errors.length) throw new Error(`Invalid portfolio content:\n${errors.join('\n')}`)
