import { useEffect, useRef, useState } from 'react'
import type { Database } from 'sql.js'
import type { QueryResult, SqlCell, SqlTable, SuggestedQuery } from '../types'
import { createDatabase, executeSql } from '../utils/sqlEngine'
import { DataTable, type Column } from './DataTable'

interface SqlRunnerProps {
  tables: SqlTable[]
  suggestions: SuggestedQuery[]
}

export function SqlRunner({ tables, suggestions }: SqlRunnerProps) {
  const dbRef = useRef<Database | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [query, setQuery] = useState(suggestions[0]?.sql ?? `SELECT * FROM ${tables[0].name};`)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Bumping this reloads a fresh database (used by "Reset data").
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    createDatabase(tables)
      .then((db) => {
        if (cancelled) {
          db.close()
          return
        }
        dbRef.current = db
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
      dbRef.current?.close()
      dbRef.current = null
    }
  }, [tables, reloadCount])

  function runQuery() {
    const db = dbRef.current
    if (!db) return
    try {
      setResult(executeSql(db, query))
      setError(null)
    } catch (caught) {
      setResult(null)
      setError(caught instanceof Error ? caught.message : String(caught))
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      runQuery()
    }
  }

  // Result columns are only known at run time, so build them from the result itself.
  const resultColumns: Column<SqlCell[]>[] =
    result?.columns.map((name, columnIndex) => ({
      header: name,
      render: (row) =>
        row[columnIndex] === null ? <span className="cell-null">NULL</span> : String(row[columnIndex]),
    })) ?? []

  return (
    <section className="card sql-runner">
      <div className="form-title">
        <h2>SQL Playground</h2>
        <span className="muted small">SQLite running in your browser</span>
      </div>

      <ul className="schema">
        {tables.map((table) => (
          <li key={table.name}>
            <code>
              {table.name}({table.columns.map((column) => column.name).join(', ')})
            </code>
          </li>
        ))}
      </ul>

      <div className="chips">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.label}
            type="button"
            className="chip"
            onClick={() => setQuery(suggestion.sql)}
          >
            {suggestion.label}
          </button>
        ))}
      </div>

      <textarea
        className="sql-input"
        aria-label="SQL query"
        spellCheck={false}
        rows={6}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
      />

      <div className="sql-actions">
        <button type="button" className="button" onClick={runQuery} disabled={status !== 'ready'}>
          {status === 'loading' ? 'Loading SQLite…' : 'Run query'}
        </button>
        <button
          type="button"
          className="button button-ghost"
          onClick={() => {
            setResult(null)
            setError(null)
            setStatus('loading')
            setReloadCount((count) => count + 1)
          }}
        >
          Reset data
        </button>
        <span className="muted small">Cmd/Ctrl + Enter to run</span>
      </div>

      {status === 'error' && <p className="sql-error">Could not start the SQL engine.</p>}
      {error && <p className="sql-error">{error}</p>}

      {result && result.columns.length === 0 && (
        <p className="muted">Statement ran successfully (no rows returned).</p>
      )}
      {result && result.columns.length > 0 && (
        <>
          <p className="muted small">
            {result.rows.length} {result.rows.length === 1 ? 'row' : 'rows'}
          </p>
          <DataTable columns={resultColumns} rows={result.rows} />
        </>
      )}
    </section>
  )
}
