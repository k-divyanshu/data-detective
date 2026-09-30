import { Link } from 'react-router-dom'
import { StatCard } from '../components/StatCard'
import { challenges } from '../data/challenges'
import { useProgress } from '../progress/useProgress'

export function ProgressPage() {
  const { completedAt, completedCount, streak, activeDays, isCompleted, reset } = useProgress()

  // One row per category: how many of its challenges are done.
  const categories = [...new Set(challenges.map((challenge) => challenge.category))].map((name) => {
    const inCategory = challenges.filter((challenge) => challenge.category === name)
    return {
      name,
      total: inCategory.length,
      done: inCategory.filter((challenge) => isCompleted(challenge.id)).length,
    }
  })

  const completedChallenges = challenges
    .filter((challenge) => isCompleted(challenge.id))
    .sort((a, b) => completedAt[a.id].localeCompare(completedAt[b.id]))

  function handleReset() {
    if (window.confirm('Reset all progress? This cannot be undone.')) reset()
  }

  return (
    <>
      <h1>Progress</h1>

      <section className="grid grid-3">
        <StatCard label="Completed" value={`${completedCount} / ${challenges.length}`} />
        <StatCard label="Current streak" value={streak} hint={streak === 1 ? 'day' : 'days'} />
        <StatCard label="Active days" value={activeDays.length} />
      </section>

      {completedCount === 0 ? (
        <div className="card coming-soon">
          <p>Complete your first challenge to start building your data-engineering skill profile.</p>
          <Link className="button" to="/challenges">Browse challenges</Link>
        </div>
      ) : (
        <>
          <section className="card">
            <h2>Skill profile</h2>
            <div className="skill-list">
              {categories.map((category) => (
                <div key={category.name} className="skill-row">
                  <span>{category.name}</span>
                  <div className="progress-track" aria-hidden="true">
                    <div
                      className="progress-fill"
                      style={{ width: `${(category.done / category.total) * 100}%` }}
                    />
                  </div>
                  <span className="muted small">{category.done} / {category.total}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <h2>Completed challenges</h2>
            <ul className="history">
              {completedChallenges.map((challenge) => (
                <li key={challenge.id}>
                  <Link to={`/challenges/${challenge.id}`}>{challenge.title}</Link>
                  <span className="muted small">
                    {new Date(completedAt[challenge.id]).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <button type="button" className="button button-ghost" onClick={handleReset}>
            Reset progress
          </button>
        </>
      )}
    </>
  )
}
