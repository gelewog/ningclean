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
      className="fixed top-20 left-1/2 -translate-x-1/2 z-40"
    >
      <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2">
          {clipboard.operation === 'copy' ? (
            <Copy className="w-4 h-4 text-blue-500" />
          ) : (
            <Scissors className="w-4 h-4 text-amber-500" />
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
            {clipboard.operation === 'copy' ? 'Copied' : 'Cut'}: {clipboard.name}
          </span>
        </div>
        <div className="h-4 w-px bg-gray-200 dark:bg-slate-700" />
        <button
          onClick={onPaste}
          disabled={!hasItems}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ClipboardPaste className="w-3.5 h-3.5" />
          Paste
        </button>
        <button
          onClick={onClear}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>
    </motion.div>
  )
}
