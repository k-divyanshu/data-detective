import { ProgressBar } from '../../../shared/components/ProgressBar'
import { StatCard } from '../../../shared/components/StatCard'
import { examDomains } from '../data/exam'
import { mockExams } from '../data/mockExams'
import { useClaudeProgress } from '../state/useClaudeProgress'
import { formatClock } from '../utils/mock'

export function ProgressPage() {
  const { stats, mockResults, reset } = useClaudeProgress()

  return (
    <>
      <h1>Progress</h1>

      <section className="grid grid-3">
        <StatCard label="Answers given" value={stats.totalAttempts} />
        <StatCard label="Accuracy" value={stats.accuracyPercent === null ? '—' : `${Math.round(stats.accuracyPercent)}%`} />
        <StatCard label="Study streak" value={stats.streak} hint={stats.streak === 1 ? 'day' : 'days'} />
      </section>

      <section className="card">
        <h2>Accuracy by domain</h2>
        <div className="skill-list">
          {examDomains.map((domain) => {
            const stat = stats.domainStats.find((item) => item.domainId === domain.id)
            const accuracy = stat?.accuracy ?? null
            return (
              <div key={domain.id} className="skill-row">
                <span>{domain.name}</span>
                <ProgressBar percent={accuracy ?? 0} tone={accuracy !== null && accuracy < 70 ? 'warning' : 'good'} label={`${domain.name} accuracy`} />
                <span className="muted small">{accuracy === null ? 'no data' : `${Math.round(accuracy)}% (${stat?.attempts})`}</span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="card">
        <h2>Mock exam history</h2>
        {mockResults.length === 0 ? (
          <p className="muted">No mock exams completed yet.</p>
        ) : (
          <ul className="history">
            {mockResults.map((result) => (
              <li key={result.id}>
                <span>
                  {mockExams.find((exam) => exam.id === result.mockId)?.title ?? 'Mock exam'}{' '}
                  <span className="muted small">
                    · {new Date(result.finishedAt).toLocaleDateString()} · {formatClock(result.durationSeconds)}
                  </span>
                </span>
                <strong>{Math.round(result.percent)}% ({result.correct}/{result.total})</strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button
        type="button"
        className="button button-ghost"
        onClick={() => {
          if (window.confirm('Reset all Claude Developer progress? Notes and tips are kept.')) reset()
        }}
      >
        Reset progress
      </button>
    </>
  )
}
