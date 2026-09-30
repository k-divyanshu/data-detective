import type { DuplicateAnalysis, Order, RowStatus } from '../types'

// A "duplicate record" here means an extra row for an order_id we have already seen.
// The first occurrence is the original; every later one is a duplicate.
export function analyzeDuplicates(orders: Order[]): DuplicateAnalysis {
  const seen = new Set<number>()
  const duplicateOrderIds = new Set<number>()
  let extraRevenue = 0

  const firstPass: RowStatus[] = orders.map((order) => {
    if (!seen.has(order.order_id)) {
      seen.add(order.order_id)
      return 'unique'
    }
    duplicateOrderIds.add(order.order_id)
    extraRevenue += order.amount
    return 'duplicate'
  })

  // Second pass: upgrade the first occurrence of a duplicated order to "original".
  const rowStatus = firstPass.map((status, index) =>
    status === 'unique' && duplicateOrderIds.has(orders[index].order_id)
      ? 'original'
      : status,
  )

  const totalRecords = orders.length
  const duplicateRecords = totalRecords - seen.size

  return {
    totalRecords,
    uniqueOrders: seen.size,
    duplicateRecords,
    duplicateRate: totalRecords === 0 ? 0 : (duplicateRecords / totalRecords) * 100,
    duplicateOrderIds: [...duplicateOrderIds],
    extraRevenue,
    rowStatus,
  }
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
