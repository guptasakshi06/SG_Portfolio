import type { Experiment, Experiments } from '../../content/types'

export interface ChartSeries { key: string; label: string; color: string; dashed: boolean }
export interface ChartView {
  id: string; title: string; units: string; xLabel: string
  rows: { label: string; [key: string]: string | number }[]
  series: ChartSeries[]
}
export const splits = ['Training', 'Validation'] as const
export type Split = typeof splits[number]
export const seriesColors = ['#a78bfa', '#67d5e8']

export function experimentView(experiment: Experiment, xLabel = 'Observation'): ChartView {
  return {
    id: experiment.id, title: experiment.title, units: experiment.axisUnits, xLabel,
    series: experiment.legend.map((label, i) => ({ key: `s${i}`, label, color: seriesColors[i % seriesColors.length], dashed: false })),
    rows: experiment.data.map(row => ({ label: row.label, ...Object.fromEntries(row.values.map((value, i) => [`s${i}`, value])) })),
  }
}

/** Chart and table consume this same filtered view; JSON is the only numerical source. */
export function demoViews(experiments: Experiments, modelId: string, selectedSplits: Split[]) {
  const models = experiments.demo.models.filter(model => modelId === 'all' || model.id === modelId)
  const comparison = experiments.illustrative.find(item => item.id === experiments.demo.comparisonId)!
  const splitIndices = splits.flatMap((split, i) => selectedSplits.includes(split) ? [i] : [])
  const accuracy: ChartView = {
    id: comparison.id, title: comparison.title, units: comparison.axisUnits, xLabel: 'Sample model',
    series: splitIndices.map(i => ({ key: `s${i}`, label: splits[i], color: seriesColors[i], dashed: i === 1 })),
    rows: comparison.data.filter(row => models.some(model => model.name === row.label)).map(row => ({ label: row.label, ...Object.fromEntries(splitIndices.map(i => [`s${i}`, row.values[i]])) })),
  }
  const losses = models.map(model => ({ model, experiment: experiments.illustrative.find(item => item.id === model.lossId)! }))
  const loss: ChartView = {
    id: 'demo-loss', title: 'Training & validation loss', units: 'unitless loss', xLabel: 'Epoch (one training pass)',
    series: losses.flatMap(({ model }) => splitIndices.map(i => ({ key: `${model.id}-${i}`, label: `${model.name} · ${splits[i]}`, color: seriesColors[experiments.demo.models.indexOf(model) % seriesColors.length], dashed: i === 1 }))),
    rows: (losses[0]?.experiment.data ?? []).map((row, epoch) => ({ label: row.label, ...Object.fromEntries(losses.flatMap(({ model, experiment }) => splitIndices.map(i => [`${model.id}-${i}`, experiment.data[epoch].values[i]]))) })),
  }
  const matrices = models.map(model => ({ model, experiment: experiments.illustrative.find(item => item.id === model.matrixId)! }))
  return { models, accuracy, loss, matrices }
}

export function viewSummary(view: ChartView): string {
  if (!view.series.length || !view.rows.length) return 'Synthetic demonstration: no series selected. Select Training or Validation to display values.'
  const last = view.rows[view.rows.length - 1]
  return `Synthetic demonstration — ${view.rows.length} ${view.xLabel === 'Sample model' ? 'model rows' : 'epochs'}. ${view.series.map(series => `${series.label}: ${view.rows.map(row => row[series.key]).join(', ')} (${view.units})`).join('; ')}. Final row: ${last.label}.`
}
