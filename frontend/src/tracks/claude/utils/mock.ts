import type { Question } from '../types'
import { isCorrect } from './practice'

export interface MockScore {
  correct: number
  total: number
  percent: number
  byDomain: Record<string, { correct: number; total: number }>
  incorrectIds: string[] // wrong or unanswered
  unansweredCount: number
}

// answers: question id -> selected option ids (missing or empty = unanswered, counts as wrong).
export function scoreMock(questions: Question[], answers: Record<string, string[]>): MockScore {
  const byDomain: MockScore['byDomain'] = {}
  const incorrectIds: string[] = []
  let correct = 0
  let unansweredCount = 0

  for (const question of questions) {
    const selected = answers[question.id] ?? []
    if (selected.length === 0) unansweredCount += 1

    const domain = (byDomain[question.domainId] ??= { correct: 0, total: 0 })
    domain.total += 1
    if (isCorrect(question, selected)) {
      correct += 1
      domain.correct += 1
    } else {
      incorrectIds.push(question.id)
    }
  }

  const total = questions.length
  return { correct, total, percent: total === 0 ? 0 : (correct / total) * 100, byDomain, incorrectIds, unansweredCount }
}

// Domains ordered from weakest to strongest score, for "study these next".
export function weakestDomains(byDomain: MockScore['byDomain'], limit = 2): string[] {
  return Object.entries(byDomain)
    .filter(([, stat]) => stat.total > 0 && stat.correct < stat.total)
    .sort(([, a], [, b]) => a.correct / a.total - b.correct / b.total)
    .slice(0, limit)
    .map(([domainId]) => domainId)
}

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
