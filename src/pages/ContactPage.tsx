import { FolderOpen, Mail, MessageCircle } from 'lucide-react'
import { Link } from 'react-router'
import { content } from '../content'
import { PageIntro } from '../components/ui/PageIntro'
import { ProfileAction } from '../components/layout/ProfileAction'
import { useResumeStatus } from '../features/contact/resume-context'
import { emailHref } from '../lib/links'
import '../styles/contact.css'

export function ContactPage() {
  const { profile, contact: copy } = content
  const resumeStatus = useResumeStatus()
  return <div className="contact-page">
    <PageIntro eyebrow={copy.eyebrow} title={copy.title}><p>{copy.introduction}</p></PageIntro>
    <p className="contact-availability"><span className="availability-dot" aria-hidden="true" />{profile.availability.label}</p>
    <div className="contact-grid">
      <section className="contact-email" aria-labelledby="contact-email-title"><span className="contact-icon" aria-hidden="true"><Mail size={24} /></span><p className="eyebrow">EMAIL</p><h2 id="contact-email-title">{copy.emailTitle}</h2><p>{copy.emailDescription}</p>
        {emailHref(profile.email) ? <p className="contact-address">{profile.email}</p> : null}
        <div className="action-row"><ProfileAction kind="email" className="primary-link" label={copy.emailLabel} /></div>
        {emailHref(profile.email) ? <p className="contact-note">{copy.emailNote}</p> : null}
      </section>
      <section className="contact-profiles" aria-labelledby="contact-profiles-title"><MessageCircle size={22} aria-hidden="true" /><h2 id="contact-profiles-title">{copy.profilesTitle}</h2>
        <div className="contact-profile-row"><ProfileAction kind="github" /><p>{copy.githubDescription}</p></div>
        <div className="contact-profile-row"><ProfileAction kind="linkedin" /><p>{copy.linkedinDescription}</p></div>
      </section>
    </div>
    <section className="contact-resume" aria-labelledby="contact-resume-title"><div><p className="eyebrow">RESUME</p><h2 id="contact-resume-title">{copy.resumeTitle}</h2><p>{copy.resumeDescription}</p><p className="contact-note" role="status">{!profile.resume || resumeStatus === 'unavailable' ? copy.resumeMissing : resumeStatus === 'checking' ? 'Checking the PDF is available…' : copy.resumeNote}</p></div>
      <div className="contact-resume-actions">{profile.resume && resumeStatus === 'available' ? <><ProfileAction kind="resume-open" className="secondary-link" label="Read resume" /><ProfileAction kind="resume" label="Download PDF" /></> : <ProfileAction kind="resume" />}</div>
    </section>
    <section className="contact-next" aria-labelledby="contact-next-title"><FolderOpen size={24} aria-hidden="true" /><div><h2 id="contact-next-title">{copy.nextTitle}</h2><p>{copy.nextDescription}</p><Link className="text-link" to="/projects">{copy.projectsLabel}</Link></div></section>
  </div>
}
