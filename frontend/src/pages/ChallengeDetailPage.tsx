import type { ComponentType } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '../components/Badge'
import { DifficultyBadge } from '../components/DifficultyBadge'
import { DuplicateOrdersChallenge } from '../components/DuplicateOrdersChallenge'
import { MissingCustomerIdsChallenge } from '../components/MissingCustomerIdsChallenge'
import { RevenueDropChallenge } from '../components/RevenueDropChallenge'
import { getChallengeById } from '../data/challenges'

// Add a line here when a new challenge is built.
const challengeViews: Record<string, ComponentType> = {
  'duplicate-orders': DuplicateOrdersChallenge,
  'missing-customer-ids': MissingCustomerIdsChallenge,
  'unexpected-revenue-drop': RevenueDropChallenge,
}

export function ChallengeDetailPage() {
  const { challengeId = '' } = useParams()
  const challenge = getChallengeById(challengeId)

  if (!challenge) {
    return (
      <>
        <h1>Challenge not found</h1>
        <Link to="/challenges">← Back to challenges</Link>
      </>
    )
  }

  const ChallengeView = challengeViews[challenge.id]

  return (
    <>
      <Link to="/challenges" className="muted small">← All challenges</Link>
      <header className="detail-header">
        <h1>{challenge.title}</h1>
        <div className="challenge-card-meta">
          <Badge tone="purple">{challenge.category}</Badge>
          <DifficultyBadge difficulty={challenge.difficulty} />
        </div>
        <p className="muted">{challenge.description}</p>
      </header>

      {ChallengeView ? (
        <ChallengeView />
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
