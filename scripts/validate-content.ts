import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { content } from '../src/content/index'

// Importing content runs the same integrity checks used by the application.
console.log(`Content valid: ${content.projects.length} projects, ${content.skills.items.length} skills, ${content.skills.groups.length} skill groups.`)
const resume = content.profile.resume
if (!resume) {
  console.log('Resume unconfigured: supported unavailable state.')
} else {
  const path = resolve('public', resume.path.slice(1))
  if (!existsSync(path)) {
    console.warn('Resume asset absent. Set profile.resume to null until a real PDF is available; do not render a download.')
  } else {
    const bytes = readFileSync(path)
    if (bytes.subarray(0, 5).toString() !== '%PDF-') throw new Error('Resume asset is not a PDF')
    const hash = createHash('sha256').update(bytes).digest('hex')
    if (hash !== resume.sha256) throw new Error('Resume SHA-256 does not match profile metadata; complete the replacement workflow.')
    console.log(`Resume asset present: ${bytes.length} bytes; SHA-256 matches profile metadata.`)
  }
}
