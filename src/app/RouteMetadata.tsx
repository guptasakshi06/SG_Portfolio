import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { metadataEntries, origin, pageMetadata } from './metadata'

/** Adopt the initial static tags; replace them on navigation without duplicates. */
export function RouteMetadata() {
  const { pathname } = useLocation()
  useEffect(() => {
    const meta = pageMetadata(pathname)
    document.head.querySelectorAll('[data-sg-meta]').forEach(node => node.remove())
    document.title = meta.title
    for (const entry of metadataEntries(meta)) {
      const node = document.createElement('meta')
      node.dataset.sgMeta = ''
      node.setAttribute(entry.attribute, entry.key)
      node.content = entry.value
      document.head.append(node)
    }
    if (origin && meta.found) {
      const node = document.createElement('link')
      node.dataset.sgMeta = ''
      node.rel = 'canonical'
      node.href = origin + meta.path
      document.head.append(node)
    }
  }, [pathname])
  return null
}
