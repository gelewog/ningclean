'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
  const [isMobile, setIsMobile] = React.useState(false)
  
  // Mobile: show only 3 pages, Desktop: show 5 pages
  const maxVisible = isMobile ? 3 : 5

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
  }, [currentPage, totalPages, maxVisible])

  if (totalPages <= 1) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 sm:px-4 py-3">
      {/* Info text - simplified on mobile */}
      <div className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
        {isMobile ? (
          <span>Page {currentPage} of {totalPages}</span>
        ) : (
          totalItems && (
            <span>
              Showing {(currentPage - 1) * (itemsPerPage || 10) + 1} to{' '}
              {Math.min(currentPage * (itemsPerPage || 10), totalItems)} of {totalItems} results
            </span>
          )
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-1 sm:gap-1.5 order-1 sm:order-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 sm:h-9 sm:w-auto px-0 sm:px-3"
        >
          <ChevronLeft className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* First page + ellipsis */}
        {visiblePages[0] > 1 && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPageChange(1)}
              className="h-8 w-8 sm:h-9 sm:w-10 text-xs sm:text-sm"
            >
              1
            </Button>
            {visiblePages[0] > 2 && (
              <span className="px-1 sm:px-2 text-gray-400 text-xs sm:text-sm">...</span>
            )}
          </>
        )}

        {/* Page numbers */}
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
                className="h-8 w-8 sm:h-9 sm:w-10 text-xs sm:text-sm"
              >
                {page}
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Last page + ellipsis */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-1 sm:px-2 text-gray-400 text-xs sm:text-sm">...</span>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPageChange(totalPages)}
              className="h-8 w-8 sm:h-9 sm:w-10 text-xs sm:text-sm"
            >
              {totalPages}
            </Button>
          </>
        )}

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 sm:h-9 sm:w-auto px-0 sm:px-3"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4 sm:ml-1" />
        </Button>
      </div>
    </div>
  )
}
