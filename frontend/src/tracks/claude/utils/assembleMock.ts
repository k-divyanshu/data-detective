import type { ExamDomain, Question } from '../types'
import { shuffle, withShuffledOptions, type RandomSource } from './practice'

// How many questions each domain should contribute to a mock of `total` questions.
// Uses the largest-remainder method so the counts add up exactly, then caps each domain at the
// number of questions available and hands any shortfall to the domains that still have spare ones.
export function allocateByWeight(
  domains: Pick<ExamDomain, 'id' | 'weightPercent'>[],
  available: Record<string, number>,
  total: number,
): Record<string, number> {
  const weightSum = domains.reduce((sum, domain) => sum + (domain.weightPercent ?? 0), 0)
  const ideal = domains.map((domain) => ({
    id: domain.id,
    exact: weightSum === 0 ? total / domains.length : ((domain.weightPercent ?? 0) / weightSum) * total,
  }))

  const counts: Record<string, number> = {}
  for (const entry of ideal) counts[entry.id] = Math.floor(entry.exact)

  // Distribute the leftover seats to the largest fractional remainders.
  let leftover = total - Object.values(counts).reduce((sum, count) => sum + count, 0)
  const byRemainder = [...ideal].sort((a, b) => (b.exact % 1) - (a.exact % 1))
  for (const entry of byRemainder) {
    if (leftover <= 0) break
    counts[entry.id] += 1
    leftover -= 1
  }

  // Never ask for more than exist; give the surplus to domains with spare questions (biggest weight first).
  let surplus = 0
  for (const entry of ideal) {
    const cap = available[entry.id] ?? 0
    if (counts[entry.id] > cap) {
      surplus += counts[entry.id] - cap
      counts[entry.id] = cap
    }
  }
  const byWeight = [...domains].sort((a, b) => (b.weightPercent ?? 0) - (a.weightPercent ?? 0))
  while (surplus > 0) {
    const next = byWeight.find((domain) => counts[domain.id] < (available[domain.id] ?? 0))
    if (!next) break // not enough questions in the whole bank
    counts[next.id] += 1
    surplus -= 1
  }
  return counts
}

// Picks questions per domain according to the weights, then shuffles question and option order.
export function assembleMock(
  bank: Question[],
  domains: Pick<ExamDomain, 'id' | 'weightPercent'>[],
  total: number,
  random: RandomSource = Math.random,
): Question[] {
  const available: Record<string, number> = {}
  for (const question of bank) available[question.domainId] = (available[question.domainId] ?? 0) + 1

  const counts = allocateByWeight(domains, available, total)
  const chosen = domains.flatMap((domain) =>
    shuffle(
      bank.filter((question) => question.domainId === domain.id),
      random,
    ).slice(0, counts[domain.id] ?? 0),
  )
  return withShuffledOptions(shuffle(chosen, random), random)
}
