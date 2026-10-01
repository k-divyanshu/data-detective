import initSqlJs from 'sql.js'
import { describe, expect, it } from 'vitest'
import { challenges } from '../data/challenges'
import { executeSql, populateDatabase } from '../utils/sqlEngine'
import { challengeDefinitions } from './index'

const SQL = await initSqlJs()

describe('challenge definitions', () => {
  it('have unique ids, and the challenge list is derived from them', () => {
    const ids = challengeDefinitions.map((definition) => definition.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(challenges.filter((challenge) => challenge.available).map((challenge) => challenge.id)).toEqual(ids)
  })

  it.each(challengeDefinitions.map((definition) => [definition.id, definition] as const))(
    '%s is complete and consistent',
    (_id, definition) => {
      const { content } = definition
      expect(definition.title.length).toBeGreaterThan(0)
      expect(content.problem.text.length).toBeGreaterThan(20)
      expect(content.summary.stats.length).toBeGreaterThanOrEqual(3)
      expect(content.tables.length).toBeGreaterThan(0)
      expect(content.sql.suggestions.length).toBeGreaterThan(0)
      expect(content.questions.length).toBeGreaterThan(0)
      expect(content.lesson.blocks.length).toBeGreaterThan(0)

      // Question ids are unique, and every choice question's answer is one of its options.
      const questionIds = content.questions.map((question) => question.id)
      expect(new Set(questionIds).size).toBe(questionIds.length)
      for (const question of content.questions) {
        if (question.kind === 'choice') {
          expect(question.options.map((option) => option.value)).toContain(question.answer)
        }
      }

      // Every table named in the SQL playground has data.
      for (const table of content.sql.tables) expect(table.rows.length, table.name).toBeGreaterThan(0)
    },
  )

  it.each(challengeDefinitions.map((definition) => [definition.id, definition] as const))(
    '%s: suggested queries run, and reference answers return rows',
    (_id, definition) => {
      const { sql, questions } = definition.content
      const db = populateDatabase(SQL, sql.tables)
      try {
        for (const suggestion of sql.suggestions) {
          expect(() => executeSql(db, suggestion.sql), suggestion.label).not.toThrow()
        }
        for (const question of questions) {
          if (question.kind !== 'sql') continue
          const result = executeSql(db, question.expectedSql)
          expect(result.rows.length, question.id).toBeGreaterThan(0)
          expect(result.columns.length, question.id).toBeGreaterThan(0)
        }
      } finally {
        db.close()
      }
    },
  )
})
