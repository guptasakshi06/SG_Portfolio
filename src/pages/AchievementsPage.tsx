import { content } from '../content'
import { PageIntro } from '../components/ui/PageIntro'
import { AchievementCard, ProfileNextSteps } from '../features/profile/ProfileCards'
import '../styles/profile.css'

export function AchievementsPage() {
  const copy = content.profilePages.achievements
  return <div className="profile-page">
    <PageIntro eyebrow={copy.eyebrow} title={copy.title}><p>{copy.introduction}</p></PageIntro>
    <p className="achievement-evidence-note">{copy.evidenceNote}</p>
    <div className="achievement-grid">{content.achievements.map(item => <AchievementCard key={item.id} item={item} />)}</div>
    <ProfileNextSteps />
  </div>
}
