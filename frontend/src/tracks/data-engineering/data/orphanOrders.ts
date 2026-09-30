import type { Customer, Order } from '../types'

export const customers: Customer[] = [
  { customer_id: 'C001', name: 'Asha Menon', country: 'IN', signup_date: '2025-11-03' },
  { customer_id: 'C002', name: 'Liam Carter', country: 'US', signup_date: '2025-12-14' },
  { customer_id: 'C003', name: 'Sofia Rossi', country: 'IT', signup_date: '2026-01-09' },
  { customer_id: 'C004', name: 'Noah Becker', country: 'DE', signup_date: '2026-01-21' },
  { customer_id: 'C005', name: 'Mei Tanaka', country: 'JP', signup_date: '2026-02-02' },
  { customer_id: 'C006', name: 'Omar Haddad', country: 'AE', signup_date: '2026-02-17' },
  { customer_id: 'C007', name: 'Chloe Martin', country: 'FR', signup_date: '2026-03-05' },
  { customer_id: 'C008', name: 'Ravi Patel', country: 'IN', signup_date: '2026-03-28' },
  { customer_id: 'C009', name: 'Emma Wilson', country: 'US', signup_date: '2026-04-11' },
  { customer_id: 'C010', name: 'Lucas Silva', country: 'BR', signup_date: '2026-05-06' },
]

// 20 orders. Four of them (C011, C013 x2, C099) reference customers that do not exist
// in the customers table, e.g. late-arriving customer records or deleted accounts.
export const ordersToJoin: Order[] = [
  { order_id: 5001, customer_id: 'C001', amount: 250, order_date: '2026-09-01' },
  { order_id: 5002, customer_id: 'C002', amount: 450, order_date: '2026-09-01' },
  { order_id: 5003, customer_id: 'C003', amount: 120, order_date: '2026-09-02' },
  { order_id: 5004, customer_id: 'C011', amount: 310, order_date: '2026-09-02' },
  { order_id: 5005, customer_id: 'C004', amount: 85, order_date: '2026-09-03' },
  { order_id: 5006, customer_id: 'C005', amount: 640, order_date: '2026-09-03' },
  { order_id: 5007, customer_id: 'C006', amount: 190, order_date: '2026-09-03' },
  { order_id: 5008, customer_id: 'C013', amount: 520, order_date: '2026-09-04' },
  { order_id: 5009, customer_id: 'C002', amount: 75, order_date: '2026-09-04' },
  { order_id: 5010, customer_id: 'C007', amount: 230, order_date: '2026-09-05' },
  { order_id: 5011, customer_id: 'C008', amount: 165, order_date: '2026-09-05' },
  { order_id: 5012, customer_id: 'C013', amount: 90, order_date: '2026-09-06' },
  { order_id: 5013, customer_id: 'C009', amount: 405, order_date: '2026-09-06' },
  { order_id: 5014, customer_id: 'C010', amount: 275, order_date: '2026-09-07' },
  { order_id: 5015, customer_id: 'C099', amount: 180, order_date: '2026-09-07' },
  { order_id: 5016, customer_id: 'C001', amount: 350, order_date: '2026-09-08' },
  { order_id: 5017, customer_id: 'C005', amount: 60, order_date: '2026-09-08' },
  { order_id: 5018, customer_id: 'C003', amount: 495, order_date: '2026-09-09' },
  { order_id: 5019, customer_id: 'C006', amount: 140, order_date: '2026-09-09' },
  { order_id: 5020, customer_id: 'C004', amount: 215, order_date: '2026-09-10' },
]
