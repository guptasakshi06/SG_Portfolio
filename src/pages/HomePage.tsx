import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { content } from '../content'
import { HomeHero } from '../components/home/HomeHero'
import { HomeHighlights } from '../components/home/HomeHighlights'
import { ProfileAction } from '../components/layout/ProfileAction'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ProjectPreview } from '../features/projects/ProjectPreview'
import '../styles/home.css'

export function HomePage() {
  const { home, profile } = content
  const selected = content.projects.filter(project => project.featuredOrder !== null).sort((a, b) => a.featuredOrder! - b.featuredOrder!)
  const skills = home.skills.ids.map(id => content.skills.items.find(skill => skill.id === id)!)

  return <div className="home-page">
    <title>Sakshi Gupta · SG</title>
    <HomeHero />
    <HomeHighlights selectedCount={selected.length} />
    <section className="home-section" aria-labelledby="selected-work">
      <SectionHeading id="selected-work" {...home.projects} action={<Link className="text-link" to="/projects">{home.projects.action}<ArrowUpRight size={16} aria-hidden="true" /></Link>}><p>{home.projects.description}</p></SectionHeading>
      <div className="selected-projects">{selected.map(project => <ProjectPreview key={project.id} project={project} />)}</div>
    </section>
    <section className="home-section" aria-labelledby="home-achievements">
      <SectionHeading id="home-achievements" {...home.achievements} action={<Link className="text-link" to="/achievements">{home.achievements.action}<ArrowUpRight size={16} aria-hidden="true" /></Link>} />
      <ul className="achievement-preview">{content.achievements.map(item => <li key={item.id}><h3>{item.name}{item.year ? <span>{item.year}</span> : null}</h3><p>{item.description}</p></li>)}</ul>
    </section>
    <section className="home-section" aria-labelledby="home-skills">
      <SectionHeading id="home-skills" {...home.skills} action={<Link className="text-link" to="/skills">{home.skills.action}<ArrowUpRight size={16} aria-hidden="true" /></Link>}><p>{home.skills.description}</p></SectionHeading>
      <ul className="skills-preview">{skills.map(skill => <li key={skill.id}><h3>{skill.name}</h3><p>{skill.explanation}</p></li>)}</ul>
    </section>
    <section className="home-section about-preview" aria-labelledby="home-about">
      <SectionHeading id="home-about" eyebrow={home.about.eyebrow} title={home.about.title} />
      <div>{profile.about.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<Link className="text-link" to="/about">{home.about.action}<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </section>
    <section className="home-contact" aria-labelledby="home-contact">
      <div><p className="eyebrow">{home.contact.eyebrow}</p><h2 id="home-contact">{home.contact.title}</h2><p>{home.contact.description}</p></div>
      <div className="contact-actions"><ProfileAction kind="email" className="primary-link" label={home.contact.emailLabel} /><Link className="text-link" to="/contact">{home.contact.action}<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </section>
  </div>
}
