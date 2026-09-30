import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { calculateStreak, toDateKey } from '../utils/progress'
import { ProgressContext, type ProgressContextValue } from './ProgressContext'

const STORAGE_KEY = 'data-detective-progress-v1'

interface StoredProgress {
  completedAt: Record<string, string>
  activeDays: string[]
}

const emptyProgress: StoredProgress = { completedAt: {}, activeDays: [] }

function loadProgress(): StoredProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyProgress
    const parsed = JSON.parse(raw)
    // Guard against hand-edited or outdated data.
    if (
      parsed &&
      typeof parsed.completedAt === 'object' &&
      parsed.completedAt !== null &&
      Array.isArray(parsed.activeDays)
    ) {
      return { completedAt: parsed.completedAt, activeDays: parsed.activeDays }
    }
  } catch {
    // Corrupt JSON or storage unavailable: start fresh.
  }
  return emptyProgress
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<StoredProgress>(loadProgress)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // Progress just won't persist.
    }
  }, [progress])

  const value = useMemo<ProgressContextValue>(
    () => ({
      completedAt: progress.completedAt,
      completedCount: Object.keys(progress.completedAt).length,
      activeDays: progress.activeDays,
      streak: calculateStreak(progress.activeDays),
      isCompleted: (challengeId) => challengeId in progress.completedAt,
      markCompleted: (challengeId) => {
        const now = new Date()
        const today = toDateKey(now)
        setProgress((current) => ({
          // Keep the first completion time if the user solves it again.
          completedAt: current.completedAt[challengeId]
            ? current.completedAt
            : { ...current.completedAt, [challengeId]: now.toISOString() },
          activeDays: current.activeDays.includes(today)
            ? current.activeDays
            : [...current.activeDays, today],
        }))
      },
      reset: () => setProgress(emptyProgress),
    }),
    [progress],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
