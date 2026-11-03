import { Link } from 'react-router'
import { content } from '../content'
import { navigation, type PageId } from '../app/navigation'
import { FoundationNotice, PageIntro } from '../components/ui/PageIntro'

type Page = typeof navigation[number]

function PreviewContent({ id }: { id: PageId }) {
  switch (id) {
    case 'contact': return <section className="content-panel"><h2>{content.profile.availability.label}</h2><p>{content.profile.email ?? 'Contact details will be added when available.'}</p><p>Use the shared profile and resume links above, or Say hello below. The full Contact page is planned for S10.</p><Link className="text-link" to="/about">Read about Sakshi</Link></section>
  }
}

export function FoundationPage({ page }: { page: Page }) {
  return <>
    <title>{`${page.label} · SG`}</title>
    <PageIntro eyebrow="SG / Portfolio" title={page.label} />
    <PreviewContent id={page.id} />
    <FoundationNotice>This is an early portfolio preview. This section’s full design and interactions are planned for {page.sprint}.</FoundationNotice>
  </>
}
