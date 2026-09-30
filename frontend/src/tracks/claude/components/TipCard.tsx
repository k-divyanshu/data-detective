import { Badge } from '../../../shared/components/Badge'
import type { Tip } from '../types'
import { DomainBadge } from './DomainBadge'

interface TipCardProps {
  tip: Tip
  upvoted: boolean
  bookmarked: boolean
  reported: boolean
  onUpvote: () => void
  onBookmark: () => void
  onReport: () => void
  onUndoReport: () => void
}

export function TipCard({ tip, upvoted, bookmarked, reported, onUpvote, onBookmark, onReport, onUndoReport }: TipCardProps) {
  if (reported) {
    return (
      <article className="card tip-card muted">
        <p>You reported this tip, so it is hidden on this device.</p>
        <button type="button" className="link-button" onClick={onUndoReport}>Undo</button>
      </article>
    )
  }

  return (
    <article className="card tip-card">
      <div className="challenge-card-meta">
        <DomainBadge domainId={tip.domainId} />
        {tip.origin === 'starter' ? <Badge tone="purple">AI-DRAFTED</Badge> : <Badge tone="amber">COMMUNITY</Badge>}
      </div>
      <h3>{tip.title}</h3>
      <p>{tip.text}</p>
      <p className="muted small">
        {tip.author} · {new Date(tip.createdAt).toLocaleDateString()}
      </p>
      <div className="help-row">
        <button type="button" className={`link-button ${upvoted ? 'link-active' : ''}`} aria-pressed={upvoted} onClick={onUpvote}>
          ▲ {upvoted ? 'Upvoted (1)' : 'Upvote (0)'}
        </button>
        <button type="button" className={`link-button ${bookmarked ? 'link-active' : ''}`} aria-pressed={bookmarked} onClick={onBookmark}>
          {bookmarked ? '★ Saved' : '☆ Save'}
        </button>
        <button type="button" className="link-button" onClick={onReport}>Report</button>
      </div>
    </article>
  )
}
