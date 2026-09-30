import { describe, expect, it } from 'vitest'
import { ordersMissingIds } from '../data/ordersMissingIds'
import type { Order } from '../types'
import { analyzeMissingIds, isMissingCustomerId } from './missingIds'

function order(customer_id: string | null, amount = 100): Order {
  return { order_id: 1, customer_id, amount, order_date: '2026-09-01' }
}

describe('isMissingCustomerId', () => {
  it('treats NULL, empty and whitespace-only values as missing', () => {
    expect(isMissingCustomerId(null)).toBe(true)
    expect(isMissingCustomerId('')).toBe(true)
    expect(isMissingCustomerId('   ')).toBe(true)
  })

  it('accepts real identifiers', () => {
    expect(isMissingCustomerId('C001')).toBe(false)
  })
})

describe('analyzeMissingIds', () => {
  it('separates NULLs from empty strings and sums unattributed revenue', () => {
    const result = analyzeMissingIds([order('C1', 10), order(null, 20), order('', 30), order('C2', 40)])
    expect(result.missingRecords).toBe(2)
    expect(result.nullCount).toBe(1)
    expect(result.emptyCount).toBe(1)
    expect(result.unattributedRevenue).toBe(50)
    expect(result.totalRevenue).toBe(100)
    expect(result.missingRate).toBe(50)
    expect(result.isMissing).toEqual([false, true, true, false])
  })

  it('handles an empty list', () => {
    const result = analyzeMissingIds([])
    expect(result.missingRate).toBe(0)
    expect(result.missingRecords).toBe(0)
  })

  it('matches the challenge dataset (24 rows, 5 missing: 3 NULL + 2 empty)', () => {
    const result = analyzeMissingIds(ordersMissingIds)
    expect(result.totalRecords).toBe(24)
    expect(result.missingRecords).toBe(5)
    expect(result.nullCount).toBe(3)
    expect(result.emptyCount).toBe(2)
    expect(result.unattributedRevenue).toBe(1760)
  })
})
