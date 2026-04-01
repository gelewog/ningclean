'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DataTableProps {
  columns: {
    key: string
    label: string
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
  const [hoveredRow, setHoveredRow] = React.useState<string | null>(null)

  if (!loading && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        {emptyState || (
          <>
            <div className="rounded-full bg-gray-100 p-4">
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
            <p className="mt-4 text-sm text-gray-500">No data available</p>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500',
                  column.sortable && 'cursor-pointer hover:bg-gray-50'
                )}
                onClick={() => column.sortable && onSort?.(column.key, sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                <div className="flex items-center gap-1">
                  {column.label}
                  {column.sortable && sortKey === column.key && (
                    <span className="text-primary">
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
                <tr key={i} className="border-b border-gray-100">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="skeleton h-4 w-full rounded" />
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
                    'border-b border-gray-100 transition-colors',
                    onRowClick && 'cursor-pointer',
                    hoveredRow === (row.id || rowIndex) && 'bg-gray-50'
                  )}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm">
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
