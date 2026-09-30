import { useMemo } from 'react'
import { pipelineRuns, salesOrders } from '../data/revenueDrop'
import { useProgress } from '../progress/useProgress'
import type { PipelineRun, Question, SalesOrder, SuggestedQuery } from '../types'
import { formatCurrency } from '../utils/duplicates'
import { analyzeRevenueDrop } from '../utils/revenue'
import { pipelineRunsToSqlTable, salesOrdersToSqlTable } from '../utils/sql'
import { AnswerForm } from './AnswerForm'
import { DailyRevenueChart } from './DailyRevenueChart'
import { DataTable, type Column } from './DataTable'
import { RevenueDropLearningSection } from './RevenueDropLearningSection'
import { SqlRunner } from './SqlRunner'
import { StatCard } from './StatCard'

const CHALLENGE_ID = 'unexpected-revenue-drop'

// Defined once at module level so SqlRunner gets a stable reference.
const sqlTables = [
  salesOrdersToSqlTable('orders', salesOrders),
  pipelineRunsToSqlTable('pipeline_runs', pipelineRuns),
]

const suggestions: SuggestedQuery[] = [
  {
    label: 'Daily revenue',
    sql: `SELECT order_date, SUM(amount) AS revenue
FROM orders
GROUP BY order_date
ORDER BY order_date;`,
  },
  {
    label: 'Revenue by region',
    sql: `SELECT order_date, region, SUM(amount) AS revenue
FROM orders
GROUP BY order_date, region
ORDER BY order_date, region;`,
  },
  {
    label: 'Recent pipeline runs',
    sql: `SELECT *
FROM pipeline_runs
WHERE run_date >= '2026-09-06'
ORDER BY run_date, region;`,
  },
]

const orderColumns: Column<SalesOrder>[] = [
  { header: 'order_id', render: (order) => order.order_id },
  { header: 'region', render: (order) => order.region },
  { header: 'amount', align: 'right', render: (order) => formatCurrency(order.amount) },
  { header: 'order_date', render: (order) => order.order_date },
]

const runColumns: Column<PipelineRun>[] = [
  { header: 'run_id', render: (run) => run.run_id },
  { header: 'run_date', render: (run) => run.run_date },
  { header: 'region', render: (run) => run.region },
  { header: 'rows_extracted', align: 'right', render: (run) => run.rows_extracted },
  { header: 'rows_loaded', align: 'right', render: (run) => run.rows_loaded },
  { header: 'status', render: (run) => run.status },
]

const questions: Question[] = [
  {
    id: 'drop-date',
    kind: 'choice',
    prompt: 'On which date did daily revenue first drop?',
    options: [
      { value: '2026-09-05', label: '2026-09-05' },
      { value: '2026-09-08', label: '2026-09-08' },
      { value: '2026-09-10', label: '2026-09-10' },
    ],
    answer: '2026-09-08',
    hint: 'run the “Daily revenue” query and look for the step down.',
  },
  {
    id: 'drop-region',
    kind: 'choice',
    prompt: 'Which region stopped contributing revenue?',
    options: [
      { value: 'US', label: 'US' },
      { value: 'EU', label: 'EU' },
      { value: 'APAC', label: 'APAC' },
    ],
    answer: 'EU',
    hint: 'slice revenue by region and compare before and after the drop.',
  },
  {
    id: 'drop-cause',
    kind: 'choice',
    prompt: 'What is the most likely root cause?',
    options: [
      { value: 'demand', label: 'EU customers suddenly stopped buying' },
      { value: 'silent-failure', label: 'The EU load extracted no rows but was still reported as SUCCESS' },
      { value: 'duplicates', label: 'A cleanup step removed duplicate orders' },
    ],
    answer: 'silent-failure',
    hint: 'look at rows_extracted and status in pipeline_runs.',
  },
  {
    id: 'drop-sql',
    kind: 'sql',
    prompt:
      'Write a query that returns the run_id of every pipeline run that reported SUCCESS but loaded 0 rows.',
    hint: 'return only the run_id column, filtering on status and rows_loaded.',
    tables: sqlTables,
    expectedSql: `SELECT run_id FROM pipeline_runs WHERE status = 'SUCCESS' AND rows_loaded = 0;`,
  },
]

export function RevenueDropChallenge() {
  const analysis = useMemo(() => analyzeRevenueDrop(salesOrders), [])
  const { isCompleted, markCompleted } = useProgress()

  return (
    <>
      <section className="card">
        <h2>Problem</h2>
        <p>
          The executive revenue dashboard shows a sharp fall in daily revenue, yet marketing says
          traffic and campaigns were normal. The data pipeline was updated and ran on the day the
          numbers changed. Find out when it happened, what changed, and why.
        </p>
        <dl className="meta-list">
          <div><dt>Datasets</dt><dd>orders, pipeline_runs</dd></div>
          <div><dt>Source</dt><dd>Synthetic sample</dd></div>
          <div><dt>Period</dt><dd>2026-09-01 → 2026-09-10</dd></div>
          <div><dt>Rows</dt><dd>{salesOrders.length} orders · {pipelineRuns.length} runs</dd></div>
        </dl>
      </section>

      <section>
        <h2>Investigation summary</h2>
        <div className="grid grid-4">
          <StatCard label="Avg daily revenue before" value={formatCurrency(analysis.avgBefore)} />
          <StatCard label="Avg daily revenue after" value={formatCurrency(analysis.avgAfter)} tone="warning" />
          <StatCard label="Change" value={`${analysis.changePercent.toFixed(0)}%`} tone="warning" />
          <StatCard label="Biggest drop starts" value={analysis.dropDate} hint="day-over-day" />
        </div>
        <DailyRevenueChart daily={analysis.daily} dropDate={analysis.dropDate} />
      </section>

      <section>
        <h2>Dataset: orders</h2>
        <DataTable columns={orderColumns} rows={salesOrders} />
      </section>

      <section>
        <h2>Dataset: pipeline_runs</h2>
        <DataTable columns={runColumns} rows={pipelineRuns} />
      </section>

      <SqlRunner tables={sqlTables} suggestions={suggestions} />

      <AnswerForm
        questions={questions}
        alreadyCompleted={isCompleted(CHALLENGE_ID)}
        onAllCorrect={() => markCompleted(CHALLENGE_ID)}
      />
      <RevenueDropLearningSection />
    </>
  )
}
