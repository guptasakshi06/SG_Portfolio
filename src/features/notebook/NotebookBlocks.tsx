import { content } from '../../content'
import type { NotebookBlock } from '../../content/types'
import { CodeBlock } from './CodeBlock'

function Paragraphs({ text }: { text: string }) {
  // Text remains React-escaped: no raw HTML, Markdown HTML, scripts or evaluation.
  return <>{text.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</>
}
function NotebookTable({ columns, rows, caption }: { columns: string[]; rows: string[][]; caption: string }) {
  return <div className="notebook-scroll" tabIndex={0} role="region" aria-label={`${caption}; scroll horizontally if needed`}>
    <table><caption>{caption}</caption><thead><tr>{columns.map((column, index) => <th scope="col" key={index}>{column}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, i) => i === 0 ? <th scope="row" key={i}>{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody></table>
  </div>
}
function BlockContent({ block }: { block: NotebookBlock }) {
  switch (block.type) {
    case 'text': return <div className="notebook-text"><Paragraphs text={block.text} /></div>
    case 'code': return <CodeBlock code={block.code} language={block.language} />
    case 'table': return <NotebookTable columns={block.columns} rows={block.rows} caption={block.caption} />
    case 'callout': return <aside className="notebook-callout"><h4>{block.title}</h4><Paragraphs text={block.text} /></aside>
    case 'chart': {
      const experiment = [...content.experiments.actual, ...content.experiments.illustrative].find(item => item.id === block.experimentId && item.sample === block.sample)
      if (!experiment) return <p>Chart data has not been supplied.</p>
      return <div><h4>{experiment.title}</h4><p>{experiment.description}</p><p>{experiment.accessibleSummary}</p><p>{experiment.provenance}</p><NotebookTable columns={['Observation', ...experiment.legend]} rows={experiment.data.map(row => [row.label, ...row.values.map(String)])} caption={`${experiment.sample ? 'Illustrative sample' : 'Source-attributed data'} — ${experiment.title} (${experiment.axisUnits})`} /></div>
    }
  }
}
export function NotebookBlocks({ blocks }: { blocks: NotebookBlock[] }) {
  return <div className="notebook-blocks">{blocks.map((block, index) => <div className={`notebook-block${block.sample ? ' is-sample' : ''}`} key={index}>
    <p className="notebook-provenance"><strong>{block.sample ? 'Illustrative sample — not project results' : 'Source note — documentation, not reproduced results'}</strong><span>{block.provenance}</span></p>
    <BlockContent block={block} />
  </div>)}</div>
}
