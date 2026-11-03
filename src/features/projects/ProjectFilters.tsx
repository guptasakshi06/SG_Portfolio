import { Search, RotateCcw } from 'lucide-react'
import type { RefObject } from 'react'
import { projectCategories, type CatalogFilters } from './catalog'

export function ProjectFilters({ filters, onChange, searchRef }: { filters: CatalogFilters; onChange: (filters: CatalogFilters, replace?: boolean) => void; searchRef: RefObject<HTMLInputElement | null> }) {
  const active = filters.category !== 'All' || Boolean(filters.query)
  return <section className="catalog-filters" aria-label="Filter projects">
    <div className="catalog-search-row">
      <div className="catalog-search-field">
        <label htmlFor="project-search">Search projects</label>
        <div className="catalog-search-input"><Search size={18} aria-hidden="true" /><input ref={searchRef} id="project-search" type="search" value={filters.query} placeholder="Try a topic, project or technology" aria-describedby="project-search-help" onChange={event => onChange({ ...filters, query: event.target.value }, true)} /></div>
        <p id="project-search-help">Search titles, summaries and documented technologies.</p>
      </div>
      <button className="catalog-reset secondary-link" type="button" disabled={!active} onClick={() => onChange({ category: 'All', query: '' })}><RotateCcw size={16} aria-hidden="true" />Reset filters</button>
    </div>
    <div role="group" aria-label="Project category" className="catalog-categories">
      {projectCategories.map(category => <button key={category} type="button" aria-pressed={filters.category === category} onClick={() => onChange({ ...filters, category })}>{category}</button>)}
    </div>
  </section>
}
