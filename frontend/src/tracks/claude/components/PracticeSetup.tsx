import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { examDomains } from '../data/exam'
import { questionBank } from '../data/questions'
import { availableCount, type DifficultyFilter, type PracticeConfig } from '../utils/practice'

const COUNT_CHOICES = [5, 10, 15, 20]

export function PracticeSetup({ onStart }: { onStart: (config: PracticeConfig) => void }) {
  // Links such as the study plan can pre-select a domain and size: /claude/practice?domain=tools-mcp&count=10
  const [params] = useSearchParams()
  const domainParam = params.get('domain')
  const countParam = Number(params.get('count'))
  const [domainId, setDomainId] = useState<string>(
    examDomains.some((domain) => domain.id === domainParam) ? (domainParam as string) : 'all',
  )
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('any')
  const [count, setCount] = useState(COUNT_CHOICES.includes(countParam) ? countParam : 10)

  const available = availableCount(questionBank, domainId, difficulty)
  const actualCount = Math.min(count, available)

  return (
    <form
      className="card practice-setup"
      onSubmit={(event) => {
        event.preventDefault()
        onStart({ domainId, difficulty, count })
      }}
    >
      <h2>Choose your practice set</h2>

      <div className="field">
        <label htmlFor="practice-domain">Domain</label>
        <select id="practice-domain" value={domainId} onChange={(event) => setDomainId(event.target.value)}>
          <option value="all">All domains</option>
          {examDomains.map((domain) => (
            <option key={domain.id} value={domain.id}>
              {domain.name} ({availableCount(questionBank, domain.id, difficulty)})
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="practice-difficulty">Difficulty</label>
        <select
          id="practice-difficulty"
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value as DifficultyFilter)}
        >
          <option value="any">Any difficulty</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="practice-count">Number of questions</label>
        <select id="practice-count" value={count} onChange={(event) => setCount(Number(event.target.value))}>
          {COUNT_CHOICES.map((choice) => (
            <option key={choice} value={choice}>{choice}</option>
          ))}
        </select>
      </div>

      {available === 0 ? (
        <p className="muted">No practice questions match this selection yet. Try another domain or difficulty.</p>
      ) : (
        <p className="muted small">
          {available} matching {available === 1 ? 'question' : 'questions'} available
          {actualCount < count ? `; this set will have ${actualCount}.` : '.'}
        </p>
      )}

      <button type="submit" className="button" disabled={available === 0}>Start Practice</button>
    </form>
  )
}
