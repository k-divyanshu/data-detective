import type { Difficulty, Question } from '../types'

export type DifficultyFilter = Difficulty | 'any'
export type RandomSource = () => number // returns [0, 1); injectable so tests are deterministic

export interface PracticeConfig {
  domainId: string | 'all'
  difficulty: DifficultyFilter
  count: number
}

// Fisher-Yates shuffle. Returns a new array.
export function shuffle<T>(items: T[], random: RandomSource = Math.random): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

function matches(question: Question, domainId: string | 'all', difficulty: DifficultyFilter): boolean {
  return (
    (domainId === 'all' || question.domainId === domainId) &&
    (difficulty === 'any' || question.difficulty === difficulty)
  )
}

export function availableCount(bank: Question[], domainId: string | 'all', difficulty: DifficultyFilter): number {
  return bank.filter((question) => matches(question, domainId, difficulty)).length
}

// Shuffles each question's options. Authored questions list the right answer first, so anything
// shown to a learner must go through this, otherwise "always pick A" would pass.
export function withShuffledOptions(questions: Question[], random: RandomSource = Math.random): Question[] {
  return questions.map((question) => ({ ...question, options: shuffle(question.options, random) }))
}

// Picks a random subset of matching questions, in random order, with shuffled options.
export function selectQuestions(bank: Question[], config: PracticeConfig, random: RandomSource = Math.random): Question[] {
  const pool = bank.filter((question) => matches(question, config.domainId, config.difficulty))
  return withShuffledOptions(shuffle(pool, random).slice(0, Math.max(0, config.count)), random)
}

// "Select all that apply" questions need the exact set: no missing and no extra options.
export function isCorrect(question: Question, selected: string[]): boolean {
  const chosen = new Set(selected)
  return chosen.size === question.correctAnswer.length && question.correctAnswer.every((id) => chosen.has(id))
}

// Single-answer questions replace the selection; multiple-response questions toggle it.
export function nextSelection(question: Question, selected: string[], optionId: string): string[] {
  if (question.type === 'single') return [optionId]
  return selected.includes(optionId) ? selected.filter((id) => id !== optionId) : [...selected, optionId]
}
