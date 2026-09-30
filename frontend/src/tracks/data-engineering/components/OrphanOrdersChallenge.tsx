import { useMemo } from 'react'
import { customers, ordersToJoin } from '../data/orphanOrders'
import { useProgress } from '../progress/useProgress'
import type { Customer, Question, SuggestedQuery } from '../types'
import { formatCurrency } from '../utils/duplicates'
import { analyzeOrphanOrders } from '../utils/joins'
import { customersToSqlTable, ordersToSqlTable } from '../utils/sql'
import { AnswerForm } from './AnswerForm'
import { DataTable, type Column } from './DataTable'
import { orderColumns } from './orderColumns'
import { OrphanOrdersLearningSection } from './OrphanOrdersLearningSection'
import { ProblemCard } from './ProblemCard'
import { RatioBar } from './RatioBar'
import { SqlRunner } from './SqlRunner'
import { StatCard } from '../../../shared/components/StatCard'

const CHALLENGE_ID = 'orders-vanish-after-join'
const sqlTables = [
  ordersToSqlTable('orders', ordersToJoin),
  customersToSqlTable('customers', customers),
]

const suggestions: SuggestedQuery[] = [
  {
    label: 'Revenue: orders only',
    sql: 'SELECT COUNT(*) AS orders, SUM(amount) AS revenue FROM orders;',
  },
  {
    label: 'Revenue after INNER JOIN',
    sql: `SELECT COUNT(*) AS orders, SUM(o.amount) AS revenue
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id;`,
  },
  {
    label: 'Revenue after LEFT JOIN',
    sql: `SELECT COUNT(*) AS orders, SUM(o.amount) AS revenue
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id;`,
  },
]

const customerColumns: Column<Customer>[] = [
  { header: 'customer_id', render: (customer) => customer.customer_id },
  { header: 'name', render: (customer) => customer.name },
  { header: 'country', render: (customer) => customer.country },
  { header: 'signup_date', render: (customer) => customer.signup_date },
]

const questions: Question[] = [
  {
    id: 'orphan-count',
    kind: 'number',
    prompt: 'How many orders reference a customer_id that does not exist in customers?',
    answer: analyzeOrphanOrders(ordersToJoin, customers).orphanOrders,
    hint: 'compare the row counts from the INNER JOIN and LEFT JOIN queries.',
  },
  {
    id: 'orphan-join-type',
    kind: 'choice',
    prompt: 'Which join silently drops orders that have no matching customer?',
    options: [
      { value: 'inner', label: 'INNER JOIN' },
      { value: 'left', label: 'LEFT JOIN (orders on the left)' },
      { value: 'none', label: 'Neither, joins never drop rows' },
    ],
    answer: 'inner',
    hint: 'one of them only keeps rows that match on both sides.',
  },
  {
    id: 'orphan-impact',
    kind: 'choice',
    prompt: 'A dashboard shows revenue per country using INNER JOIN. What is wrong with it?',
    options: [
      { value: 'understated', label: 'Total revenue is understated because orphaned orders disappear' },
      { value: 'overstated', label: 'Total revenue is overstated because rows are duplicated' },
      { value: 'fine', label: 'Nothing, the totals still match the orders table' },
    ],
    answer: 'understated',
    hint: 'compare the revenue from the orders table with the revenue after the INNER JOIN.',
  },
  {
    id: 'orphan-sql',
    kind: 'sql',
    prompt: 'Write a query that returns the order_id of every order with no matching customer.',
    hint: 'LEFT JOIN customers, then keep rows where the customer side is NULL. Return only order_id.',
    tables: sqlTables,
    expectedSql: `SELECT o.order_id
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;`,
  },
]

export function OrphanOrdersChallenge() {
  const analysis = useMemo(() => analyzeOrphanOrders(ordersToJoin, customers), [])
  const { isCompleted, markCompleted } = useProgress()

  return (
    <>
      <ProblemCard
        meta={[
          { label: 'Datasets', value: 'orders, customers' },
          { label: 'Source', value: 'Synthetic sample' },
          { label: 'Join key', value: 'customer_id' },
          { label: 'Rows', value: `${ordersToJoin.length} orders · ${customers.length} customers` },
        ]}
      >
        A revenue-by-country report joins <code>orders</code> to <code>customers</code>. Finance
        notices that the report total is lower than the total in the orders table, but no errors
        were logged. Find out where the revenue went and how to report it correctly.
      </ProblemCard>

      <section>
        <h2>Investigation summary</h2>
        <div className="grid grid-4">
          <StatCard label="Orders" value={analysis.totalOrders} />
          <StatCard label="Customers" value={customers.length} />
          <StatCard label="Revenue in orders" value={formatCurrency(analysis.totalRevenue)} />
          <StatCard
            label="Revenue after INNER JOIN"
            value={formatCurrency(analysis.innerJoinRevenue)}
            tone="warning"
          />
        </div>

        <div className="card callout">
          <strong>{formatCurrency(analysis.lostRevenue)} of revenue disappears in the join.</strong>
          <span className="muted"> That is {Math.round(analysis.lostRate)}% of the total.</span>
          <RatioBar
            badPercent={analysis.lostRate}
            goodLabel="Revenue kept by the join"
            badLabel="Revenue lost by the join"
          />
        </div>
      </section>

      <section>
        <h2>Dataset: orders</h2>
        <DataTable columns={orderColumns} rows={ordersToJoin} />
      </section>

      <section>
        <h2>Dataset: customers</h2>
        <DataTable columns={customerColumns} rows={customers} />
      </section>

      <SqlRunner tables={sqlTables} suggestions={suggestions} historyKey={CHALLENGE_ID} />

      <AnswerForm
        questions={questions}
        alreadyCompleted={isCompleted(CHALLENGE_ID)}
        onAllCorrect={() => markCompleted(CHALLENGE_ID)}
      />
      <OrphanOrdersLearningSection />
    </>
  )
}
