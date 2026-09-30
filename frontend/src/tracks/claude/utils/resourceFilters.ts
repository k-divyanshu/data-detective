import type { Resource, ResourceFilter } from '../types'

export const resourceFilterLabels: Record<ResourceFilter, string> = {
  all: 'All',
  official: 'Official',
  courses: 'Courses',
  documentation: 'Documentation',
  videos: 'Videos',
  github: 'GitHub',
  practice: 'Practice',
  'mock-exams': 'Mock Exams',
}

function matchesFilter(resource: Resource, filter: ResourceFilter): boolean {
  switch (filter) {
    case 'all':
      return true
    case 'official':
      return resource.source === 'official'
    case 'courses':
      return resource.type === 'course'
    case 'documentation':
      return resource.type === 'documentation'
    case 'videos':
      return resource.type === 'video'
    case 'github':
      return resource.type === 'github'
    case 'practice':
      return resource.type === 'practice-questions'
    case 'mock-exams':
      return resource.type === 'mock-exam'
  }
}

interface FilterOptions {
  filter: ResourceFilter
  domainId: string | 'all'
  includeInactive?: boolean
}

// Official resources come first, then alphabetical, so primary sources are easiest to find.
export function filterResources(resources: Resource[], options: FilterOptions): Resource[] {
  return resources
    .filter((resource) => options.includeInactive || resource.active)
    .filter((resource) => matchesFilter(resource, options.filter))
    .filter((resource) => options.domainId === 'all' || resource.domainIds.includes(options.domainId))
    .sort((a, b) => {
      if (a.source !== b.source) return a.source === 'official' ? -1 : 1
      return a.title.localeCompare(b.title)
    })
}

export function countByFilter(resources: Resource[], domainId: string | 'all'): Record<ResourceFilter, number> {
  const counts = {} as Record<ResourceFilter, number>
  for (const filter of Object.keys(resourceFilterLabels) as ResourceFilter[]) {
    counts[filter] = filterResources(resources, { filter, domainId }).length
  }
  return counts
}
