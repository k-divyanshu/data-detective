import { useState } from 'react'
import { ProgressBar } from '../../../shared/components/ProgressBar'
import { Badge } from '../../../shared/components/Badge'
import { useClaudeProgress } from '../state/useClaudeProgress'
import type { Question } from '../types'
import { isCorrect, nextSelection } from '../utils/practice'
import { DomainBadge } from './DomainBadge'
import { QuestionFeedback } from './QuestionFeedback'
import { QuestionView } from './QuestionView'
import { QuestionSourceBadge } from './ProvenanceBadge'

interface PracticeSessionProps {
  questions: Question[]
  onFinish: (results: { question: Question; correct: boolean }[]) => void
}

export function PracticeSession({ questions, onFinish }: PracticeSessionProps) {
  const { recordAnswer } = useClaudeProgress()
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<{ question: Question; correct: boolean }[]>([])

  const question = questions[index]
  const isLast = index === questions.length - 1

  function submit() {
    const correct = isCorrect(question, selected)
    recordAnswer(question.id, correct)
    setResults((current) => [...current, { question, correct }])
    setSubmitted(true)
  }

  function next() {
    if (isLast) {
      onFinish(results)
      return
    }
    setIndex(index + 1)
    setSelected([])
    setSubmitted(false)
  }

  return (
    <section className="card">
      <div className="form-title">
        <span className="muted small">Question {index + 1} of {questions.length}</span>
        <div className="challenge-card-meta">
          <DomainBadge domainId={question.domainId} />
          <Badge>{question.difficulty}</Badge>
          <QuestionSourceBadge source={question.sourceType} />
        </div>
      </div>
      <ProgressBar percent={(index / questions.length) * 100} label="Practice progress" />

      <QuestionView
        question={question}
        selected={selected}
        onToggle={(optionId) => setSelected((current) => nextSelection(question, current, optionId))}
        locked={submitted}
      />

      {!submitted ? (
        <button type="button" className="button" disabled={selected.length === 0} onClick={submit}>
          Submit answer
        </button>
      ) : (
        <>
          <QuestionFeedback question={question} selected={selected} />
          <button type="button" className="button" onClick={next}>
            {isLast ? 'See results' : 'Next question'}
          </button>
        </>
      )}
    </section>
  )
}
