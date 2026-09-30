import { describe, expect, it } from 'vitest'
import { orders as sampleOrders } from '../data/orders'
import type { Order } from '../types'
import { analyzeDuplicates } from './duplicates'

function order(order_id: number, amount = 100): Order {
  return { order_id, customer_id: 'C001', amount, order_date: '2026-09-01' }
}

describe('analyzeDuplicates', () => {
  it('reports no duplicates for unique orders', () => {
    const result = analyzeDuplicates([order(1), order(2), order(3)])
    expect(result.duplicateRecords).toBe(0)
    expect(result.uniqueOrders).toBe(3)
    expect(result.duplicateRate).toBe(0)
    expect(result.rowStatus).toEqual(['unique', 'unique', 'unique'])
  })

  it('marks the first occurrence as original and repeats as duplicate', () => {
    const result = analyzeDuplicates([order(1), order(2), order(1)])
    expect(result.rowStatus).toEqual(['original', 'unique', 'duplicate'])
    expect(result.duplicateOrderIds).toEqual([1])
  })

  it('counts every extra copy when an order appears more than twice', () => {
    const result = analyzeDuplicates([order(1, 50), order(1, 50), order(1, 50)])
    expect(result.totalRecords).toBe(3)
    expect(result.uniqueOrders).toBe(1)
    expect(result.duplicateRecords).toBe(2)
    expect(result.extraRevenue).toBe(100)
  })

  it('handles an empty list without dividing by zero', () => {
    const result = analyzeDuplicates([])
    expect(result.totalRecords).toBe(0)
    expect(result.duplicateRate).toBe(0)
  })

  it('matches the numbers shown in the challenge (25 rows, 22 unique, 3 duplicates)', () => {
    const result = analyzeDuplicates(sampleOrders)
    expect(result.totalRecords).toBe(25)
    expect(result.uniqueOrders).toBe(22)
    expect(result.duplicateRecords).toBe(3)
    expect(Math.round(result.duplicateRate)).toBe(12)
    expect(result.duplicateOrderIds).toEqual([1003, 1009, 1015])
  })
})
