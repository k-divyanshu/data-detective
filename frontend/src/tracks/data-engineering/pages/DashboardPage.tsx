import { Link } from 'react-router-dom'
import { ChallengeCard } from '../components/ChallengeCard'
import { StatCard } from '../../../shared/components/StatCard'
import { challenges } from '../data/challenges'
import { useProgress } from '../progress/useProgress'

export function DashboardPage() {
  const { completedCount, streak, isCompleted } = useProgress()

  const availableChallenges = challenges.filter((challenge) => challenge.available)
  const nextChallenge = availableChallenges.find((challenge) => !isCompleted(challenge.id))
  const availableCompleted = availableChallenges.filter((challenge) => isCompleted(challenge.id)).length
  const progressPercent = (availableCompleted / availableChallenges.length) * 100

  return (
    <>
      <section className="hero">
        <span className="hero-eyebrow">◆ Data Detective</span>
        <h1>Learn Data Engineering by solving real-world data problems.</h1>
        <p className="muted">
          Investigate broken datasets, trace pipeline failures and write the SQL that finds them.
        </p>
      </section>

      <section className="grid grid-3">
        <StatCard label="Challenges" value={challenges.length} hint="available to explore" />
        <StatCard
          label="Completed"
          value={completedCount}
          hint={completedCount === 0 ? 'start your first one' : `of ${challenges.length} challenges`}
        />
        <StatCard
          label="Current streak"
          value={streak}
          hint={streak === 1 ? 'day in a row' : 'days in a row'}
        />
      </section>

      <section>
        <h2>Continue Learning</h2>
        <div className="card continue-card">
          <div>
            {nextChallenge ? (
              <>
                <h3>{nextChallenge.title}</h3>
                <p className="muted">{nextChallenge.description}</p>
              </>
            ) : (
              <>
                <h3>You've finished every available challenge</h3>
                <p className="muted">More challenges are coming soon. Review any of them below.</p>
              </>
            )}
            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="muted small">
              {availableCompleted} of {availableChallenges.length} available challenges completed
            </span>
          </div>
          {nextChallenge && (
            <Link className="button" to={`/data-engineering/challenges/${nextChallenge.id}`}>
              {availableCompleted === 0 ? 'Start Challenge' : 'Continue'}
            </Link>
          )}
        </div>
      </section>

      <section>
        <h2>Challenges</h2>
        <div className="grid grid-3">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </section>
    </>
  )
}
