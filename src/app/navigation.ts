export const navigation = [
  { path: '/', label: 'Home', id: 'home', sprint: 'S03' },
  { path: '/about', label: 'About Me', id: 'about', sprint: 'S06' },
  { path: '/projects', label: 'My Projects', id: 'projects', sprint: 'S04' },
  { path: '/experiments', label: 'Experiments & Research', id: 'experiments', sprint: 'S08' },
  { path: '/skills', label: 'Skills & Technologies', id: 'skills', sprint: 'S07' },
  { path: '/education', label: 'Education', id: 'education', sprint: 'S06' },
  { path: '/achievements', label: 'Achievements', id: 'achievements', sprint: 'S06' },
  { path: '/contact', label: 'Contact', id: 'contact', sprint: 'S10' },
] as const

export type PageId = typeof navigation[number]['id']
