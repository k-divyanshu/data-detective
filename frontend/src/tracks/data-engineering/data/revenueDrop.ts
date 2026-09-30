import type { PipelineRun, SalesOrder } from '../types'

// Synthetic scenario: 10 days x 3 regions x 2 orders a day.
// From 2026-09-08 the EU extract silently returns nothing, yet the job still reports
// SUCCESS, so EU revenue disappears from the warehouse without any alert.
const DATES = [
  '2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-09-05',
  '2026-09-06', '2026-09-07', '2026-09-08', '2026-09-09', '2026-09-10',
]
const REGION_BASE_AMOUNTS: Record<string, [number, number]> = {
  US: [420, 380],
  EU: [300, 260],
  APAC: [210, 190],
}
const FIRST_BROKEN_DATE = '2026-09-08'

export const salesOrders: SalesOrder[] = []
export const pipelineRuns: PipelineRun[] = []

let nextOrderId = 3001
let nextRunId = 1

DATES.forEach((date, dayIndex) => {
  for (const [region, baseAmounts] of Object.entries(REGION_BASE_AMOUNTS)) {
    const extractBroken = region === 'EU' && date >= FIRST_BROKEN_DATE
    // Small day-to-day variation so the data doesn't look artificial.
    const wobble = (dayIndex % 3) * 15
    const loaded = extractBroken ? [] : baseAmounts.map((base) => base + wobble)

    for (const amount of loaded) {
      salesOrders.push({ order_id: nextOrderId++, region, amount, order_date: date })
    }
    pipelineRuns.push({
      run_id: nextRunId++,
      run_date: date,
      region,
      rows_extracted: loaded.length,
      rows_loaded: loaded.length,
      status: 'SUCCESS',
    })
  }
})
