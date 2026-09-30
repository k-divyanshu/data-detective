import { Badge } from '../../../shared/components/Badge'
import { getResource } from '../data/resources'
import type { Question } from '../types'
import { isCorrect } from '../utils/practice'

export function QuestionFeedback({ question, selected }: { question: Question; selected: string[] }) {
  const correct = isCorrect(question, selected)
  const relatedResources = question.resourceIds.flatMap((id) => getResource(id) ?? [])
  const wrongOptions = question.options.filter((option) => !question.correctAnswer.includes(option.id))

  return (
    <div className={`feedback ${correct ? 'feedback-right' : 'feedback-wrong'}`} role="status">
      <Badge tone={correct ? 'green' : 'red'}>{correct ? 'Correct' : 'Incorrect'}</Badge>

      <h4>Explanation</h4>
      <p>{question.explanation}</p>

      {wrongOptions.length > 0 && (
        <>
          <h4>Why the other options are incorrect</h4>
          <ul className="why-list">
            {wrongOptions.map((option) => (
              <li key={option.id}>
                <strong>{option.text}</strong>
                {selected.includes(option.id) && <span className="muted"> (your choice)</span>}
                <br />
                <span className="muted">{question.whyIncorrect[option.id] ?? 'This option does not answer the question.'}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {relatedResources.length > 0 && (
        <>
          <h4>Related resources</h4>
          <ul className="why-list">
            {relatedResources.map((resource) => (
              <li key={resource.id}>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  {resource.title} ↗
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
