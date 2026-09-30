import { Badge } from '../../../shared/components/Badge'
import type { Provenance, QuestionSource } from '../types'

// Labels are deliberately loud: users must always see who published a resource.
export function ProvenanceBadge({ source }: { source: Provenance }) {
  return source === 'official' ? <Badge tone="green">OFFICIAL</Badge> : <Badge tone="amber">COMMUNITY</Badge>
}

export function QuestionSourceBadge({ source }: { source: QuestionSource }) {
  if (source === 'original') return <Badge tone="blue">ORIGINAL PRACTICE</Badge>
  if (source === 'community-inspired') return <Badge tone="amber">COMMUNITY-INSPIRED PRACTICE</Badge>
  return <Badge tone="purple">AI-GENERATED PRACTICE</Badge>
}
