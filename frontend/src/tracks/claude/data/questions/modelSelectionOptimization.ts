import type { Question } from '../../types'

export const modelSelectionOptimizationQuestions: Question[] = [
  {
    id: 'model-tier-choice',
    domainId: 'model-selection-optimization',
    topic: 'Model selection trade-offs',
    difficulty: 'beginner',
    question:
      'A high-volume feature sorts short messages into five categories. Latency and cost matter, and a smaller model already meets your accuracy target in testing. Which choice is most appropriate?',
    type: 'single',
    options: [
      { id: 'a', text: 'Use the smallest, fastest model tier that meets the accuracy target' },
      { id: 'b', text: 'Use the most capable tier to be safe' },
      { id: 'c', text: 'Use the largest model with extended thinking on every call' },
      { id: 'd', text: 'Pick whichever model was released most recently' },
    ],
    correctAnswer: ['a'],
    explanation:
      'Model choice is a quality, latency and cost trade-off. When a smaller tier meets the requirement, it is usually faster and cheaper.',
    whyIncorrect: {
      b: 'A more capable tier adds cost and latency you have already shown you do not need.',
      c: 'Extended thinking adds tokens and delay, which works against a simple, high-volume task.',
      d: 'Release date is not a selection criterion; fit to the task is.',
    },
    resourceIds: ['choosing-a-model', 'models-overview'],
    sourceType: 'ai-generated',
  },
  {
    id: 'model-context-window',
    domainId: 'model-selection-optimization',
    topic: 'Context windows and tokens',
    difficulty: 'beginner',
    question: 'What consumes the context window in a single request?',
    type: 'single',
    options: [
      { id: 'a', text: 'The system prompt, the conversation messages, tool definitions, and the tokens Claude generates' },
      { id: 'b', text: 'Only the user\'s latest message' },
      { id: 'c', text: 'Only the system prompt' },
      { id: 'd', text: 'Only the tokens Claude generates' },
    ],
    correctAnswer: ['a'],
    explanation:
      'Everything the model reads or writes counts: instructions, history, tool definitions and its own output. That is why long conversations and large tool outputs need managing.',
    whyIncorrect: {
      b: 'Earlier turns and instructions also count.',
      c: 'The system prompt is only one part of the total.',
      d: 'Input tokens count too, not just output.',
    },
    resourceIds: ['context-windows'],
    sourceType: 'ai-generated',
  },
  {
    id: 'model-cache-cost',
    domainId: 'model-selection-optimization',
    topic: 'Cost and token management',
    difficulty: 'intermediate',
    question: 'Which statement about prompt caching costs is accurate?',
    type: 'single',
    options: [
      { id: 'a', text: 'Reading a cached prefix costs less than normal input tokens, while writing to the cache costs somewhat more than normal input' },
      { id: 'b', text: 'Cache reads and cache writes cost the same as ordinary input tokens' },
      { id: 'c', text: 'Once caching is on, all tokens are free' },
      { id: 'd', text: 'Caching only reduces the price of output tokens' },
    ],
    correctAnswer: ['a'],
    explanation:
      'Caching trades a slightly higher cost to write the prefix for a much lower cost each time it is read, so it pays off when the prefix is reused enough.',
    whyIncorrect: {
      b: 'The pricing differs on purpose: cheap reads, more expensive writes.',
      c: 'Cached tokens are discounted, not free.',
      d: 'The discount applies to reading cached input, not to output tokens.',
    },
    resourceIds: ['prompt-caching', 'pricing'],
    sourceType: 'ai-generated',
  },
  {
    id: 'model-nondeterminism',
    domainId: 'model-selection-optimization',
    topic: 'LLM fundamentals',
    difficulty: 'intermediate',
    question:
      'A teammate says that setting temperature to 0 makes Claude\'s output identical every time, so tests can compare exact strings. What is the best response?',
    type: 'single',
    options: [
      { id: 'a', text: 'Outputs can still vary even at low temperature, so use tolerant checks or graded evaluations instead of exact matching' },
      { id: 'b', text: 'Agreed; temperature 0 guarantees identical output' },
      { id: 'c', text: 'That is only true for the smallest models' },
      { id: 'd', text: 'Variation only ever comes from prompt caching' },
    ],
    correctAnswer: ['a'],
    explanation:
      'Lower temperature reduces randomness but does not guarantee identical outputs. Design tests that tolerate harmless variation.',
    whyIncorrect: {
      b: 'The documentation warns that outputs are not fully deterministic even at temperature 0.',
      c: 'Non-determinism is not limited to one model size.',
      d: 'Caching affects cost and speed, not the content of generated text.',
    },
    resourceIds: ['define-success-criteria-and-build-evaluations'],
    sourceType: 'ai-generated',
  },
  {
    id: 'model-upgrade',
    domainId: 'model-selection-optimization',
    topic: 'Model upgrades',
    difficulty: 'intermediate',
    question: 'You want to move a production feature to a newer model. What should you do first?',
    type: 'single',
    options: [
      { id: 'a', text: 'Run your evaluation set on the new model and compare results with the current one' },
      { id: 'b', text: 'Change the model name; newer models always behave the same' },
      { id: 'c', text: 'Switch and wait for users to report problems' },
      { id: 'd', text: 'Assume prompts never need retesting across models' },
    ],
    correctAnswer: ['a'],
    explanation:
      'Behavior can change between model releases. An evaluation set turns "it seems fine" into evidence before users are affected.',
    whyIncorrect: {
      b: 'Behavior changes between releases are possible, which is why you test.',
      c: 'Using users as the test suite risks harming them and hides the cause.',
      d: 'Prompts tuned for one model may need adjustment for another.',
    },
    resourceIds: ['define-success-criteria-and-build-evaluations', 'choosing-a-model'],
    sourceType: 'ai-generated',
  },
]
