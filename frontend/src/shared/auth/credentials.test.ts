import { describe, expect, it } from 'vitest'
import { credentialsMatch } from './credentials'

describe('credentialsMatch', () => {
  it('accepts the fixed username and password', () => {
    expect(credentialsMatch('nymbl', 'nymbl')).toBe(true)
    expect(credentialsMatch('  nymbl ', 'nymbl')).toBe(true)
  })

  it('rejects anything else', () => {
    expect(credentialsMatch('nymbl', 'wrong')).toBe(false)
    expect(credentialsMatch('other', 'nymbl')).toBe(false)
    expect(credentialsMatch('nymbl', 'Nymbl')).toBe(false)
    expect(credentialsMatch('', '')).toBe(false)
  })
})
