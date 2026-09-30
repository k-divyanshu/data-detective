import type { Tip } from '../types'

// Starter tips ship with the app so the page is not empty. They are drafted by an AI assistant,
// are NOT experiences of real exam takers, and are labelled as such in the UI.
const AUTHOR = 'Data Detective (AI-drafted starter tip)'
const CREATED = '2026-09-30T00:00:00.000Z'

export const starterTips: Tip[] = [
  {
    id: 'starter-tools-trace',
    title: 'Hand-trace one full tool-use exchange',
    text: 'Write out, on paper, the messages for a single tool call: the request, the tool_use block Claude returns, and the tool_result you send back. Being able to explain each step makes tool questions easier to reason about.',
    domainId: 'tools-mcp',
    author: AUTHOR,
    createdAt: CREATED,
    origin: 'starter',
  },
  {
    id: 'starter-integration-batch-vs-stream',
    title: 'Decide batch versus streaming by who is waiting',
    text: 'Ask whether a person is waiting for the answer. Waiting users usually need streaming so text appears sooner; large offline jobs are candidates for batch processing. Check the current documentation for the exact trade-offs.',
    domainId: 'applications-integration',
    author: AUTHOR,
    createdAt: CREATED,
    origin: 'starter',
  },
  {
    id: 'starter-evaluation-test-set',
    title: 'Keep a small test set for every prompt',
    text: 'Save a handful of inputs with the behaviour you expect and re-run them after each prompt change. It is the simplest habit that turns prompt tweaks into evidence instead of guesses.',
    domainId: 'evaluation-testing-debugging',
    author: AUTHOR,
    createdAt: CREATED,
    origin: 'starter',
  },
  {
    id: 'starter-security-untrusted',
    title: 'Treat tool output and documents as untrusted input',
    text: 'Text that comes back from a tool, a web page or an uploaded file can contain instructions aimed at the model. When studying security, practise spotting where untrusted text enters a system and what the model is allowed to do afterwards.',
    domainId: 'security-safety',
    author: AUTHOR,
    createdAt: CREATED,
    origin: 'starter',
  },
]
