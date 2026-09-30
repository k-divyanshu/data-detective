import type { Order } from '../types'

// Synthetic dataset: 25 rows, 22 distinct orders.
// Orders 1003, 1009 and 1015 were "loaded twice" by a pretend pipeline retry.
export const orders: Order[] = [
  { order_id: 1001, customer_id: 'C001', amount: 250, order_date: '2026-09-01' },
  { order_id: 1002, customer_id: 'C002', amount: 450, order_date: '2026-09-01' },
  { order_id: 1003, customer_id: 'C003', amount: 120, order_date: '2026-09-02' },
  { order_id: 1003, customer_id: 'C003', amount: 120, order_date: '2026-09-02' },
  { order_id: 1004, customer_id: 'C004', amount: 310, order_date: '2026-09-02' },
  { order_id: 1005, customer_id: 'C001', amount: 85, order_date: '2026-09-03' },
  { order_id: 1006, customer_id: 'C005', amount: 640, order_date: '2026-09-03' },
  { order_id: 1007, customer_id: 'C006', amount: 190, order_date: '2026-09-03' },
  { order_id: 1008, customer_id: 'C002', amount: 75, order_date: '2026-09-04' },
  { order_id: 1009, customer_id: 'C007', amount: 520, order_date: '2026-09-04' },
  { order_id: 1009, customer_id: 'C007', amount: 520, order_date: '2026-09-04' },
  { order_id: 1010, customer_id: 'C008', amount: 230, order_date: '2026-09-05' },
  { order_id: 1011, customer_id: 'C003', amount: 165, order_date: '2026-09-05' },
  { order_id: 1012, customer_id: 'C009', amount: 90, order_date: '2026-09-05' },
  { order_id: 1013, customer_id: 'C010', amount: 405, order_date: '2026-09-06' },
  { order_id: 1014, customer_id: 'C004', amount: 275, order_date: '2026-09-06' },
  { order_id: 1015, customer_id: 'C011', amount: 180, order_date: '2026-09-07' },
  { order_id: 1015, customer_id: 'C011', amount: 180, order_date: '2026-09-07' },
  { order_id: 1016, customer_id: 'C012', amount: 350, order_date: '2026-09-07' },
  { order_id: 1017, customer_id: 'C005', amount: 60, order_date: '2026-09-08' },
  { order_id: 1018, customer_id: 'C013', amount: 495, order_date: '2026-09-08' },
  { order_id: 1019, customer_id: 'C006', amount: 140, order_date: '2026-09-09' },
  { order_id: 1020, customer_id: 'C014', amount: 215, order_date: '2026-09-09' },
  { order_id: 1021, customer_id: 'C008', amount: 330, order_date: '2026-09-10' },
  { order_id: 1022, customer_id: 'C015', amount: 105, order_date: '2026-09-10' },
]
