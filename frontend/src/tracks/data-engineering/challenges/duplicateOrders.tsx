import { Badge } from '../../../shared/components/Badge'
import { orderColumns } from '../components/orderColumns'
import type { Column } from '../components/DataTable'
import { orders } from '../data/orders'
import type { ChallengeDefinition, Order, Question, RowStatus, SuggestedQuery } from '../types'
import { analyzeDuplicates, formatCurrency } from '../utils/duplicates'
import { ordersToSqlTable } from '../utils/sql'
import { defineTable } from './defineTable'

const analysis = analyzeDuplicates(orders)
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

export const duplicateOrders: ChallengeDefinition = {
  id: 'duplicate-orders',
  title: 'Find the Duplicate Orders',
  category: 'Data Quality',
  difficulty: 'Beginner',
  description: 'Identify duplicate order records and determine why they can cause incorrect analytics.',
  content: {
    problem: {
      text: "The finance team says yesterday's revenue dashboard looks higher than the payment provider's report. The `orders` table was loaded by a pipeline that recently retried a failed run. Investigate whether duplicate orders are the cause.",
      meta: [
        { label: 'Dataset', value: 'orders' },
        { label: 'Source', value: 'Synthetic sample' },
        { label: 'Columns', value: 'order_id, customer_id, amount, order_date' },
        { label: 'Rows', value: analysis.totalRecords },
      ],
    },
    summary: {
      stats: [
        { label: 'Total records', value: analysis.totalRecords },
        { label: 'Unique orders', value: analysis.uniqueOrders },
        { label: 'Duplicate records', value: analysis.duplicateRecords, tone: 'warning' },
        { label: 'Duplicate rate', value: `${Math.round(analysis.duplicateRate)}%`, tone: 'warning' },
      ],
      callout: {
        headline: `${analysis.duplicateRecords} duplicate records detected.`,
        detail: `Order IDs affected: ${analysis.duplicateOrderIds.join(', ')}. Revenue counted twice: ${formatCurrency(analysis.extraRevenue)}.`,
        ratio: { badPercent: analysis.duplicateRate, goodLabel: 'Clean records', badLabel: 'Duplicate records' },
      },
    },
    tables: [
      defineTable({
        title: 'orders',
        columns,
        rows: orders,
        rowClassName: (_, index) => rowClassByStatus[analysis.rowStatus[index]],
      }),
    ],
    sql: { tables: sqlTables, suggestions },
    questions,
    lesson: {
      title: 'What are duplicate records?',
      blocks: [
        { type: 'heading', text: 'What is a duplicate record?' },
        {
          type: 'paragraph',
          text: 'A duplicate is a row that represents something already recorded. Here, two rows with the same `order_id` describe the same order, so the table says it happened twice.',
        },
        { type: 'heading', text: 'Why are duplicates dangerous in analytics?' },
        {
          type: 'paragraph',
          text: 'Dashboards trust what is in the table. Duplicates silently inflate counts and totals, so reports look healthy while being wrong, and nothing fails loudly.',
        },
        { type: 'heading', text: 'How do they affect revenue?' },
        {
          type: 'paragraph',
          text: '`SUM(amount)` adds every row. A $120 order stored twice counts as $240, and metrics built on it (average order value, customer lifetime value) drift as well.',
        },
        { type: 'heading', text: 'Common causes in pipelines' },
        {
          type: 'list',
          items: [
            'A job retried after a partial failure and loaded the same batch again.',
            'Overlapping extraction windows (e.g. “last 24h” run every 12h).',
            'Joins on a non-unique key that fan out rows.',
            'Source systems that emit the same event more than once (at-least-once delivery).',
          ],
        },
        { type: 'heading', text: 'Detecting duplicates with SQL' },
        { type: 'paragraph', muted: true, text: 'Group by the key that should be unique and keep groups seen more than once.' },
        {
          type: 'code',
          language: 'sql',
          code: `SELECT order_id, COUNT(*) AS occurrences
FROM orders
GROUP BY order_id
HAVING COUNT(*) > 1;`,
        },
        { type: 'heading', text: 'Removing them' },
        {
          type: 'code',
          language: 'sql',
          code: `-- Keep only the first row for each order_id
SELECT *
FROM (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY order_date) AS rn
  FROM orders
) t
WHERE rn = 1;`,
        },
      ],
    },
  },
}
