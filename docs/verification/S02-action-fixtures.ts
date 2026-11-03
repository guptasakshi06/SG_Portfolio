import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import assert from 'node:assert/strict'
import { ProfileActions } from '../../src/components/layout/ProfileActions'
import { content } from '../../src/content/index'
const fixture = structuredClone(content.profile)
fixture.socials = { github: null, linkedin: null }
fixture.resume = null
const missing = renderToStaticMarkup(createElement(ProfileActions, { profile: fixture }))
assert.equal((missing.match(/<a /g) || []).length, 0)
assert.equal((missing.match(/aria-disabled="true"/g) || []).length, 3)
fixture.socials = { github: 'javascript:alert(1)', linkedin: '//unsafe.invalid' }
fixture.resume = { ...content.profile.resume!, path: '//unsafe.invalid/resume.pdf' }
assert.equal((renderToStaticMarkup(createElement(ProfileActions, { profile: fixture })).match(/<a /g) || []).length, 0)
const configured = renderToStaticMarkup(createElement(ProfileActions, { profile: content.profile }))
assert.equal((configured.match(/<a /g) || []).length, 3)
assert.ok(configured.includes('Sakshi_Gupta_Resume.pdf'))
console.log('PASS: configured, null and unsafe ProfileActions configurations')
