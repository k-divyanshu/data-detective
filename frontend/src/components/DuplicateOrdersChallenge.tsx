import { useMemo } from 'react'
import { orders } from '../data/orders'
import { useProgress } from '../progress/useProgress'
import type { Order, Question, RowStatus, SuggestedQuery } from '../types'
import { analyzeDuplicates, formatCurrency } from '../utils/duplicates'
import { ordersToSqlTable } from '../utils/sql'
import { AnswerForm } from './AnswerForm'
import { Badge } from './Badge'
import { DataTable, type Column } from './DataTable'
import { DuplicateLearningSection } from './DuplicateLearningSection'
import { orderColumns } from './orderColumns'
import { RatioBar } from './RatioBar'
import { SqlRunner } from './SqlRunner'
import { StatCard } from './StatCard'

const CHALLENGE_ID = 'duplicate-orders'
const sqlTables = [ordersToSqlTable('orders', orders)]

const suggestions: SuggestedQuery[] = [
  { label: 'Preview the table', sql: 'SELECT * FROM orders LIMIT 10;' },
  {
    label: 'Find duplicate order_ids',
    sql: `SELECT order_id, COUNT(*) AS occurrences
FROM orders
GROUP BY order_id
HAVING COUNT(*) > 1;`,
  },
  {
    label: 'Revenue: raw vs. deduplicated',
    sql: `SELECT SUM(amount) AS raw_revenue,
       (SELECT SUM(amount) FROM (SELECT DISTINCT * FROM orders)) AS deduplicated_revenue
FROM orders;`,
  },
]

const statusBadge: Record<RowStatus, { tone: 'red' | 'amber' | 'green'; label: string }> = {
  duplicate: { tone: 'red', label: 'Duplicate' },
  original: { tone: 'amber', label: 'Original' },
  unique: { tone: 'green', label: 'OK' },
}

const rowClassByStatus: Record<RowStatus, string | undefined> = {
  duplicate: 'row-danger',
  original: 'row-warn',
  unique: undefined,
}

export function DuplicateOrdersChallenge() {
  const analysis = useMemo(() => analyzeDuplicates(orders), [])
  const { isCompleted, markCompleted } = useProgress()

  const columns: Column<Order>[] = [
    ...orderColumns,
    {
      header: 'status',
      render: (_, index) => {
        const badge = statusBadge[analysis.rowStatus[index]]
        return <Badge tone={badge.tone}>{badge.label}</Badge>
      },
    },
  ]

  const questions: Question[] = [
    {
      id: 'dup-count',
      kind: 'number',
      prompt: 'How many duplicate records (extra rows) are in the dataset?',
      answer: analysis.duplicateRecords,
      hint: 'count only the repeated rows, not the originals.',
    },
    {
      id: 'dup-impact',
      kind: 'choice',
      prompt: 'What effect do these duplicates have on revenue reporting?',
      options: [
        { value: 'inflated', label: 'Revenue and order counts are inflated' },
        { value: 'deflated', label: 'Revenue is understated' },
        { value: 'none', label: 'No impact on analytics' },
      ],
      answer: 'inflated',
      hint: 'think about what SUM(amount) does with extra rows.',
    },
    {
      id: 'dup-sql',
      kind: 'sql',
      prompt: 'Write a query that returns each order_id that appears more than once.',
      hint: 'group by order_id and filter groups with HAVING. Return only the order_id column.',
      tables: sqlTables,
      expectedSql: 'SELECT order_id FROM orders GROUP BY order_id HAVING COUNT(*) > 1;',
    },
  ]

  return (
    <>
      <section className="card">
        <h2>Problem</h2>
        <p>
          The finance team says yesterday's revenue dashboard looks higher than the payment
          provider's report. The <code>orders</code> table was loaded by a pipeline that
          recently retried a failed run. Investigate whether duplicate orders are the cause.
        </p>
        <dl className="meta-list">
          <div><dt>Dataset</dt><dd>orders</dd></div>
          <div><dt>Source</dt><dd>Synthetic sample</dd></div>
          <div><dt>Columns</dt><dd>order_id, customer_id, amount, order_date</dd></div>
          <div><dt>Rows</dt><dd>{analysis.totalRecords}</dd></div>
        </dl>
      </section>

      <section>
        <h2>Investigation summary</h2>
        <div className="grid grid-4">
          <StatCard label="Total records" value={analysis.totalRecords} />
          <StatCard label="Unique orders" value={analysis.uniqueOrders} />
          <StatCard label="Duplicate records" value={analysis.duplicateRecords} tone="warning" />
          <StatCard
            label="Duplicate rate"
            value={`${Math.round(analysis.duplicateRate)}%`}
            tone="warning"
          />
        </div>

        <div className="card callout">
          <strong>{analysis.duplicateRecords} duplicate records detected.</strong>
          <span className="muted">
            {' '}
            Order IDs affected: {analysis.duplicateOrderIds.join(', ')}. Revenue counted twice:{' '}
            {formatCurrency(analysis.extraRevenue)}.
          </span>
          <RatioBar
            badPercent={analysis.duplicateRate}
            goodLabel="Clean records"
            badLabel="Duplicate records"
          />
        </div>
      </section>

      <section>
        <h2>Dataset: orders</h2>
        <DataTable
          columns={columns}
          rows={orders}
          rowClassName={(_, index) => rowClassByStatus[analysis.rowStatus[index]]}
        />
      </section>

      <SqlRunner tables={sqlTables} suggestions={suggestions} />

      <AnswerForm
        questions={questions}
        alreadyCompleted={isCompleted(CHALLENGE_ID)}
        onAllCorrect={() => markCompleted(CHALLENGE_ID)}
      />
      <DuplicateLearningSection />
    </>
  )
}
