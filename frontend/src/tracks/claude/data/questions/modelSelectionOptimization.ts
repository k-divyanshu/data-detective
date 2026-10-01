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
      { id: 'a', text: 'Use the smallest and fastest model tier that still meets the accuracy target' },
      { id: 'b', text: 'Use the most capable tier available, to be safe on every single message' },
      { id: 'c', text: 'Use the largest model at its highest effort level for every single call' },
      { id: 'd', text: 'Choose whichever model was released most recently, since newer is always better' },
    ],
    correctAnswer: ['a'],
    explanation:
      'Model choice is a quality, latency and cost trade-off. When a smaller tier meets the requirement, it is usually faster and cheaper.',
    whyIncorrect: {
      b: 'A more capable tier adds cost and latency you have already shown you do not need.',
      c: 'A larger model at high effort adds tokens and delay, which works against a simple, high-volume task.',
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
      { id: 'a', text: 'The system prompt, the messages, the tool definitions, and the tokens Claude generates' },
      { id: 'b', text: 'Only the user\'s latest message, because earlier turns are summarized automatically' },
      { id: 'c', text: 'Only the system prompt, since messages are stored outside the context window' },
      { id: 'd', text: 'Only the tokens Claude generates, because input tokens are billed but not counted' },
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
      { id: 'a', text: 'Reading a cached prefix costs less than normal input, while writing it costs somewhat more' },
      { id: 'b', text: 'Cache reads and cache writes are both priced exactly the same as ordinary input tokens' },
      { id: 'c', text: 'Once caching is switched on, every token in the request becomes free of charge from then on' },
      { id: 'd', text: 'Caching only lowers the price of output tokens and leaves input pricing completely unchanged' },
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
      'A teammate says that sending the same request again always gives identical output, so tests can compare exact strings. What is the best response?',
    type: 'single',
    options: [
      { id: 'a', text: 'Outputs are not guaranteed to be identical between runs, so use tolerant checks or graded evaluations' },
      { id: 'b', text: 'Agreed, an identical request guarantees byte-identical output every time it is sent' },
      { id: 'c', text: 'That is only true for the smallest models, so exact matching works on the larger ones' },
      { id: 'd', text: 'Any variation comes only from prompt caching, so disabling the cache fixes the tests' },
    ],
    correctAnswer: ['a'],
    explanation:
      'Even with settings that reduce randomness, output is not guaranteed to be identical between runs, and some newer models do not let you change sampling parameters such as temperature at all. Design tests that tolerate harmless variation.',
    whyIncorrect: {
      b: 'Identical input does not guarantee identical output, so exact-match tests are brittle.',
      c: 'Non-determinism is not limited to one model size.',
      d: 'Caching affects cost and speed, not the content of generated text.',
    },
    resourceIds: ['define-success-criteria-and-build-evaluations', 'model-deprecations'],
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
      { id: 'a', text: 'Run your evaluation set on the new model and compare the results with the current one' },
      { id: 'b', text: 'Change the model name and ship it, since newer models always behave the same way' },
      { id: 'c', text: 'Switch over now and wait for users to report anything that seems to have changed' },
      { id: 'd', text: 'Assume your prompts never need retesting when the underlying model is replaced' },
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
