import { usePersistentState } from '../../../shared/usePersistentState'
import { starterTips } from '../data/starterTips'
import type { Tip, TipReactions } from '../types'

const TIPS_KEY = 'data-detective-claude-tips-v1'
const REACTIONS_KEY = 'data-detective-claude-tip-reactions-v1'
const noReactions: TipReactions = { upvoted: [], bookmarked: [], reported: [] }

function isTipList(value: unknown): value is Tip[] {
  return Array.isArray(value) && value.every((item) => typeof item?.id === 'string' && typeof item?.text === 'string')
}

function isReactions(value: unknown): value is TipReactions {
  const candidate = value as Partial<TipReactions> | null
  return (
    typeof candidate === 'object' &&
    candidate !== null &&
    Array.isArray(candidate.upvoted) &&
    Array.isArray(candidate.bookmarked) &&
    Array.isArray(candidate.reported)
  )
}

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id]
}

// Tips and reactions live in this browser only (there is no server yet).
export function useTips() {
  const [userTips, setUserTips] = usePersistentState<Tip[]>(TIPS_KEY, [], isTipList)
  const [reactions, setReactions] = usePersistentState<TipReactions>(REACTIONS_KEY, noReactions, isReactions)

  return {
    tips: [...userTips, ...starterTips].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    reactions,
    addTip: (input: Pick<Tip, 'title' | 'text' | 'domainId' | 'author'>) =>
      setUserTips((current) => [
        { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString(), origin: 'user' },
        ...current,
      ]),
    toggleUpvote: (id: string) => setReactions((current) => ({ ...current, upvoted: toggle(current.upvoted, id) })),
    toggleBookmark: (id: string) => setReactions((current) => ({ ...current, bookmarked: toggle(current.bookmarked, id) })),
    reportTip: (id: string) =>
      setReactions((current) => (current.reported.includes(id) ? current : { ...current, reported: [...current.reported, id] })),
    unreportTip: (id: string) => setReactions((current) => ({ ...current, reported: current.reported.filter((item) => item !== id) })),
  }
}
