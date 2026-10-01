import type { MockExam } from '../types'

// The real exam has 53 items in 120 minutes (about 2.3 minutes per item). These practice mocks use
// the same pace. Each attempt draws a fresh set of questions from the bank, weighted by the
// published domain weights, so repeat attempts are not identical.
const MINUTES_PER_ITEM = 120 / 53

function minutesFor(questionCount: number): number {
  return Math.ceil(questionCount * MINUTES_PER_ITEM)
}

export const mockExams: MockExam[] = [
  {
    id: 'mock-quick-10',
    title: 'Quick Practice (10 questions)',
    description: 'A fast, timed warm-up across the domains, weighted like the real exam.',
    questionCount: 10,
    durationMinutes: minutesFor(10),
  },
  {
    id: 'mock-25',
    title: '25-Question Mock',
    description: 'About half an exam: enough questions for a meaningful per-domain picture.',
    questionCount: 25,
    durationMinutes: minutesFor(25),
  },
  {
    id: 'mock-full',
    title: 'Full Mock Exam (53 questions)',
    description: 'Same item count and time limit as the real exam, with questions drawn from our practice bank.',
    questionCount: 53,
    durationMinutes: 120,
  },
]
