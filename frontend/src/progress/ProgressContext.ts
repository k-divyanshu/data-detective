import { createContext } from 'react'

export interface ProgressContextValue {
  completedAt: Record<string, string> // challenge id -> ISO timestamp of first completion
  completedCount: number
  activeDays: string[] // days on which the user solved something
  streak: number
  isCompleted: (challengeId: string) => boolean
  markCompleted: (challengeId: string) => void
  reset: () => void
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)
