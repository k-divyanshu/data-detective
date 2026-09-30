import { CodeBlock } from './CodeBlock'

const bySegmentSql = `-- Which slice of the business changed?
SELECT order_date, region, SUM(amount) AS revenue
FROM orders
GROUP BY order_date, region
ORDER BY order_date, region;`

const volumeCheckSql = `-- Did any load report success while moving no data?
SELECT run_date, region, rows_extracted, rows_loaded
FROM pipeline_runs
WHERE status = 'SUCCESS'
  AND rows_loaded = 0;`

export function RevenueDropLearningSection() {
  return (
    <section className="card learning">
      <h2>How do you investigate a sudden metric change?</h2>

      <h3>Start with the shape of the problem</h3>
      <p>
        Find <em>when</em> the metric changed and whether it fell everywhere or in one slice
        (region, product, channel). A drop that starts on one exact day usually points to a
        system change, not customer behavior.
      </p>

      <h3>Then compare the pipeline to the data</h3>
      <p>
        Pipeline metadata tells you what the job believed it did. If a run says{' '}
        <code>SUCCESS</code> but extracted or loaded zero rows, the job ran without failing
        loudly, and the warehouse silently lost data.
      </p>

      <h3>Common causes</h3>
      <ul>
        <li>A source API or file returns empty results and the job treats that as valid.</li>
        <li>A schema or permission change makes one segment's query match nothing.</li>
        <li>A filter or join added in a pipeline change drops rows for one segment.</li>
        <li>A partial load or failed retry leaves a partition missing.</li>
      </ul>

      <h3>How teams prevent it</h3>
      <ul>
        <li>Row-count checks: fail the run if today's volume is far below the usual.</li>
        <li>Freshness and completeness monitors per segment, not just in total.</li>
        <li>Reconciling warehouse totals with the source system.</li>
      </ul>

      <h3>Slicing revenue by segment</h3>
      <CodeBlock language="sql" code={bySegmentSql} />

      <h3>Checking pipeline volume</h3>
      <CodeBlock language="sql" code={volumeCheckSql} />
    </section>
  )
}
