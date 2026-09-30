import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProgressBar } from '../../../shared/components/ProgressBar'
import { PracticeSession } from '../components/PracticeSession'
import { PracticeSetup } from '../components/PracticeSetup'
import { getDomain } from '../data/exam'
import { questionBank } from '../data/questions'
import type { Question } from '../types'
import { selectQuestions, type PracticeConfig } from '../utils/practice'

type Phase =
  | { name: 'setup' }
  | { name: 'running'; questions: Question[] }
  | { name: 'done'; results: { question: Question; correct: boolean }[] }

export function PracticePage() {
  const [phase, setPhase] = useState<Phase>({ name: 'setup' })

  return (
    <>
      <h1>Practice Questions</h1>
      <p className="muted">
        These are practice questions written to help you study the published exam topics. They are not
        real exam questions and do not predict your exam result.
      </p>

      {phase.name === 'setup' && (
        <PracticeSetup
          onStart={(config: PracticeConfig) => {
            const questions = selectQuestions(questionBank, config)
            if (questions.length > 0) setPhase({ name: 'running', questions })
          }}
        />
      )}

      {phase.name === 'running' && (
        <PracticeSession
          // Re-mount when a new set starts so state resets cleanly.
          key={phase.questions.map((q) => q.id).join()}
          questions={phase.questions}
          onFinish={(results) => setPhase({ name: 'done', results })}
        />
      )}

      {phase.name === 'done' && <PracticeSummary results={phase.results} onAgain={() => setPhase({ name: 'setup' })} />}
    </>
  )
}

function PracticeSummary({
  results,
  onAgain,
}: {
  results: { question: Question; correct: boolean }[]
  onAgain: () => void
}) {
  const correct = results.filter((result) => result.correct).length
  const percent = results.length === 0 ? 0 : (correct / results.length) * 100
  const missed = results.filter((result) => !result.correct)

  return (
    <section className="card">
      <h2>Practice complete</h2>
      <p className="score">{correct} / {results.length} correct ({Math.round(percent)}%)</p>
      <ProgressBar percent={percent} tone={percent >= 70 ? 'good' : 'warning'} label="Practice score" />

      {missed.length > 0 && (
        <>
          <h3>Review these topics</h3>
          <ul className="why-list">
            {missed.map(({ question }) => (
              <li key={question.id}>
                {question.topic} <span className="muted">({getDomain(question.domainId)?.name})</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="sql-actions">
        <button type="button" className="button" onClick={onAgain}>Practice again</button>
        <Link className="button button-ghost" to="/claude/resources">Browse resources</Link>
      </div>
    </section>
  )
}
