import { useState } from 'react'
import type { Question } from '../types'
import { gradeSqlAnswer } from '../utils/sqlEngine'
import { Badge } from './Badge'
import { CodeBlock } from './CodeBlock'

interface AnswerFormProps {
  questions: Question[]
  alreadyCompleted: boolean
  onAllCorrect: () => void
}

interface QuestionResult {
  correct: boolean
  message?: string // specific feedback that replaces the question's generic hint
}

// Hints are written to follow "Not quite — ", so they start in lowercase.
function asSentence(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

async function gradeQuestion(question: Question, given: string): Promise<QuestionResult> {
  switch (question.kind) {
    case 'number':
      return { correct: Number(given) === question.answer }
    case 'choice':
      return { correct: given === question.answer }
    case 'sql':
      return gradeSqlAnswer(question.tables, given, question.expectedSql)
  }
}

export function AnswerForm({ questions, alreadyCompleted, onAllCorrect }: AnswerFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  // question id -> outcome of the last submit. null until the first submit.
  const [results, setResults] = useState<Record<string, QuestionResult> | null>(null)
  const [checking, setChecking] = useState(false)
  // question id -> has the user asked to see the hint / the reference query?
  const [shownHints, setShownHints] = useState<Record<string, boolean>>({})
  const [shownSolutions, setShownSolutions] = useState<Record<string, boolean>>({})

  const allAnswered = questions.every((question) => (answers[question.id] ?? '').trim() !== '')
  const allCorrect = results !== null && questions.every((question) => results[question.id]?.correct)

  function setAnswer(questionId: string, value: string) {
    setAnswers((current) => ({ ...current, [questionId]: value }))
  }

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setChecking(true)
    try {
      // SQL answers are graded by actually running them, so grading is asynchronous.
      const graded = await Promise.all(
        questions.map((question) => gradeQuestion(question, answers[question.id] ?? '')),
      )
      const nextResults: Record<string, QuestionResult> = {}
      questions.forEach((question, index) => {
        nextResults[question.id] = graded[index]
      })
      setResults(nextResults)
      if (graded.every((result) => result.correct)) onAllCorrect()
    } finally {
      setChecking(false)
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="form-title">
        <h2>Your investigation</h2>
        {alreadyCompleted && <Badge tone="green">Completed</Badge>}
      </div>

      {questions.map((question, index) => {
        const result = results?.[question.id]
        return (
          <fieldset key={question.id} className="field">
            <legend>
              {index + 1}. {question.prompt}
            </legend>

            {question.kind === 'number' && (
              <input
                type="number"
                min={0}
                aria-label={question.prompt}
                value={answers[question.id] ?? ''}
                onChange={(event) => setAnswer(question.id, event.target.value)}
              />
            )}

            {question.kind === 'choice' && (
              <div className="options">
                {question.options.map((option) => (
                  <label key={option.value} className="option">
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={answers[question.id] === option.value}
                      onChange={() => setAnswer(question.id, option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            )}

            {question.kind === 'sql' && (
              <textarea
                className="sql-input"
                aria-label={question.prompt}
                placeholder="SELECT ..."
                spellCheck={false}
                rows={4}
                value={answers[question.id] ?? ''}
                onChange={(event) => setAnswer(question.id, event.target.value)}
              />
            )}

            <div className="help-row">
              {!shownHints[question.id] && (
                <button
                  type="button"
                  className="link-button"
                  onClick={() => setShownHints((current) => ({ ...current, [question.id]: true }))}
                >
                  Show hint
                </button>
              )}
              {question.kind === 'sql' && !shownSolutions[question.id] && (
                <button
                  type="button"
                  className="link-button"
                  onClick={() => setShownSolutions((current) => ({ ...current, [question.id]: true }))}
                >
                  Show solution
                </button>
              )}
            </div>

            {shownHints[question.id] && (
              <p className="hint-box">
                <strong>Hint:</strong> {asSentence(question.hint)}
              </p>
            )}
            {question.kind === 'sql' && shownSolutions[question.id] && (
              <div className="solution-box">
                <p className="muted small">One possible solution. Other queries that return the same result also count.</p>
                <CodeBlock language="sql" code={question.expectedSql} />
              </div>
            )}

            {result && (
              <Badge tone={result.correct ? 'green' : 'red'}>
                {result.correct ? 'Correct' : `Not quite — ${result.message ?? question.hint}`}
              </Badge>
            )}
          </fieldset>
        )
      })}

      <button type="submit" className="button" disabled={!allAnswered || checking}>
        {checking ? 'Checking…' : 'Submit Answer'}
      </button>

      {allCorrect && (
        <p className="success-note">Challenge complete! Your progress has been saved.</p>
      )}
    </form>
  )
}
