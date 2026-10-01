import { describe, expect, it } from 'vitest'
import type { ExamDomain, MockExam } from '../types'
import type { DomainStat } from './stats'
import { buildStudyPlan, domainNeed, type StudyPlanInput } from './studyPlan'
import { makeResource } from './testFixtures'

const domain = (id: string, weightPercent: number): ExamDomain => ({
  id, name: id, shortName: id, weightPercent, description: '', topics: [],
})
const domains = [domain('big', 50), domain('mid', 30), domain('small', 20)]
const mocks: MockExam[] = [
  { id: 'quick', title: 'Quick', description: '', questionCount: 10, durationMinutes: 23 },
  { id: 'half', title: 'Half', description: '', questionCount: 25, durationMinutes: 57 },
  { id: 'full', title: 'Full', description: '', questionCount: 53, durationMinutes: 120 },
]
const resources = ['big', 'mid', 'small'].flatMap((id) => [
  makeResource({ id: `${id}-community`, domainIds: [id], source: 'community', difficulty: 'beginner', title: `${id} community` }),
  makeResource({ id: `${id}-adv`, domainIds: [id], difficulty: 'advanced', title: `${id} advanced` }),
  makeResource({ id: `${id}-beg`, domainIds: [id], difficulty: 'beginner', title: `${id} beginner` }),
])
const noStats: DomainStat[] = domains.map((d) => ({ domainId: d.id, attempts: 0, accuracy: null }))

function input(overrides: Partial<StudyPlanInput> = {}): StudyPlanInput {
  return {
    days: 7, minutesPerDay: 60, domains, domainStats: noStats, resources, mocks,
    questionCountByDomain: { big: 40, mid: 20, small: 12 }, ...overrides,
  }
}

describe('domainNeed', () => {
  it('treats unpractised domains as fully unmastered', () => {
    expect(domainNeed(domains[0], undefined)).toBe(50)
    expect(domainNeed(domains[0], { domainId: 'big', attempts: 2, accuracy: 100 })).toBe(50) // too few attempts to trust
  })

  it('lowers need as accuracy rises, with a small floor, and boosts weak domains', () => {
    const strong = domainNeed(domains[0], { domainId: 'big', attempts: 10, accuracy: 100 })
    expect(strong).toBe(5) // floor of 10% of the weight
    const weak = domainNeed(domains[0], { domainId: 'big', attempts: 10, accuracy: 40 })
    expect(weak).toBeCloseTo(50 * 0.6 * 1.5)
  })
})

describe('buildStudyPlan', () => {
  it('gives the requested number of days and ends with a mock when there is room', () => {
    const plan = buildStudyPlan(input({ days: 7 }))
    expect(plan).toHaveLength(7)
    expect(plan[6].tasks[0].type).toBe('mock')
    expect(plan.slice(0, 6).every((day) => day.domainId !== undefined)).toBe(true)
  })

  it('skips the mock for very short plans', () => {
    const plan = buildStudyPlan(input({ days: 3 }))
    expect(plan).toHaveLength(3)
    expect(plan.some((day) => day.tasks.some((task) => task.type === 'mock'))).toBe(false)
  })

  it('spends more days on heavier and weaker domains', () => {
    const fresh = buildStudyPlan(input({ days: 11 })).filter((d) => d.domainId)
    const count = (plan: typeof fresh, id: string) => plan.filter((d) => d.domainId === id).length
    expect(count(fresh, 'big')).toBeGreaterThan(count(fresh, 'small'))

    const smallIsWeak: DomainStat[] = [
      { domainId: 'big', attempts: 10, accuracy: 95 },
      { domainId: 'mid', attempts: 10, accuracy: 95 },
      { domainId: 'small', attempts: 10, accuracy: 20 },
    ]
    const adapted = buildStudyPlan(input({ days: 11, domainStats: smallIsWeak })).filter((d) => d.domainId)
    expect(count(adapted, 'small')).toBeGreaterThan(count(fresh, 'small'))
  })

  it('avoids studying the same domain on consecutive days when possible', () => {
    const plan = buildStudyPlan(input({ days: 10 })).filter((d) => d.domainId)
    for (let i = 1; i < plan.length; i++) expect(plan[i].domainId).not.toBe(plan[i - 1].domainId)
  })

  it('reads official, beginner material first and moves on over repeat visits', () => {
    const plan = buildStudyPlan(input({ days: 12, minutesPerDay: 30 })).filter((d) => d.domainId === 'big')
    const reads = plan.flatMap((d) => d.tasks.filter((t) => t.type === 'read').map((t) => t.resourceId))
    expect(reads[0]).toBe('big-beg')
    expect(reads[1]).toBe('big-adv')
    expect(reads).not.toContain(undefined)
  })

  it('caps practice at the questions that exist and fits the daily time', () => {
    const plan = buildStudyPlan(input({ days: 6, minutesPerDay: 120, questionCountByDomain: { big: 8, mid: 8, small: 8 } }))
    for (const day of plan) for (const task of day.tasks) if (task.type === 'practice') expect(task.questionCount).toBeLessThanOrEqual(8)
    const study = buildStudyPlan(input({ days: 6, minutesPerDay: 60 })).filter((d) => d.domainId)
    for (const day of study) expect(day.minutes).toBeLessThanOrEqual(60 + 10)
  })

  it('picks a mock that fits the daily time', () => {
    const mockTask = (minutes: number) => buildStudyPlan(input({ days: 6, minutesPerDay: minutes })).at(-1)!.tasks[0].mockId
    expect(mockTask(30)).toBe('quick')
    expect(mockTask(60)).toBe('half')
    expect(mockTask(120)).toBe('full')
    expect(mockTask(15)).toBe('quick') // nothing fits: fall back to the shortest
  })

  it('returns nothing for zero days', () => {
    expect(buildStudyPlan(input({ days: 0 }))).toEqual([])
  })
})
