import { ArrowUpRight } from 'lucide-react'
import { content } from '../../content'
import { emailHref } from '../../lib/links'

export function Footer() {
  const email = emailHref(content.profile.email)
  return <footer className="workspace-footer"><div><p className="footer-name">SG <span aria-hidden="true">/</span> {content.profile.name}</p><p>{content.profile.tagline}</p></div>{email ? <a href={email}>Say hello <ArrowUpRight size={16} aria-hidden="true" /></a> : <span>Email unavailable</span>}</footer>
}
