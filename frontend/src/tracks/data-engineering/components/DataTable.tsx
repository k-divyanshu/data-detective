import type { ReactNode } from 'react'

export interface Column<T> {
  header: string
  align?: 'left' | 'right'
  render: (row: T, index: number) => ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowClassName?: (row: T, index: number) => string | undefined
}

export function DataTable<T>({ columns, rows, rowClassName }: DataTableProps<T>) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.header} className={column.align === 'right' ? 'num' : undefined}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowClassName?.(row, rowIndex)}>
              {columns.map((column) => (
                <td key={column.header} className={column.align === 'right' ? 'num' : undefined}>
                  {column.render(row, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
