'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Loader2, AlertCircle, Folder, File } from 'lucide-react'

interface DeleteItem {
  name: string
  path: string
  type: 'file' | 'folder'
  sizeFormatted?: string
  fileCount?: number
}

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  items: DeleteItem[]
  onConfirm: () => void
  deleting: boolean
}

function getFileIcon(extension: string, isImage: boolean) {
  if (isImage) return null
  return null
}

export function DeleteConfirmModal({ isOpen, onClose, items, onConfirm, deleting }: DeleteConfirmModalProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => { setMounted(true) }, [])
  if (!mounted || !isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-black/70 via-black/60 to-black/80 backdrop-blur-xl"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="pointer-events-auto w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700/50 overflow-hidden">
            <div className="relative bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent px-6 py-5 border-b border-gray-100 dark:border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl animate-pulse" />
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                    <Trash2 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hapus {items.length > 1 ? `${items.length} Items` : 'Item'}</h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>
              <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-gray-500 dark:text-slate-400" />
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200/50 dark:border-red-800/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {items.length > 1
                      ? `${items.length} file/folder akan dihapus secara permanen.`
                      : `"${items[0]?.name}" akan dihapus secara permanen.`
                    }
                  </p>
                </div>
              </div>

              <div className="mt-4 max-h-40 overflow-y-auto space-y-2">
                {items.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                      {item.type === 'folder'
                        ? <Folder className="w-4 h-4 text-amber-500" />
                        : <File className="w-4 h-4 text-gray-400" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {item.type === 'folder' ? `${item.fileCount || 0} files` : item.sizeFormatted}
                      </p>
                    </div>
                  </div>
                ))}
                {items.length > 5 && (
                  <p className="text-xs text-gray-500 dark:text-slate-400 text-center py-2">
                    +{items.length - 5} more items...
                  </p>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-700/50 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                disabled={deleting}
                className="group relative px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30 transition-all disabled:opacity-50 overflow-hidden"
              >
                {deleting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menghapus...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus Permanen</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
