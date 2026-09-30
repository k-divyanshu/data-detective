export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export interface Challenge {
  id: string
  title: string
  category: string
  difficulty: Difficulty
  description: string
  // Only challenges marked available have a playable experience.
  available: boolean
}

export interface Order {
  order_id: number
  customer_id: string | null
  amount: number
  order_date: string
}

// Orders for the revenue investigation: one row per order, tagged with a sales region.
export interface SalesOrder {
  order_id: number
  region: string
  amount: number
  order_date: string
}

// One row per pipeline load: what the job extracted vs. what it wrote.
export interface PipelineRun {
  run_id: number
  run_date: string
  region: string
  rows_extracted: number
  rows_loaded: number
  status: string
}

export type RowStatus = 'unique' | 'original' | 'duplicate'

export interface DuplicateAnalysis {
  totalRecords: number
  uniqueOrders: number
  duplicateRecords: number
  duplicateRate: number // percentage, 0-100
  duplicateOrderIds: number[]
  extraRevenue: number // revenue counted more than once
  rowStatus: RowStatus[] // one entry per input row
}

export interface MissingIdsAnalysis {
  totalRecords: number
  missingRecords: number
  nullCount: number // customer_id IS NULL
  emptyCount: number // customer_id is '' or only spaces
  missingRate: number // percentage, 0-100
  unattributedRevenue: number
  totalRevenue: number
  isMissing: boolean[] // one entry per input row
}

// ---- Answer questions ----
interface QuestionBase {
  id: string
  prompt: string
  hint: string // shown when the answer is wrong
}

export interface NumberQuestion extends QuestionBase {
  kind: 'number'
  answer: number
}

export interface ChoiceQuestion extends QuestionBase {
  kind: 'choice'
  options: { value: string; label: string }[]
  answer: string // value of the correct option
}

// The answer is a SQL query. It is graded by running it and comparing its result
// with the result of `expectedSql` on the same tables.
export interface SqlQuestion extends QuestionBase {
  kind: 'sql'
  tables: SqlTable[]
  expectedSql: string
}

export type Question = NumberQuestion | ChoiceQuestion | SqlQuestion

// ---- In-browser SQL ----
export type SqlCell = string | number | null

export interface SqlTable {
  name: string
  columns: { name: string; type: 'INTEGER' | 'REAL' | 'TEXT' }[]
  rows: Record<string, SqlCell>[]
}

export interface SuggestedQuery {
  label: string
  sql: string
}

export interface RevenueDropAnalysis {
  daily: { date: string; revenue: number }[]
  dropDate: string // first day of the biggest day-over-day decline
  avgBefore: number
  avgAfter: number
  changePercent: number // negative when revenue fell
}

export interface QueryResult {
  columns: string[]
  rows: SqlCell[][]
}
