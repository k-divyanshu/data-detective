// Small helpers so every feature reads and writes localStorage the same, safe way.
// localStorage can be unavailable (private windows, blocked storage) or hold stale data,
// so reads are validated and nothing throws.

export function readStored<T>(key: string, fallback: T, isValid: (value: unknown) => value is T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed: unknown = JSON.parse(raw)
    return isValid(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

export function writeStored(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Data just won't persist.
  }
}
