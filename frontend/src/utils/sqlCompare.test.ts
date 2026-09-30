import { describe, expect, it } from 'vitest'
import type { QueryResult } from '../types'
import { compareResults } from './sqlCompare'

const expected: QueryResult = { columns: ['order_id'], rows: [[1003], [1009], [1015]] }

describe('compareResults', () => {
  it('matches identical results', () => {
    expect(compareResults(expected, expected)).toBe('match')
  })

  it('ignores row order and column names', () => {
    const actual: QueryResult = { columns: ['id'], rows: [[1015], [1003], [1009]] }
    expect(compareResults(actual, expected)).toBe('match')
  })

  it('reports a different number of columns', () => {
    const actual: QueryResult = { columns: ['order_id', 'n'], rows: [[1003, 2], [1009, 2], [1015, 2]] }
    expect(compareResults(actual, expected)).toBe('column-count')
  })

  it('reports different rows', () => {
    expect(compareResults({ columns: ['order_id'], rows: [[1003]] }, expected)).toBe('rows')
    expect(compareResults({ columns: ['order_id'], rows: [[1], [2], [3]] }, expected)).toBe('rows')
  })

  it('treats NULL and empty string as different values', () => {
    const withNull: QueryResult = { columns: ['c'], rows: [[null]] }
    const withEmpty: QueryResult = { columns: ['c'], rows: [['']] }
    expect(compareResults(withNull, withEmpty)).toBe('rows')
  })
})
