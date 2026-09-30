import type { Challenge } from '../types'

export const challenges: Challenge[] = [
  {
    id: 'duplicate-orders',
    title: 'Find the Duplicate Orders',
    category: 'Data Quality',
    difficulty: 'Beginner',
    description:
      'Identify duplicate order records and determine why they can cause incorrect analytics.',
    available: true,
  },
  {
    id: 'missing-customer-ids',
    title: 'Missing Customer IDs',
    category: 'Data Quality',
    difficulty: 'Beginner',
    description:
      'Investigate missing customer identifiers and determine their impact on downstream data.',
    available: true,
  },
  {
    id: 'unexpected-revenue-drop',
    title: 'Unexpected Revenue Drop',
    category: 'Data Investigation',
    difficulty: 'Intermediate',
    description:
      'Investigate why reported revenue suddenly decreased after a pipeline run.',
    available: true,
  },
]

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find((challenge) => challenge.id === id)
}
