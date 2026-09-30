import type { MissingIdsAnalysis, Order } from '../types'

// A customer_id is "missing" if it is NULL, empty, or only whitespace.
export function isMissingCustomerId(customerId: string | null): boolean {
  return customerId === null || customerId.trim() === ''
}

export function analyzeMissingIds(orders: Order[]): MissingIdsAnalysis {
  const isMissing = orders.map((order) => isMissingCustomerId(order.customer_id))
  const missingOrders = orders.filter((_, index) => isMissing[index])

  const totalRecords = orders.length
  const missingRecords = missingOrders.length

  return {
    totalRecords,
    missingRecords,
    nullCount: missingOrders.filter((order) => order.customer_id === null).length,
    emptyCount: missingOrders.filter((order) => order.customer_id !== null).length,
    missingRate: totalRecords === 0 ? 0 : (missingRecords / totalRecords) * 100,
    unattributedRevenue: missingOrders.reduce((sum, order) => sum + order.amount, 0),
    totalRevenue: orders.reduce((sum, order) => sum + order.amount, 0),
    isMissing,
  }
}
