import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { content } from '../src/content'
import { validateContent } from '../src/lib/validate-content'
import { NotebookBlocks } from '../src/features/notebook/NotebookBlocks'
import NotebookViewer from '../src/features/notebook/NotebookViewer'
import { highlightCode } from '../src/features/notebook/highlight'
import type { NotebookBlock } from '../src/content/types'

const render = (blocks: NotebookBlock[]) => renderToStaticMarkup(createElement(NotebookBlocks, { blocks }))

test('notebook provenance, table structure, sample and experiment references are validated', () => {
  const fixture = structuredClone(content)
  fixture.notebook.example.blocks[0].sample = false
  fixture.notebook.example.blocks[0].provenance = ''
  fixture.projects[0].technicalSections = [{ id: 'fixture', title: 'Fixture', blocks: [
    { type: 'table', caption: '', columns: ['One'], rows: [['One', 'Two']], provenance: 'Fixture', sample: false },
    { type: 'chart', experimentId: 'missing', provenance: 'Fixture', sample: false },
  ] }]
  const errors = validateContent(fixture)
  for (const expected of ['every block must be marked illustrative', 'block provenance', 'table caption', 'inconsistent table', 'unknown chart']) assert.ok(errors.some(error => error.includes(expected)), expected)
  assert.deepEqual(validateContent(content), [])
})

test('text, code, callouts and table cells stay inert and retain accessible labels', () => {
  const injection = '<img src=x onerror="alert(1)"><script>alert(1)</script>'
  const common = { provenance: 'Synthetic security fixture', sample: true }
  const html = render([
    { ...common, type: 'text', text: injection + '\n\nSecond paragraph' },
    { ...common, type: 'code', code: injection, language: 'unknown' },
    { ...common, type: 'callout', title: injection, text: injection },
    { ...common, type: 'table', caption: 'Illustrative security fixture', columns: [injection, 'Value'], rows: [['Sample', injection]] },
  ])
  assert.ok(!html.includes('<script>') && !html.includes('<img'))
  assert.ok(html.includes('&lt;script&gt;'))
  assert.equal((html.match(/Illustrative sample — not project results/g) ?? []).length, 4)
  assert.ok(html.includes('scope="col"') && html.includes('scope="row"'))
  assert.ok(html.includes('<caption>Illustrative security fixture</caption>'))
  assert.ok(html.includes('tabindex="0"') && html.includes('role="region"'))
  assert.ok(html.includes('Read-only · does not execute'))
})

test('every project has eleven honest technical topics while empty details keep the example separate', () => {
  for (const project of content.projects) {
    const html = renderToStaticMarkup(createElement(NotebookViewer, { project }))
    for (const topic of content.notebook.topics) assert.ok(html.includes(`id="technical-${topic.id}"`), project.slug + topic.id)
    assert.ok(html.includes('Separate illustrative example'))
    assert.ok(!html.includes('<pre'), 'example code is not mounted before its disclosure opens')
    if (!project.links.repository) {
      assert.ok(html.includes('No project notebook or implementation details have been supplied'))
      assert.ok(!html.includes('Source note — documentation'))
    } else assert.ok(html.includes('Source note — documentation, not reproduced results'))
  }
})

test('Shiki tokenizes selected grammars without altering code and falls back for unknown languages', async () => {
  for (const [language, code] of [['python', 'value = "<script>"\nprint(value)'], ['sql', 'SELECT 1 AS value;'], ['json', '{"sample": true}'], ['unknown', '<b>plain</b>']]) {
    const lines = await highlightCode(code, language)
    assert.equal(lines.map(line => line.map(token => token.content).join('')).join('\n'), code)
    if (language !== 'unknown') assert.ok(lines.flat().some(token => token.color))
  }
})

test('optional chart blocks show a provenance-labeled table and enforce sample boundaries', () => {
  const experiment = { id: 'fixture-chart', title: 'Fixture chart', sample: true, provenance: 'Synthetic fixture', description: 'Only a test', axisUnits: 'test units', legend: ['Series'], accessibleSummary: 'One invented observation', data: [{ label: 'Sample', values: [2] }] }
  content.experiments.illustrative.push(experiment)
  try {
    const html = render([{ type: 'chart', experimentId: experiment.id, sample: true, provenance: experiment.provenance }])
    assert.ok(html.includes('Illustrative sample — Fixture chart (test units)'))
    assert.ok(html.includes('One invented observation') && html.includes('Synthetic fixture'))
    assert.ok(render([{ type: 'chart', experimentId: experiment.id, sample: false, provenance: 'Fixture' }]).includes('Chart data has not been supplied'))
  } finally { content.experiments.illustrative.pop() }
})
