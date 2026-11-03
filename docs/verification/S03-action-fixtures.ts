import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import assert from 'node:assert/strict'
import { ProfileAction, type ProfileActionKind } from '../../src/components/layout/ProfileAction'
import { content } from '../../src/content/index'
import { validateContent } from '../../src/lib/validate-content'

const kinds: ProfileActionKind[] = ['github', 'linkedin', 'email', 'resume']
const render = (profile: typeof content.profile, kind: ProfileActionKind) => renderToStaticMarkup(createElement(ProfileAction, { profile, kind }))
const missing = structuredClone(content.profile)
missing.socials = { github: null, linkedin: null }
missing.email = null
missing.resume = null
for (const kind of kinds) {
  assert.ok(!render(missing, kind).includes('<a '))
  assert.ok(render(missing, kind).includes('aria-disabled="true"'))
  assert.ok(render(content.profile, kind).includes('<a '))
}
const unsafe = structuredClone(content.profile)
unsafe.socials = { github: 'javascript:alert(1)', linkedin: '//unsafe.invalid' }
unsafe.email = 'invalid address'
unsafe.resume = { ...content.profile.resume!, path: '//unsafe.invalid/resume.pdf' }
for (const kind of kinds) assert.ok(!render(unsafe, kind).includes('<a '))
assert.ok(render(content.profile, 'resume').includes('download="Sakshi_Gupta_Resume.pdf"'))
assert.ok(render(content.profile, 'email').includes('mailto:guptasak06%40gmail.com'))
const invalid = structuredClone(content)
invalid.home.skills.ids = ['unknown-skill']
assert.ok(validateContent(invalid).some(error => error.includes('home: unknown skill')))
console.log('PASS: all four shared actions configured/null/unsafe; real resume name/email; homepage skill references')
