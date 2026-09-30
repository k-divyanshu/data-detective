import { describe, expect, it } from 'vitest'
import { availableCount, isCorrect, nextSelection, selectQuestions, shuffle, withShuffledOptions } from './practice'
import { makeQuestion, seededRandom } from './testFixtures'

const bank = [
  makeQuestion({ id: 'q1', domainId: 'tools', difficulty: 'beginner' }),
  makeQuestion({ id: 'q2', domainId: 'tools', difficulty: 'advanced' }),
  makeQuestion({ id: 'q3', domainId: 'agents', difficulty: 'beginner' }),
  makeQuestion({ id: 'q4', domainId: 'agents', difficulty: 'intermediate' }),
]

describe('shuffle', () => {
  it('keeps every item and does not change the input', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffle(input, seededRandom(1))
    expect([...result].sort()).toEqual([1, 2, 3, 4, 5])
    expect(input).toEqual([1, 2, 3, 4, 5])
  })
})

describe('selectQuestions', () => {
  it('filters by domain and difficulty', () => {
    const result = selectQuestions(bank, { domainId: 'tools', difficulty: 'beginner', count: 10 }, seededRandom(2))
    expect(result.map((q) => q.id)).toEqual(['q1'])
  })

  it('limits to the requested count, and never returns more than exist', () => {
    expect(selectQuestions(bank, { domainId: 'all', difficulty: 'any', count: 2 }, seededRandom(3))).toHaveLength(2)
    expect(selectQuestions(bank, { domainId: 'all', difficulty: 'any', count: 99 }, seededRandom(3))).toHaveLength(4)
  })

  it('shuffles options but keeps the same set', () => {
    const [question] = selectQuestions(bank, { domainId: 'agents', difficulty: 'beginner', count: 1 }, seededRandom(4))
    expect(question.options.map((o) => o.id).sort()).toEqual(['a', 'b', 'c'])
    expect(question.correctAnswer).toEqual(['a'])
  })

  it('handles a zero or negative count', () => {
    expect(selectQuestions(bank, { domainId: 'all', difficulty: 'any', count: 0 })).toEqual([])
    expect(selectQuestions(bank, { domainId: 'all', difficulty: 'any', count: -3 })).toEqual([])
  })
})

describe('availableCount', () => {
  it('counts matching questions', () => {
    expect(availableCount(bank, 'all', 'any')).toBe(4)
    expect(availableCount(bank, 'agents', 'any')).toBe(2)
    expect(availableCount(bank, 'tools', 'intermediate')).toBe(0)
  })
})

describe('isCorrect', () => {
  const single = makeQuestion({ id: 's', correctAnswer: ['a'] })
  const multiple = makeQuestion({ id: 'm', type: 'multiple', correctAnswer: ['a', 'c'], whyIncorrect: { b: 'no' } })

  it('grades single-answer questions', () => {
    expect(isCorrect(single, ['a'])).toBe(true)
    expect(isCorrect(single, ['b'])).toBe(false)
    expect(isCorrect(single, [])).toBe(false)
  })

  it('requires the exact set for multiple-response questions', () => {
    expect(isCorrect(multiple, ['c', 'a'])).toBe(true)
    expect(isCorrect(multiple, ['a'])).toBe(false) // missing one
    expect(isCorrect(multiple, ['a', 'b', 'c'])).toBe(false) // one extra
    expect(isCorrect(multiple, ['a', 'a'])).toBe(false) // duplicates don't count twice
  })
})

describe('nextSelection', () => {
  const single = makeQuestion({ id: 's' })
  const multiple = makeQuestion({ id: 'm', type: 'multiple', correctAnswer: ['a', 'c'], whyIncorrect: { b: 'no' } })

  it('replaces the choice for single-answer questions', () => {
    expect(nextSelection(single, ['a'], 'b')).toEqual(['b'])
  })

  it('toggles options for multiple-response questions', () => {
    expect(nextSelection(multiple, [], 'a')).toEqual(['a'])
    expect(nextSelection(multiple, ['a'], 'c')).toEqual(['a', 'c'])
    expect(nextSelection(multiple, ['a', 'c'], 'a')).toEqual(['c'])
  })
})

describe('withShuffledOptions', () => {
  it('does not change the answer key or the set of options', () => {
    const [shuffled] = withShuffledOptions([makeQuestion({ id: 'x' })], seededRandom(9))
    expect(shuffled.options.map((o) => o.id).sort()).toEqual(['a', 'b', 'c'])
    expect(shuffled.correctAnswer).toEqual(['a'])
  })

  it('moves the correct answer around, so the first option is not always right', () => {
    const questions = Array.from({ length: 40 }, (_, index) => makeQuestion({ id: `q${index}` }))
    const random = seededRandom(123)
    const firstOptionIsCorrect = withShuffledOptions(questions, random).filter(
      (question) => question.options[0].id === question.correctAnswer[0],
    ).length
    // Unshuffled it would be 40 of 40; a fair shuffle puts the answer first about a third of the time.
    expect(firstOptionIsCorrect).toBeGreaterThan(3)
    expect(firstOptionIsCorrect).toBeLessThan(25)
  })
})
