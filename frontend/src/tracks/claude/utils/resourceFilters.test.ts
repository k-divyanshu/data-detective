import { describe, expect, it } from 'vitest'
import { countByFilter, filterResources } from './resourceFilters'
import { makeResource } from './testFixtures'

const resources = [
  makeResource({ id: 'docs-official', type: 'documentation', source: 'official', domainIds: ['tools'] }),
  makeResource({ id: 'course-official', type: 'course', source: 'official', domainIds: ['agents', 'tools'] }),
  makeResource({ id: 'video-community', type: 'video', source: 'community', domainIds: ['tools'] }),
  makeResource({ id: 'repo-official', type: 'github', source: 'official', domainIds: ['agents'] }),
  makeResource({ id: 'dead-link', type: 'documentation', source: 'official', active: false }),
]

const ids = (list: { id: string }[]) => list.map((item) => item.id)

describe('filterResources', () => {
  it('hides inactive resources unless asked', () => {
    expect(ids(filterResources(resources, { filter: 'all', domainId: 'all' }))).not.toContain('dead-link')
    expect(ids(filterResources(resources, { filter: 'all', domainId: 'all', includeInactive: true }))).toContain('dead-link')
  })

  it('filters by provenance and by type', () => {
    expect(ids(filterResources(resources, { filter: 'official', domainId: 'all' }))).not.toContain('video-community')
    expect(ids(filterResources(resources, { filter: 'videos', domainId: 'all' }))).toEqual(['video-community'])
    expect(ids(filterResources(resources, { filter: 'courses', domainId: 'all' }))).toEqual(['course-official'])
    expect(ids(filterResources(resources, { filter: 'github', domainId: 'all' }))).toEqual(['repo-official'])
  })

  it('filters by exam domain', () => {
    expect(ids(filterResources(resources, { filter: 'all', domainId: 'agents' })).sort()).toEqual(['course-official', 'repo-official'])
  })

  it('combines domain and type filters', () => {
    expect(ids(filterResources(resources, { filter: 'documentation', domainId: 'tools' }))).toEqual(['docs-official'])
  })

  it('lists official resources before community ones', () => {
    const result = filterResources(resources, { filter: 'all', domainId: 'tools' })
    expect(result[result.length - 1].id).toBe('video-community')
  })

  it('returns an empty list when nothing matches (e.g. no mock exams yet)', () => {
    expect(filterResources(resources, { filter: 'mock-exams', domainId: 'all' })).toEqual([])
  })
})

describe('countByFilter', () => {
  it('counts active resources per filter for a domain', () => {
    const counts = countByFilter(resources, 'tools')
    expect(counts.all).toBe(3)
    expect(counts.official).toBe(2)
    expect(counts.videos).toBe(1)
    expect(counts['mock-exams']).toBe(0)
  })
})
