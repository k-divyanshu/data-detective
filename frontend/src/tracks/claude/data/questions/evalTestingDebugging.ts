import type { Question } from '../../types'

export const evalTestingDebuggingQuestions: Question[] = [
  {
    id: 'eval-rate-limit',
    domainId: 'evaluation-testing-debugging',
    topic: 'Error handling',
    difficulty: 'beginner',
    question: 'Your application receives a 429 rate limit error from the API. What is the best recovery strategy?',
    type: 'single',
    options: [
      { id: 'a', text: 'Wait and retry with exponential backoff, respecting any retry-after guidance' },
      { id: 'b', text: 'Retry immediately in a tight loop' },
      { id: 'c', text: 'Rewrite the prompt, since the error means it was invalid' },
      { id: 'd', text: 'Treat it as an authentication problem and rotate the key' },
    ],
    correctAnswer: ['a'],
    explanation:
      'Rate limit errors are transient. Backing off and retrying is the standard recovery, while errors such as invalid requests need the request itself to be fixed.',
    whyIncorrect: {
      b: 'Hammering the API makes rate limiting worse.',
      c: 'A rate limit is about request volume, not prompt content.',
      d: 'Authentication problems produce different errors, and rotating keys does not raise a rate limit.',
    },
    resourceIds: ['errors'],
    sourceType: 'ai-generated',
  },
  {
    id: 'eval-isolate-origin',
    domainId: 'evaluation-testing-debugging',
    topic: 'Debugging',
    difficulty: 'intermediate',
    question:
      'Users report wrong answers from your Claude-powered feature. What is the most useful first debugging step?',
    type: 'single',
    options: [
      { id: 'a', text: 'Inspect the exact request and response to see whether the integration built the wrong input or the model produced a wrong output' },
      { id: 'b', text: 'Immediately switch to a larger model' },
      { id: 'c', text: 'Add more instructions to the prompt without looking at any failures' },
      { id: 'd', text: 'Assume the model is at fault' },
    ],
    correctAnswer: ['a'],
    explanation:
      'A trace of the real request and response tells you where the problem originates: missing context, a malformed tool result and similar integration bugs look like model errors but are fixed differently.',
    whyIncorrect: {
      b: 'A bigger model may mask a bug in your integration and adds cost.',
      c: 'Changing the prompt blindly can hide or worsen the real cause.',
      d: 'Assuming a cause before checking the trace often sends you in the wrong direction.',
    },
    resourceIds: ['demystifying-evals-for-ai-agents', 'define-success-criteria-and-build-evaluations'],
    sourceType: 'ai-generated',
  },
]
