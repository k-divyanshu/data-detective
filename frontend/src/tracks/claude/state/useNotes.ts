import { usePersistentState } from '../../../shared/usePersistentState'
import type { Note } from '../types'

const STORAGE_KEY = 'data-detective-claude-notes-v1'

function isNoteList(value: unknown): value is Note[] {
  return Array.isArray(value) && value.every((item) => typeof item?.id === 'string' && typeof item?.body === 'string')
}

export type NoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>

export function useNotes() {
  const [notes, setNotes] = usePersistentState<Note[]>(STORAGE_KEY, [], isNoteList)

  return {
    notes,
    addNote: (input: NoteInput) => {
      const now = new Date().toISOString()
      setNotes((current) => [{ ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now }, ...current])
    },
    updateNote: (id: string, input: NoteInput) =>
      setNotes((current) =>
        current.map((note) => (note.id === id ? { ...note, ...input, updatedAt: new Date().toISOString() } : note)),
      ),
    deleteNote: (id: string) => setNotes((current) => current.filter((note) => note.id !== id)),
  }
}
