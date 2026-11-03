import test from 'node:test'
import assert from 'node:assert/strict'
import { content } from '../src/content'
import { navigation } from '../src/app/navigation'
import { buildSearchIndex, isSearchShortcut, nextResultIndex, searchPortfolio } from '../src/features/search/search'
import { readSkillSelection } from '../src/features/skills/explorer'

const index = buildSearchIndex(content)
const hits = (query: string) => searchPortfolio(index, query)

test('global search covers every page, project and skill with safe, durable destinations', () => {
  assert.equal(new Set(index.map(entry => entry.id)).size, index.length)
  assert.deepEqual(hits('  ').map(entry => entry.href), navigation.map(page => page.path))
  for (const project of content.projects) assert.ok(hits(project.title).some(entry => entry.href === `/projects/${project.slug}`))
  for (const skill of content.skills.items) {
    const hit = hits(skill.name).find(entry => entry.id === `skill-${skill.id}`)!
    const url = new URL(hit.href, 'https://local.invalid')
    assert.equal(readSkillSelection(url.searchParams, content.skills.items).skill?.id, skill.id)
  }
  for (const entry of index) {
    assert.ok(entry.href.startsWith('/') && !entry.href.startsWith('//'))
    const url = new URL(entry.href, 'https://local.invalid')
    assert.ok(navigation.some(page => page.path === url.pathname) || content.projects.some(project => `/projects/${project.slug}` === url.pathname))
  }
})

test('matching supports case, whitespace, partial words, punctuation and every-term intersections', () => {
  assert.deepEqual(hits('pYtHoN'), hits('python'))
  assert.deepEqual(hits('PÝTHÓN'), hits('python'))
  assert.deepEqual(hits('  power   BI '), hits('power bi'))
  assert.ok(hits('tamper').some(entry => entry.id === 'project-railway-track-tampering'))
  assert.ok(hits('c++').some(entry => entry.id === 'skill-cpp'))
  assert.ok(hits('loan power bi').some(entry => entry.id === 'project-loan-analysis-dashboard'))
  assert.equal(hits('loan nonexistentword').length, 0)
  assert.equal(hits('<script>alert(1)</script>').length, 0)
  const skills = hits('sql').filter(entry => entry.group === 'Skills')
  assert.equal(skills[0].title, 'SQL')
  assert.deepEqual(hits('sql'), hits('sql'))
  assert.deepEqual(searchPortfolio([], 'python'), [])
})

test('portfolio content yields exact context and real sections without changing achievement qualifiers', () => {
  assert.equal(hits('GreedUp')[0].href, '/about#experience-greedup-2026')
  assert.ok(hits('noisy audio').some(entry => entry.id === 'experience-greedup-2026'))
  assert.ok(hits('RGIPT').some(entry => entry.href === '/education#education-rgipt-btech'))
  assert.equal(hits('myntra')[0].description, 'Team reached the top 4% after the ideation phase.')
  assert.equal(hits('ML LAB')[0].href, '/experiments')
  assert.ok(hits('make the work understandable').some(entry => entry.href === '/about#about-approach'))
})

test('allowlisted fields exclude private metadata, synthetic metrics and inferred project technologies', () => {
  const fixture = structuredClone(content)
  fixture.profile.resume!.source = 'privateconfigsentinel'
  fixture.profile.resume!.sha256 = 'hashsentinel'
  fixture.education[0].source = 'educationsourcesentinel'
  fixture.education[0].cpi = 9.87654321
  fixture.projects[0].proposedTechnologies = ['unconfirmedtoolsentinel']
  fixture.projects[0].evidence.sources[0].note = 'privatereviewsentinel'
  fixture.projects[0].technicalSections = [{ id: 'results', title: 'sampleblocksentinel', blocks: [{ type: 'text', text: 'sampleblocksentinel', provenance: 'fixture', sample: true }] }]
  fixture.experiments.illustrative[0].title = 'syntheticmetricssentinel'
  fixture.experiments.illustrative[0].accessibleSummary = 'syntheticmetricssentinel'
  fixture.skills.items[0].source = 'skillsourcesentinel'
  const fixtureIndex = buildSearchIndex(fixture)
  for (const term of ['privateconfigsentinel', 'hashsentinel', 'educationsourcesentinel', '9.87654321', 'unconfirmedtoolsentinel', 'privatereviewsentinel', 'sampleblocksentinel', 'syntheticmetricssentinel', 'skillsourcesentinel']) {
    assert.deepEqual(searchPortfolio(fixtureIndex, term), [], term)
  }
  assert.equal(searchPortfolio(fixtureIndex, '89%').length, 0)
  assert.equal(hits('pytorch').filter(entry => entry.group === 'Projects').length, 0)
  assert.deepEqual(hits('power bi').filter(entry => entry.group === 'Projects').map(entry => entry.id), ['project-loan-analysis-dashboard'])
})

test('shortcut guard preserves editing/composition and supports both platform modifiers', () => {
  const base = { key: 'k', ctrlKey: true, metaKey: false, altKey: false, shiftKey: false, repeat: false, isComposing: false, defaultPrevented: false }
  assert.equal(isSearchShortcut(base, false), true)
  assert.equal(isSearchShortcut({ ...base, key: 'K', ctrlKey: false, metaKey: true }, false), true)
  assert.equal(isSearchShortcut(base, true), false)
  for (const field of ['altKey', 'shiftKey', 'repeat', 'isComposing', 'defaultPrevented'] as const) assert.equal(isSearchShortcut({ ...base, [field]: true }, false), false)
  assert.equal(isSearchShortcut({ ...base, ctrlKey: false }, false), false)
  assert.equal(isSearchShortcut({ ...base, key: 'p' }, false), false)
  assert.equal(nextResultIndex(0, -1, 8), 7)
  assert.equal(nextResultIndex(7, 1, 8), 0)
  assert.equal(nextResultIndex(0, 1, 0), 0)
})
