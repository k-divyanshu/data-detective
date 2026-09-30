interface RatioBarProps {
  badPercent: number
  goodLabel: string
  badLabel: string
}

export function RatioBar({ badPercent, goodLabel, badLabel }: RatioBarProps) {
  return (
    <>
      <div
        className="bar"
        role="img"
        aria-label={`${badPercent.toFixed(0)} percent ${badLabel.toLowerCase()}`}
      >
        <div className="bar-clean" style={{ width: `${100 - badPercent}%` }} />
        <div className="bar-dup" style={{ width: `${badPercent}%` }} />
      </div>
      <div className="bar-legend muted">
        <span><i className="dot dot-clean" /> {goodLabel}</span>
        <span><i className="dot dot-dup" /> {badLabel}</span>
      </div>
    </>
  )
}
