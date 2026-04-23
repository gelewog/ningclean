'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, FileText, Image as ImageIcon, Film, Music, Archive, File } from 'lucide-react'
import { FileInfo } from '@/lib/api'

const getFileIcon = (extension: string, isImage: boolean) => {
  if (isImage) return <ImageIcon className="w-10 h-10" />
  const ext = extension.toLowerCase()
  if (['.pdf'].includes(ext)) return <FileText className="w-10 h-10 text-red-500" />
  if (['.mp4', '.mov', '.avi'].includes(ext)) return <Film className="w-10 h-10 text-purple-500" />
  if (['.mp3', '.wav', '.flac'].includes(ext)) return <Music className="w-10 h-10 text-green-500" />
  if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) return <Archive className="w-10 h-10 text-amber-500" />
  return <File className="w-10 h-10 text-gray-400" />
}

const getFileColor = (extension: string, isImage: boolean): string => {
  if (isImage) return 'text-emerald-500'
  const ext = extension.toLowerCase()
  if (['.pdf'].includes(ext)) return 'text-red-500'
  if (['.mp4', '.mov', '.avi'].includes(ext)) return 'text-purple-500'
  if (['.mp3', '.wav', '.flac'].includes(ext)) return 'text-green-500'
  if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) return 'text-amber-500'
  return 'text-gray-400'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

interface FilePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  file: FileInfo | null
}

export function FilePreviewModal({ isOpen, onClose, file }: FilePreviewModalProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => { setMounted(true) }, [])
  if (!mounted || !isOpen || !file) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-black/80 via-black/70 to-black/90 backdrop-blur-xl flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="pointer-events-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700/50 overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${file.isImage ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-gray-100 dark:bg-slate-800'}`}>
                <div className={getFileColor(file.extension, file.isImage)}>
                  {getFileIcon(file.extension, file.isImage)}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{file.name}</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">{file.sizeFormatted} • {file.extension}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                <ExternalLink className="w-4 h-4 text-gray-500 dark:text-slate-400" />
              </a>
              <button onClick={onClose} className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                <X className="w-4 h-4 text-gray-500 dark:text-slate-400" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-gray-50 dark:bg-slate-800/30">
            {file.isImage ? (
              <img
                src={file.url}
                alt={file.name}
                className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-lg"
              />
            ) : (
              <div className="text-center py-12">
                <div className={`w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gray-100 dark:bg-slate-800 ${getFileColor(file.extension, file.isImage)}`}>
                  {getFileIcon(file.extension, file.isImage)}
                </div>
                <p className="text-gray-500 dark:text-slate-400">Preview tidak tersedia untuk tipe file ini</p>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/30">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-slate-400">Created</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(file.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-slate-400">Modified</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(file.modifiedAt)}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-slate-400">Type</p>
                <p className="font-medium text-gray-900 dark:text-white">{file.type}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
