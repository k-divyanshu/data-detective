import type { ReactNode } from 'react'
import type { Order } from '../types'
import { formatCurrency } from '../utils/duplicates'
import type { Column } from './DataTable'

// Makes NULL and '' visible: both look "empty" but behave differently in SQL.
function renderCustomerId(value: string | null): ReactNode {
  if (value === null) return <span className="cell-null">NULL</span>
  if (value === '') return <span className="cell-null">'' (empty)</span>
  return value
}

// Columns shared by every orders table; challenges append their own status column.
export const orderColumns: Column<Order>[] = [
  { header: '#', render: (_, index) => <span className="muted">{index + 1}</span> },
  { header: 'order_id', render: (order) => order.order_id },
  { header: 'customer_id', render: (order) => renderCustomerId(order.customer_id) },
  { header: 'amount', align: 'right', render: (order) => formatCurrency(order.amount) },
  { header: 'order_date', render: (order) => order.order_date },
]
