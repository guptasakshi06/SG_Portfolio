import { Link } from 'react-router'
import { PageIntro } from '../components/ui/PageIntro'

export function NotFoundPage({ project = false }: { project?: boolean }) {
  return <><PageIntro eyebrow="404 / Let's find your way" title={project ? 'Project not found.' : 'This page isn’t here.'}><p>{project ? 'This project link may be incomplete. You can explore all available projects below.' : 'The address may have changed. There’s still plenty to explore.'}</p></PageIntro><div className="action-row"><Link className="primary-link" to="/">Back to Home</Link><Link className="text-link" to="/projects">Browse projects</Link></div></>
}
