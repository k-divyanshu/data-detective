import type { Customer, Order, PipelineRun, SalesOrder, SqlCell, SqlTable } from '../types'

function buildTable(name: string, columns: SqlTable['columns'], rows: object[]): SqlTable {
  return { name, columns, rows: rows.map((row) => ({ ...row }) as Record<string, SqlCell>) }
}

export function ordersToSqlTable(name: string, orders: Order[]): SqlTable {
  return buildTable(
    name,
    [
      { name: 'order_id', type: 'INTEGER' },
      { name: 'customer_id', type: 'TEXT' },
      { name: 'amount', type: 'REAL' },
      { name: 'order_date', type: 'TEXT' },
    ],
    orders,
  )
}

export function salesOrdersToSqlTable(name: string, orders: SalesOrder[]): SqlTable {
  return buildTable(
    name,
    [
      { name: 'order_id', type: 'INTEGER' },
      { name: 'region', type: 'TEXT' },
      { name: 'amount', type: 'REAL' },
      { name: 'order_date', type: 'TEXT' },
    ],
    orders,
  )
}

export function pipelineRunsToSqlTable(name: string, runs: PipelineRun[]): SqlTable {
  return buildTable(
    name,
    [
      { name: 'run_id', type: 'INTEGER' },
      { name: 'run_date', type: 'TEXT' },
      { name: 'region', type: 'TEXT' },
      { name: 'rows_extracted', type: 'INTEGER' },
      { name: 'rows_loaded', type: 'INTEGER' },
      { name: 'status', type: 'TEXT' },
    ],
    runs,
  )
}

export function customersToSqlTable(name: string, customers: Customer[]): SqlTable {
  return buildTable(
    name,
    [
      { name: 'customer_id', type: 'TEXT' },
      { name: 'name', type: 'TEXT' },
      { name: 'country', type: 'TEXT' },
      { name: 'signup_date', type: 'TEXT' },
    ],
    customers,
  )
}
