import { describe, expect, it } from 'vitest'
import { examDomains } from './exam'
import { mockExams } from './mockExams'
import { questionBank } from './questions'
import { resources } from './resources'

const domainIds = new Set(examDomains.map((domain) => domain.id))
const resourceIds = new Set(resources.map((resource) => resource.id))

// Hosts (and GitHub organisations) that really are published by Anthropic or the MCP project.
function isOfficialLocation(url: string): boolean {
  const { hostname, pathname } = new URL(url)
  const officialHosts = [
    'platform.claude.com', 'code.claude.com', 'docs.claude.com', 'claude.com', 'academy.claude.com',
    'anthropic.com', 'www.anthropic.com', 'anthropic-partners.skilljar.com', 'modelcontextprotocol.io',
  ]
  if (officialHosts.includes(hostname)) return true
  return hostname === 'github.com' && /^\/(anthropics|modelcontextprotocol)(\/|$)/.test(pathname)
}

describe('exam domains', () => {
  it('have unique ids and weights that add up to 100%', () => {
    expect(domainIds.size).toBe(examDomains.length)
    const total = examDomains.reduce((sum, domain) => sum + (domain.weightPercent ?? 0), 0)
    expect(total).toBeCloseTo(100, 5)
  })
})

describe('resources', () => {
  it('have unique ids and unique https URLs', () => {
    expect(resourceIds.size).toBe(resources.length)
    expect(new Set(resources.map((r) => r.url)).size).toBe(resources.length)
    for (const resource of resources) expect(resource.url.startsWith('https://')).toBe(true)
  })

  it('reference only known domains and have a verification date', () => {
    for (const resource of resources) {
      expect(resource.domainIds.length).toBeGreaterThan(0)
      for (const domainId of resource.domainIds) expect(domainIds.has(domainId), `${resource.id}: ${domainId}`).toBe(true)
      expect(resource.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('label a resource official only when it is hosted by Anthropic or the MCP project', () => {
    for (const resource of resources) {
      expect(isOfficialLocation(resource.url), `${resource.id} (${resource.source})`).toBe(resource.source === 'official')
    }
  })

  it('cover every exam domain', () => {
    for (const domain of examDomains) {
      expect(resources.some((r) => r.active && r.domainIds.includes(domain.id)), domain.id).toBe(true)
    }
  })
})

describe('question bank', () => {
  it('has unique question ids', () => {
    expect(new Set(questionBank.map((q) => q.id)).size).toBe(questionBank.length)
  })

  it('has at least one question in every domain', () => {
    for (const domain of examDomains) {
      expect(questionBank.some((q) => q.domainId === domain.id), domain.id).toBe(true)
    }
  })

  it.each(questionBank.map((q) => [q.id, q] as const))('%s is well-formed', (_id, question) => {
    const optionIds = question.options.map((option) => option.id)
    expect(domainIds.has(question.domainId)).toBe(true)
    expect(question.options.length).toBeGreaterThanOrEqual(3)
    expect(new Set(optionIds).size).toBe(optionIds.length)

    // Answer key
    for (const answerId of question.correctAnswer) expect(optionIds).toContain(answerId)
    if (question.type === 'single') expect(question.correctAnswer).toHaveLength(1)
    else expect(question.correctAnswer.length).toBeGreaterThanOrEqual(2)

    // Every wrong option is explained, and nothing else is
    const wrongIds = optionIds.filter((id) => !question.correctAnswer.includes(id)).sort()
    expect(Object.keys(question.whyIncorrect).sort()).toEqual(wrongIds)
    for (const reason of Object.values(question.whyIncorrect)) expect(reason.trim().length).toBeGreaterThan(10)

    expect(question.explanation.trim().length).toBeGreaterThan(20)
    for (const resourceId of question.resourceIds) expect(resourceIds.has(resourceId), resourceId).toBe(true)
    expect(question.resourceIds.length).toBeGreaterThan(0)
  })

  it('never labels a practice question as official', () => {
    for (const question of questionBank) expect(['original', 'ai-generated', 'community-inspired']).toContain(question.sourceType)
  })
})

describe('mock exams', () => {
  it.each(mockExams.map((exam) => [exam.id, exam] as const))('%s only uses existing, unique questions', (_id, exam) => {
    expect(new Set(exam.questionIds).size).toBe(exam.questionIds.length)
    for (const questionId of exam.questionIds) expect(questionBank.some((q) => q.id === questionId), questionId).toBe(true)
    expect(exam.durationMinutes).toBeGreaterThan(0)
  })
})
