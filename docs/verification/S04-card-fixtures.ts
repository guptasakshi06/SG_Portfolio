import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { content } from '../../src/content'
import { ProjectSources } from '../../src/features/projects/ProjectSources'
import { ProjectPreview } from '../../src/features/projects/ProjectPreview'

const loan = content.projects.find(project => project.slug === 'loan-analysis-dashboard')!
const sourceMarkup = (project = loan) => renderToStaticMarkup(createElement(ProjectSources, { project }))
assert.ok(sourceMarkup().includes(`href="${loan.links.repository}"`))
assert.ok(sourceMarkup().includes('rel="noopener noreferrer"'))
assert.ok(sourceMarkup().includes('opens in a new tab'))
assert.ok(sourceMarkup().includes('Live demo not provided'))
for (const unsafe of [null, 'javascript:alert(1)', '//unsafe.invalid', 'http://unsafe.invalid', 'https://user:pass@unsafe.invalid']) {
  const project = { ...loan, links: { repository: unsafe, demo: unsafe } }
  assert.ok(!sourceMarkup(project).includes('<a '))
  assert.ok(sourceMarkup(project).includes('Repository not provided'))
}
const configuredDemo = { ...loan, links: { repository: null, demo: 'https://fixture.invalid/demo' } }
assert.ok(sourceMarkup(configuredDemo).includes('href="https://fixture.invalid/demo"'))

function card(project = loan) {
  return renderToStaticMarkup(createElement(MemoryRouter, null, createElement(ProjectPreview, { project, catalogSearch: '?category=Data+Analytics&q=power' })))
}
const html = card()
assert.ok(html.includes('/projects/loan-analysis-dashboard?category=Data+Analytics&amp;q=power'))
assert.ok(html.includes('README-listed tools'))
assert.ok(html.includes('Owner-supplied resume'))
assert.ok(html.includes('practice/learning project'))
assert.ok(card(content.projects[0]).includes('Technology details to be added'))
for (const slug of ['metron-data-optimizer', 'credresolve-collections-dashboard']) {
  const project = content.projects.find(item => item.slug === slug)!
  for (const caveat of project.evidence.limitations) assert.ok(card(project).includes(caveat.replaceAll('&', '&amp;').replaceAll("'", '&#x27;')))
}
console.log('PASS: S04 safe configured/null/unsafe repository/demo actions, filter-preserving card links, technology provenance, missing technologies and source caveats.')
