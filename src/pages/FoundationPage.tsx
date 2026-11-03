import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { content } from '../content'
import { navigation, type PageId } from '../app/navigation'
import { FoundationNotice, PageIntro } from '../components/ui/PageIntro'

type Page = typeof navigation[number]

function PreviewContent({ id }: { id: PageId }) {
  switch (id) {
    case 'home': return (
      <>
        <p className="intro-copy">{content.profile.description}</p>
        <div className="action-row"><Link className="primary-link" to="/projects">Explore my work <ArrowUpRight size={18} aria-hidden="true" /></Link><Link className="text-link" to="/about">Get to know me</Link></div>
        <section className="summary-strip" aria-label="Profile at a glance"><p><span>FOCUS</span>{content.profile.role}</p><p><span>EDUCATION</span>{content.education[0].degree}</p><p><span>AVAILABILITY</span>{content.profile.availability.label}</p></section>
      </>
    )
    case 'projects': return <ol className="project-list">{content.projects.map((project, index) => <li key={project.id}><span className="list-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><Link to={`/projects/${project.slug}`}>{project.title} <ArrowUpRight size={16} aria-hidden="true" /></Link><p>{project.summary}</p><span className="muted-label">{project.categories.join(' / ')}</span></div></li>)}</ol>
    case 'about': return <div className="prose">{content.profile.about.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<p>Interests: {content.profile.focusAreas.join(', ')}.</p><Link className="text-link" to="/education">View education</Link></div>
    case 'education': return <div className="preview-grid">{content.education.map(item => <section className="content-panel" key={item.id}><h2>{item.degree}</h2><p>{item.institution}</p><p>{item.location}</p><p className="accent-text">Expected graduation: {item.expectedEnd.slice(0, 4)}</p></section>)}</div>
    case 'achievements': return <div className="preview-grid">{content.achievements.map(item => <section className="content-panel" key={item.id}><p className="eyebrow">{item.year ?? 'Coding achievement'}</p><h2>{item.name}</h2><p>{item.description}</p></section>)}</div>
    case 'skills': return <div className="preview-grid">{content.skills.groups.map(group => <section className="content-panel" key={group.id}><h2>{group.name}</h2><p>{content.skills.items.filter(skill => skill.groups.includes(group.id)).map(skill => skill.name).join(' · ')}</p></section>)}</div>
    case 'experiments': return <section className="content-panel"><h2>Experiment records</h2><p>{content.experiments.emptyMessage}</p><p>No demonstration values or performance results are displayed in this foundation preview.</p><Link className="text-link" to="/projects">Explore the project catalog</Link></section>
    case 'contact': return <section className="content-panel"><h2>{content.profile.availability.label}</h2><p>{content.profile.email ?? 'Contact details will be added when available.'}</p><p>Contact and resume actions will be added with the shared workspace and Contact page.</p><Link className="text-link" to="/about">Read about Sakshi</Link></section>
  }
}

export function FoundationPage({ page }: { page: Page }) {
  const isHome = page.id === 'home'
  return <>
    <title>{`${isHome ? 'Sakshi Gupta' : page.label} · SG`}</title>
    <PageIntro eyebrow={isHome ? content.profile.intro : 'SG / Portfolio'} title={isHome ? content.profile.tagline : page.label}>
      {!isHome && page.id === 'projects' ? <p>{content.projects.length} projects, from early ideas to documented builds.</p> : null}
    </PageIntro>
    <PreviewContent id={page.id} />
    <FoundationNotice>This is an early portfolio preview. This section’s full design and interactions are planned for {page.sprint}.</FoundationNotice>
  </>
}
