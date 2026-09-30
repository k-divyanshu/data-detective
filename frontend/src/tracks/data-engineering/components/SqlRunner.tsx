import { useEffect, useRef, useState } from 'react'
import type { Database } from 'sql.js'
import type { QueryResult, SqlCell, SqlTable, SuggestedQuery } from '../types'
import { createDatabase, executeSql } from '../utils/sqlEngine'
import { DataTable, type Column } from './DataTable'

const HISTORY_LIMIT = 8

function historyStorageKey(historyKey: string): string {
  return `data-detective-sql-history-v1:${historyKey}`
}

function loadHistory(historyKey: string): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(historyStorageKey(historyKey)) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
  } catch {
    return []
  }
}

function saveHistory(historyKey: string, history: string[]) {
  try {
    localStorage.setItem(historyStorageKey(historyKey), JSON.stringify(history))
  } catch {
    // History just won't persist.
  }
}

// One-line preview for the history list.
function preview(sql: string): string {
  const oneLine = sql.replace(/\s+/g, ' ').trim()
  return oneLine.length > 90 ? `${oneLine.slice(0, 90)}…` : oneLine
}

interface SqlRunnerProps {
  tables: SqlTable[]
  suggestions: SuggestedQuery[]
  historyKey: string // one history list per challenge
}

export function SqlRunner({ tables, suggestions, historyKey }: SqlRunnerProps) {
  const dbRef = useRef<Database | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [query, setQuery] = useState(suggestions[0]?.sql ?? `SELECT * FROM ${tables[0].name};`)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>(() => loadHistory(historyKey))

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

  // Only queries that ran successfully are kept, newest first, without repeats.
  function rememberQuery(sql: string) {
    const trimmed = sql.trim()
    const next = [trimmed, ...history.filter((item) => item !== trimmed)].slice(0, HISTORY_LIMIT)
    setHistory(next)
    saveHistory(historyKey, next)
  }

  function clearHistory() {
    setHistory([])
    saveHistory(historyKey, [])
  }

  function runQuery() {
    const db = dbRef.current
    if (!db) return
    try {
      setResult(executeSql(db, query))
      setError(null)
      rememberQuery(query)
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

      {history.length > 0 && (
        <details className="query-history">
          <summary>Query history ({history.length})</summary>
          <ul>
            {history.map((sql) => (
              <li key={sql}>
                <button type="button" title={sql} onClick={() => setQuery(sql)}>
                  {preview(sql)}
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="link-button" onClick={clearHistory}>
            Clear history
          </button>
        </details>
      )}

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
