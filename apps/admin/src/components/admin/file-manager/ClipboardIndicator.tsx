'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Scissors, ClipboardPaste } from 'lucide-react'

interface ClipboardState {
  sourcePath: string
  type: 'file' | 'folder'
  operation: 'copy' | 'cut'
  name: string
}

interface ClipboardIndicatorProps {
  clipboard: ClipboardState | null
  onPaste: () => void
  onClear: () => void
  hasItems: boolean
}

export function ClipboardIndicator({ clipboard, onPaste, onClear, hasItems }: ClipboardIndicatorProps) {
  if (!clipboard) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed top-20 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-40"
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl sm:rounded-2xl shadow-xl max-w-full">
        <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-none">
          {clipboard.operation === 'copy' ? (
            <Copy className="w-4 h-4 text-blue-500 flex-shrink-0" />
          ) : (
            <Scissors className="w-4 h-4 text-amber-500 flex-shrink-0" />
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-slate-200 truncate max-w-[120px] sm:max-w-[200px]">
            {clipboard.operation === 'copy' ? 'Disalin' : 'Dipotong'}: {clipboard.name}
          </span>
        </div>
        <div className="hidden sm:block h-4 w-px bg-gray-200 dark:bg-slate-700 flex-shrink-0" />
        <button
          onClick={onPaste}
          disabled={!hasItems}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <ClipboardPaste className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tempel</span>
        </button>
        <button
          onClick={onClear}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex-shrink-0"
        >
          <X className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>
    </motion.div>
  )
}
