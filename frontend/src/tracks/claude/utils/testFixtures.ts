import type { Question, Resource } from '../types'

export function makeQuestion(overrides: Partial<Question> & { id: string }): Question {
  return {
    domainId: 'domain-a',
    topic: 'topic',
    difficulty: 'beginner',
    question: 'Q?',
    type: 'single',
    options: [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
      { id: 'c', text: 'C' },
    ],
    correctAnswer: ['a'],
    explanation: 'because',
    whyIncorrect: { b: 'no', c: 'no' },
    resourceIds: [],
    sourceType: 'ai-generated',
    ...overrides,
  }
}

export function makeResource(overrides: Partial<Resource> & { id: string }): Resource {
  return {
    title: overrides.id,
    url: 'https://example.com',
    provider: 'Example',
    type: 'documentation',
    domainIds: ['domain-a'],
    difficulty: 'beginner',
    cost: 'free',
    source: 'official',
    description: 'd',
    lastVerified: '2026-01-01',
    active: true,
    ...overrides,
  }
}

// Deterministic "random" numbers for shuffle tests.
export function seededRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}
