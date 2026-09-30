import type { Customer, Order, OrphanOrdersAnalysis } from '../types'

// An "orphan" order points at a customer_id that has no row in the customers table.
// orders INNER JOIN customers silently drops every orphan.
export function analyzeOrphanOrders(orders: Order[], customers: Customer[]): OrphanOrdersAnalysis {
  const knownIds = new Set(customers.map((customer) => customer.customer_id))
  // NULL never matches in a join, so a missing customer_id is an orphan too.
  const isOrphan = orders.map((order) => order.customer_id === null || !knownIds.has(order.customer_id))

  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0)
  const lostRevenue = orders.reduce((sum, order, index) => sum + (isOrphan[index] ? order.amount : 0), 0)

  const orphanCustomerIds = [
    ...new Set(
      orders.flatMap((order, index) =>
        isOrphan[index] && order.customer_id !== null ? [order.customer_id] : [],
      ),
    ),
  ].sort()

  return {
    totalOrders: orders.length,
    orphanOrders: isOrphan.filter(Boolean).length,
    orphanCustomerIds,
    totalRevenue,
    innerJoinRevenue: totalRevenue - lostRevenue,
    lostRevenue,
    lostRate: totalRevenue === 0 ? 0 : (lostRevenue / totalRevenue) * 100,
    isOrphan,
  }
}
