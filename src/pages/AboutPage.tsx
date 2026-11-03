import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { content } from '../content'
import { PageIntro } from '../components/ui/PageIntro'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ExperienceCard, ProfileNextSteps } from '../features/profile/ProfileCards'
import '../styles/profile.css'

export function AboutPage() {
  const { profile, profilePages, education, experience } = content
  const copy = profilePages.about
  return <div className="profile-page">
    <PageIntro eyebrow={copy.eyebrow} title={copy.title}><p>{copy.introduction}</p></PageIntro>
    <div className="about-context">
      <section className="about-interests" aria-labelledby="about-interests"><h2 id="about-interests">{copy.interestsTitle}</h2><p>{copy.interestsDescription}</p><ul className="profile-tags">{profile.focusAreas.map(area => <li key={area}>{area}</li>)}</ul></section>
      <section className="about-education" aria-labelledby="about-education"><p className="eyebrow">EDUCATION</p><h2 id="about-education">{copy.educationTitle}</h2>{education.map(item => <div key={item.id}><p className="about-degree">{item.degree}</p><p>{item.institution}</p></div>)}<Link className="text-link" to="/education">View education<ArrowUpRight size={16} aria-hidden="true" /></Link></section>
    </div>
    <section className="profile-section" aria-labelledby="about-approach">
      <SectionHeading id="about-approach" eyebrow="APPROACH" title={copy.approachTitle} />
      <ol className="approach-list">{copy.approach.map((item, index) => <li key={item.id}><span className="approach-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ol>
      <aside className="learning-note" aria-labelledby="about-learning"><h3 id="about-learning">{copy.learningTitle}</h3><p>{copy.learningDescription}</p></aside>
    </section>
    <section className="profile-section" aria-labelledby="about-experience">
      <SectionHeading id="about-experience" eyebrow={copy.experienceEyebrow} title={copy.experienceTitle} />
      <div className="experience-list">{experience.map(item => <ExperienceCard key={item.id} item={item} />)}</div>
    </section>
    <ProfileNextSteps />
  </div>
}
