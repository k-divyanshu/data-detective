import { DailyRevenueChart } from '../components/DailyRevenueChart'
import type { Column } from '../components/DataTable'
import { pipelineRuns, salesOrders } from '../data/revenueDrop'
import type { ChallengeDefinition, PipelineRun, Question, SalesOrder, SuggestedQuery } from '../types'
import { formatCurrency } from '../utils/duplicates'
import { analyzeRevenueDrop } from '../utils/revenue'
import { pipelineRunsToSqlTable, salesOrdersToSqlTable } from '../utils/sql'
import { defineTable } from './defineTable'

const analysis = analyzeRevenueDrop(salesOrders)

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
    prompt: 'Write a query that returns the run_id of every pipeline run that reported SUCCESS but loaded 0 rows.',
    hint: 'return only the run_id column, filtering on status and rows_loaded.',
    tables: sqlTables,
    expectedSql: `SELECT run_id FROM pipeline_runs WHERE status = 'SUCCESS' AND rows_loaded = 0;`,
  },
]

export const unexpectedRevenueDrop: ChallengeDefinition = {
  id: 'unexpected-revenue-drop',
  title: 'Unexpected Revenue Drop',
  category: 'Data Investigation',
  difficulty: 'Intermediate',
  description: 'Investigate why reported revenue suddenly decreased after a pipeline run.',
  content: {
    problem: {
      text: 'The executive revenue dashboard shows a sharp fall in daily revenue, yet marketing says traffic and campaigns were normal. The data pipeline was updated and ran on the day the numbers changed. Find out when it happened, what changed, and why.',
      meta: [
        { label: 'Datasets', value: 'orders, pipeline_runs' },
        { label: 'Source', value: 'Synthetic sample' },
        { label: 'Period', value: '2026-09-01 → 2026-09-10' },
        { label: 'Rows', value: `${salesOrders.length} orders · ${pipelineRuns.length} runs` },
      ],
    },
    summary: {
      stats: [
        { label: 'Avg daily revenue before', value: formatCurrency(analysis.avgBefore) },
        { label: 'Avg daily revenue after', value: formatCurrency(analysis.avgAfter), tone: 'warning' },
        { label: 'Change', value: `${analysis.changePercent.toFixed(0)}%`, tone: 'warning' },
        { label: 'Biggest drop starts', value: analysis.dropDate, hint: 'day-over-day' },
      ],
      extra: <DailyRevenueChart daily={analysis.daily} dropDate={analysis.dropDate} />,
    },
    tables: [
      defineTable({ title: 'orders', columns: orderColumns, rows: salesOrders }),
      defineTable({ title: 'pipeline_runs', columns: runColumns, rows: pipelineRuns }),
    ],
    sql: { tables: sqlTables, suggestions },
    questions,
    lesson: {
      title: 'How do you investigate a sudden metric change?',
      blocks: [
        { type: 'heading', text: 'Start with the shape of the problem' },
        {
          type: 'paragraph',
          text: 'Find *when* the metric changed and whether it fell everywhere or in one slice (region, product, channel). A drop that starts on one exact day usually points to a system change, not customer behavior.',
        },
        { type: 'heading', text: 'Then compare the pipeline to the data' },
        {
          type: 'paragraph',
          text: 'Pipeline metadata tells you what the job believed it did. If a run says `SUCCESS` but extracted or loaded zero rows, the job ran without failing loudly, and the warehouse silently lost data.',
        },
        { type: 'heading', text: 'Common causes' },
        {
          type: 'list',
          items: [
            "A source API or file returns empty results and the job treats that as valid.",
            "A schema or permission change makes one segment's query match nothing.",
            'A filter or join added in a pipeline change drops rows for one segment.',
            'A partial load or failed retry leaves a partition missing.',
          ],
        },
        { type: 'heading', text: 'How teams prevent it' },
        {
          type: 'list',
          items: [
            "Row-count checks: fail the run if today's volume is far below the usual.",
            'Freshness and completeness monitors per segment, not just in total.',
            'Reconciling warehouse totals with the source system.',
          ],
        },
        { type: 'heading', text: 'Slicing revenue by segment' },
        {
          type: 'code',
          language: 'sql',
          code: `-- Which slice of the business changed?
SELECT order_date, region, SUM(amount) AS revenue
FROM orders
GROUP BY order_date, region
ORDER BY order_date, region;`,
        },
        { type: 'heading', text: 'Checking pipeline volume' },
        {
          type: 'code',
          language: 'sql',
          code: `-- Did any load report success while moving no data?
SELECT run_date, region, rows_extracted, rows_loaded
FROM pipeline_runs
WHERE status = 'SUCCESS'
  AND rows_loaded = 0;`,
        },
      ],
    },
  },
}
