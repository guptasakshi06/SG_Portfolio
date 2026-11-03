import { House, UserRound, FolderOpen, FlaskConical, Blocks, GraduationCap, Award, Mail } from 'lucide-react'

export const navigation = [
  { path: '/', label: 'Home', id: 'home', sprint: 'S03', icon: House },
  { path: '/about', label: 'About Me', id: 'about', sprint: 'S06', icon: UserRound },
  { path: '/projects', label: 'My Projects', id: 'projects', sprint: 'S04', icon: FolderOpen },
  { path: '/experiments', label: 'Experiments & Research', id: 'experiments', sprint: 'S08', icon: FlaskConical },
  { path: '/skills', label: 'Skills & Technologies', id: 'skills', sprint: 'S07', icon: Blocks },
  { path: '/education', label: 'Education', id: 'education', sprint: 'S06', icon: GraduationCap },
  { path: '/achievements', label: 'Achievements', id: 'achievements', sprint: 'S06', icon: Award },
  { path: '/contact', label: 'Contact', id: 'contact', sprint: 'S10', icon: Mail },
] as const

export type PageId = typeof navigation[number]['id']
