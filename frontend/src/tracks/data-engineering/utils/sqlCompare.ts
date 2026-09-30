import type { QueryResult } from '../types'

export type CompareOutcome = 'match' | 'column-count' | 'rows'

// Compares two query results the way a beginner expects:
// column names and row order don't matter, values and row counts do.
export function compareResults(actual: QueryResult, expected: QueryResult): CompareOutcome {
  if (actual.columns.length !== expected.columns.length) return 'column-count'

  const normalize = (result: QueryResult) => result.rows.map((row) => JSON.stringify(row)).sort()
  const actualRows = normalize(actual)
  const expectedRows = normalize(expected)

  const same =
    actualRows.length === expectedRows.length &&
    actualRows.every((row, index) => row === expectedRows[index])
  return same ? 'match' : 'rows'
}
