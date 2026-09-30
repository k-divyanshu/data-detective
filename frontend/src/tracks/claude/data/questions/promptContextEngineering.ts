import type { Question } from '../../types'

export const promptContextEngineeringQuestions: Question[] = [
  {
    id: 'prompt-long-docs',
    domainId: 'prompt-context-engineering',
    topic: 'Long-context prompting',
    difficulty: 'beginner',
    question: 'You are sending Claude several long documents plus a question about them. Where should the question go?',
    type: 'single',
    options: [
      { id: 'a', text: 'After the documents, near the end of the prompt' },
      { id: 'b', text: 'Before the documents, at the very top' },
      { id: 'c', text: 'Hidden inside the middle of the largest document' },
      { id: 'd', text: 'It does not matter; placement never affects results' },
    ],
    correctAnswer: ['a'],
    explanation:
      'The prompting guidance recommends putting long reference material first and the query or instructions at the end, which tends to improve answers on long inputs.',
    whyIncorrect: {
      b: 'Placing the long material first and the question last is the recommended order.',
      c: 'Burying the question in the middle makes it easier to miss.',
      d: 'Placement can noticeably affect quality on long inputs.',
    },
    resourceIds: ['prompting-best-practices'],
    sourceType: 'ai-generated',
  },
  {
    id: 'prompt-few-shot',
    domainId: 'prompt-context-engineering',
    topic: 'Few-shot examples',
    difficulty: 'intermediate',
    question:
      'Claude\'s answers follow your instructions but the output format keeps varying. The instructions are already clear. Which change most directly helps?',
    type: 'single',
    options: [
      { id: 'a', text: 'Add a few well-chosen examples that show exactly the desired format' },
      { id: 'b', text: 'Make the instructions longer with stronger adjectives' },
      { id: 'c', text: 'Repeat the instructions in capital letters several times' },
      { id: 'd', text: 'Increase max_tokens' },
    ],
    correctAnswer: ['a'],
    explanation:
      'Examples show the model the target pattern. A few varied, relevant examples are often more effective than piling on more description.',
    whyIncorrect: {
      b: 'More adjectives add length without adding a concrete target.',
      c: 'Shouting does not clarify the format and can make behavior more brittle.',
      d: 'max_tokens limits length; it does not shape format.',
    },
    resourceIds: ['prompting-best-practices', 'prompt-engineering-interactive-tutorial'],
    sourceType: 'ai-generated',
  },
  {
    id: 'prompt-context-bloat',
    domainId: 'prompt-context-engineering',
    topic: 'Context engineering',
    difficulty: 'intermediate',
    question:
      'A long-running agent\'s context fills up with large tool outputs from early steps that are no longer needed, and answer quality drops. What is the best remedy?',
    type: 'single',
    options: [
      { id: 'a', text: 'Prune or summarize old tool results and keep only what later steps need' },
      { id: 'b', text: 'Keep everything and hope a larger window fixes it' },
      { id: 'c', text: 'Remove the system prompt to save space' },
      { id: 'd', text: 'Restart the agent with no memory after every step' },
    ],
    correctAnswer: ['a'],
    explanation:
      'Context is a limited resource. Trimming stale tool output, compacting history, or isolating work in subagents keeps the important information in view.',
    whyIncorrect: {
      b: 'Even with room to spare, irrelevant content dilutes attention and adds cost.',
      c: 'The system prompt holds the instructions the agent needs.',
      d: 'Discarding all state throws away information the task depends on.',
    },
    resourceIds: ['effective-context-engineering-for-ai-agents', 'context-windows'],
    sourceType: 'ai-generated',
  },
  {
    id: 'prompt-output-validation',
    domainId: 'prompt-context-engineering',
    topic: 'Output handling',
    difficulty: 'beginner',
    question: 'Your application parses JSON that Claude produces. Which practice is best?',
    type: 'single',
    options: [
      { id: 'a', text: 'Validate the parsed result against a schema and handle malformed or incomplete output with a retry or fallback' },
      { id: 'b', text: 'Assume it is valid because Claude sounds confident' },
      { id: 'c', text: 'Insert the output directly into the database to save time' },
      { id: 'd', text: 'Use a single regular expression and ignore failures' },
    ],
    correctAnswer: ['a'],
    explanation:
      'Model output is untrusted input to the rest of your system. Validate it, parse defensively, and decide in advance what happens when it is wrong.',
    whyIncorrect: {
      b: 'Confident wording is not evidence of correctness.',
      c: 'Unvalidated output can corrupt data or be exploited.',
      d: 'Ignoring failures hides errors that then surface downstream.',
    },
    resourceIds: ['structured-outputs'],
    sourceType: 'ai-generated',
  },
]
