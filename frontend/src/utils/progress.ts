// Local calendar day as YYYY-MM-DD (not UTC, so "today" matches the user's clock).
export function toDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

// Consecutive active days ending today. If today has no activity yet,
// the streak is still alive as long as yesterday was active.
export function calculateStreak(activeDays: string[], today: Date = new Date()): number {
  const days = new Set(activeDays)
  const cursor = new Date(today)
  if (!days.has(toDateKey(cursor))) cursor.setDate(cursor.getDate() - 1)

  let streak = 0
  while (days.has(toDateKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}
