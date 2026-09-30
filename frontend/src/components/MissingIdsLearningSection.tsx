import { CodeBlock } from './CodeBlock'

const findSql = `SELECT *
FROM orders
WHERE customer_id IS NULL
   OR TRIM(customer_id) = '';`

const impactSql = `SELECT
  COUNT(*)                                    AS total_orders,
  COUNT(customer_id)                          AS orders_with_customer,   -- ignores NULLs, not ''
  COUNT(DISTINCT customer_id)                 AS distinct_customers
FROM orders;`

export function MissingIdsLearningSection() {
  return (
    <section className="card learning">
      <h2>What are missing identifiers?</h2>

      <h3>What is a missing customer ID?</h3>
      <p>
        A row that should point at a customer but doesn't. It can be a real <code>NULL</code>,
        an empty string, or a placeholder such as <code>'N/A'</code>. They look similar on
        screen but behave differently in SQL.
      </p>

      <h3>Why does it matter downstream?</h3>
      <p>
        Revenue is still recorded, but it belongs to nobody. Customer lifetime value, retention
        and cohort reports silently drop these rows, and joins to a customers table lose them.
      </p>

      <h3>Common causes</h3>
      <ul>
        <li>Guest checkouts where the app never creates a customer record.</li>
        <li>An upstream service failing and writing the order before the customer lookup.</li>
        <li>ETL code converting missing values to empty strings instead of NULL.</li>
        <li>A schema change renaming or dropping the field in the source.</li>
      </ul>

      <h3>SQL gotchas</h3>
      <ul>
        <li>
          <code>customer_id = NULL</code> never matches, because NULL is never equal to anything.
          Use <code>IS NULL</code>.
        </li>
        <li>
          <code>COUNT(customer_id)</code> skips NULLs but still counts empty strings.
        </li>
      </ul>

      <h3>Finding every missing value</h3>
      <CodeBlock language="sql" code={findSql} />

      <h3>Measuring the damage</h3>
      <CodeBlock language="sql" code={impactSql} />
    </section>
  )
}
