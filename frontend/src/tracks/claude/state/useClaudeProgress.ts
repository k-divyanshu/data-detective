import { useContext } from 'react'
import { ClaudeProgressContext } from './ClaudeProgressContext'

export function useClaudeProgress() {
  const value = useContext(ClaudeProgressContext)
  if (!value) throw new Error('useClaudeProgress must be used inside <ClaudeProgressProvider>')
  return value
}
