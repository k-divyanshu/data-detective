import { Link } from 'react-router-dom'
import { useProgress } from '../progress/useProgress'
import type { Challenge } from '../types'
import { Badge } from '../../../shared/components/Badge'
import { DifficultyBadge } from './DifficultyBadge'

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const { isCompleted } = useProgress()
  const completed = isCompleted(challenge.id)

  return (
    <article className="card challenge-card">
      <div className="challenge-card-meta">
        <Badge tone="purple">{challenge.category}</Badge>
        <DifficultyBadge difficulty={challenge.difficulty} />
        {completed && <Badge tone="green">Completed</Badge>}
        {!challenge.available && <Badge>Coming soon</Badge>}
      </div>
      <h3>{challenge.title}</h3>
      <p className="muted">{challenge.description}</p>
      <Link className="button" to={`/data-engineering/challenges/${challenge.id}`}>
        {completed ? 'Review Challenge' : 'Start Challenge'}
      </Link>
    </article>
  )
}
