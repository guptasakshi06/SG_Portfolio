import { content } from '../../content'
import { ProfileAction } from './ProfileAction'

export function Footer() {
  return <footer className="workspace-footer"><div><p className="footer-name">SG <span aria-hidden="true">/</span> {content.profile.name}</p><p>{content.profile.tagline}</p></div><ProfileAction kind="email" label="Say hello" /></footer>
}
