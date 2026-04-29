'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DataTableProps {
  columns: {
    key: string
    label: string | React.ReactNode
    sortable?: boolean
    render?: (value: any, row: any) => React.ReactNode
    hideOnMobile?: boolean
  }[]
  data: any[]
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  onRowClick?: (row: any) => void
  loading?: boolean
  emptyState?: React.ReactNode
  renderCard?: (row: any) => React.ReactNode
  skeletonCard?: (i: number) => React.ReactNode
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
  renderCard,
  skeletonCard,
}: DataTableProps) {
  const [hoveredRow, setHoveredRow] = React.useState<string | number | null>(null)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!loading && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
        {emptyState || (
          <>
            <div className="mb-4 rounded-full bg-gray-100 dark:bg-slate-800 p-4">
              <svg
                className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-slate-500"
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
            <p className="text-sm font-medium text-gray-900 dark:text-white">No data available</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Get started by creating a new record</p>
          </>
        )}
      </div>
    )
  }

  // Mobile Card View
  if (isMobile) {
    return (
      <div className="space-y-2">
        {loading
          ? skeletonCard
            ? Array.from({ length: 3 }).map((_, i) => skeletonCard(i))
            : Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 animate-pulse"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="skeleton h-4 w-20 rounded dark:bg-slate-700" />
                    <div className="skeleton h-6 w-16 rounded-full dark:bg-slate-700" />
                  </div>
                  <div className="skeleton h-5 w-32 rounded dark:bg-slate-700 mb-2" />
                  <div className="skeleton h-4 w-24 rounded dark:bg-slate-700 mb-1" />
                  <div className="skeleton h-4 w-20 rounded dark:bg-slate-700" />
                </div>
              ))
          : data.map((row, rowIndex) => (
              <div
                key={row.id || rowIndex}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  renderCard ? '' : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700',
                  'rounded-xl transition-all',
                  onRowClick && 'cursor-pointer active:scale-[0.99]',
                  hoveredRow === (row.id || rowIndex) && 'bg-gray-50 dark:bg-slate-700/50'
                )}
              >
                {renderCard ? renderCard(row) : (
                  <div className="space-y-2">
                    {columns
                      .filter(col => col.key !== 'checkbox' && col.key !== 'actions')
                      .map((column) => (
                        <div key={column.key} className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-slate-400">
                            {typeof column.label === 'string' ? column.label : ''}
                          </span>
                          <span className="text-sm text-gray-900 dark:text-slate-100 text-right">
                            {column.render
                              ? column.render(row[column.key], row)
                              : row[column.key]}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
      </div>
    )
  }

  // Desktop Table View
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 dark:border-slate-700">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-4 sm:px-5 py-3 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400',
                  column.sortable && 'cursor-pointer select-none transition-colors hover:text-gray-700 dark:hover:text-slate-300'
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
                <tr key={i} className="border-b border-gray-200 dark:border-slate-700/50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 sm:px-5 py-3 sm:py-4">
                      <div className="skeleton h-5 w-full rounded dark:bg-slate-700" />
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
                    "group border-b border-gray-200 dark:border-slate-700/50 transition-all duration-200",
                    onRowClick && 'cursor-pointer',
                    hoveredRow === (row.id || rowIndex) && 'bg-emerald-50/50 dark:bg-emerald-900/20'
                  )}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 sm:px-5 py-3 sm:py-4 text-sm text-gray-700 dark:text-slate-300">
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
