'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DataTableProps {
  columns: {
    key: string
    label: string | React.ReactNode
    sortable?: boolean
    render?: (value: any, row: any) => React.ReactNode
  }[]
  data: any[]
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  onRowClick?: (row: any) => void
  loading?: boolean
  emptyState?: React.ReactNode
}

export function DataTable({
  columns,
  data,
  onSort,
  sortKey,
  sortDirection,
  onRowClick,
  loading,
  emptyState,
}: DataTableProps) {
  const [hoveredRow, setHoveredRow] = React.useState<string | number | null>(null)

  if (!loading && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {emptyState || (
          <>
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">No data available</p>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new record</p>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500',
                  column.sortable && 'cursor-pointer select-none transition-colors hover:text-gray-700'
                )}
                onClick={() => column.sortable && onSort?.(column.key, sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && sortKey === column.key && (
                    <span className="text-blue-500">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4">
                      <div className="skeleton h-5 w-full rounded" />
                    </td>
                  ))}
                </tr>
              ))
            : data.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  onMouseEnter={() => setHoveredRow(row.id || rowIndex)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'group border-b border-gray-50 transition-all duration-200',
                    onRowClick && 'cursor-pointer',
                    hoveredRow === (row.id || rowIndex) && 'bg-blue-50/50'
                  )}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-5 py-4 text-sm text-gray-700">
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  )
}
