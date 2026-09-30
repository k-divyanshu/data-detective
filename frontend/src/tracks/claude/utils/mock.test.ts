import { describe, expect, it } from 'vitest'
import { formatClock, scoreMock, weakestDomains } from './mock'
import { makeQuestion } from './testFixtures'

const questions = [
  makeQuestion({ id: 'q1', domainId: 'tools' }),
  makeQuestion({ id: 'q2', domainId: 'tools' }),
  makeQuestion({ id: 'q3', domainId: 'agents' }),
  makeQuestion({ id: 'q4', domainId: 'security', type: 'multiple', correctAnswer: ['a', 'b'], whyIncorrect: { c: 'no' } }),
]

describe('scoreMock', () => {
  it('scores overall and per domain', () => {
    const score = scoreMock(questions, { q1: ['a'], q2: ['b'], q3: ['a'], q4: ['a', 'b'] })
    expect(score.correct).toBe(3)
    expect(score.total).toBe(4)
    expect(score.percent).toBe(75)
    expect(score.byDomain.tools).toEqual({ correct: 1, total: 2 })
    expect(score.byDomain.security).toEqual({ correct: 1, total: 1 })
    expect(score.incorrectIds).toEqual(['q2'])
  })

  it('counts unanswered questions as incorrect', () => {
    const score = scoreMock(questions, { q1: ['a'] })
    expect(score.correct).toBe(1)
    expect(score.unansweredCount).toBe(3)
    expect(score.incorrectIds).toEqual(['q2', 'q3', 'q4'])
  })

  it('handles an empty exam', () => {
    expect(scoreMock([], {}).percent).toBe(0)
  })
})

describe('weakestDomains', () => {
  it('orders by lowest score and skips perfect domains', () => {
    const byDomain = {
      tools: { correct: 1, total: 4 },
      agents: { correct: 3, total: 4 },
      security: { correct: 2, total: 2 },
    }
    expect(weakestDomains(byDomain, 2)).toEqual(['tools', 'agents'])
  })
})

describe('formatClock', () => {
  it('formats mm:ss and never goes negative', () => {
    expect(formatClock(0)).toBe('00:00')
    expect(formatClock(65)).toBe('01:05')
    expect(formatClock(3600)).toBe('60:00')
    expect(formatClock(-5)).toBe('00:00')
  })
})
