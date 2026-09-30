import { useEffect, useRef, useState } from 'react'
import { Badge } from '../../../shared/components/Badge'
import type { MockExam, Question } from '../types'
import { formatClock } from '../utils/mock'
import { nextSelection } from '../utils/practice'
import { DomainBadge } from './DomainBadge'
import { QuestionView } from './QuestionView'

interface MockExamRunnerProps {
  exam: MockExam
  questions: Question[]
  onFinish: (answers: Record<string, string[]>, elapsedSeconds: number) => void
}

export function MockExamRunner({ exam, questions, onFinish }: MockExamRunnerProps) {
  const totalSeconds = exam.durationMinutes * 60
  // The deadline is fixed when the exam starts, so a throttled background tab can't cheat the timer.
  const [startedAt] = useState(() => Date.now())
  const [remaining, setRemaining] = useState(totalSeconds)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [marked, setMarked] = useState<string[]>([])
  const [confirming, setConfirming] = useState(false)
  const finishedRef = useRef(false)

  const answersRef = useRef(answers)
  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  function finish() {
    if (finishedRef.current) return // the timer and the button may both fire
    finishedRef.current = true
    onFinish(answersRef.current, Math.min(totalSeconds, Math.round((Date.now() - startedAt) / 1000)))
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const left = totalSeconds - Math.floor((Date.now() - startedAt) / 1000)
      setRemaining(Math.max(0, left))
      if (left <= 0) {
        clearInterval(timer)
        if (!finishedRef.current) {
          finishedRef.current = true
          onFinish(answersRef.current, totalSeconds)
        }
      }
    }, 1000)
    return () => clearInterval(timer)
    // The exam is fixed for the lifetime of this component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const question = questions[index]
  const selected = answers[question.id] ?? []
  const answeredCount = questions.filter((q) => (answers[q.id] ?? []).length > 0).length
  const unanswered = questions.length - answeredCount
  const isMarked = marked.includes(question.id)

  return (
    <section className="mock-layout">
      <div className="card">
        <div className="form-title">
          <span className="muted small">Question {index + 1} of {questions.length}</span>
          <div className="challenge-card-meta">
            <DomainBadge domainId={question.domainId} />
            <span className={`timer ${remaining < 60 ? 'timer-low' : ''}`} aria-live="off">
              ⏱ {formatClock(remaining)}
            </span>
          </div>
        </div>

        <QuestionView
          question={question}
          selected={selected}
          onToggle={(optionId) =>
            setAnswers((current) => ({ ...current, [question.id]: nextSelection(question, current[question.id] ?? [], optionId) }))
          }
          locked={false}
        />

        <div className="sql-actions">
          <button type="button" className="button button-ghost" disabled={index === 0} onClick={() => setIndex(index - 1)}>
            Previous
          </button>
          <button
            type="button"
            className="button button-ghost"
            disabled={index === questions.length - 1}
            onClick={() => setIndex(index + 1)}
          >
            Next
          </button>
          <button
            type="button"
            className="button button-ghost"
            onClick={() => setMarked((current) => (isMarked ? current.filter((id) => id !== question.id) : [...current, question.id]))}
          >
            {isMarked ? '★ Marked for review' : '☆ Mark for review'}
          </button>
        </div>
      </div>

      <aside className="card mock-nav">
        <h3>Questions</h3>
        <div className="nav-grid">
          {questions.map((q, position) => {
            const answered = (answers[q.id] ?? []).length > 0
            const classes = ['nav-cell', answered ? 'nav-answered' : '', marked.includes(q.id) ? 'nav-marked' : '', position === index ? 'nav-current' : '']
            return (
              <button
                key={q.id}
                type="button"
                className={classes.join(' ')}
                aria-label={`Question ${position + 1}${answered ? ', answered' : ''}${marked.includes(q.id) ? ', marked for review' : ''}`}
                onClick={() => setIndex(position)}
              >
                {position + 1}
              </button>
            )
          })}
        </div>
        <p className="muted small">
          {answeredCount} answered · {unanswered} unanswered · {marked.length} marked
        </p>

        {!confirming ? (
          <button type="button" className="button" onClick={() => setConfirming(true)}>Submit exam</button>
        ) : (
          <div className="confirm-box">
            <p>
              {unanswered > 0 ? <><Badge tone="amber">{unanswered} unanswered</Badge> </> : null}
              Submit now? You can't change answers afterwards.
            </p>
            <div className="sql-actions">
              <button type="button" className="button" onClick={finish}>Yes, submit</button>
              <button type="button" className="button button-ghost" onClick={() => setConfirming(false)}>Keep working</button>
            </div>
          </div>
        )}
      </aside>
    </section>
  )
}
