import { useState } from 'react'
import { DomainBadge } from '../components/DomainBadge'
import { examDomains } from '../data/exam'
import { resources } from '../data/resources'
import { questionBank } from '../data/questions'
import { useNotes, type NoteInput } from '../state/useNotes'
import type { Note } from '../types'

const blank = { title: '', body: '', domainId: '', topic: '', resourceId: '', questionId: '' }

function toInput(form: typeof blank): NoteInput {
  return {
    title: form.title.trim(),
    body: form.body.trim(),
    domainId: form.domainId || undefined,
    topic: form.topic.trim() || undefined,
    resourceId: form.resourceId || undefined,
    questionId: form.questionId || undefined,
  }
}

export function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useNotes()
  const [form, setForm] = useState(blank)
  const [editingId, setEditingId] = useState<string | null>(null)

  function set<K extends keyof typeof blank>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function startEdit(note: Note) {
    setEditingId(note.id)
    setForm({
      title: note.title,
      body: note.body,
      domainId: note.domainId ?? '',
      topic: note.topic ?? '',
      resourceId: note.resourceId ?? '',
      questionId: note.questionId ?? '',
    })
  }

  function reset() {
    setEditingId(null)
    setForm(blank)
  }

  return (
    <>
      <h1>My Notes</h1>
      <p className="muted">Private notes for your own study. They are saved in this browser only.</p>

      <form
        className="card"
        onSubmit={(event) => {
          event.preventDefault()
          if (editingId) updateNote(editingId, toInput(form))
          else addNote(toInput(form))
          reset()
        }}
      >
        <h2>{editingId ? 'Edit note' : 'New note'}</h2>
        <div className="field">
          <label htmlFor="note-title">Title</label>
          <input id="note-title" value={form.title} onChange={(event) => set('title', event.target.value)} maxLength={100} required />
        </div>
        <div className="field">
          <label htmlFor="note-body">Note</label>
          <textarea id="note-body" className="sql-input plain-text" rows={5} value={form.body} onChange={(event) => set('body', event.target.value)} required />
        </div>

        <div className="field field-inline">
          <label htmlFor="note-domain">Domain (optional)</label>
          <select id="note-domain" value={form.domainId} onChange={(event) => set('domainId', event.target.value)}>
            <option value="">None</option>
            {examDomains.map((domain) => (
              <option key={domain.id} value={domain.id}>{domain.name}</option>
            ))}
          </select>
          <label htmlFor="note-topic">Topic (optional)</label>
          <input id="note-topic" value={form.topic} onChange={(event) => set('topic', event.target.value)} maxLength={60} />
        </div>
        <div className="field field-inline">
          <label htmlFor="note-resource">Resource (optional)</label>
          <select id="note-resource" value={form.resourceId} onChange={(event) => set('resourceId', event.target.value)}>
            <option value="">None</option>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>{resource.title}</option>
            ))}
          </select>
          <label htmlFor="note-question">Practice question (optional)</label>
          <select id="note-question" value={form.questionId} onChange={(event) => set('questionId', event.target.value)}>
            <option value="">None</option>
            {questionBank.map((question) => (
              <option key={question.id} value={question.id}>{question.topic}: {question.question.slice(0, 60)}</option>
            ))}
          </select>
        </div>

        <div className="sql-actions">
          <button type="submit" className="button" disabled={form.title.trim() === '' || form.body.trim() === ''}>
            {editingId ? 'Save changes' : 'Add note'}
          </button>
          {editingId && <button type="button" className="button button-ghost" onClick={reset}>Cancel</button>}
        </div>
      </form>

      {notes.length === 0 ? (
        <p className="muted">No notes yet. Try writing down something you keep forgetting.</p>
      ) : (
        <div className="grid grid-2">
          {notes.map((note) => (
            <article key={note.id} className="card">
              <div className="challenge-card-meta">
                {note.domainId && <DomainBadge domainId={note.domainId} />}
                {note.topic && <span className="muted small">{note.topic}</span>}
              </div>
              <h3>{note.title}</h3>
              <p className="note-body">{note.body}</p>
              {note.resourceId && (
                <p className="muted small">Resource: {resources.find((r) => r.id === note.resourceId)?.title ?? 'removed'}</p>
              )}
              {note.questionId && (
                <p className="muted small">Question: {questionBank.find((q) => q.id === note.questionId)?.topic ?? 'removed'}</p>
              )}
              <p className="muted small">Updated {new Date(note.updatedAt).toLocaleDateString()}</p>
              <div className="help-row">
                <button type="button" className="link-button" onClick={() => startEdit(note)}>Edit</button>
                <button
                  type="button"
                  className="link-button"
                  onClick={() => {
                    if (window.confirm('Delete this note?')) deleteNote(note.id)
                  }}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
