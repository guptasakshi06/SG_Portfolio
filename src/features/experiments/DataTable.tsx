import type { ChartView } from './demo'

export function DataTable({ view, sample = true, provenance }: { view: ChartView; sample?: boolean; provenance: string }) {
  return <div className="lab-table-wrap" role="region" tabIndex={0} aria-label={`${sample ? 'Synthetic sample' : 'Source-attributed'} — ${view.title}; scroll table horizontally if needed`}>
    <table className="lab-table">
      <caption><strong>{sample ? 'Synthetic sample — not project results' : 'Source-attributed record'} · {view.title}</strong><span>{view.units}. {provenance}</span></caption>
      <thead><tr><th scope="col">{view.xLabel}</th>{view.series.map(series => <th scope="col" key={series.key}>{series.label}</th>)}</tr></thead>
      <tbody>{view.rows.map(row => <tr key={row.label}><th scope="row">{row.label}</th>{view.series.map(series => <td key={series.key}>{row[series.key]}</td>)}</tr>)}</tbody>
    </table>
  </div>
}
