import { useMemo } from 'react'
import { ordersMissingIds } from '../data/ordersMissingIds'
import { useProgress } from '../progress/useProgress'
import type { Order, Question, SuggestedQuery } from '../types'
import { formatCurrency } from '../utils/duplicates'
import { analyzeMissingIds } from '../utils/missingIds'
import { ordersToSqlTable } from '../utils/sql'
import { AnswerForm } from './AnswerForm'
import { Badge } from '../../../shared/components/Badge'
import { DataTable, type Column } from './DataTable'
import { MissingIdsLearningSection } from './MissingIdsLearningSection'
import { orderColumns } from './orderColumns'
import { ProblemCard } from './ProblemCard'
import { RatioBar } from './RatioBar'
import { SqlRunner } from './SqlRunner'
import { StatCard } from '../../../shared/components/StatCard'

const CHALLENGE_ID = 'missing-customer-ids'
const sqlTables = [ordersToSqlTable('orders', ordersMissingIds)]

const suggestions: SuggestedQuery[] = [
  { label: 'Preview the table', sql: 'SELECT * FROM orders LIMIT 10;' },
  {
    label: 'Only NULLs (misses some!)',
    sql: `SELECT COUNT(*) AS missing
FROM orders
WHERE customer_id IS NULL;`,
  },
  {
    label: 'NULL or empty',
    sql: `SELECT COUNT(*) AS missing,
       SUM(amount) AS unattributed_revenue
FROM orders
WHERE customer_id IS NULL OR TRIM(customer_id) = '';`,
  },
]

export function MissingCustomerIdsChallenge() {
  const analysis = useMemo(() => analyzeMissingIds(ordersMissingIds), [])
  const { isCompleted, markCompleted } = useProgress()

  const columns: Column<Order>[] = [
    ...orderColumns,
    {
      header: 'status',
      render: (_, index) =>
        analysis.isMissing[index] ? <Badge tone="red">Missing ID</Badge> : <Badge tone="green">OK</Badge>,
    },
  ]

  const questions: Question[] = [
    {
      id: 'missing-count',
      kind: 'number',
      prompt: 'How many orders have a missing customer_id (NULL or empty)?',
      answer: analysis.missingRecords,
      hint: 'remember that an empty string counts as missing too.',
    },
    {
      id: 'missing-impact',
      kind: 'choice',
      prompt: 'What is the main downstream impact of these rows?',
      options: [
        { value: 'unattributed', label: 'Revenue exists but cannot be attributed to any customer' },
        { value: 'double', label: 'Revenue is counted twice' },
        { value: 'none', label: 'Nothing changes; order totals are still correct everywhere' },
      ],
      answer: 'unattributed',
      hint: 'customer-level reports (LTV, retention) cannot use these rows.',
    },
    {
      id: 'missing-filter',
      kind: 'choice',
      prompt: 'Which filter finds every order with a missing customer_id?',
      options: [
        { value: 'equals-null', label: "WHERE customer_id = NULL" },
        { value: 'is-null', label: 'WHERE customer_id IS NULL' },
        { value: 'is-null-or-empty', label: "WHERE customer_id IS NULL OR TRIM(customer_id) = ''" },
      ],
      answer: 'is-null-or-empty',
      hint: 'try each filter in the SQL Playground and compare the counts.',
    },
    {
      id: 'missing-sql',
      kind: 'sql',
      prompt: 'Write a query that returns the order_id of every order with a missing customer_id.',
      hint: 'remember NULL and empty strings. Return only the order_id column.',
      tables: sqlTables,
      expectedSql: "SELECT order_id FROM orders WHERE customer_id IS NULL OR TRIM(customer_id) = '';",
    },
  ]

  return (
    <>
      <ProblemCard
        meta={[
          { label: 'Dataset', value: 'orders' },
          { label: 'Source', value: 'Synthetic sample' },
          { label: 'Columns', value: 'order_id, customer_id, amount, order_date' },
          { label: 'Rows', value: analysis.totalRecords },
        ]}
      >
        The growth team is building a customer lifetime value report, but the numbers per
        customer look too low. The <code>orders</code> table comes from a checkout system that
        sometimes fails to attach a customer. Investigate how many orders are affected and what
        that means downstream.
      </ProblemCard>

      <section>
        <h2>Investigation summary</h2>
        <div className="grid grid-4">
          <StatCard label="Total records" value={analysis.totalRecords} />
          <StatCard label="Missing customer IDs" value={analysis.missingRecords} tone="warning" />
          <StatCard
            label="Missing rate"
            value={`${Math.round(analysis.missingRate)}%`}
            tone="warning"
          />
          <StatCard
            label="Unattributed revenue"
            value={formatCurrency(analysis.unattributedRevenue)}
            hint={`of ${formatCurrency(analysis.totalRevenue)} total`}
            tone="warning"
          />
        </div>

        <div className="card callout">
          <strong>{analysis.missingRecords} orders have no usable customer_id.</strong>
          <span className="muted">
            {' '}
            {analysis.nullCount} are NULL and {analysis.emptyCount} are empty strings.
          </span>
          <RatioBar
            badPercent={analysis.missingRate}
            goodLabel="Has customer_id"
            badLabel="Missing customer_id"
          />
        </div>
      </section>

      <section>
        <h2>Dataset: orders</h2>
        <DataTable
          columns={columns}
          rows={ordersMissingIds}
          rowClassName={(_, index) => (analysis.isMissing[index] ? 'row-danger' : undefined)}
        />
      </section>

      <SqlRunner tables={sqlTables} suggestions={suggestions} historyKey={CHALLENGE_ID} />

      <AnswerForm
        questions={questions}
        alreadyCompleted={isCompleted(CHALLENGE_ID)}
        onAllCorrect={() => markCompleted(CHALLENGE_ID)}
      />
      <MissingIdsLearningSection />
    </>
  )
}
