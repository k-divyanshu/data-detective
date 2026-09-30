import type { RevenueDropAnalysis, SalesOrder } from '../types'

function average(values: number[]): number {
  return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length
}

// Finds the day with the largest fall in revenue compared with the previous day,
// and compares average daily revenue before vs. from that day on.
export function analyzeRevenueDrop(orders: SalesOrder[]): RevenueDropAnalysis {
  const revenueByDate = new Map<string, number>()
  for (const order of orders) {
    revenueByDate.set(order.order_date, (revenueByDate.get(order.order_date) ?? 0) + order.amount)
  }
  const daily = [...revenueByDate.entries()]
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date))

  let dropIndex = 1
  let biggestFall = 0
  for (let index = 1; index < daily.length; index++) {
    const fall = daily[index - 1].revenue - daily[index].revenue
    if (fall > biggestFall) {
      biggestFall = fall
      dropIndex = index
    }
  }

  const before = daily.slice(0, dropIndex).map((day) => day.revenue)
  const after = daily.slice(dropIndex).map((day) => day.revenue)
  const avgBefore = average(before)
  const avgAfter = average(after)

  return {
    daily,
    dropDate: daily[dropIndex]?.date ?? '',
    avgBefore,
    avgAfter,
    changePercent: avgBefore === 0 ? 0 : ((avgAfter - avgBefore) / avgBefore) * 100,
  }
}
