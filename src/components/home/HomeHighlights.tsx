import { ArrowUpRight, Compass, GraduationCap, Layers } from 'lucide-react'
import { Link } from 'react-router'
import { content } from '../../content'

export function HomeHighlights({ selectedCount }: { selectedCount: number }) {
  const { home, profile, education } = content
  return <section className="home-highlights" aria-label="At a glance">
    <div><Layers aria-hidden="true" size={20} /><p className="highlight-label">{home.highlights.selected}</p><Link to="/projects">{selectedCount} selected projects<ArrowUpRight size={15} aria-hidden="true" /></Link><p>{home.highlights.selectedDescription}</p></div>
    <div><Compass aria-hidden="true" size={20} /><p className="highlight-label">{home.highlights.interests}</p><p className="highlight-value">{profile.focusAreas.join(' · ')}</p></div>
    <div><GraduationCap aria-hidden="true" size={20} /><p className="highlight-label">{home.highlights.education}</p>{education[0] ? <><p className="highlight-value">{education[0].degree}</p><p>{education[0].institution} · Expected {education[0].expectedEnd.slice(0, 4)}</p></> : <p>Education details to be added.</p>}</div>
  </section>
}
