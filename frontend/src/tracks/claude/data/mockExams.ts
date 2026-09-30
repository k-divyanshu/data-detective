import type { MockExam } from '../types'

// The real exam has 53 items in 120 minutes (about 2.3 minutes per item). This practice mock uses
// the same pace, and its questions are spread across domains roughly like the published weights.
export const mockExams: MockExam[] = [
  {
    id: 'mock-starter-20',
    title: 'Starter Mock (20 questions)',
    description: 'A short, timed run-through across all eight domains, weighted toward the biggest ones.',
    durationMinutes: 45,
    questionIds: [
      'app-tool-loop', 'app-batch', 'app-streaming', 'app-caching-fit', 'app-model-pinning', 'app-stateless',
      'model-tier-choice', 'model-cache-cost', 'model-nondeterminism',
      'agent-workflow-vs-agent', 'agent-routing', 'agent-safeguards',
      'prompt-long-docs', 'prompt-context-bloat',
      'tools-descriptions', 'tools-mcp-transport',
      'sec-indirect-injection', 'sec-least-privilege',
      'code-enforce-rules',
      'eval-rate-limit',
    ],
  },
]
