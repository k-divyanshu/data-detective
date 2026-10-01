import type { Question } from '../../types'

export const agentsWorkflowsQuestions: Question[] = [
  {
    id: 'agent-workflow-vs-agent',
    domainId: 'agents-workflows',
    topic: 'Workflow versus agent',
    difficulty: 'beginner',
    question:
      'A pipeline extracts fields from an invoice, validates them against fixed rules, and writes them to a database. The steps are identical every time. What is the best design?',
    type: 'single',
    options: [
      { id: 'a', text: 'A workflow with predefined code paths, using Claude for the steps needing language understanding' },
      { id: 'b', text: 'A fully autonomous agent, because agents are always more accurate than any fixed pipeline' },
      { id: 'c', text: 'A manager agent that spawns a separate subagent for each field found on the invoice' },
      { id: 'd', text: 'Neither, because Claude cannot reliably follow a fixed sequence of steps in order' },
    ],
    correctAnswer: ['a'],
    explanation:
      'When the steps are known in advance, a workflow is simpler, more predictable and cheaper. Agents are for tasks where the path cannot be predicted.',
    whyIncorrect: {
      b: 'Autonomy adds cost and unpredictability; it is not automatically more accurate.',
      c: 'Extra agents add complexity a fixed process does not need.',
      d: 'Claude can be used inside fixed workflows.',
    },
    resourceIds: ['building-effective-agents'],
    sourceType: 'ai-generated',
  },
  {
    id: 'agent-routing',
    domainId: 'agents-workflows',
    topic: 'Workflow patterns',
    difficulty: 'beginner',
    question:
      'An app first classifies each incoming support request (billing, technical, account) and then sends it to a prompt specialized for that category. Which workflow pattern is this?',
    type: 'single',
    options: [
      { id: 'a', text: 'Routing' },
      { id: 'b', text: 'Prompt chaining' },
      { id: 'c', text: 'Evaluator-optimizer' },
      { id: 'd', text: 'Parallelization' },
    ],
    correctAnswer: ['a'],
    explanation: 'Routing classifies an input and directs it to a specialized follow-up path.',
    whyIncorrect: {
      b: 'Prompt chaining runs a fixed sequence of steps where each output feeds the next.',
      c: 'Evaluator-optimizer loops: one call generates, another critiques and refines.',
      d: 'Parallelization runs independent calls at the same time and combines them.',
    },
    resourceIds: ['building-effective-agents'],
    sourceType: 'ai-generated',
  },
  {
    id: 'agent-orchestrator',
    domainId: 'agents-workflows',
    topic: 'Workflow patterns',
    difficulty: 'intermediate',
    question:
      'A coding task may require changes in an unpredictable number of files. A central model must decide the subtasks at run time, delegate them, and combine the results. Which pattern fits?',
    type: 'single',
    options: [
      { id: 'a', text: 'Orchestrator-workers' },
      { id: 'b', text: 'Prompt chaining' },
      { id: 'c', text: 'Routing' },
      { id: 'd', text: 'A single prompt with a bigger limit' },
    ],
    correctAnswer: ['a'],
    explanation:
      'In orchestrator-workers, a central model breaks the task down dynamically and delegates to workers, which suits problems whose subtasks cannot be predicted.',
    whyIncorrect: {
      b: 'Prompt chaining has a fixed sequence decided in advance.',
      c: 'Routing picks one specialized path for an input; it does not decompose work dynamically.',
      d: 'A larger token limit does not add delegation or decomposition.',
    },
    resourceIds: ['building-effective-agents', 'claude-code-subagents'],
    sourceType: 'ai-generated',
  },
  {
    id: 'agent-safeguards',
    domainId: 'agents-workflows',
    topic: 'Agent loops',
    difficulty: 'intermediate',
    question: 'Select all safeguards that make an autonomous agent loop safer to run.',
    type: 'multiple',
    options: [
      { id: 'a', text: 'A maximum number of iterations or a spending budget that stops the loop' },
      { id: 'b', text: 'Human approval before destructive or irreversible actions are carried out' },
      { id: 'c', text: 'Logging each step and tool result so that failures can be traced afterwards' },
      { id: 'd', text: 'Letting the agent retry a failing action indefinitely until it finally succeeds' },
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation:
      'Limits, approval gates and traces keep an agent bounded and debuggable. Unbounded retries can waste money and repeat harmful actions.',
    whyIncorrect: {
      d: 'Unlimited retries risk runaway cost and repeated side effects; loops need stop conditions.',
    },
    resourceIds: ['building-effective-agents', 'agent-sdk-overview'],
    sourceType: 'ai-generated',
  },
]
