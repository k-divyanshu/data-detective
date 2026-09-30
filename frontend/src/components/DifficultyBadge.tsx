import type { Difficulty } from '../types'
import { Badge, type BadgeTone } from './Badge'

const toneByDifficulty: Record<Difficulty, BadgeTone> = {
  Beginner: 'green',
  Intermediate: 'amber',
  Advanced: 'red',
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return <Badge tone={toneByDifficulty[difficulty]}>{difficulty}</Badge>
}
