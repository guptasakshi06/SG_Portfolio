import { useState } from 'react'
import { content } from '../../content'
import type { Project } from '../../content/types'
import { NotebookBlocks } from './NotebookBlocks'

export default function NotebookViewer({ project }: { project: Project }) {
  const sections = [...content.notebook.topics.map(topic => ({ ...topic, blocks: project.technicalSections.find(section => section.id === topic.id)?.blocks ?? [] })), ...project.technicalSections.filter(section => !content.notebook.topics.some(topic => topic.id === section.id)).map(section => ({ ...section, pending: 'Details have not been supplied.' }))]
  return <div className="notebook-viewer">
    <p className="notebook-intro">Read the documented approach below. Pending sections identify what is still unknown; source notes describe documentation rather than independently reproduced results.</p>
    {!project.technicalSections.some(section => section.blocks.length) ? <p className="notebook-empty">No project notebook or implementation details have been supplied yet. The overview remains available above.</p> : null}
    <div className="notebook-sections">{sections.map((section, index) => <section className={`notebook-section${section.blocks.length ? '' : ' is-pending'}`} key={section.id} aria-labelledby={`technical-${section.id}`}>
      <h3 id={`technical-${section.id}`}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{section.title}</h3>
      {section.blocks.length ? <NotebookBlocks blocks={section.blocks} /> : <p className="notebook-pending">{section.pending}</p>}
    </section>)}</div>
    <NotebookExample />
  </div>
}

function NotebookExample() {
  const [opened, setOpened] = useState(false)
  return <section className="notebook-example" aria-labelledby="notebook-example-title"><p className="eyebrow">Separate illustrative example</p><h3 id="notebook-example-title">{content.notebook.example.title}</h3><p>{content.notebook.example.description}</p>
    <details onToggle={event => setOpened(event.currentTarget.open)}><summary>View illustrative notebook example</summary>{opened ? <NotebookBlocks blocks={content.notebook.example.blocks} /> : null}</details>
  </section>
}
