import type { ExamDomain, ExamInfo } from '../types'

// Source: "Claude Certified Developer – Foundations Exam Guide", Version 1.0 (July 2026), plus the
// official certification FAQ. Both were read and checked on 2026-09-30. The exam can change
// ("subject to change without notice"), so update this file, and only this file, when it does.
export const examInfo: ExamInfo = {
  name: 'Claude Certified Developer – Foundations',
  shortName: 'CCDV-F',
  officialGuideUrl: 'https://anthropic-partners.skilljar.com/claude-certified-developer-foundations-certification',
  guideNote: 'Domains and weights below come from Exam Guide v1.0 (July 2026).',
  lastVerified: '2026-09-30',
  facts: [
    { label: 'Items', value: '53, multiple-choice and multiple-response' },
    { label: 'Time limit', value: '120 minutes' },
    { label: 'Passing score', value: 'Scaled score of 720 on a 100–1,000 scale' },
    { label: 'Price', value: '$125 USD before partner discounts' },
    { label: 'Delivery', value: 'Proctored via Pearson VUE, online or at a test center; English only' },
    { label: 'Availability', value: 'Currently only for people at Claude Partner Network organizations (company email required)' },
  ],
}

export const examDomains: ExamDomain[] = [
  {
    id: 'agents-workflows',
    name: 'Agents and Workflows',
    shortName: 'Agents',
    weightPercent: 14.7,
    description: 'Choosing between workflows and agents, building agents with Claude, and common agent patterns.',
    topics: ['Agent architecture', 'Agent construction with Claude', 'Agent patterns and frameworks'],
  },
  {
    id: 'applications-integration',
    name: 'Applications and Integration',
    shortName: 'Integration',
    weightPercent: 33.1,
    description: 'The Claude API, application design, configuration management and core software engineering.',
    topics: [
      'Understanding requirements',
      'Systems life cycle',
      'Claude API mechanics',
      'Software engineering foundations',
      'Claude application design',
      'Configuration management',
    ],
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    shortName: 'Claude Code',
    weightPercent: 3.1,
    description: 'Operating Claude Code: rules, skills, commands, agents, CLAUDE.md and settings.json.',
    topics: ['Claude Code operation'],
  },
  {
    id: 'evaluation-testing-debugging',
    name: 'Eval, Testing, and Debugging',
    shortName: 'Eval & Debug',
    weightPercent: 2.6,
    description: 'Debugging and error handling for Claude applications.',
    topics: ['Debugging and error handling'],
  },
  {
    id: 'model-selection-optimization',
    name: 'Model Selection and Optimization',
    shortName: 'Models',
    weightPercent: 16.8,
    description: 'LLM fundamentals, choosing models and trade-offs, and managing tokens and cost.',
    topics: ['LLM fundamentals', 'Technical fundamentals', 'Model selection and trade-offs', 'Cost and token management'],
  },
  {
    id: 'prompt-context-engineering',
    name: 'Prompt and Context Engineering',
    shortName: 'Prompting',
    weightPercent: 11.0,
    description: 'Managing context, writing prompts, and handling model output safely.',
    topics: ['Context engineering', 'Prompt engineering', 'Output handling'],
  },
  {
    id: 'security-safety',
    name: 'Security and Safety',
    shortName: 'Security',
    weightPercent: 8.1,
    description: 'Application security, guardrails, hooks, and identity, secrets and key management.',
    topics: ['AI application security', 'Guardrails and safe deployment', 'Claude hooks', 'Identity, secrets and key management'],
  },
  {
    id: 'tools-mcp',
    name: 'Tools and MCPs',
    shortName: 'Tools & MCP',
    weightPercent: 10.6,
    description: 'Implementing tools, building MCP servers, and choosing between tools, skills and MCP.',
    topics: ['Tool implementation', 'MCP server development', 'Agentic customization'],
  },
]

export function getDomain(domainId: string): ExamDomain | undefined {
  return examDomains.find((domain) => domain.id === domainId)
}
