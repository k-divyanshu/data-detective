import type { Column } from '../components/DataTable'
import { orderColumns } from '../components/orderColumns'
import { customers, ordersToJoin } from '../data/orphanOrders'
import type { ChallengeDefinition, Customer, Question, SuggestedQuery } from '../types'
import { formatCurrency } from '../utils/duplicates'
import { analyzeOrphanOrders } from '../utils/joins'
import { customersToSqlTable, ordersToSqlTable } from '../utils/sql'
import { defineTable } from './defineTable'

const analysis = analyzeOrphanOrders(ordersToJoin, customers)

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
    answer: analysis.orphanOrders,
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

export const ordersVanishAfterJoin: ChallengeDefinition = {
  id: 'orders-vanish-after-join',
  title: 'Orders That Vanish After a Join',
  category: 'SQL Joins',
  difficulty: 'Intermediate',
  description:
    'A join between orders and customers loses revenue without any error. Find the orphaned orders and choose the right join.',
  content: {
    problem: {
      text: 'A revenue-by-country report joins `orders` to `customers`. Finance notices that the report total is lower than the total in the orders table, but no errors were logged. Find out where the revenue went and how to report it correctly.',
      meta: [
        { label: 'Datasets', value: 'orders, customers' },
        { label: 'Source', value: 'Synthetic sample' },
        { label: 'Join key', value: 'customer_id' },
        { label: 'Rows', value: `${ordersToJoin.length} orders · ${customers.length} customers` },
      ],
    },
    summary: {
      stats: [
        { label: 'Orders', value: analysis.totalOrders },
        { label: 'Customers', value: customers.length },
        { label: 'Revenue in orders', value: formatCurrency(analysis.totalRevenue) },
        { label: 'Revenue after INNER JOIN', value: formatCurrency(analysis.innerJoinRevenue), tone: 'warning' },
      ],
      callout: {
        headline: `${formatCurrency(analysis.lostRevenue)} of revenue disappears in the join.`,
        detail: `That is ${Math.round(analysis.lostRate)}% of the total.`,
        ratio: {
          badPercent: analysis.lostRate,
          goodLabel: 'Revenue kept by the join',
          badLabel: 'Revenue lost by the join',
        },
      },
    },
    tables: [
      defineTable({ title: 'orders', columns: orderColumns, rows: ordersToJoin }),
      defineTable({ title: 'customers', columns: customerColumns, rows: customers }),
    ],
    sql: { tables: sqlTables, suggestions },
    questions,
    lesson: {
      title: 'How can a join lose rows?',
      blocks: [
        { type: 'heading', text: 'INNER JOIN keeps only matches' },
        {
          type: 'paragraph',
          text: '`orders INNER JOIN customers` returns a row only when the `customer_id` exists on *both* sides. An order whose customer is missing is dropped without any error or warning, and revenue quietly shrinks.',
        },
        { type: 'heading', text: 'LEFT JOIN keeps everything on the left' },
        {
          type: 'paragraph',
          text: '`orders LEFT JOIN customers` keeps every order. When there is no customer, the customer columns are `NULL`. That makes the problem visible: filter on `c.customer_id IS NULL` to list the orphans.',
        },
        { type: 'heading', text: 'Why do orphan rows exist?' },
        {
          type: 'list',
          items: [
            'Orders arrive before the customer record is loaded (late-arriving dimensions).',
            'Customers were deleted or merged while their orders remained.',
            'Different systems format IDs differently (`C011` vs `c011`).',
            'Test or guest orders that were never linked to a customer.',
          ],
        },
        { type: 'heading', text: 'A trap: NOT IN and NULL' },
        {
          type: 'paragraph',
          text: '`WHERE customer_id NOT IN (SELECT customer_id FROM customers)` returns nothing if that subquery contains a `NULL`. The `LEFT JOIN … IS NULL` or `NOT EXISTS` pattern is safer.',
        },
        { type: 'heading', text: 'Finding orphans' },
        {
          type: 'code',
          language: 'sql',
          code: `-- Orders with no matching customer (an "anti-join")
SELECT o.*
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;`,
        },
        { type: 'heading', text: 'Reporting without losing revenue' },
        {
          type: 'code',
          language: 'sql',
          code: `-- Keep every order, even without a customer
SELECT o.order_id,
       o.amount,
       COALESCE(c.country, 'Unknown') AS country
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id;`,
        },
      ],
    },
  },
}
