import { describe, expect, it } from 'vitest'
import { calculateStreak, toDateKey } from './progress'

// Month is zero-based: (2026, 8, 30) is 30 September 2026, in local time.
const today = new Date(2026, 8, 30)

describe('toDateKey', () => {
  it('formats local dates as YYYY-MM-DD with zero padding', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(toDateKey(new Date(2026, 11, 31))).toBe('2026-12-31')
  })
})

describe('calculateStreak', () => {
  it('is 0 with no activity', () => {
    expect(calculateStreak([], today)).toBe(0)
  })

  it('is 1 when only today is active', () => {
    expect(calculateStreak(['2026-09-30'], today)).toBe(1)
  })

  it('counts consecutive days ending today', () => {
    expect(calculateStreak(['2026-09-28', '2026-09-29', '2026-09-30'], today)).toBe(3)
  })

  it('keeps the streak alive when the last activity was yesterday', () => {
    expect(calculateStreak(['2026-09-28', '2026-09-29'], today)).toBe(2)
  })

  it('resets to 0 when the last activity was two or more days ago', () => {
    expect(calculateStreak(['2026-09-27', '2026-09-28'], today)).toBe(0)
  })

  it('stops counting at the first gap', () => {
    expect(calculateStreak(['2026-09-25', '2026-09-26', '2026-09-29', '2026-09-30'], today)).toBe(2)
  })

  it('ignores order and duplicate entries', () => {
    expect(calculateStreak(['2026-09-30', '2026-09-29', '2026-09-30'], today)).toBe(2)
  })

  it('counts across a month boundary', () => {
    expect(calculateStreak(['2026-09-30', '2026-10-01'], new Date(2026, 9, 1))).toBe(2)
  })
})
