import { Badge } from '../../../shared/components/Badge'
import { getDomain } from '../data/exam'

export function DomainBadge({ domainId }: { domainId: string }) {
  return <Badge tone="blue">{getDomain(domainId)?.shortName ?? domainId}</Badge>
}
