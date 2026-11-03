import test from 'node:test'
import assert from 'node:assert/strict'
import { content } from '../src/content'
import { readSkillSelection, relatedProjects, skillHref } from '../src/features/skills/explorer'
import { validateContent } from '../src/lib/validate-content'

test('every inventory skill has a durable direct link; unknown links are recoverable', () => {
  for (const skill of content.skills.items) {
    const url = new URL(skillHref(skill.id), 'https://local.invalid')
    assert.equal(url.pathname, '/skills')
    assert.deepEqual(readSkillSelection(url.searchParams, content.skills.items), { skill, unknown: false })
    assert.ok(skill.groups.every(id => content.skills.groups.some(group => group.id === id)))
  }
  assert.deepEqual(readSkillSelection(new URLSearchParams(), content.skills.items), { skill: null, unknown: false })
  for (const id of ['', 'unknown', '<script>alert(1)</script>', 'PYTHON']) {
    assert.deepEqual(readSkillSelection(new URLSearchParams({ skill: id }), content.skills.items), { skill: null, unknown: true })
  }
  assert.equal(new URL(skillHref('C++ & SQL/#'), 'https://local.invalid').searchParams.get('skill'), 'C++ & SQL/#')
})

test('related projects retain exact README versus resume attribution and catalog order', () => {
  const python = relatedProjects(content.projects, 'python')
  assert.deepEqual(python.map(item => item.project.slug), ['metron-data-optimizer', 'credresolve-collections-dashboard'])
  assert.equal(python[0].source, 'https://github.com/guptasakshi06/Metron/blob/main/README.md')
  assert.equal(python[1].source, 'Owner-supplied resume')
  assert.deepEqual(relatedProjects(content.projects, 'power-bi').map(item => item.project.slug), ['loan-analysis-dashboard'])
  assert.deepEqual(relatedProjects(content.projects, 'sql').map(item => item.project.slug), ['credresolve-collections-dashboard'])
  assert.equal(relatedProjects(content.projects, 'sql-server')[0].source, 'Owner-supplied resume')
})

test('related projects exclude topic, name and proposed technology inferences; empty catalogs work', () => {
  assert.deepEqual(relatedProjects(content.projects, 'pytorch'), [])
  const fixture = structuredClone(content.projects)
  fixture[0].title = 'Python project'
  fixture[0].categories = ['Machine Learning']
  fixture[0].proposedTechnologies = ['python', 'pytorch']
  assert.deepEqual(relatedProjects(fixture, 'pytorch'), [])
  fixture.forEach(project => { project.technologyClaims = [] })
  assert.deepEqual(relatedProjects(fixture, 'python'), [])
  assert.deepEqual(relatedProjects([], 'python'), [])
})

test('skills page copy and source/membership failures are rejected before shipping', () => {
  const fixture = structuredClone(content)
  fixture.skillsPage.emptyDescription = ' '
  fixture.skills.items[0].source = ''
  fixture.skills.items[0].groups = ['invented-group']
  const errors = validateContent(fixture)
  assert.ok(errors.some(error => error.includes('skillsPage.emptyDescription')))
  assert.ok(errors.some(error => error.includes('skill python.source')))
  assert.ok(errors.some(error => error.includes('skill python: unknown or absent group')))
})
