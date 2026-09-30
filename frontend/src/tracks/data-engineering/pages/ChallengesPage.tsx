import { ChallengeCard } from '../components/ChallengeCard'
import { challenges } from '../data/challenges'

export function ChallengesPage() {
  return (
    <>
      <h1>Challenges</h1>
      <p className="muted">Pick a scenario and start investigating.</p>
      <div className="grid grid-3">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </>
  )
}
