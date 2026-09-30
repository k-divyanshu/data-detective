import { Link } from 'react-router-dom'
import { ProgressBar } from '../../../shared/components/ProgressBar'
import { StatCard } from '../../../shared/components/StatCard'
import { examDomains, getDomain } from '../data/exam'
import { resources } from '../data/resources'
import type { MockExam, Question } from '../types'
import { filterResources } from '../utils/resourceFilters'
import { formatClock, weakestDomains, type MockScore } from '../utils/mock'
import { DomainBadge } from './DomainBadge'
import { QuestionFeedback } from './QuestionFeedback'
import { ResourceCard } from './ResourceCard'

interface MockExamResultsProps {
  exam: MockExam
  questions: Question[]
  answers: Record<string, string[]>
  score: MockScore
  durationSeconds: number
  onRetake: () => void
}

export function MockExamResults({ exam, questions, answers, score, durationSeconds, onRetake }: MockExamResultsProps) {
  const weak = weakestDomains(score.byDomain, 2)
  const missed = questions.filter((question) => score.incorrectIds.includes(question.id))
  const recommended = weak.flatMap((domainId) => filterResources(resources, { filter: 'all', domainId }).slice(0, 2))

  return (
    <>
      <section className="card">
        <h2>Mock exam result: {exam.title}</h2>
        <div className="grid grid-3">
          <StatCard label="Score" value={`${Math.round(score.percent)}%`} hint={`${score.correct} of ${score.total} correct`} />
          <StatCard label="Time used" value={formatClock(durationSeconds)} hint={`of ${exam.durationMinutes} minutes`} />
          <StatCard label="Unanswered" value={score.unansweredCount} />
        </div>
        <p className="muted small">
          This is a practice score on original study questions. It does not predict your result on the real exam.
        </p>
      </section>

      <section className="card">
        <h2>Domain performance</h2>
        <div className="skill-list">
          {examDomains
            .filter((domain) => score.byDomain[domain.id])
            .map((domain) => {
              const stat = score.byDomain[domain.id]
              const percent = (stat.correct / stat.total) * 100
              return (
                <div key={domain.id} className="skill-row">
                  <span>{domain.name}</span>
                  <ProgressBar percent={percent} tone={percent >= 70 ? 'good' : 'warning'} label={`${domain.name} score`} />
                  <span className="muted small">{Math.round(percent)}% ({stat.correct}/{stat.total})</span>
                </div>
              )
            })}
        </div>

        {weak.length > 0 && (
          <>
            <h3>Recommended next study areas</h3>
            <ul className="why-list">
              {weak.map((domainId) => (
                <li key={domainId}>{getDomain(domainId)?.name}</li>
              ))}
            </ul>
            <Link className="button" to={`/claude/resources?domain=${weak[0]}`}>Study weak areas</Link>
          </>
        )}
      </section>

      {recommended.length > 0 && (
        <section>
          <h2>Recommended resources</h2>
          <div className="grid grid-2">
            {recommended.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>
      )}

      {missed.length > 0 && (
        <section className="card">
          <h2>Questions to review ({missed.length})</h2>
          {missed.map((question) => (
            <details key={question.id} className="review-item">
              <summary>
                <DomainBadge domainId={question.domainId} /> {question.question}
              </summary>
              <QuestionFeedback question={question} selected={answers[question.id] ?? []} />
            </details>
          ))}
        </section>
      )}

      <div className="sql-actions">
        <button type="button" className="button" onClick={onRetake}>Back to mock exams</button>
      </div>
    </>
  )
}
