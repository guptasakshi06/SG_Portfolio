import { content } from '../content'
import { PageIntro } from '../components/ui/PageIntro'
import { EducationCard, ProfileNextSteps } from '../features/profile/ProfileCards'
import '../styles/profile.css'

export function EducationPage() {
  const copy = content.profilePages.education
  return <div className="profile-page">
    <title>Education · SG</title>
    <PageIntro eyebrow={copy.eyebrow} title={copy.title}><p>{copy.introduction}</p></PageIntro>
    <div className="education-list">{content.education.map(item => <EducationCard key={item.id} item={item} />)}</div>
    <section className="education-interests" aria-labelledby="education-interests"><h2 id="education-interests">{copy.interestsTitle}</h2><p>{copy.interestsDescription}</p><ul className="profile-tags">{content.profile.focusAreas.map(area => <li key={area}>{area}</li>)}</ul></section>
    <ProfileNextSteps />
  </div>
}
