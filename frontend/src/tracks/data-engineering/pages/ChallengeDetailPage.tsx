import { Link, useParams } from 'react-router-dom'
import { Badge } from '../../../shared/components/Badge'
import { getChallengeDefinition } from '../challenges'
import { ChallengeView } from '../components/ChallengeView'
import { DifficultyBadge } from '../components/DifficultyBadge'
import { getChallengeById } from '../data/challenges'

export function ChallengeDetailPage() {
  const { challengeId = '' } = useParams()
  const challenge = getChallengeById(challengeId)
  const definition = getChallengeDefinition(challengeId)

  if (!challenge) {
    return (
      <>
        <h1>Challenge not found</h1>
        <Link to="/data-engineering/challenges">← Back to challenges</Link>
      </>
    )
  }

  return (
    <>
      <Link to="/data-engineering/challenges" className="muted small">← All challenges</Link>
      <header className="detail-header">
        <h1>{challenge.title}</h1>
        <div className="challenge-card-meta">
          <Badge tone="purple">{challenge.category}</Badge>
          <DifficultyBadge difficulty={challenge.difficulty} />
        </div>
        <p className="muted">{challenge.description}</p>
      </header>

      {definition ? (
        <ChallengeView challengeId={challenge.id} content={definition.content} />
      ) : (
        <div className="card coming-soon">
          <Badge>Coming soon</Badge>
          <h2>This challenge is being built</h2>
          <p className="muted">Try one of the available challenges in the meantime.</p>
        </div>
      )}
    </>
  )
}
