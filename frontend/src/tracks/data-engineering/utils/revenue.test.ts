import { describe, expect, it } from 'vitest'
import { salesOrders } from '../data/revenueDrop'
import type { SalesOrder } from '../types'
import { analyzeRevenueDrop } from './revenue'

function sale(order_date: string, amount: number): SalesOrder {
  return { order_id: 1, region: 'US', amount, order_date }
}

describe('analyzeRevenueDrop', () => {
  it('sums revenue per day in date order', () => {
    const result = analyzeRevenueDrop([sale('2026-09-02', 5), sale('2026-09-01', 10), sale('2026-09-01', 20)])
    expect(result.daily).toEqual([
      { date: '2026-09-01', revenue: 30 },
      { date: '2026-09-02', revenue: 5 },
    ])
  })

  it('finds the day of the biggest day-over-day fall and the change around it', () => {
    const result = analyzeRevenueDrop([
      sale('2026-09-01', 100),
      sale('2026-09-02', 100),
      sale('2026-09-03', 40),
      sale('2026-09-04', 60),
    ])
    expect(result.dropDate).toBe('2026-09-03')
    expect(result.avgBefore).toBe(100)
    expect(result.avgAfter).toBe(50)
    expect(result.changePercent).toBe(-50)
  })

  it('detects 2026-09-08 as the drop in the challenge dataset', () => {
    const result = analyzeRevenueDrop(salesOrders)
    expect(result.dropDate).toBe('2026-09-08')
    expect(result.changePercent).toBeLessThan(-25)
  })

  it('has no EU orders from the drop date on', () => {
    const euAfter = salesOrders.filter((o) => o.region === 'EU' && o.order_date >= '2026-09-08')
    expect(euAfter).toHaveLength(0)
  })
})
