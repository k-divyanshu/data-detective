import type { Question } from '../../types'

export const claudeCodeQuestions: Question[] = [
  {
    id: 'code-enforce-rules',
    domainId: 'claude-code',
    topic: 'Hooks and permissions',
    difficulty: 'intermediate',
    question:
      'You must guarantee that Claude Code can never run a particular destructive command in your repository. Which approach provides that guarantee?',
    type: 'single',
    options: [
      { id: 'a', text: 'A permission deny rule or a PreToolUse hook that blocks the command' },
      { id: 'b', text: 'A sentence in CLAUDE.md asking Claude not to run it' },
      { id: 'c', text: 'A polite instruction in the first message of each session' },
      { id: 'd', text: 'Nothing; enforcement is impossible' },
    ],
    correctAnswer: ['a'],
    explanation:
      'CLAUDE.md is context that Claude usually follows, not an enforced control. Deny rules and hooks are enforced by the tool itself, so they are the right place for hard limits.',
    whyIncorrect: {
      b: 'CLAUDE.md is guidance loaded into context, not a guarantee.',
      c: 'A one-off instruction is even weaker than a CLAUDE.md file.',
      d: 'Permissions and hooks exist precisely to enforce limits.',
    },
    resourceIds: ['claude-code-hooks-guide', 'claude-code-permissions', 'claude-code-memory'],
    sourceType: 'ai-generated',
  },
  {
    id: 'code-claude-md-location',
    domainId: 'claude-code',
    topic: 'CLAUDE.md hierarchy',
    difficulty: 'beginner',
    question: 'Where should project conventions that the whole team should share live?',
    type: 'single',
    options: [
      { id: 'a', text: 'In the project\'s CLAUDE.md, committed to the repository' },
      { id: 'b', text: 'Only in your personal ~/.claude/CLAUDE.md' },
      { id: 'c', text: 'In a CLAUDE.local.md file' },
      { id: 'd', text: 'In each teammate\'s memory' },
    ],
    correctAnswer: ['a'],
    explanation:
      'A committed project CLAUDE.md is shared with everyone working in the repo. Personal preferences belong in the user-level or local files.',
    whyIncorrect: {
      b: 'The user-level file applies to you across projects and is not shared with the team.',
      c: 'CLAUDE.local.md is for personal, project-specific notes and is normally not committed.',
      d: 'Individual memories are not a shared, versioned source of truth.',
    },
    resourceIds: ['claude-code-memory', 'claude-code-best-practices'],
    sourceType: 'ai-generated',
  },
]
