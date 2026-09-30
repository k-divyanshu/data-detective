import { Badge } from '../../../shared/components/Badge'
import type { Resource } from '../types'
import { DomainBadge } from './DomainBadge'
import { ProvenanceBadge } from './ProvenanceBadge'

const typeLabels: Record<Resource['type'], string> = {
  course: 'Course',
  documentation: 'Documentation',
  tutorial: 'Tutorial',
  github: 'GitHub',
  article: 'Article',
  video: 'Video',
  'cheat-sheet': 'Cheat sheet',
  'study-guide': 'Study guide',
  'practice-questions': 'Practice questions',
  'mock-exam': 'Mock exam',
}

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className={`card resource-card ${resource.active ? '' : 'resource-inactive'}`}>
      <div className="challenge-card-meta">
        <ProvenanceBadge source={resource.source} />
        <Badge tone="purple">{typeLabels[resource.type]}</Badge>
        {resource.cost === 'partially-free' && <Badge>Partially free</Badge>}
        {!resource.active && <Badge tone="red">Inactive</Badge>}
      </div>

      <h3>
        <a href={resource.url} target="_blank" rel="noopener noreferrer">
          {resource.title} <span aria-hidden="true">↗</span>
        </a>
      </h3>
      <p className="muted small">{resource.provider}</p>
      <p>{resource.description}</p>

      <div className="challenge-card-meta">
        {resource.domainIds.map((domainId) => (
          <DomainBadge key={domainId} domainId={domainId} />
        ))}
      </div>
      <p className="muted small resource-foot">
        {resource.difficulty} · verified {resource.lastVerified}
      </p>
    </article>
  )
}
