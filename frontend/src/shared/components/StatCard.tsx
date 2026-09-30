interface StatCardProps {
  label: string
  value: string | number
  hint?: string
  tone?: 'default' | 'warning'
}

export function StatCard({ label, value, hint, tone = 'default' }: StatCardProps) {
  return (
    <div className={`card stat-card ${tone === 'warning' ? 'stat-warning' : ''}`}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {hint && <span className="stat-hint">{hint}</span>}
    </div>
  )
}
