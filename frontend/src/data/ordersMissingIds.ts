import type { Order } from '../types'

// Synthetic dataset: 24 rows. Five have no usable customer_id:
// three are NULL and two are empty strings (a classic "looks filled in, isn't" trap).
export const ordersMissingIds: Order[] = [
  { order_id: 2001, customer_id: 'C001', amount: 250, order_date: '2026-09-01' },
  { order_id: 2002, customer_id: 'C002', amount: 450, order_date: '2026-09-01' },
  { order_id: 2003, customer_id: null, amount: 120, order_date: '2026-09-02' },
  { order_id: 2004, customer_id: 'C004', amount: 310, order_date: '2026-09-02' },
  { order_id: 2005, customer_id: 'C001', amount: 85, order_date: '2026-09-03' },
  { order_id: 2006, customer_id: '', amount: 640, order_date: '2026-09-03' },
  { order_id: 2007, customer_id: 'C006', amount: 190, order_date: '2026-09-03' },
  { order_id: 2008, customer_id: 'C002', amount: 75, order_date: '2026-09-04' },
  { order_id: 2009, customer_id: 'C007', amount: 520, order_date: '2026-09-04' },
  { order_id: 2010, customer_id: null, amount: 230, order_date: '2026-09-05' },
  { order_id: 2011, customer_id: 'C003', amount: 165, order_date: '2026-09-05' },
  { order_id: 2012, customer_id: 'C009', amount: 90, order_date: '2026-09-05' },
  { order_id: 2013, customer_id: 'C010', amount: 405, order_date: '2026-09-06' },
  { order_id: 2014, customer_id: '', amount: 275, order_date: '2026-09-06' },
  { order_id: 2015, customer_id: 'C011', amount: 180, order_date: '2026-09-07' },
  { order_id: 2016, customer_id: 'C012', amount: 350, order_date: '2026-09-07' },
  { order_id: 2017, customer_id: 'C005', amount: 60, order_date: '2026-09-08' },
  { order_id: 2018, customer_id: null, amount: 495, order_date: '2026-09-08' },
  { order_id: 2019, customer_id: 'C013', amount: 140, order_date: '2026-09-09' },
  { order_id: 2020, customer_id: 'C014', amount: 215, order_date: '2026-09-09' },
  { order_id: 2021, customer_id: 'C008', amount: 330, order_date: '2026-09-10' },
  { order_id: 2022, customer_id: 'C015', amount: 105, order_date: '2026-09-10' },
  { order_id: 2023, customer_id: 'C004', amount: 260, order_date: '2026-09-11' },
  { order_id: 2024, customer_id: 'C006', amount: 130, order_date: '2026-09-11' },
]
