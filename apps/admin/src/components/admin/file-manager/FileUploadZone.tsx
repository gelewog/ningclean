'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Loader2, CheckCircle, AlertCircle, FileIcon } from 'lucide-react'

interface UploadFile {
  file: File
  id: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

interface FileUploadProps {
  currentPath: string
  onUploadComplete: () => void
  uploadFile: (file: File, folder?: string) => Promise<{
    success: boolean
    message: string
    data?: unknown
  }>
}

export function FileUploadZone({ currentPath, onUploadComplete, uploadFile }: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [uploads, setUploads] = React.useState<UploadFile[]>([])
  const [isExpanded, setIsExpanded] = React.useState(false)
  const dragCounter = React.useRef(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const handleTriggerUpload = () => {
      inputRef.current?.click()
    }
    window.addEventListener('file-manager-trigger-upload', handleTriggerUpload)
    return () => window.removeEventListener('file-manager-trigger-upload', handleTriggerUpload)
  }, [])

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await uploadFiles(files)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      await uploadFiles(files)
    }
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const uploadFiles = async (files: File[]) => {
    const newUploads: UploadFile[] = files.map((file) => ({
      file,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      progress: 0,
      status: 'pending',
    }))

    setUploads((prev) => [...prev, ...newUploads])
    setIsExpanded(true)

    for (const upload of newUploads) {
      setUploads((prev) =>
        prev.map((u) => (u.id === upload.id ? { ...u, status: 'uploading' } : u))
      )

      try {
        const result = await uploadFile(upload.file, currentPath || undefined)

        if (result.success) {
          setUploads((prev) =>
            prev.map((u) =>
              u.id === upload.id ? { ...u, progress: 100, status: 'success' } : u
            )
          )
        } else {
          setUploads((prev) =>
            prev.map((u) =>
              u.id === upload.id ? { ...u, status: 'error', error: result.message } : u
            )
          )
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Upload failed'
        setUploads((prev) =>
          prev.map((u) =>
            u.id === upload.id ? { ...u, status: 'error', error: message } : u
          )
        )
      }
    }

    setTimeout(() => {
      onUploadComplete()
    }, 500)

    setTimeout(() => {
      setUploads((prev) => {
        const stillUploading = prev.filter((u) => u.status === 'uploading')
        if (stillUploading.length === 0) {
          setIsExpanded(false)
          return prev.filter((u) => u.status !== 'success')
        }
        return prev
      })
    }, 2000)
  }

  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id))
  }

  const hasActiveUploads = uploads.some((u) => u.status === 'uploading')

  return (
    <>
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-blue-500/10 backdrop-blur-sm flex items-center justify-center"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 shadow-2xl border-4 border-dashed border-blue-500 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <Upload className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Letakkan file di sini
              </h3>
              <p className="text-gray-500 dark:text-slate-400">
                File akan diupload ke folder {currentPath || 'root'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && uploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: 20 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-h-80 overflow-hidden bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {hasActiveUploads ? 'Mengupload...' : 'Upload Selesai'}
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto p-2 space-y-2">
              {uploads.map((upload) => (
                <UploadItem key={upload.id} upload={upload} onRemove={() => removeUpload(upload.id)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="hidden"
      />
    </>
  )
}

interface UploadItemProps {
  upload: UploadFile
  onRemove: () => void
}

function UploadItem({ upload, onRemove }: UploadItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
      <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-slate-600 flex items-center justify-center overflow-hidden">
        {upload.file.type.startsWith('image/') ? (
          <img
            src={URL.createObjectURL(upload.file)}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <FileIcon className="w-5 h-5 text-gray-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {upload.file.name}
        </p>
        <div className="flex items-center gap-2">
          {upload.status === 'uploading' && (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
              <span className="text-xs text-gray-500 dark:text-slate-400">Mengupload...</span>
            </>
          )}
          {upload.status === 'success' && (
            <>
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              <span className="text-xs text-emerald-600 dark:text-emerald-400">Terupload</span>
            </>
          )}
          {upload.status === 'error' && (
            <>
              <AlertCircle className="w-3 h-3 text-red-500" />
              <span className="text-xs text-red-600 dark:text-red-400 truncate">
                {upload.error || 'Gagal'}
              </span>
            </>
          )}
        </div>
      </div>

      <button
        onClick={onRemove}
        className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  )
}

export function triggerFileUpload() {
  window.dispatchEvent(new CustomEvent('file-manager-trigger-upload'))
}
