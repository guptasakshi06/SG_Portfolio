import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { TooltipContentProps } from 'recharts'
import type { ChartView } from './demo'

function SampleTooltip({ active, label, payload, units }: Pick<TooltipContentProps, 'active' | 'label' | 'payload'> & { units: string }) {
  if (!active || !payload?.length) return null
  return <div className="lab-tooltip"><strong>Synthetic sample · {label}</strong><p>Not Sakshi’s project results</p><ul>{payload.map(item => <li key={item.name}>{item.name}: {item.value} {units}</li>)}</ul></div>
}
export default function MetricChart({ view, kind }: { view: ChartView; kind: 'bar' | 'line' }) {
  const axes = <>
    <CartesianGrid stroke="#353d50" strokeDasharray="3 5" vertical={false} />
    <XAxis dataKey="label" tick={{ fill: '#b8bfd0', fontSize: 12 }} tickLine={false} axisLine={false} />
    <YAxis width={42} domain={kind === 'bar' ? [0, 100] : [0, 'auto']} tick={{ fill: '#b8bfd0', fontSize: 12 }} tickLine={false} axisLine={false} />
    <Tooltip content={props => <SampleTooltip active={props.active} label={props.label} payload={props.payload} units={view.units} />} isAnimationActive={false} cursor={kind === 'bar' ? { fill: '#a78bfa10' } : { stroke: '#a1a8b8' }} />
  </>
  return <div className="lab-chart" aria-label={`Synthetic sample — ${view.title}. ${view.units}. Exact values in the following table.`}>
    <p className="lab-axis-label">Synthetic sample · {view.units} · {kind === 'bar' ? 'higher is better' : 'lower is better'}</p>
    <ResponsiveContainer width="100%" height={264} minWidth={0} initialDimension={{ width: 300, height: 264 }}>
      {kind === 'bar' ? <BarChart data={view.rows} accessibilityLayer aria-label={`Synthetic accuracy comparison; use Left and Right arrows for values; table follows`} margin={{ top: 12, right: 12, bottom: 4, left: 0 }}>
        {axes}{view.series.map(series => <Bar key={series.key} dataKey={series.key} name={series.label} fill={series.color} radius={[3, 3, 0, 0]} maxBarSize={44} isAnimationActive={false} />)}
      </BarChart> : <LineChart data={view.rows} accessibilityLayer aria-label="Synthetic loss curves; use Left and Right arrows for values; table follows" margin={{ top: 12, right: 12, bottom: 4, left: 0 }}>
        {axes}{view.series.map(series => <Line key={series.key} dataKey={series.key} name={series.label} stroke={series.color} strokeDasharray={series.dashed ? '6 4' : undefined} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} isAnimationActive={false} />)}
      </LineChart>}
    </ResponsiveContainer>
    <p className="lab-x-label">{view.xLabel}</p>
    <ul className="lab-legend" aria-label="Chart legend">{view.series.map(series => <li key={series.key}><span aria-hidden="true" style={{ borderColor: series.color, borderStyle: series.dashed ? 'dashed' : 'solid' }} />{series.label}{kind === 'line' ? ` (${series.dashed ? 'dashed' : 'solid'})` : ''}</li>)}</ul>
    <p className="lab-chart-help">Focus chart, then use ← / → for sample tooltips. All values are also in the table below.</p>
  </div>
}
