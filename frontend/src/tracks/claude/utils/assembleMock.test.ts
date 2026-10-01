import { describe, expect, it } from 'vitest'
import { assembleMock, allocateByWeight } from './assembleMock'
import { makeQuestion, seededRandom } from './testFixtures'

const domains = [
  { id: 'big', weightPercent: 50 },
  { id: 'mid', weightPercent: 30 },
  { id: 'small', weightPercent: 20 },
]

describe('allocateByWeight', () => {
  it('follows the weights and always adds up to the total', () => {
    const counts = allocateByWeight(domains, { big: 99, mid: 99, small: 99 }, 10)
    expect(counts).toEqual({ big: 5, mid: 3, small: 2 })
    for (const total of [7, 10, 25, 53]) {
      const result = allocateByWeight(domains, { big: 99, mid: 99, small: 99 }, total)
      expect(Object.values(result).reduce((a, b) => a + b, 0)).toBe(total)
    }
  })

  it('gives rounding leftovers to the largest remainders', () => {
    // 7 * 50% = 3.5, 7 * 30% = 2.1, 7 * 20% = 1.4 -> floors 3,2,1 + one extra seat for 'big' (0.5)
    expect(allocateByWeight(domains, { big: 99, mid: 99, small: 99 }, 7)).toEqual({ big: 4, mid: 2, small: 1 })
  })

  it('caps a domain at the questions available and redistributes the surplus', () => {
    const counts = allocateByWeight(domains, { big: 2, mid: 99, small: 99 }, 10)
    expect(counts.big).toBe(2)
    expect(Object.values(counts).reduce((a, b) => a + b, 0)).toBe(10)
  })

  it('returns as many as possible when the bank is too small', () => {
    const counts = allocateByWeight(domains, { big: 1, mid: 1, small: 1 }, 10)
    expect(Object.values(counts).reduce((a, b) => a + b, 0)).toBe(3)
  })
})

describe('assembleMock', () => {
  const bank = [
    ...Array.from({ length: 8 }, (_, i) => makeQuestion({ id: `big${i}`, domainId: 'big' })),
    ...Array.from({ length: 8 }, (_, i) => makeQuestion({ id: `mid${i}`, domainId: 'mid' })),
    ...Array.from({ length: 8 }, (_, i) => makeQuestion({ id: `small${i}`, domainId: 'small' })),
  ]

  it('picks the requested number of distinct questions, weighted by domain', () => {
    const mock = assembleMock(bank, domains, 10, seededRandom(5))
    expect(mock).toHaveLength(10)
    expect(new Set(mock.map((q) => q.id)).size).toBe(10)
    expect(mock.filter((q) => q.domainId === 'big')).toHaveLength(5)
    expect(mock.filter((q) => q.domainId === 'small')).toHaveLength(2)
  })

  it('varies between attempts', () => {
    const first = assembleMock(bank, domains, 10, seededRandom(1)).map((q) => q.id).join()
    const second = assembleMock(bank, domains, 10, seededRandom(2)).map((q) => q.id).join()
    expect(first).not.toBe(second)
  })
})
