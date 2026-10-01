import { Badge } from '../../../shared/components/Badge'
import { orderColumns } from '../components/orderColumns'
import type { Column } from '../components/DataTable'
import { ordersMissingIds } from '../data/ordersMissingIds'
import type { ChallengeDefinition, Order, Question, SuggestedQuery } from '../types'
import { formatCurrency } from '../utils/duplicates'
import { analyzeMissingIds } from '../utils/missingIds'
import { ordersToSqlTable } from '../utils/sql'
import { defineTable } from './defineTable'

const analysis = analyzeMissingIds(ordersMissingIds)
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
      { value: 'equals-null', label: 'WHERE customer_id = NULL' },
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

export const missingCustomerIds: ChallengeDefinition = {
  id: 'missing-customer-ids',
  title: 'Missing Customer IDs',
  category: 'Data Quality',
  difficulty: 'Beginner',
  description: 'Investigate missing customer identifiers and determine their impact on downstream data.',
  content: {
    problem: {
      text: 'The growth team is building a customer lifetime value report, but the numbers per customer look too low. The `orders` table comes from a checkout system that sometimes fails to attach a customer. Investigate how many orders are affected and what that means downstream.',
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
        { label: 'Missing customer IDs', value: analysis.missingRecords, tone: 'warning' },
        { label: 'Missing rate', value: `${Math.round(analysis.missingRate)}%`, tone: 'warning' },
        {
          label: 'Unattributed revenue',
          value: formatCurrency(analysis.unattributedRevenue),
          hint: `of ${formatCurrency(analysis.totalRevenue)} total`,
          tone: 'warning',
        },
      ],
      callout: {
        headline: `${analysis.missingRecords} orders have no usable customer_id.`,
        detail: `${analysis.nullCount} are NULL and ${analysis.emptyCount} are empty strings.`,
        ratio: { badPercent: analysis.missingRate, goodLabel: 'Has customer_id', badLabel: 'Missing customer_id' },
      },
    },
    tables: [
      defineTable({
        title: 'orders',
        columns,
        rows: ordersMissingIds,
        rowClassName: (_, index) => (analysis.isMissing[index] ? 'row-danger' : undefined),
      }),
    ],
    sql: { tables: sqlTables, suggestions },
    questions,
    lesson: {
      title: 'What are missing identifiers?',
      blocks: [
        { type: 'heading', text: 'What is a missing customer ID?' },
        {
          type: 'paragraph',
          text: "A row that should point at a customer but doesn't. It can be a real `NULL`, an empty string, or a placeholder such as `'N/A'`. They look similar on screen but behave differently in SQL.",
        },
        { type: 'heading', text: 'Why does it matter downstream?' },
        {
          type: 'paragraph',
          text: "Revenue is still recorded, but it belongs to nobody. Customer lifetime value, retention and cohort reports silently drop these rows, and joins to a customers table lose them.",
        },
        { type: 'heading', text: 'Common causes' },
        {
          type: 'list',
          items: [
            'Guest checkouts where the app never creates a customer record.',
            'An upstream service failing and writing the order before the customer lookup.',
            'ETL code converting missing values to empty strings instead of NULL.',
            'A schema change renaming or dropping the field in the source.',
          ],
        },
        { type: 'heading', text: 'SQL gotchas' },
        {
          type: 'list',
          items: [
            '`customer_id = NULL` never matches, because NULL is never equal to anything. Use `IS NULL`.',
            '`COUNT(customer_id)` skips NULLs but still counts empty strings.',
          ],
        },
        { type: 'heading', text: 'Finding every missing value' },
        {
          type: 'code',
          language: 'sql',
          code: `SELECT *
FROM orders
WHERE customer_id IS NULL
   OR TRIM(customer_id) = '';`,
        },
        { type: 'heading', text: 'Measuring the damage' },
        {
          type: 'code',
          language: 'sql',
          code: `SELECT
  COUNT(*)                                    AS total_orders,
  COUNT(customer_id)                          AS orders_with_customer,   -- ignores NULLs, not ''
  COUNT(DISTINCT customer_id)                 AS distinct_customers
FROM orders;`,
        },
      ],
    },
  },
}
