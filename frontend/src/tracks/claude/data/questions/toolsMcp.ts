import type { Question } from '../../types'

export const toolsMcpQuestions: Question[] = [
  {
    id: 'tools-descriptions',
    domainId: 'tools-mcp',
    topic: 'Tool descriptions',
    difficulty: 'beginner',
    question: 'Which change most improves how reliably Claude chooses and uses a tool?',
    type: 'single',
    options: [
      { id: 'a', text: 'A clear, detailed description of what the tool does, when to use it, and what each parameter means' },
      { id: 'b', text: 'A very short name and no description' },
      { id: 'c', text: 'Adding many similar tools with overlapping purposes' },
      { id: 'd', text: 'Hiding parameter names to keep the request small' },
    ],
    correctAnswer: ['a'],
    explanation:
      'Claude decides which tool to call largely from its name and description, so clear and specific descriptions are among the most effective improvements.',
    whyIncorrect: {
      b: 'With no description Claude has little to go on.',
      c: 'Overlapping tools make selection harder, not easier.',
      d: 'Parameter names and descriptions help Claude fill arguments correctly.',
    },
    resourceIds: ['writing-effective-tools-for-agents', 'define-tools'],
    sourceType: 'ai-generated',
  },
  {
    id: 'tools-mcp-primitives',
    domainId: 'tools-mcp',
    topic: 'MCP concepts',
    difficulty: 'beginner',
    question: 'Which set lists the three primitives an MCP server can expose?',
    type: 'single',
    options: [
      { id: 'a', text: 'Tools, resources, and prompts' },
      { id: 'b', text: 'Models, tokens, and embeddings' },
      { id: 'c', text: 'Agents, hooks, and skills' },
      { id: 'd', text: 'Batches, streams, and caches' },
    ],
    correctAnswer: ['a'],
    explanation:
      'MCP servers can offer tools (actions), resources (data for context) and prompts (reusable templates).',
    whyIncorrect: {
      b: 'These are LLM concepts, not MCP server primitives.',
      c: 'Hooks and skills relate to Claude Code and agents, not to the MCP primitives.',
      d: 'These are API features, not MCP primitives.',
    },
    resourceIds: ['mcp-introduction', 'mcp-architecture-overview'],
    sourceType: 'ai-generated',
  },
  {
    id: 'tools-mcp-transport',
    domainId: 'tools-mcp',
    topic: 'MCP transports',
    difficulty: 'intermediate',
    question: 'A client starts an MCP server as a local subprocess and talks to it over its standard input and output. Which transport is this?',
    type: 'single',
    options: [
      { id: 'a', text: 'stdio' },
      { id: 'b', text: 'Streamable HTTP' },
      { id: 'c', text: 'gRPC' },
      { id: 'd', text: 'SMTP' },
    ],
    correctAnswer: ['a'],
    explanation:
      'stdio is for local servers launched by the client. Streamable HTTP is the standard transport for servers reached over the network.',
    whyIncorrect: {
      b: 'Streamable HTTP is used when the server is reached over HTTP, typically remotely.',
      c: 'gRPC is not one of the transports defined by the MCP specification.',
      d: 'SMTP is an email protocol.',
    },
    resourceIds: ['mcp-transports', 'build-an-mcp-server'],
    sourceType: 'ai-generated',
  },
  {
    id: 'tools-skill-vs-mcp',
    domainId: 'tools-mcp',
    topic: 'Agentic customization',
    difficulty: 'intermediate',
    question:
      'You want Claude to query your company\'s live ticketing system during a task. Which approach is the best fit?',
    type: 'single',
    options: [
      { id: 'a', text: 'Connect it through a tool, for example an MCP server that wraps the ticketing API' },
      { id: 'b', text: 'Write a CLAUDE.md paragraph describing the tickets from memory' },
      { id: 'c', text: 'Copy a snapshot of tickets into the system prompt once a year' },
      { id: 'd', text: 'Rely on a skill that contains only static instructions' },
    ],
    correctAnswer: ['a'],
    explanation:
      'Live data and actions need a tool or MCP server. Skills package instructions and resources for a kind of task; they do not by themselves connect to a live external system.',
    whyIncorrect: {
      b: 'A written description goes out of date and cannot fetch live data.',
      c: 'A stale snapshot defeats the purpose of live access.',
      d: 'Static instructions cannot retrieve current ticket data.',
    },
    resourceIds: ['claude-code-mcp', 'agent-skills-overview', 'mcp-introduction'],
    sourceType: 'ai-generated',
  },
]
