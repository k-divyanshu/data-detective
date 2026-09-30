import type { Database, SqlJsStatic } from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import type { QueryResult, SqlCell, SqlTable } from '../types'
import { compareResults } from './sqlCompare'

// Load the SQLite WebAssembly module once and share it everywhere.
let sqlModule: Promise<SqlJsStatic> | undefined
function loadSqlModule(): Promise<SqlJsStatic> {
  sqlModule ??= import('sql.js').then(({ default: initSqlJs }) =>
    initSqlJs({ locateFile: () => wasmUrl }),
  )
  return sqlModule
}

// Creates a new in-memory database containing every given table.
export async function createDatabase(tables: SqlTable[]): Promise<Database> {
  const SQL = await loadSqlModule()
  const db = new SQL.Database()

  for (const table of tables) {
    const columnDefs = table.columns.map((column) => `${column.name} ${column.type}`).join(', ')
    db.run(`CREATE TABLE ${table.name} (${columnDefs});`)

    const placeholders = table.columns.map(() => '?').join(', ')
    const insert = db.prepare(`INSERT INTO ${table.name} VALUES (${placeholders});`)
    for (const row of table.rows) {
      insert.run(table.columns.map((column) => row[column.name]))
    }
    insert.free()
  }
  return db
}

// Runs one or more statements and returns the result of the last one that produced rows.
export function executeSql(db: Database, sql: string): QueryResult {
  const results = db.exec(sql)
  const last = results[results.length - 1]
  return last ? { columns: last.columns, rows: last.values as SqlCell[][] } : { columns: [], rows: [] }
}

export interface SqlGrade {
  correct: boolean
  message?: string // specific feedback, when we have some
}

// Runs the user's query and the reference query on a fresh copy of the data.
// A fresh database each time means a DROP TABLE in an answer can't hurt anything.
export async function gradeSqlAnswer(
  tables: SqlTable[],
  userSql: string,
  expectedSql: string,
): Promise<SqlGrade> {
  const db = await createDatabase(tables)
  try {
    const expected = executeSql(db, expectedSql)

    let actual: QueryResult
    try {
      actual = executeSql(db, userSql)
    } catch (caught) {
      const reason = caught instanceof Error ? caught.message : String(caught)
      return { correct: false, message: `your query failed: ${reason}` }
    }

    if (actual.columns.length === 0) {
      return { correct: false, message: 'your query returned no result set. Did you write a SELECT?' }
    }

    const outcome = compareResults(actual, expected)
    if (outcome === 'match') return { correct: true }
    if (outcome === 'column-count') {
      return {
        correct: false,
        message: `expected ${expected.columns.length} column(s) but your query returned ${actual.columns.length}.`,
      }
    }
    return { correct: false }
  } finally {
    db.close()
  }
}
