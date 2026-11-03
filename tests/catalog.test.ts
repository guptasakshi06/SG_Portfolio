import test from 'node:test'
import assert from 'node:assert/strict'
import { content } from '../src/content'
import { catalogSearch, filterProjects, projectCategories, readCatalogFilters } from '../src/features/projects/catalog'

const filter = (category: typeof projectCategories[number], query = '') => filterProjects(content.projects, content.skills.items, { category, query })

test('catalog begins with every content project in source order and combines categories with search', () => {
  assert.deepEqual(filter('All').map(p => p.id), content.projects.map(p => p.id))
  for (const category of projectCategories.slice(1)) {
    assert.deepEqual(filter(category).map(p => p.id), content.projects.filter(p => p.categories.includes(category)).map(p => p.id))
  }
  assert.deepEqual(filter('Data Analytics', 'POWER bi').map(p => p.slug), ['loan-analysis-dashboard'])
  assert.deepEqual(filter('Data Science', 'power bi'), [])
  assert.deepEqual(filter('All', '  COLLection  quality ').map(p => p.slug), ['credresolve-collections-dashboard'])
  assert.deepEqual(filter('All', 'PostgreSQL').map(p => p.slug), ['metron-data-optimizer'])
  assert.deepEqual(filter('All', 'no project matches this'), [])
  assert.equal(filter('All', '  ').length, content.projects.length)
})

test('URL state round-trips search characters and category while rejecting unknown parameters', () => {
  const filters = { category: 'Data Analytics' as const, query: 'C++ & SQL / #你好' }
  assert.deepEqual(readCatalogFilters(new URLSearchParams(catalogSearch(filters))), filters)
  assert.equal(catalogSearch({ category: 'All', query: '' }), '')
  const unsafe = readCatalogFilters(new URLSearchParams('category=javascript:bad&q=loan&redirect=https://untrusted.invalid'))
  assert.deepEqual(unsafe, { category: 'All', query: 'loan' })
  assert.equal(catalogSearch(unsafe), '?q=loan')
})

test('empty category works and unverified proposed technologies do not become search matches', () => {
  const projects = structuredClone(content.projects)
  projects.forEach(project => { project.categories = [] })
  projects[0].proposedTechnologies = ['invented-technology']
  assert.equal(filterProjects(projects, content.skills.items, { category: 'NLP', query: '' }).length, 0)
  assert.equal(filterProjects(projects, content.skills.items, { category: 'All', query: 'invented-technology' }).length, 0)
})
