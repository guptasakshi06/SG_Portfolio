import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { content } from '../src/content/index'
import { validateContent } from '../src/lib/validate-content'
import { emailHref, isSafeExternalUrl, resumeHref } from '../src/lib/links'

test('source intake survives runtime content seeding without duplicate loan projects', () => {
  const owner = JSON.parse(readFileSync('docs/sources/owner-inputs.json', 'utf8'))
  const evidence = JSON.parse(readFileSync('docs/sources/repository-evidence.json', 'utf8'))
  assert.equal(content.projects.length, 10)
  assert.equal(content.projects.filter(p => p.slug === 'loan-analysis-dashboard').length, 1)
  assert.deepEqual(content.projects.filter(p => p.featuredOrder !== null).sort((a, b) => a.featuredOrder! - b.featuredOrder!).map(p => p.slug), owner.featuredProjectSlugs)
  assert.equal(content.profile.email, owner.profile.email)
  assert.equal(content.profile.socials.github, owner.profile.github)
  assert.equal(content.profile.socials.linkedin, owner.profile.linkedin)
  assert.equal(content.profile.availability.label, owner.profile.availability.displayLabel)
  assert.equal(content.education[0].degree, owner.profile.degree.name)
  assert.equal(content.profile.resume?.sha256, owner.resume.sha256)
  for (const source of evidence.repositories) {
    const project = content.projects.find(p => p.slug === source.portfolioSlug)!
    assert.equal(project.links.repository, `https://github.com/${source.repository}`)
    for (const technology of source.explicitTechnologies) {
      const skill = content.skills.items.find(s => s.name === technology)!
      assert.ok(project.technologyClaims.some(claim => claim.skillId === skill.id && claim.source === source.sourceUrl))
    }
  }
  assert.deepEqual(validateContent(content), [])
})

test('cross-record validation rejects duplicate slugs and unresolved technology references', () => {
  const fixture = structuredClone(content)
  fixture.projects[1].slug = fixture.projects[0].slug
  fixture.projects[0].technologyClaims.push({ skillId: 'invented-skill', source: 'Test fixture' })
  assert.ok(validateContent(fixture).some(error => error.includes('project slugs: duplicate')))
  assert.ok(validateContent(fixture).some(error => error.includes('unknown skill invented-skill')))
})

test('unsafe owner links and missing required labels fail content validation', () => {
  const fixture = structuredClone(content)
  fixture.profile.socials.github = 'javascript:alert(1)'
  fixture.projects[0].links.demo = '//untrusted.invalid'
  fixture.projects[0].title = ' '
  const errors = validateContent(fixture)
  assert.ok(errors.some(error => error.includes('profile.socials.github')))
  assert.ok(errors.some(error => error.includes('railway-track-tampering.demo')))
  assert.ok(errors.some(error => error.includes('railway-track-tampering.title')))
})

test('nullable contact and asset states are valid without placeholder URLs', () => {
  const fixture = structuredClone(content)
  fixture.profile.email = null
  fixture.profile.socials = { github: null, linkedin: null }
  fixture.profile.resume = null
  assert.deepEqual(validateContent(fixture), [])
  assert.equal(emailHref(null), null)
  assert.equal(resumeHref(null), null)
})

test('URL helpers enforce HTTPS, safe local assets, and versioned resume URLs', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,bad', '//host.invalid', 'http://host.invalid', 'https://user:password@host.invalid', ' https://host.invalid']) assert.equal(isSafeExternalUrl(value), false, value)
  assert.equal(isSafeExternalUrl('https://github.com/guptasakshi06'), true)
  assert.equal(emailHref('bad\r\nBcc:another@host.invalid'), null)
  assert.equal(emailHref('guptasak06@gmail.com'), 'mailto:guptasak06%40gmail.com')
  assert.equal(resumeHref({ path: '//untrusted.invalid/resume.pdf', version: '1' }), null)
  assert.equal(resumeHref({ path: '/resume/../secret.pdf', version: '1' }), null)
  assert.equal(resumeHref({ path: '/resume/real.pdf', version: 'new version' }), '/resume/real.pdf?v=new%20version')
})

test('synthetic experiments cannot enter actual-result records', () => {
  const fixture = structuredClone(content)
  fixture.experiments.actual.push({ id: 'sample-fixture', title: 'Fixture', sample: true, provenance: 'Synthetic test only', description: 'Validation fixture', axisUnits: 'test units', legend: ['Test'], accessibleSummary: 'One test value', data: [{ label: 'Test', values: [1] }] })
  assert.ok(validateContent(fixture).some(error => error.includes('sample in actual results')))
})

test('undocumented original projects keep technical claims and unknown results empty', () => {
  for (const project of content.projects.filter(p => !p.links.repository)) {
    assert.equal(project.whatIBuilt, null)
    assert.equal(project.problem, null)
    assert.equal(project.technologyClaims.length, 0)
    assert.equal(project.technicalSections.length, 0)
    assert.equal(project.links.demo, null)
    assert.ok(project.evidence.missing.length > 0)
  }
})

test('education and internship date ranges reject invalid months and reversed ordering', () => {
  const fixture = structuredClone(content)
  fixture.education[0].start = '2027-06'
  fixture.experience[0].end = '2026-00'
  let errors = validateContent(fixture)
  assert.ok(errors.some(error => error.includes('education rgipt-btech: start follows expected end')))
  assert.ok(errors.some(error => error.includes('experience greedup-2026 end: expected YYYY-MM')))
  fixture.education[0].start = null
  fixture.experience[0].end = '2026-05'
  errors = validateContent(fixture)
  assert.ok(errors.some(error => error.includes('experience greedup-2026: start follows end')))
  fixture.experience[0].end = '2026-08'
  assert.deepEqual(validateContent(fixture), [])
})
