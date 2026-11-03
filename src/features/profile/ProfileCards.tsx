import { ArrowUpRight, Award, BriefcaseBusiness, GraduationCap, MapPin } from 'lucide-react'
import { Link } from 'react-router'
import type { Achievement, Education, Experience } from '../../content/types'
import { content } from '../../content'
import { isSafeExternalUrl } from '../../lib/links'
import { MonthDate } from './MonthDate'

export function EducationCard({ item }: { item: Education }) {
  return <article className="education-card" aria-labelledby={`education-${item.id}`}>
    <div className="profile-card-icon" aria-hidden="true"><GraduationCap size={24} /></div>
    <div className="education-card-body">
      <p className="eyebrow">UNDERGRADUATE STUDY</p>
      <h2 id={`education-${item.id}`}>{item.degree}</h2>
      <p className="institution-name">{item.institution}</p>
      <p className="profile-location"><MapPin size={16} aria-hidden="true" />{item.location}</p>
      <dl className="education-dates">
        {item.start ? <div><dt>Started</dt><dd><MonthDate value={item.start} /></dd></div> : null}
        <div><dt>Expected graduation</dt><dd><MonthDate value={item.expectedEnd} /></dd></div>
      </dl>
    </div>
  </article>
}

export function ExperienceCard({ item }: { item: Experience }) {
  return <article className="experience-card" aria-labelledby={`experience-${item.id}`}>
    <div className="experience-heading">
      <div className="profile-card-icon" aria-hidden="true"><BriefcaseBusiness size={22} /></div>
      <div><h3 id={`experience-${item.id}`}>{item.role}</h3><p className="experience-organization">{item.organization}</p></div>
      <p className="experience-date"><MonthDate value={item.start} /> – <MonthDate value={item.end} /></p>
    </div>
    <p className="experience-summary">{item.summary}</p>
    <ul className="contribution-list">{item.contributions.map(text => <li key={text}>{text}</li>)}</ul>
    <ul className="profile-tags" aria-label="Tools used in this internship">{item.technologies.map(tool => <li key={tool}>{tool}</li>)}</ul>
    <p className="profile-source">From the owner-supplied resume.</p>
  </article>
}

export function AchievementCard({ item }: { item: Achievement }) {
  const copy = content.profilePages.achievements
  const evidenceUrl = item.evidenceUrl && isSafeExternalUrl(item.evidenceUrl) ? item.evidenceUrl : null
  return <article className="achievement-card" aria-labelledby={`achievement-${item.id}`}>
    <div className="achievement-card-top"><Award size={22} aria-hidden="true" /><p className="muted-label">{item.year ? <time dateTime={String(item.year)}>{item.year}</time> : copy.undatedLabel}</p></div>
    <h2 id={`achievement-${item.id}`}>{item.name}</h2>
    <p className="achievement-description">{item.description}</p>
    <div className="achievement-evidence">
      {evidenceUrl ? <a className="text-link" href={evidenceUrl} target="_blank" rel="noopener noreferrer" aria-label={`${copy.evidenceLabel} for ${item.name}`}>{copy.evidenceLabel}<ArrowUpRight size={16} aria-hidden="true" /></a> : <p className="profile-source">{copy.missingEvidence}</p>}
      <p className="profile-source">Source: {item.source}</p>
    </div>
  </article>
}

export function ProfileNextSteps() {
  const copy = content.profilePages.nextSteps
  return <section className="profile-next-steps" aria-labelledby="profile-next-steps">
    <div><h2 id="profile-next-steps">{copy.title}</h2><p>{copy.description}</p></div>
    <div className="profile-next-actions"><Link className="primary-link" to="/projects">{copy.projectsLabel}<ArrowUpRight size={16} aria-hidden="true" /></Link><Link className="text-link" to="/contact">{copy.contactLabel}<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
  </section>
}
