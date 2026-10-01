import { challengeDefinitions } from '../challenges'
import type { Challenge } from '../types'

// Challenges announced but not built yet. They show a "Coming soon" page.
const plannedChallenges: Challenge[] = []

// The list is derived from the definitions, so there is no second place to keep in sync.
export const challenges: Challenge[] = [
  ...challengeDefinitions.map(({ content: _content, ...meta }) => ({ ...meta, available: true })),
  ...plannedChallenges,
]

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find((challenge) => challenge.id === id)
}
