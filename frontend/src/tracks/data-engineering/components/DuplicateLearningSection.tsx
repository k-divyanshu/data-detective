import { CodeBlock } from '../../../shared/components/CodeBlock'

const detectSql = `SELECT order_id, COUNT(*) AS occurrences
FROM orders
GROUP BY order_id
HAVING COUNT(*) > 1;`

const dedupeSql = `-- Keep only the first row for each order_id
SELECT *
FROM (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY order_date) AS rn
  FROM orders
) t
WHERE rn = 1;`

export function DuplicateLearningSection() {
  return (
    <section className="card learning">
      <h2>What are duplicate records?</h2>

      <h3>What is a duplicate record?</h3>
      <p>
        A duplicate is a row that represents something already recorded. Here, two rows with
        the same <code>order_id</code> describe the same order, so the table says it happened
        twice.
      </p>

      <h3>Why are duplicates dangerous in analytics?</h3>
      <p>
        Dashboards trust what is in the table. Duplicates silently inflate counts and totals,
        so reports look healthy while being wrong, and nothing fails loudly.
      </p>

      <h3>How do they affect revenue?</h3>
      <p>
        <code>SUM(amount)</code> adds every row. A $120 order stored twice counts as $240, and
        metrics built on it (average order value, customer lifetime value) drift as well.
      </p>

      <h3>Common causes in pipelines</h3>
      <ul>
        <li>A job retried after a partial failure and loaded the same batch again.</li>
        <li>Overlapping extraction windows (e.g. “last 24h” run every 12h).</li>
        <li>Joins on a non-unique key that fan out rows.</li>
        <li>Source systems that emit the same event more than once (at-least-once delivery).</li>
      </ul>

      <h3>Detecting duplicates with SQL</h3>
      <p className="muted">Group by the key that should be unique and keep groups seen more than once.</p>
      <CodeBlock language="sql" code={detectSql} />

      <h3>Removing them</h3>
      <CodeBlock language="sql" code={dedupeSql} />
    </section>
  )
}
