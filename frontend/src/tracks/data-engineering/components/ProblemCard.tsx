import type { ReactNode } from 'react'

interface ProblemCardProps {
  children: ReactNode // the scenario text
  meta: { label: string; value: ReactNode }[]
}

// The "Problem" box at the top of every challenge.
export function ProblemCard({ children, meta }: ProblemCardProps) {
  return (
    <section className="card">
      <h2>Problem</h2>
      <p>{children}</p>
      <dl className="meta-list">
        {meta.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
