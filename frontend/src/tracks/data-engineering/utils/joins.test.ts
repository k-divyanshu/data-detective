import { describe, expect, it } from 'vitest'
import { customers as sampleCustomers, ordersToJoin } from '../data/orphanOrders'
import type { Customer, Order } from '../types'
import { analyzeOrphanOrders } from './joins'

const customers: Customer[] = [
  { customer_id: 'C1', name: 'A', country: 'US', signup_date: '2026-01-01' },
  { customer_id: 'C2', name: 'B', country: 'IN', signup_date: '2026-01-02' },
]

function order(customer_id: string | null, amount: number): Order {
  return { order_id: 1, customer_id, amount, order_date: '2026-09-01' }
}

describe('analyzeOrphanOrders', () => {
  it('finds orders whose customer does not exist and the revenue an INNER JOIN would drop', () => {
    const result = analyzeOrphanOrders(
      [order('C1', 100), order('C9', 40), order('C9', 60), order('C2', 200)],
      customers,
    )
    expect(result.orphanOrders).toBe(2)
    expect(result.orphanCustomerIds).toEqual(['C9'])
    expect(result.totalRevenue).toBe(400)
    expect(result.lostRevenue).toBe(100)
    expect(result.innerJoinRevenue).toBe(300)
    expect(result.lostRate).toBe(25)
    expect(result.isOrphan).toEqual([false, true, true, false])
  })

  it('treats a NULL customer_id as an orphan because NULL never matches in a join', () => {
    const result = analyzeOrphanOrders([order(null, 10), order('C1', 10)], customers)
    expect(result.orphanOrders).toBe(1)
    expect(result.orphanCustomerIds).toEqual([])
  })

  it('reports nothing lost when every order has a customer', () => {
    const result = analyzeOrphanOrders([order('C1', 10), order('C2', 20)], customers)
    expect(result.orphanOrders).toBe(0)
    expect(result.lostRate).toBe(0)
  })

  it('handles an empty list', () => {
    expect(analyzeOrphanOrders([], customers).lostRate).toBe(0)
  })

  it('matches the challenge dataset (20 orders, 4 orphans, $1,100 of $5,245 lost)', () => {
    const result = analyzeOrphanOrders(ordersToJoin, sampleCustomers)
    expect(result.totalOrders).toBe(20)
    expect(result.orphanOrders).toBe(4)
    expect(result.orphanCustomerIds).toEqual(['C011', 'C013', 'C099'])
    expect(result.totalRevenue).toBe(5245)
    expect(result.lostRevenue).toBe(1100)
    expect(Math.round(result.lostRate)).toBe(21)
  })
})
