import { createContext } from 'react'
import type { MockResult } from '../types'
import type { ClaudeStats } from '../utils/stats'

export interface ClaudeProgressValue {
  stats: ClaudeStats
  mockResults: MockResult[]
  recordAnswer: (questionId: string, correct: boolean) => void
  recordMock: (result: MockResult) => void
  reset: () => void
}

export const ClaudeProgressContext = createContext<ClaudeProgressValue | null>(null)
