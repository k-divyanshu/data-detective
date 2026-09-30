import { useSearchParams } from 'react-router-dom'
import { ResourceCard } from '../components/ResourceCard'
import { examDomains, examInfo } from '../data/exam'
import { resources } from '../data/resources'
import type { ResourceFilter } from '../types'
import { countByFilter, filterResources, resourceFilterLabels } from '../utils/resourceFilters'

const filters = Object.keys(resourceFilterLabels) as ResourceFilter[]

function isFilter(value: string | null): value is ResourceFilter {
  return value !== null && (filters as string[]).includes(value)
}

export function ResourcesPage() {
  // Filters live in the URL (?domain=tools-mcp&type=official) so links can pre-select them.
  const [params, setParams] = useSearchParams()
  const filter: ResourceFilter = isFilter(params.get('type')) ? (params.get('type') as ResourceFilter) : 'all'
  const domainParam = params.get('domain')
  const domainId = examDomains.some((domain) => domain.id === domainParam) ? (domainParam as string) : 'all'
  const showInactive = params.get('inactive') === '1'

  function update(changes: Record<string, string | null>) {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === 'all') next.delete(key)
      else next.set(key, value)
    }
    setParams(next, { replace: true })
  }

  const counts = countByFilter(resources, domainId)
  const visible = filterResources(resources, { filter, domainId, includeInactive: showInactive })
  const inactiveCount = resources.filter((resource) => !resource.active).length

  return (
    <>
      <h1>Free Resource Library</h1>
      <p className="muted">
        Official Anthropic material comes first. Community resources are useful but are not Anthropic
        guidance; check them against the official documentation. All links were checked on the date shown.
      </p>

      <div className="chips" role="group" aria-label="Resource type">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            className={`chip ${filter === item ? 'chip-active' : ''}`}
            aria-pressed={filter === item}
            onClick={() => update({ type: item })}
          >
            {resourceFilterLabels[item]} ({counts[item]})
          </button>
        ))}
      </div>

      <div className="field field-inline">
        <label htmlFor="resource-domain">Exam domain</label>
        <select id="resource-domain" value={domainId} onChange={(event) => update({ domain: event.target.value })}>
          <option value="all">All domains</option>
          {examDomains.map((domain) => (
            <option key={domain.id} value={domain.id}>{domain.name}</option>
          ))}
        </select>
        {inactiveCount > 0 && (
          <label className="option-inline">
            <input type="checkbox" checked={showInactive} onChange={(event) => update({ inactive: event.target.checked ? '1' : null })} />
            Show inactive ({inactiveCount})
          </label>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="card coming-soon">
          <p>No verified resources match these filters yet.</p>
          <p className="muted small">
            {filter === 'practice' || filter === 'mock-exams'
              ? 'We only list free practice material that is clearly original and legitimate. Use the Practice and Mock Exam sections in this app in the meantime.'
              : 'Try another domain or filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-2">
          {visible.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}

      <p className="muted small">
        Exam information source:{' '}
        {examInfo.officialGuideUrl ? (
          <a href={examInfo.officialGuideUrl} target="_blank" rel="noopener noreferrer">official exam guide ↗</a>
        ) : (
          'no official guide URL has been verified yet'
        )}
        . Last verified {examInfo.lastVerified}.
      </p>
    </>
  )
}
