import type { Question } from '../types'

interface QuestionViewProps {
  question: Question
  selected: string[]
  onToggle: (optionId: string) => void
  locked: boolean // true after the answer was submitted: shows right/wrong on each option
}

export function QuestionView({ question, selected, onToggle, locked }: QuestionViewProps) {
  const multiple = question.type === 'multiple'

  return (
    <fieldset className="question" disabled={locked}>
      <legend className="question-text">{question.question}</legend>
      <p className="muted small">{multiple ? 'Select all that apply.' : 'Select one answer.'}</p>

      <div className="options">
        {question.options.map((option) => {
          const isSelected = selected.includes(option.id)
          const isRight = question.correctAnswer.includes(option.id)
          let state = ''
          if (locked && isRight) state = 'option-right'
          else if (locked && isSelected) state = 'option-wrong'

          return (
            <label key={option.id} className={`option ${state}`}>
              <input
                type={multiple ? 'checkbox' : 'radio'}
                name={question.id}
                checked={isSelected}
                onChange={() => onToggle(option.id)}
              />
              <span>{option.text}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
