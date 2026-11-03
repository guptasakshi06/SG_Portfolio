import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { content } from '../../content'
import { ProfileAction } from '../layout/ProfileAction'

export function HomeHero() {
  const { profile, home } = content
  return <header className="home-hero">
    <div className="hero-copy">
      <p className="eyebrow">{profile.intro}</p>
      <h1>{profile.tagline}</h1>
      <p className="hero-description">{profile.description}</p>
      <div className="hero-actions">
        <Link className="primary-link" to="/projects">{home.hero.exploreLabel}<ArrowUpRight size={18} aria-hidden="true" /></Link>
        <ProfileAction kind="resume" className="secondary-link" label={home.hero.resumeLabel} />
      </div>
      <div className="hero-socials" aria-label="Connect with Sakshi">
        <ProfileAction kind="github" /><ProfileAction kind="linkedin" /><ProfileAction kind="email" />
      </div>
      <p className="hero-availability"><span className="availability-dot" aria-hidden="true" />{profile.availability.label}</p>
    </div>
    <div className="hero-art" aria-hidden="true">
      <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
      <span className="orbit-center">SG<span>curiosity × data</span></span>
      <i className="orbit-node node-one" /><i className="orbit-node node-two" /><i className="orbit-node node-three" />
      <span className="art-caption">PATTERNS. POSSIBILITIES.</span>
    </div>
  </header>
}
