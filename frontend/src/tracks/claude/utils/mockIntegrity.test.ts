import { describe, expect, it } from 'vitest'
import { examDomains } from '../data/exam'
import { mockExams } from '../data/mockExams'
import { questionBank } from '../data/questions'
import { allocateByWeight, assembleMock } from './assembleMock'
import { scoreMock } from './mock'

// Builds many real mocks from the real bank and checks that every one is a fair, correctly graded exam.
const ATTEMPTS = 300
const bankById = new Map(questionBank.map((question) => [question.id, question]))
const available: Record<string, number> = {}
for (const question of questionBank) available[question.domainId] = (available[question.domainId] ?? 0) + 1

describe.each(mockExams)('$title', (exam) => {
  const expectedCounts = allocateByWeight(examDomains, available, exam.questionCount)

  it('always has the right size, no repeats, and the weighted domain mix', () => {
    for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
      const mock = assembleMock(questionBank, examDomains, exam.questionCount)
      expect(mock).toHaveLength(exam.questionCount)
      expect(new Set(mock.map((question) => question.id)).size).toBe(exam.questionCount)

      const counts: Record<string, number> = {}
      for (const question of mock) counts[question.domainId] = (counts[question.domainId] ?? 0) + 1
      for (const domain of examDomains) expect(counts[domain.id] ?? 0).toBe(expectedCounts[domain.id])
    }
  })

  it('keeps every answer key attached to the same option text after shuffling', () => {
    for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
      for (const question of assembleMock(questionBank, examDomains, exam.questionCount)) {
        const original = bankById.get(question.id)!
        expect(question.correctAnswer).toEqual(original.correctAnswer)
        const textOf = (q: typeof question) => Object.fromEntries(q.options.map((option) => [option.id, option.text]))
        expect(textOf(question)).toEqual(textOf(original))
        expect(question.options).toHaveLength(original.options.length)
      }
    }
  })

  it('scores 100% for the answer key, 0% for wrong or partial answers', () => {
    for (let attempt = 0; attempt < 50; attempt += 1) {
      const mock = assembleMock(questionBank, examDomains, exam.questionCount)
      const perfect = Object.fromEntries(mock.map((question) => [question.id, question.correctAnswer]))
      expect(scoreMock(mock, perfect).percent).toBe(100)

      const wrong = Object.fromEntries(
        mock.map((question) => [
          question.id,
          question.type === 'multiple'
            ? question.correctAnswer.slice(1) // partial credit is not given
            : [question.options.find((option) => !question.correctAnswer.includes(option.id))!.id],
        ]),
      )
      expect(scoreMock(mock, wrong).correct).toBe(0)
      expect(scoreMock(mock, {}).unansweredCount).toBe(exam.questionCount)
    }
  })
})
