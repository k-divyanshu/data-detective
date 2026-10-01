import { DataTable, type Column } from '../components/DataTable'
import type { TableView } from '../types'

interface TableSpec<T> {
  title: string
  columns: Column<T>[]
  rows: T[]
  rowClassName?: (row: T, index: number) => string | undefined
}

// Keeps columns and rows type-checked against each other while returning a uniform TableView.
export function defineTable<T>(spec: TableSpec<T>): TableView {
  return {
    title: spec.title,
    render: () => <DataTable columns={spec.columns} rows={spec.rows} rowClassName={spec.rowClassName} />,
  }
}
