import { CodeBlock } from './CodeBlock'

const antiJoinSql = `-- Orders with no matching customer (an "anti-join")
SELECT o.*
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;`

const leftJoinSql = `-- Keep every order, even without a customer
SELECT o.order_id,
       o.amount,
       COALESCE(c.country, 'Unknown') AS country
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id;`

export function OrphanOrdersLearningSection() {
  return (
    <section className="card learning">
      <h2>How can a join lose rows?</h2>

      <h3>INNER JOIN keeps only matches</h3>
      <p>
        <code>orders INNER JOIN customers</code> returns a row only when the{' '}
        <code>customer_id</code> exists on <em>both</em> sides. An order whose customer is missing
        is dropped without any error or warning, and revenue quietly shrinks.
      </p>

      <h3>LEFT JOIN keeps everything on the left</h3>
      <p>
        <code>orders LEFT JOIN customers</code> keeps every order. When there is no customer, the
        customer columns are <code>NULL</code>. That makes the problem visible: filter on{' '}
        <code>c.customer_id IS NULL</code> to list the orphans.
      </p>

      <h3>Why do orphan rows exist?</h3>
      <ul>
        <li>Orders arrive before the customer record is loaded (late-arriving dimensions).</li>
        <li>Customers were deleted or merged while their orders remained.</li>
        <li>Different systems format IDs differently (<code>C011</code> vs <code>c011</code>).</li>
        <li>Test or guest orders that were never linked to a customer.</li>
      </ul>

      <h3>A trap: NOT IN and NULL</h3>
      <p>
        <code>WHERE customer_id NOT IN (SELECT customer_id FROM customers)</code> returns nothing
        if that subquery contains a <code>NULL</code>. The <code>LEFT JOIN … IS NULL</code> or{' '}
        <code>NOT EXISTS</code> pattern is safer.
      </p>

      <h3>Finding orphans</h3>
      <CodeBlock language="sql" code={antiJoinSql} />

      <h3>Reporting without losing revenue</h3>
      <CodeBlock language="sql" code={leftJoinSql} />
    </section>
  )
}
