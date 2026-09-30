import { useMemo, type ReactNode } from 'react'
import { usePersistentState } from '../../../shared/usePersistentState'
import { toDateKey } from '../../../shared/utils/progress'
import { examDomains } from '../data/exam'
import { questionBank } from '../data/questions'
import type { ClaudeProgressData, MockResult } from '../types'
import { computeStats, emptyProgress } from '../utils/stats'
import { ClaudeProgressContext, type ClaudeProgressValue } from './ClaudeProgressContext'

const STORAGE_KEY = 'data-detective-claude-progress-v1'

function isProgressData(value: unknown): value is ClaudeProgressData {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Partial<ClaudeProgressData>
  return (
    typeof candidate.attempts === 'object' &&
    candidate.attempts !== null &&
    Array.isArray(candidate.mockResults) &&
    Array.isArray(candidate.activeDays)
  )
}

function withToday(days: string[]): string[] {
  const today = toDateKey(new Date())
  return days.includes(today) ? days : [...days, today]
}

export function ClaudeProgressProvider({ children }: { children: ReactNode }) {
  const [data, setData] = usePersistentState<ClaudeProgressData>(STORAGE_KEY, emptyProgress, isProgressData)

  const value = useMemo<ClaudeProgressValue>(
    () => ({
      stats: computeStats(data, questionBank, examDomains),
      mockResults: data.mockResults,
      recordAnswer: (questionId, correct) =>
        setData((current) => {
          const previous = current.attempts[questionId] ?? { correct: 0, wrong: 0 }
          return {
            ...current,
            attempts: {
              ...current.attempts,
              [questionId]: {
                correct: previous.correct + (correct ? 1 : 0),
                wrong: previous.wrong + (correct ? 0 : 1),
              },
            },
            activeDays: withToday(current.activeDays),
          }
        }),
      recordMock: (result: MockResult) =>
        setData((current) => ({
          ...current,
          mockResults: [result, ...current.mockResults],
          activeDays: withToday(current.activeDays),
        })),
      reset: () => setData(emptyProgress),
    }),
    [data, setData],
  )

  return <ClaudeProgressContext.Provider value={value}>{children}</ClaudeProgressContext.Provider>
}
