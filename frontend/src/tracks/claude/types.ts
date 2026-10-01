// ---- Exam configuration (data, so it can change when the exam changes) ----
export interface ExamDomain {
  id: string
  name: string
  shortName: string
  weightPercent?: number // only set when the official guide publishes it
  description: string
  topics: string[]
}

export interface ExamInfo {
  name: string
  shortName: string
  officialGuideUrl?: string
  guideNote: string // what the official guide says (or that it could not be verified)
  lastVerified: string // YYYY-MM-DD
  facts: { label: string; value: string }[] // only facts verified from official sources
}

// ---- Resource library ----
// Who published it. Third-party material must never be labelled official.
export type Provenance = 'official' | 'community'

export type ResourceType =
  | 'course'
  | 'documentation'
  | 'tutorial'
  | 'github'
  | 'article'
  | 'video'
  | 'cheat-sheet'
  | 'study-guide'
  | 'practice-questions'
  | 'mock-exam'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type Cost = 'free' | 'partially-free'

export interface Resource {
  id: string
  title: string
  url: string
  provider: string
  type: ResourceType
  domainIds: string[]
  difficulty: Difficulty
  cost: Cost
  source: Provenance
  description: string
  lastVerified: string // YYYY-MM-DD, when the URL was last checked
  active: boolean // false = link is dead or outdated; hidden by default
}

export type ResourceFilter =
  | 'all'
  | 'official'
  | 'courses'
  | 'documentation'
  | 'videos'
  | 'github'
  | 'practice'
  | 'mock-exams'

// ---- Questions ----
export type QuestionType = 'single' | 'multiple'

// How a question came to exist. Nothing here is ever an official Anthropic exam question.
export type QuestionSource = 'original' | 'ai-generated' | 'community-inspired'

export interface QuestionOption {
  id: string
  text: string
}

export interface Question {
  id: string
  domainId: string
  topic: string
  difficulty: Difficulty
  question: string
  type: QuestionType
  options: QuestionOption[]
  correctAnswer: string[] // option ids; exactly one for 'single'
  explanation: string
  whyIncorrect: Record<string, string> // option id -> why it is wrong (wrong options only)
  resourceIds: string[]
  sourceType: QuestionSource
}

// A mock is assembled from the question bank each time it starts, following the exam's domain
// weights, so it needs only a size and a time limit.
export interface MockExam {
  id: string
  title: string
  description: string
  questionCount: number
  durationMinutes: number
}

// ---- User progress (all stored in the browser) ----
export interface AttemptRecord {
  correct: number
  wrong: number
}

export interface MockResult {
  id: string
  mockId: string
  finishedAt: string // ISO timestamp
  correct: number
  total: number
  percent: number
  byDomain: Record<string, { correct: number; total: number }>
  durationSeconds: number
}

export interface ClaudeProgressData {
  attempts: Record<string, AttemptRecord> // question id -> tally
  mockResults: MockResult[]
  activeDays: string[] // YYYY-MM-DD, days something was practised
}

// ---- Community tips and notes ----
export interface Tip {
  id: string
  title: string
  text: string
  domainId: string
  author: string
  createdAt: string // ISO timestamp
  origin: 'starter' | 'user' // starter tips ship with the app and are AI-drafted
}

export interface TipReactions {
  upvoted: string[]
  bookmarked: string[]
  reported: string[]
}

export interface Note {
  id: string
  title: string
  body: string
  domainId?: string
  topic?: string
  resourceId?: string
  questionId?: string
  createdAt: string
  updatedAt: string
}
