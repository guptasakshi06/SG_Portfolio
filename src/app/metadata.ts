import seo from '../content/seo.json' with { type: 'json' }
import projects from '../content/projects.json' with { type: 'json' }
import { isSafeAssetPath, isSafeExternalUrl } from '../lib/links.ts'

export interface PageMetadata { title: string; description: string; path: string; found: boolean }

/** Production is opt-in; preview hostnames never become canonical addresses. */
export function productionOrigin(value: string | null): string | null {
  if (value === null) return null
  if (!isSafeExternalUrl(value)) throw new Error('seo.productionOrigin must be a real HTTPS origin or null')
  const url = new URL(value)
  if (url.pathname !== '/' || url.search || url.hash || url.port || url.hostname === 'localhost' || /^127\./.test(url.hostname) || url.hostname === '[::1]' || /(?:^|\.)(?:example\.(?:com|org|net)|invalid|test|localhost)$/.test(url.hostname)) throw new Error('seo.productionOrigin must be a real production origin without path, query, fragment or port')
  return url.origin
}
export const origin = productionOrigin(seo.productionOrigin)
if (!isSafeAssetPath(seo.imagePath)) throw new Error('seo.imagePath must be a safe local asset')

export const metadataPaths = [...Object.keys(seo.pages), ...projects.map(project => `/projects/${project.slug}`)]
export function pageMetadata(pathname: string): PageMetadata {
  const path = pathname.replace(/\/+$/, '') || '/'
  const page = (seo.pages as Record<string, { title: string; description: string }>)[path]
  if (page) return { ...page, path, found: true }
  const project = projects.find(item => path === `/projects/${item.slug}`)
  if (project) return { title: `${project.title} · Sakshi Gupta · SG`, description: project.summary, path, found: true }
  return { ...seo.notFound, path, found: false }
}
export function metadataEntries(meta: PageMetadata, knownOrigin = origin): { attribute: 'name' | 'property'; key: string; value: string }[] {
  const entries: { attribute: 'name' | 'property'; key: string; value: string }[] = [
    { attribute: 'name', key: 'description', value: meta.description },
    { attribute: 'name', key: 'robots', value: knownOrigin && meta.found ? 'index, follow' : 'noindex, nofollow' },
    { attribute: 'property', key: 'og:type', value: 'website' },
    { attribute: 'property', key: 'og:site_name', value: seo.siteName },
    { attribute: 'property', key: 'og:locale', value: 'en_IN' },
    { attribute: 'property', key: 'og:title', value: meta.title },
    { attribute: 'property', key: 'og:description', value: meta.description },
    { attribute: 'name', key: 'twitter:card', value: knownOrigin ? 'summary_large_image' : 'summary' },
    { attribute: 'name', key: 'twitter:title', value: meta.title },
    { attribute: 'name', key: 'twitter:description', value: meta.description },
  ]
  if (knownOrigin) entries.push(
    ...(meta.found ? [{ attribute: 'property' as const, key: 'og:url', value: knownOrigin + meta.path }] : []),
    { attribute: 'property', key: 'og:image', value: knownOrigin + seo.imagePath },
    { attribute: 'property', key: 'og:image:width', value: '1200' },
    { attribute: 'property', key: 'og:image:height', value: '630' },
    { attribute: 'property', key: 'og:image:alt', value: seo.imageAlt },
    { attribute: 'name', key: 'twitter:image', value: knownOrigin + seo.imagePath },
    { attribute: 'name', key: 'twitter:image:alt', value: seo.imageAlt },
  )
  return entries
}
export function escapeHtml(value: string) { return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!) }
export function metadataHtml(meta: PageMetadata, knownOrigin = origin) {
  return `<title data-sg-meta>${escapeHtml(meta.title)}</title>\n` + metadataEntries(meta, knownOrigin).map(entry => `<meta data-sg-meta ${entry.attribute}="${entry.key}" content="${escapeHtml(entry.value)}" />`).join('\n') +
    (knownOrigin && meta.found ? `\n<link data-sg-meta rel="canonical" href="${escapeHtml(knownOrigin + meta.path)}" />` : '')
}
export function injectMetadata(html: string, meta: PageMetadata) {
  return html.replace(/<!-- sg-metadata -->[\s\S]*?<!-- \/sg-metadata -->/, () => `<!-- sg-metadata -->\n${metadataHtml(meta)}\n<!-- /sg-metadata -->`)
}

export function crawlFiles(knownOrigin = origin): Record<string, string> {
  if (!knownOrigin) return {}
  return {
    'robots.txt': `User-agent: *\nAllow: /\nSitemap: ${knownOrigin}/sitemap.xml\n`,
    'sitemap.xml': `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${metadataPaths.map(path => `  <url><loc>${escapeHtml(knownOrigin + path)}</loc></url>`).join('\n')}\n</urlset>\n`,
  }
}
