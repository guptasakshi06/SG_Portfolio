import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { content } from '../../content'
import { buildSearchIndex, nextResultIndex, searchGroups, searchPortfolio } from './search'
import type { SearchEntry } from './search'

const index = buildSearchIndex(content)

/** Mounted only while open. Native modal makes the background inert. */
export function CommandPalette({ onClose, onChoose }: { onClose: () => void; onChoose: (entry: SearchEntry) => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigating = useRef(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const results = searchPortfolio(index, query)
  const selected = results[active]
  const optionId = (id: string) => `search-result-${id}`

  useEffect(() => {
    const dialog = dialogRef.current!
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (!navigating.current && previousFocus?.getClientRects().length) previousFocus.focus({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    if (selected) document.getElementById(optionId(selected.id))?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  function choose(entry: SearchEntry) {
    navigating.current = true
    onChoose(entry)
  }
  function updateQuery(value: string) { setQuery(value); setActive(0) }
  function inputKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setActive(current => nextResultIndex(current, event.key === 'ArrowDown' ? 1 : -1, results.length))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (selected) choose(selected)
    }
  }
  function containFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return
    const controls = dialogRef.current!.querySelectorAll<HTMLElement>('button:not([disabled]), input, a[href]')
    const first = controls[0]
    const last = controls[controls.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }
  return <dialog ref={dialogRef} id="portfolio-search" className="command-palette" aria-labelledby="search-title" aria-describedby="search-help" onCancel={event => { event.preventDefault(); onClose() }} onKeyDown={containFocus}>
    <div className="search-heading"><div><p className="sidebar-caption">SG / EXPLORE</p><h2 id="search-title">Search portfolio</h2></div><button type="button" className="icon-button" aria-label="Close search" onClick={onClose}><X size={20} aria-hidden="true" /></button></div>
    <div className="search-field"><Search size={20} aria-hidden="true" /><label className="sr-only" htmlFor="portfolio-query">Search pages, projects and skills</label><input autoFocus ref={inputRef} id="portfolio-query" role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="portfolio-results" aria-activedescendant={selected ? optionId(selected.id) : undefined} aria-describedby="search-help" autoComplete="off" spellCheck={false} placeholder="Try Python, loan or GreedUp…" value={query} onChange={event => updateQuery(event.target.value)} onKeyDown={inputKey} />{query ? <button type="button" className="icon-button" aria-label="Clear search" onClick={() => { updateQuery(''); inputRef.current?.focus() }}><X size={18} aria-hidden="true" /></button> : null}</div>
    <p className="search-count" role="status" aria-live="polite" aria-atomic="true">{results.length} {results.length === 1 ? 'result' : 'results'}{query.trim() ? ` for “${query.trim()}”` : ' · Start with a page, or type to explore'}</p>
    <div className="search-results" id="portfolio-results" role="listbox" aria-label="Portfolio search results">
      {searchGroups.map(group => {
        const entries = results.filter(entry => entry.group === group)
        return entries.length ? <div key={group} role="group" aria-label={group}><p className="search-group-title" aria-hidden="true">{group} <span>{entries.length}</span></p>{entries.map(entry => <div key={entry.id} id={optionId(entry.id)} role="option" aria-selected={entry.id === selected?.id} className="search-result" onPointerMove={() => setActive(results.indexOf(entry))} onClick={() => choose(entry)}><div><p className="search-result-title">{entry.title}</p><p className="search-result-description">{entry.description}</p></div><ArrowUpRight size={18} aria-hidden="true" /></div>)}</div> : null
      })}
    </div>
    {!results.length ? <div className="search-empty"><h3>No matches yet</h3><p>Try a shorter word, a project topic or a skill such as Python. Clear search to browse all pages.</p><button type="button" className="text-link" onClick={() => { updateQuery(''); inputRef.current?.focus() }}>Browse pages</button></div> : null}
    <p id="search-help" className="search-help"><span><kbd>↑</kbd> <kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></p>
  </dialog>
}
