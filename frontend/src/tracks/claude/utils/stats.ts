import { calculateStreak } from '../../../shared/utils/progress'
import type { ClaudeProgressData, ExamDomain, Question } from '../types'

// A domain is a "weak area" once you have enough attempts and score below the threshold.
export const WEAK_MIN_ATTEMPTS = 3
export const WEAK_ACCURACY_BELOW = 70

export interface DomainStat {
  domainId: string
  attempts: number
  accuracy: number | null // percent; null when there are no attempts yet
}

export interface ClaudeStats {
  coveragePercent: number // share of the question bank answered correctly at least once
  accuracyPercent: number | null
  totalAttempts: number
  mockCount: number
  streak: number
  domainStats: DomainStat[]
  weakDomainIds: string[]
}

export const emptyProgress: ClaudeProgressData = { attempts: {}, mockResults: [], activeDays: [] }

export function computeStats(
  progress: ClaudeProgressData,
  questions: Pick<Question, 'id' | 'domainId'>[],
  domains: Pick<ExamDomain, 'id'>[],
  today: Date = new Date(),
): ClaudeStats {
  const domainOf = new Map(questions.map((question) => [question.id, question.domainId]))
  const tally = new Map(domains.map((domain) => [domain.id, { correct: 0, wrong: 0 }]))

  let correctTotal = 0
  let wrongTotal = 0
  let solvedQuestions = 0

  for (const [questionId, record] of Object.entries(progress.attempts)) {
    const domainId = domainOf.get(questionId)
    if (domainId === undefined) continue // question was removed from the bank
    const domain = tally.get(domainId)
    if (domain) {
      domain.correct += record.correct
      domain.wrong += record.wrong
    }
    correctTotal += record.correct
    wrongTotal += record.wrong
    if (record.correct > 0) solvedQuestions += 1
  }

  const totalAttempts = correctTotal + wrongTotal
  const domainStats: DomainStat[] = domains.map((domain) => {
    const { correct, wrong } = tally.get(domain.id) ?? { correct: 0, wrong: 0 }
    const attempts = correct + wrong
    return { domainId: domain.id, attempts, accuracy: attempts === 0 ? null : (correct / attempts) * 100 }
  })

  return {
    coveragePercent: questions.length === 0 ? 0 : (solvedQuestions / questions.length) * 100,
    accuracyPercent: totalAttempts === 0 ? null : (correctTotal / totalAttempts) * 100,
    totalAttempts,
    mockCount: progress.mockResults.length,
    streak: calculateStreak(progress.activeDays, today),
    domainStats,
    weakDomainIds: domainStats
      .filter((stat) => stat.attempts >= WEAK_MIN_ATTEMPTS && stat.accuracy !== null && stat.accuracy < WEAK_ACCURACY_BELOW)
      .sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0))
      .map((stat) => stat.domainId),
  }
}
