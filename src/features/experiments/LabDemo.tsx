import { Component, lazy, Suspense, useState, type ReactNode } from 'react'
import { content } from '../../content'
import { DataTable } from './DataTable'
import { demoViews, experimentView, splits, viewSummary, type ChartView, type Split } from './demo'

const MetricChart = lazy(() => import('./MetricChart'))
class ChartFallback extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <p>Chart view could not load. The complete synthetic data remains available in the table below.</p> : this.props.children }
}
function MetricPanel({ view, kind, explanation }: { view: ChartView; kind: 'bar' | 'line'; explanation: string }) {
  return <section className="lab-metric" aria-labelledby={`${view.id}-heading`}>
    <p className="lab-sample-label">Synthetic demonstration</p>
    <h3 id={`${view.id}-heading`}>{view.title}</h3>
    <p className="lab-explanation">{explanation}</p>
    {view.series.length ? <>
      <ChartFallback><Suspense fallback={<p className="lab-chart-loading" role="status">Loading synthetic chart. Exact values are available below.</p>}><MetricChart view={view} kind={kind} /></Suspense></ChartFallback>
      <p className="sr-only">{viewSummary(view)}</p>
      <DataTable view={view} provenance="Hand-authored teaching values; no model was trained." />
    </> : <p className="lab-empty">No series selected. Choose Training or Validation above to show the synthetic chart and values.</p>}
  </section>
}
export function LabDemo() {
  const [model, setModel] = useState('all')
  const [selectedSplits, setSelectedSplits] = useState<Split[]>([...splits])
  const { demo } = content.experiments
  const views = demoViews(content.experiments, model, selectedSplits)
  function toggle(split: Split) { setSelectedSplits(current => current.includes(split) ? current.filter(item => item !== split) : splits.filter(item => current.includes(item) || item === split)) }
  return <section className="lab-demo" aria-labelledby="demo-title">
    <aside className="lab-notice"><strong>{demo.notice}</strong><p>{demo.provenance}</p></aside>
    <div className="lab-demo-intro"><p className="eyebrow">Interactive teaching example</p><h2 id="demo-title">{demo.title}</h2><p>{demo.description}</p></div>
    <div className="lab-controls">
      <label className="lab-model">Compare models<select value={model} onChange={event => setModel(event.target.value)} aria-controls="lab-views"><option value="all">Both models</option>{demo.models.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <fieldset><legend>Accuracy & loss series</legend>{splits.map(split => <label key={split}><input type="checkbox" checked={selectedSplits.includes(split)} onChange={() => toggle(split)} aria-controls="lab-views" />{split}</label>)}</fieldset>
      <button className="lab-reset" type="button" onClick={() => { setModel('all'); setSelectedSplits([...splits]) }}>Reset view</button>
    </div>
    <p className="lab-filter-status" role="status">Synthetic view: {views.models.map(item => item.name).join(' and ')}. {selectedSplits.length ? `${selectedSplits.join(' and ')} accuracy and loss.` : 'No accuracy or loss series selected.'} Prediction-count tables always show validation.</p>
    <div id="lab-views">
      <div className="lab-chart-grid"><MetricPanel view={views.accuracy} kind="bar" explanation={demo.accuracyExplanation} /><MetricPanel view={views.loss} kind="line" explanation={demo.lossExplanation} /></div>
      <section className="lab-matrix" aria-labelledby="matrix-title"><p className="lab-sample-label">Synthetic demonstration</p><h3 id="matrix-title">What do the validation predictions count?</h3><p className="lab-explanation">{demo.matrixExplanation}</p>
        <div className="lab-matrix-grid">{views.matrices.map(({ model: item, experiment }) => <div key={item.id}>
          <DataTable view={experimentView(experiment, 'Known class')} provenance={experiment.provenance} />
          <p className="lab-summary">{experiment.accessibleSummary}</p>
        </div>)}</div>
      </section>
    </div>
  </section>
}
