import { useState } from 'react'
import { Badge } from '../../../shared/components/Badge'
import { MockExamResults } from '../components/MockExamResults'
import { MockExamRunner } from '../components/MockExamRunner'
import { mockExams } from '../data/mockExams'
import { examDomains } from '../data/exam'
import { questionBank } from '../data/questions'
import { useClaudeProgress } from '../state/useClaudeProgress'
import type { MockExam, Question } from '../types'
import { assembleMock } from '../utils/assembleMock'
import { isCorrect } from '../utils/practice'
import { scoreMock, type MockScore } from '../utils/mock'

type Phase =
  | { name: 'list' }
  | { name: 'running'; exam: MockExam; questions: Question[] }
  | { name: 'results'; exam: MockExam; questions: Question[]; answers: Record<string, string[]>; score: MockScore; seconds: number }

export function MockExamPage() {
  const { recordAnswer, recordMock } = useClaudeProgress()
  const [phase, setPhase] = useState<Phase>({ name: 'list' })

  function start(exam: MockExam) {
    // A fresh, weight-balanced set is drawn from the bank for every attempt.
    const questions = assembleMock(questionBank, examDomains, exam.questionCount)
    setPhase({ name: 'running', exam, questions })
  }

  function finish(exam: MockExam, questions: Question[], answers: Record<string, string[]>, seconds: number) {
    const score = scoreMock(questions, answers)
    for (const question of questions) recordAnswer(question.id, isCorrect(question, answers[question.id] ?? []))
    recordMock({
      id: crypto.randomUUID(),
      mockId: exam.id,
      finishedAt: new Date().toISOString(),
      correct: score.correct,
      total: score.total,
      percent: score.percent,
      byDomain: score.byDomain,
      durationSeconds: seconds,
    })
    setPhase({ name: 'results', exam, questions, answers, score, seconds })
  }

  if (phase.name === 'running') {
    return (
      <>
        <h1>{phase.exam.title}</h1>
        <MockExamRunner
          exam={phase.exam}
          questions={phase.questions}
          onFinish={(answers, seconds) => finish(phase.exam, phase.questions, answers, seconds)}
        />
      </>
    )
  }

  if (phase.name === 'results') {
    return (
      <MockExamResults
        exam={phase.exam}
        questions={phase.questions}
        answers={phase.answers}
        score={phase.score}
        durationSeconds={phase.seconds}
        onRetake={() => setPhase({ name: 'list' })}
      />
    )
  }

  return (
    <>
      <h1>Mock Exams</h1>
      <p className="muted">
        Timed practice built from original study questions. They are not real exam questions, and the
        format is only an approximation of the real exam.
      </p>

      <div className="grid grid-2">
        {mockExams.map((exam) => (
          <article key={exam.id} className="card">
            <h3>{exam.title}</h3>
            <p className="muted">{exam.description}</p>
            <div className="challenge-card-meta">
              <Badge>{exam.questionCount} questions</Badge>
              <Badge>{exam.durationMinutes} minutes</Badge>
            </div>
            <button type="button" className="button" onClick={() => start(exam)}>Start mock exam</button>
          </article>
        ))}
        {mockExams.length === 0 && <p className="muted">No mock exams available yet.</p>}
      </div>

      <p className="muted small">
        Questions are drawn from a bank of {questionBank.length} practice questions in proportion to the published
        domain weights, so each attempt is different. The full mock uses the real exam's item count and time limit.
      </p>
    </>
  )
}
