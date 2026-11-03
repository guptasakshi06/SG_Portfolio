import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { content } from '../src/content'
import { validateContent } from '../src/lib/validate-content'
import { demoViews, viewSummary, splits } from '../src/features/experiments/demo'
import { DataTable } from '../src/features/experiments/DataTable'

const experiments = content.experiments

test('model and split intersections drive the same exact chart/table values, including empty series', () => {
  const both = demoViews(experiments, 'all', [...splits])
  assert.deepEqual(both.accuracy.rows, [{ label: 'Model A', s0: 90, s1: 84 }, { label: 'Model B', s0: 96, s1: 89 }])
  assert.equal(both.loss.series.length, 4)
  for (const model of experiments.demo.models) {
    for (const selected of [[...splits], ['Training'], ['Validation'], []] as (typeof splits[number])[][]) {
      const views = demoViews(experiments, model.id, selected)
      assert.equal(views.accuracy.rows.length, 1)
      assert.equal(views.accuracy.rows[0].label, model.name)
      assert.deepEqual(views.accuracy.series.map(series => series.label), selected)
      assert.equal(views.loss.series.length, selected.length)
      const originalLoss = experiments.illustrative.find(item => item.id === model.lossId)!
      assert.equal(views.loss.rows.length, originalLoss.data.length)
      views.loss.rows.forEach((row, epoch) => views.loss.series.forEach(series => {
        const index = series.dashed ? 1 : 0
        assert.equal(row[series.key], originalLoss.data[epoch].values[index])
      }))
      assert.equal(views.matrices.length, 1)
      assert.equal(views.matrices[0].experiment.id, model.matrixId)
      assert.match(viewSummary(views.loss), /Synthetic demonstration/)
      if (!selected.length) assert.match(viewSummary(views.accuracy), /no series selected/)
    }
  }
})

test('tables preserve synthetic context and values without hover; future actual entries use source attribution', () => {
  const view = demoViews(experiments, 'model-b', ['Validation']).accuracy
  const html = renderToStaticMarkup(createElement(DataTable, { view, provenance: experiments.demo.provenance }))
  assert.match(html, /Synthetic sample — not project results/)
  assert.match(html, /accuracy \(%\)/)
  assert.match(html, /scope="col">Validation/)
  assert.match(html, /scope="row">Model B/)
  assert.match(html, /<td>89<\/td>/)
  assert.doesNotMatch(html, /<td>96<\/td>/)
  assert.match(html, /No dataset was collected/)
  assert.match(renderToStaticMarkup(createElement(DataTable, { view, sample: false, provenance: 'Fixture source' })), /Source-attributed record/)
})

test('sample boundaries, chart references, aligned epochs, counts, accuracy and provenance are validated', () => {
  const fixture = structuredClone(content)
  fixture.experiments.actual.push(fixture.experiments.illustrative[0])
  fixture.experiments.demo.models[0].lossId = 'missing'
  fixture.experiments.demo.models[1].validationSize = 99
  fixture.experiments.demo.notice = 'Results'
  fixture.experiments.illustrative[0].data[0].values[0] = 101
  fixture.experiments.illustrative[1].data[1].values[0] = -1
  fixture.experiments.illustrative[4].data[0].values[0] = 45
  fixture.experiments.notes.push({ id: 'note', kind: 'lesson', title: 'Fixture', text: 'Fixture', provenance: '' })
  const errors = validateContent(fixture).join('\n')
  for (const pattern of [/sample in actual results/, /invalid synthetic loss/, /explicit synthetic/, /invalid synthetic accuracy/, /does not match confusion counts/, /experiment note/]) assert.match(errors, pattern)
  const nonfinite = structuredClone(content)
  nonfinite.experiments.illustrative[1].data[0].values[0] = NaN
  assert.ok(validateContent(nonfinite).some(error => error.includes('inconsistent chart values')))
  const misaligned = structuredClone(content)
  misaligned.experiments.illustrative[2].data.pop()
  assert.ok(validateContent(misaligned).some(error => error.includes('epochs must align')))
  assert.equal(experiments.actual.length, 0)
  assert.equal(experiments.notes.length, 0)
  assert.ok(experiments.illustrative.every(item => item.sample && /synthetic/i.test(item.provenance)))
})
