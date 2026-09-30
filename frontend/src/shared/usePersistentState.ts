import { useEffect, useState } from 'react'
import { readStored, writeStored } from './storage'

// Like useState, but saved to localStorage under `key` and restored on the next visit.
export function usePersistentState<T>(
  key: string,
  initial: T,
  isValid: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() => readStored(key, initial, isValid))

  useEffect(() => {
    writeStored(key, value)
  }, [key, value])

  return [value, setValue] as const
}
