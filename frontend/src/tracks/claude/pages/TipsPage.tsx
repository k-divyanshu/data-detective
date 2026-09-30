import { useState } from 'react'
import { TipCard } from '../components/TipCard'
import { examDomains } from '../data/exam'
import { useTips } from '../state/useTips'

export function TipsPage() {
  const { tips, reactions, addTip, toggleUpvote, toggleBookmark, reportTip, unreportTip } = useTips()
  const [domainFilter, setDomainFilter] = useState<string>('all')
  const [savedOnly, setSavedOnly] = useState(false)

  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [domainId, setDomainId] = useState(examDomains[0].id)
  const [author, setAuthor] = useState('')

  const visible = tips
    .filter((tip) => domainFilter === 'all' || tip.domainId === domainFilter)
    .filter((tip) => !savedOnly || reactions.bookmarked.includes(tip.id))

  return (
    <>
      <h1>Community Tips</h1>
      <p className="notice">
        Community tips are personal experiences and are not official Anthropic guidance. They do not
        guarantee a pass. Tips you add and your votes are stored in this browser only for now.
      </p>

      <form
        className="card"
        onSubmit={(event) => {
          event.preventDefault()
          addTip({ title: title.trim(), text: text.trim(), domainId, author: author.trim() || 'Anonymous' })
          setTitle('')
          setText('')
        }}
      >
        <h2>Share a study tip</h2>
        <div className="field">
          <label htmlFor="tip-title">Title</label>
          <input id="tip-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} required />
        </div>
        <div className="field">
          <label htmlFor="tip-text">Tip</label>
          <textarea id="tip-text" className="sql-input plain-text" rows={3} value={text} onChange={(event) => setText(event.target.value)} maxLength={600} required />
        </div>
        <div className="field field-inline">
          <label htmlFor="tip-domain">Related domain</label>
          <select id="tip-domain" value={domainId} onChange={(event) => setDomainId(event.target.value)}>
            {examDomains.map((domain) => (
              <option key={domain.id} value={domain.id}>{domain.name}</option>
            ))}
          </select>
          <label htmlFor="tip-author">Display name</label>
          <input id="tip-author" value={author} onChange={(event) => setAuthor(event.target.value)} maxLength={40} placeholder="Anonymous" />
        </div>
        <button type="submit" className="button" disabled={title.trim() === '' || text.trim() === ''}>Add tip</button>
      </form>

      <div className="field field-inline">
        <label htmlFor="tip-filter">Show</label>
        <select id="tip-filter" value={domainFilter} onChange={(event) => setDomainFilter(event.target.value)}>
          <option value="all">All domains</option>
          {examDomains.map((domain) => (
            <option key={domain.id} value={domain.id}>{domain.name}</option>
          ))}
        </select>
        <label className="option-inline">
          <input type="checkbox" checked={savedOnly} onChange={(event) => setSavedOnly(event.target.checked)} />
          Saved tips only ({reactions.bookmarked.length})
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="muted">No tips match these filters.</p>
      ) : (
        <div className="grid grid-2">
          {visible.map((tip) => (
            <TipCard
              key={tip.id}
              tip={tip}
              upvoted={reactions.upvoted.includes(tip.id)}
              bookmarked={reactions.bookmarked.includes(tip.id)}
              reported={reactions.reported.includes(tip.id)}
              onUpvote={() => toggleUpvote(tip.id)}
              onBookmark={() => toggleBookmark(tip.id)}
              onReport={() => reportTip(tip.id)}
              onUndoReport={() => unreportTip(tip.id)}
            />
          ))}
        </div>
      )}
    </>
  )
}
