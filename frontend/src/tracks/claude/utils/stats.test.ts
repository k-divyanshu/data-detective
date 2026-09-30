import { describe, expect, it } from 'vitest'
import type { ClaudeProgressData } from '../types'
import { computeStats, emptyProgress } from './stats'

const questions = [
  { id: 'q1', domainId: 'tools' },
  { id: 'q2', domainId: 'tools' },
  { id: 'q3', domainId: 'agents' },
  { id: 'q4', domainId: 'agents' },
]
const domains = [{ id: 'tools' }, { id: 'agents' }, { id: 'security' }]
const today = new Date(2026, 8, 30)

describe('computeStats', () => {
  it('reports no accuracy and no weak areas before any practice', () => {
    const stats = computeStats(emptyProgress, questions, domains, today)
    expect(stats.accuracyPercent).toBeNull()
    expect(stats.coveragePercent).toBe(0)
    expect(stats.weakDomainIds).toEqual([])
    expect(stats.domainStats.every((d) => d.accuracy === null)).toBe(true)
  })

  it('computes accuracy, coverage and streak', () => {
    const progress: ClaudeProgressData = {
      attempts: { q1: { correct: 2, wrong: 0 }, q2: { correct: 0, wrong: 2 }, q3: { correct: 1, wrong: 1 } },
      mockResults: [],
      activeDays: ['2026-09-29', '2026-09-30'],
    }
    const stats = computeStats(progress, questions, domains, today)
    expect(stats.totalAttempts).toBe(6)
    expect(stats.accuracyPercent).toBeCloseTo((3 / 6) * 100)
    expect(stats.coveragePercent).toBe(50) // q1 and q3 solved at least once, of 4 questions
    expect(stats.streak).toBe(2)
  })

  it('flags a weak area only after enough attempts', () => {
    const fewAttempts: ClaudeProgressData = { ...emptyProgress, attempts: { q1: { correct: 0, wrong: 2 } } }
    expect(computeStats(fewAttempts, questions, domains, today).weakDomainIds).toEqual([])

    const enough: ClaudeProgressData = { ...emptyProgress, attempts: { q1: { correct: 0, wrong: 2 }, q2: { correct: 1, wrong: 1 } } }
    expect(computeStats(enough, questions, domains, today).weakDomainIds).toEqual(['tools'])
  })

  it('ignores attempts for questions that were removed from the bank', () => {
    const progress: ClaudeProgressData = { ...emptyProgress, attempts: { gone: { correct: 5, wrong: 5 } } }
    expect(computeStats(progress, questions, domains, today).totalAttempts).toBe(0)
  })

  it('counts completed mock exams', () => {
    const progress: ClaudeProgressData = {
      ...emptyProgress,
      mockResults: [{ id: 'r1', mockId: 'm1', finishedAt: '2026-09-30T10:00:00Z', correct: 1, total: 2, percent: 50, byDomain: {}, durationSeconds: 60 }],
    }
    expect(computeStats(progress, questions, domains, today).mockCount).toBe(1)
  })
})
