'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Edit3, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface RenameModalProps {
  isOpen: boolean
  onClose: () => void
  item: { name: string; path: string; type: 'file' | 'folder' } | null
  onConfirm: (newName: string) => void
  loading: boolean
}

export function RenameModal({ isOpen, onClose, item, onConfirm, loading }: RenameModalProps) {
  const [newName, setNewName] = React.useState('')
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    if (item) setNewName(item.name)
  }, [item])

  if (!mounted || !isOpen || !item) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newName.trim() && newName !== item.name) {
      onConfirm(newName.trim())
    }
  }

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
            <div className="relative bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent px-6 py-5 border-b border-gray-100 dark:border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl animate-pulse" />
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Edit3 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ubah Nama {item.type === 'folder' ? 'Folder' : 'File'}</h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{item.name}</p>
                </div>
              </div>
              <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-gray-500 dark:text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-6 py-5">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-2 block">Nama Baru</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Masukkan nama baru..."
                  className="h-11"
                  autoFocus
                />
              </div>

              <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-700/50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || !newName.trim() || newName === item.name}
                  className="group relative px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengubah nama...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4" />
                      <span>Ubah Nama</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
