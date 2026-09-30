import type { Order, PipelineRun, SalesOrder, SqlCell, SqlTable } from '../types'

export function ordersToSqlTable(name: string, orders: Order[]): SqlTable {
  return {
    name,
    columns: [
      { name: 'order_id', type: 'INTEGER' },
      { name: 'customer_id', type: 'TEXT' },
      { name: 'amount', type: 'REAL' },
      { name: 'order_date', type: 'TEXT' },
    ],
    rows: orders.map((order) => ({ ...order })),
  }
}

export function salesOrdersToSqlTable(name: string, orders: SalesOrder[]): SqlTable {
  return {
    name,
    columns: [
      { name: 'order_id', type: 'INTEGER' },
      { name: 'region', type: 'TEXT' },
      { name: 'amount', type: 'REAL' },
      { name: 'order_date', type: 'TEXT' },
    ],
    rows: orders.map((order) => ({ ...order }) as Record<string, SqlCell>),
  }
}

export function pipelineRunsToSqlTable(name: string, runs: PipelineRun[]): SqlTable {
  return {
    name,
    columns: [
      { name: 'run_id', type: 'INTEGER' },
      { name: 'run_date', type: 'TEXT' },
      { name: 'region', type: 'TEXT' },
      { name: 'rows_extracted', type: 'INTEGER' },
      { name: 'rows_loaded', type: 'INTEGER' },
      { name: 'status', type: 'TEXT' },
    ],
    rows: runs.map((run) => ({ ...run }) as Record<string, SqlCell>),
  }
}
