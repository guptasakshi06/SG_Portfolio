import { useSearchParams } from 'react-router'
import { useRef } from 'react'
import { SearchX } from 'lucide-react'
import { content } from '../content'
import { PageIntro } from '../components/ui/PageIntro'
import { ProjectFilters } from '../features/projects/ProjectFilters'
import { ProjectPreview } from '../features/projects/ProjectPreview'
import { catalogSearch, filterProjects, readCatalogFilters, type CatalogFilters } from '../features/projects/catalog'
import '../styles/projects.css'

export function ProjectsPage() {
  const [params, setParams] = useSearchParams()
  const searchRef = useRef<HTMLInputElement>(null)
  const filters = readCatalogFilters(params)
  const projects = filterProjects(content.projects, content.skills.items, filters)
  const search = catalogSearch(filters)
  function updateFilters(next: CatalogFilters, replace = false) {
    setParams(new URLSearchParams(catalogSearch(next)), { replace, preventScrollReset: true })
  }
  return <div className="projects-page">
    <PageIntro eyebrow="SG / Selected ideas & documented builds" title="My Projects"><p>Explore {content.projects.length} projects across data, analytics and AI. Start with a topic that interests you, then look closer at the work.</p></PageIntro>
    <ProjectFilters filters={filters} onChange={updateFilters} searchRef={searchRef} />
    <div className="catalog-results-heading">
      <p role="status" aria-live="polite" aria-atomic="true">Showing <strong>{projects.length}</strong> of {content.projects.length} projects{filters.category !== 'All' ? ` in ${filters.category}` : ''}{filters.query.trim() ? ` matching “${filters.query.trim()}”` : ''}.</p>
      <p>Categories describe topics; methods are listed only when documented. Visuals are topic illustrations.</p>
    </div>
    {projects.length ? <div className="catalog-grid" aria-label="Project results">{projects.map(project => <ProjectPreview key={project.id} project={project} catalogSearch={search} />)}</div>
      : <section className="catalog-empty" aria-labelledby="catalog-empty-title"><SearchX size={28} aria-hidden="true" /><h2 id="catalog-empty-title">No projects match these filters</h2><p>Try another topic or a shorter search. You can also reset to explore all {content.projects.length} projects.</p><button type="button" className="primary-link" onClick={() => { updateFilters({ category: 'All', query: '' }); searchRef.current?.focus() }}>Show all projects</button></section>}
  </div>
}
