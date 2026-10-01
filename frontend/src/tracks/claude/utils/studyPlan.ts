import type { ExamDomain, MockExam, Resource } from '../types'
import { allocateByWeight } from './assembleMock'
import type { DomainStat } from './stats'
import { WEAK_ACCURACY_BELOW, WEAK_MIN_ATTEMPTS } from './stats'

export interface StudyTask {
  type: 'read' | 'practice' | 'mock'
  label: string
  minutes: number
  resourceId?: string
  domainId?: string
  questionCount?: number
  mockId?: string
}

export interface StudyDay {
  day: number
  domainId?: string // the focus domain (undefined on a mock day)
  title: string
  tasks: StudyTask[]
  minutes: number
}

export interface StudyPlanInput {
  days: number
  minutesPerDay: number
  domains: ExamDomain[]
  domainStats: DomainStat[] // from computeStats; accuracy is null until the learner has practised
  resources: Resource[]
  questionCountByDomain: Record<string, number>
  mocks: MockExam[]
}

// Rough planning estimates, shown as such in the UI.
export const READ_MINUTES = 25
export const MINUTES_PER_QUESTION = 2.3
const MIN_DAYS_FOR_MOCK = 5

// How much a domain needs attention: exam weight x how much of it you have not yet mastered.
// Unpractised domains count as unmastered; weak domains get a boost; every domain keeps a small
// floor so nothing disappears from the plan once it looks strong.
export function domainNeed(domain: ExamDomain, stat: DomainStat | undefined): number {
  const weight = domain.weightPercent ?? 100 / 8
  const practised = stat !== undefined && stat.accuracy !== null && stat.attempts >= WEAK_MIN_ATTEMPTS
  const mastery = practised ? (stat.accuracy as number) / 100 : 0
  const weakBoost = practised && (stat.accuracy as number) < WEAK_ACCURACY_BELOW ? 1.5 : 1
  return Math.max(weight * (1 - mastery) * weakBoost, weight * 0.1)
}

// Official, beginner-friendly material first.
function readingOrder(resources: Resource[], domainId: string): Resource[] {
  const rank = { beginner: 0, intermediate: 1, advanced: 2 }
  const readable = new Set(['course', 'documentation', 'article', 'tutorial', 'study-guide'])
  return resources
    .filter((r) => r.active && r.domainIds.includes(domainId) && readable.has(r.type))
    .sort(
      (a, b) =>
        Number(b.source === 'official') - Number(a.source === 'official') ||
        rank[a.difficulty] - rank[b.difficulty] ||
        a.title.localeCompare(b.title),
    )
}

// Spread the slots so the same domain is not studied two days in a row when avoidable.
function sequenceDomains(slots: Record<string, number>, priority: string[]): string[] {
  const remaining = { ...slots }
  const sequence: string[] = []
  const total = Object.values(slots).reduce((a, b) => a + b, 0)
  for (let step = 0; step < total; step++) {
    const last = sequence[sequence.length - 1]
    const candidates = priority.filter((id) => remaining[id] > 0)
    const pick = candidates.filter((id) => id !== last).sort((a, b) => remaining[b] - remaining[a])[0] ?? candidates[0]
    sequence.push(pick)
    remaining[pick] -= 1
  }
  return sequence
}

export function buildStudyPlan(input: StudyPlanInput): StudyDay[] {
  const { days, minutesPerDay, domains, domainStats, resources, questionCountByDomain, mocks } = input
  if (days < 1) return []

  const includeMock = days >= MIN_DAYS_FOR_MOCK && mocks.length > 0
  const studyDays = includeMock ? days - 1 : days

  // 1. Decide how many study days each domain gets, in proportion to its need.
  const need = domains.map((domain) => ({
    id: domain.id,
    weightPercent: domainNeed(domain, domainStats.find((stat) => stat.domainId === domain.id)),
  }))
  const unlimited = Object.fromEntries(domains.map((domain) => [domain.id, Number.MAX_SAFE_INTEGER]))
  const slots = allocateByWeight(need, unlimited, studyDays)
  const priority = [...need].sort((a, b) => b.weightPercent - a.weightPercent).map((entry) => entry.id)
  const sequence = sequenceDomains(slots, priority)

  // 2. Fill each day with reading and practice that fit the time available.
  const visits: Record<string, number> = {}
  const plan: StudyDay[] = sequence.map((domainId, index) => {
    const domain = domains.find((d) => d.id === domainId) as ExamDomain
    const visit = visits[domainId] ?? 0
    visits[domainId] = visit + 1
    const material = readingOrder(resources, domainId)

    const readCount = material.length === 0 ? 0 : Math.max(1, Math.floor((minutesPerDay * 0.5) / READ_MINUTES))
    const tasks: StudyTask[] = []
    for (let i = 0; i < readCount; i++) {
      const resource = material[(visit * readCount + i) % material.length]
      tasks.push({ type: 'read', label: resource.title, minutes: READ_MINUTES, resourceId: resource.id, domainId })
    }

    const readMinutes = tasks.reduce((sum, task) => sum + task.minutes, 0)
    const available = questionCountByDomain[domainId] ?? 0
    const wanted = Math.round(((minutesPerDay - readMinutes) / MINUTES_PER_QUESTION) / 5) * 5
    const questionCount = Math.min(available, Math.max(5, wanted))
    if (questionCount > 0) {
      tasks.push({
        type: 'practice',
        label: `Answer ${questionCount} practice questions`,
        minutes: Math.round(questionCount * MINUTES_PER_QUESTION),
        domainId,
        questionCount,
      })
    }

    return {
      day: index + 1,
      domainId,
      title: domain.name,
      tasks,
      minutes: tasks.reduce((sum, task) => sum + task.minutes, 0),
    }
  })

  // 3. Finish with a timed mock that fits the daily time.
  if (includeMock) {
    const fitting = [...mocks].sort((a, b) => b.durationMinutes - a.durationMinutes).find((mock) => mock.durationMinutes <= minutesPerDay)
    const mock = fitting ?? [...mocks].sort((a, b) => a.durationMinutes - b.durationMinutes)[0]
    plan.push({
      day: days,
      title: 'Timed mock exam',
      tasks: [{ type: 'mock', label: mock.title, minutes: mock.durationMinutes, mockId: mock.id }],
      minutes: mock.durationMinutes,
    })
  }
  return plan
}
