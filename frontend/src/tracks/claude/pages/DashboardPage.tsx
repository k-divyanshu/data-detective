import { Link } from 'react-router-dom'
import { ProgressBar } from '../../../shared/components/ProgressBar'
import { StatCard } from '../../../shared/components/StatCard'
import { examDomains, examInfo, getDomain } from '../data/exam'
import { questionBank } from '../data/questions'
import { resources } from '../data/resources'
import { useClaudeProgress } from '../state/useClaudeProgress'

export function DashboardPage() {
  const { stats } = useClaudeProgress()
  const weakAreas = stats.weakDomainIds.flatMap((id) => getDomain(id) ?? [])
  const continueDomain = weakAreas[0]?.id ?? examDomains[0].id

  return (
    <>
      <section className="hero">
        <span className="hero-eyebrow">{examInfo.shortName} · Exam preparation</span>
        <h1>{examInfo.name}</h1>
        <p className="muted">{examInfo.guideNote}</p>
        {examInfo.officialGuideUrl && (
          <a href={examInfo.officialGuideUrl} target="_blank" rel="noopener noreferrer">
            Official exam guide ↗
          </a>
        )}
      </section>

      <section className="card">
        <h2>About the exam</h2>
        <dl className="meta-list">
          {examInfo.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd className="fact-value">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <p className="muted small">
          From the official Exam Guide v1.0 and certification FAQ, checked {examInfo.lastVerified}. The exam may
          change without notice, so confirm details on the official page.
        </p>
      </section>

      <section className="card">
        <div className="form-title">
          <h2>Overall progress</h2>
          <span className="stat-value">{Math.round(stats.coveragePercent)}%</span>
        </div>
        <ProgressBar percent={stats.coveragePercent} label="Question bank coverage" />
        <p className="muted small">
          Share of the {questionBank.length} practice questions you have answered correctly at least once.
          This measures your practice, not your readiness for the real exam.
        </p>
      </section>

      <section className="grid grid-4">
        <StatCard label="Study streak" value={`🔥 ${stats.streak}`} hint={stats.streak === 1 ? 'day' : 'days'} />
        <StatCard
          label="Practice accuracy"
          value={stats.accuracyPercent === null ? '—' : `${Math.round(stats.accuracyPercent)}%`}
          hint={`${stats.totalAttempts} answers`}
        />
        <StatCard label="Mock exams" value={stats.mockCount} hint="completed" />
        <StatCard label="Weak areas" value={weakAreas.length} tone={weakAreas.length > 0 ? 'warning' : 'default'} />
      </section>

      <section className="card">
        <h2>Weak areas</h2>
        {weakAreas.length === 0 ? (
          <p className="muted">
            Answer at least 3 questions in a domain to see where you need more practice.
          </p>
        ) : (
          <ul className="why-list">
            {weakAreas.map((domain) => (
              <li key={domain.id}>
                ⚠ <Link to={`/claude/resources?domain=${domain.id}`}>{domain.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="action-row">
        <Link className="button" to={`/claude/resources?domain=${continueDomain}`}>Continue Learning</Link>
        <Link className="button" to="/claude/plan">Study Plan</Link>
        <Link className="button" to="/claude/practice">Practice Questions</Link>
        <Link className="button" to="/claude/mock-exam">Mock Exam</Link>
        <Link className="button button-ghost" to="/claude/resources">Free Resources</Link>
        <Link className="button button-ghost" to="/claude/tips">Community Tips</Link>
        <Link className="button button-ghost" to="/claude/notes">My Notes</Link>
        <Link className="button button-ghost" to="/claude/progress">Progress</Link>
      </section>

      <section>
        <h2>Exam domains</h2>
        <div className="grid grid-2">
          {examDomains.map((domain) => {
            const stat = stats.domainStats.find((item) => item.domainId === domain.id)
            const resourceCount = resources.filter((r) => r.active && r.domainIds.includes(domain.id)).length
            const questionCount = questionBank.filter((q) => q.domainId === domain.id).length
            return (
              <article key={domain.id} className="card">
                <h3>{domain.name}</h3>
                {domain.weightPercent !== undefined && <p className="muted small">Exam weight: {domain.weightPercent}%</p>}
                <p className="muted">{domain.description}</p>
                <p className="muted small">
                  {resourceCount} resources · {questionCount} practice questions
                  {stat?.accuracy != null ? ` · ${Math.round(stat.accuracy)}% accuracy` : ''}
                </p>
                <Link to={`/claude/resources?domain=${domain.id}`}>Study this domain →</Link>
              </article>
            )
          })}
        </div>
      </section>

      <p className="muted small">
        This is an independent study tool, not affiliated with or endorsed by Anthropic. Practice questions
        are original study aids and are not real exam questions.
      </p>
    </>
  )
}
