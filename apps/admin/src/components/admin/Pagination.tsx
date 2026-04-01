'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  itemsPerPage?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const [visiblePages, setVisiblePages] = React.useState<number[]>([])
  const maxVisible = 5

  React.useEffect(() => {
    const pages: number[] = []
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    setVisiblePages(pages)
  }, [currentPage, totalPages])

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="text-sm text-gray-500">
        {totalItems && (
          <span>
            Showing {(currentPage - 1) * (itemsPerPage || 10) + 1} to{' '}
            {Math.min(currentPage * (itemsPerPage || 10), totalItems)} of {totalItems} results
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        {visiblePages[0] > 1 && (
          <>
            <Button variant="outline" size="sm" onClick={() => onPageChange(1)}>
              1
            </Button>
            {visiblePages[0] > 2 && <span className="px-2 text-gray-400">...</span>}
          </>
        )}

        <AnimatePresence mode="wait">
          {visiblePages.map((page) => (
            <motion.div
              key={page}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(page)}
                className="w-10"
              >
                {page}
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-2 text-gray-400">...</span>
            )}
            <Button variant="outline" size="sm" onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
