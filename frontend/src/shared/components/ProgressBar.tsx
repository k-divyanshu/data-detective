interface ProgressBarProps {
  percent: number // 0-100
  label?: string // accessible description
  tone?: 'default' | 'good' | 'warning'
}

export function ProgressBar({ percent, label, tone = 'default' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent))
  return (
    <div
      className="meter"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-label={label}
    >
      <div className={`meter-fill meter-${tone}`} style={{ width: `${clamped}%` }} />
    </div>
  )
}
