'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Folder, File, Image as ImageIcon, FileText, Film, Music, Archive,
  Trash2, RefreshCw, Grid3X3, List, Search, CheckSquare, Square,
  ChevronRight, Home, HardDrive, Info, Loader2,
  Copy, Scissors, Edit3, FolderPlus, Upload
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  getFiles, getStorageStats, deleteFile, deleteFiles,
  copyFile, moveFile, copyFolder, moveFolder,
  renameItem, createFolder, uploadFile,
  FileInfo, FolderInfo, StorageStats
} from '@/lib/api'
import {
  RenameModal, CreateFolderModal, DeleteConfirmModal,
  FilePreviewModal, ClipboardIndicator, FileUploadZone, UploadButton
} from '@/components/admin/file-manager'
import { Breadcrumb } from '@/components/admin/Breadcrumb'

// File type icons
const getFileIcon = (extension: string, isImage: boolean) => {
  if (isImage) return <ImageIcon className="w-5 h-5" />
  const ext = extension.toLowerCase()
  if (['.pdf'].includes(ext)) return <FileText className="w-5 h-5 text-red-500" />
  if (['.mp4', '.mov', '.avi'].includes(ext)) return <Film className="w-5 h-5 text-purple-500" />
  if (['.mp3', '.wav', '.flac'].includes(ext)) return <Music className="w-5 h-5 text-green-500" />
  if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) return <Archive className="w-5 h-5 text-amber-500" />
  return <File className="w-5 h-5 text-gray-400" />
}

// File type colors
const getFileColor = (extension: string, isImage: boolean): string => {
  if (isImage) return 'text-emerald-500'
  const ext = extension.toLowerCase()
  if (['.pdf'].includes(ext)) return 'text-red-500'
  if (['.mp4', '.mov', '.avi'].includes(ext)) return 'text-purple-500'
  if (['.mp3', '.wav', '.flac'].includes(ext)) return 'text-green-500'
  if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) return 'text-amber-500'
  return 'text-gray-400'
}

export default function FileManagerPage() {
  const [loading, setLoading] = React.useState(true)
  const [files, setFiles] = React.useState<FileInfo[]>([])
  const [folders, setFolders] = React.useState<FolderInfo[]>([])
  const [stats, setStats] = React.useState<StorageStats | null>(null)
  const [currentPath, setCurrentPath] = React.useState<string>('')
  const [pathHistory, setPathHistory] = React.useState<string[]>([])
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set())
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [renameModal, setRenameModal] = React.useState<{ name: string; path: string; type: 'file' | 'folder' } | null>(null)
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = React.useState(false)
  const [previewFile, setPreviewFile] = React.useState<FileInfo | null>(null)
  const [deleting, setDeleting] = React.useState(false)
  const [renaming, setRenaming] = React.useState(false)
  const [creatingFolder, setCreatingFolder] = React.useState(false)
  const [clipboard, setClipboard] = React.useState<{ sourcePath: string; type: 'file' | 'folder'; operation: 'copy' | 'cut'; name: string } | null>(null)

  const fetchFiles = React.useCallback(async (folder?: string) => {
    setLoading(true)
    try {
      const [filesData, statsData] = await Promise.all([getFiles(folder), getStorageStats()])
      
      // FIX Bug #1: Remove duplicate filtering - API already returns correct data
      console.log('[FileManager] fetchFiles:', { folder, filesCount: filesData.files.length, foldersCount: filesData.folders.length })
      
      setFiles(filesData.files)
      setFolders(filesData.folders)
      setStats(statsData)
      
      // Store apiBaseUrl for image URL construction
      if (filesData.apiBaseUrl) {
        ;(window as any).__fileManagerApiBaseUrl = filesData.apiBaseUrl
      }
    } catch (error) {
      console.error('Failed to fetch files:', error)
      toast.error('Gagal memuat file')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { fetchFiles(currentPath) }, [currentPath, fetchFiles])

  const navigateToFolder = (folderPath: string) => {
    setPathHistory(prev => [...prev, currentPath])
    setCurrentPath(folderPath)
    setSelectedItems(new Set())
  }

  const navigateBack = () => {
    if (pathHistory.length > 0) {
      const prevPath = pathHistory[pathHistory.length - 1]
      setPathHistory(prev => prev.slice(0, -1))
      setCurrentPath(prevPath)
      setSelectedItems(new Set())
    }
  }

  const navigateHome = () => {
    setPathHistory([])
    setCurrentPath('')
    setSelectedItems(new Set())
  }

  // FIX Bug #2: Use current visible items (files/folders) based on current view
  const toggleSelectAll = () => {
    // Use original files/folders for select all, not filtered (which is for search)
    const currentVisibleItems = [...files, ...folders].map(f => f.path)
    const allSelected = currentVisibleItems.length > 0 && currentVisibleItems.every(path => selectedItems.has(path))
    
    if (allSelected) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(currentVisibleItems))
    }
  }

  const toggleSelect = (path: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      newSet.has(path) ? newSet.delete(path) : newSet.add(path)
      return newSet
    })
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const itemsToDelete = selectedItemsList.map(item => ({
        path: item.path,
        type: 'fileCount' in item ? 'folder' : 'file'
      }))
      const result = await deleteFiles(
        itemsToDelete.map(i => i.path),
        itemsToDelete.map(i => i.type) as ('file' | 'folder')[]
      )
      if (result.success) {
        toast.success(`Berhasil menghapus ${result.deleted} item`)
      } else {
        toast.error(`Gagal menghapus ${result.failed} item`)
      }
      setIsDeleteModalOpen(false)
      setSelectedItems(new Set())
      fetchFiles(currentPath)
    } catch (error) {
      toast.error('Gagal menghapus file')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteSingle = async (path: string, type: 'file' | 'folder') => {
    try {
      const result = type === 'file'
        ? await deleteFile(path)
        : await deleteFiles([path], ['folder'])
      // FIX: Use result.success for both file and folder delete
      if (result.success) {
        toast.success('Item dihapus')
        fetchFiles(currentPath)
      } else {
        toast.error((result as any).message || 'Gagal menghapus')
      }
    } catch (error) {
      toast.error('Gagal menghapus item')
    }
  }

  const handleRename = async (newName: string) => {
    if (!renameModal) return
    setRenaming(true)
    try {
      const result = await renameItem(renameModal.path, newName)
      if (result.success) {
        toast.success('Berhasil rename')
        setRenameModal(null)
        fetchFiles(currentPath)
      } else {
        toast.error(result.message || 'Gagal rename')
      }
    } catch (error) {
      toast.error('Gagal rename item')
    } finally {
      setRenaming(false)
    }
  }

  const handleCreateFolder = async (folderName: string) => {
    setCreatingFolder(true)
    try {
      const result = await createFolder(currentPath, folderName)
      if (result.success) {
        toast.success('Folder berhasil dibuat')
        setIsCreateFolderModalOpen(false)
        fetchFiles(currentPath)
      } else {
        toast.error(result.message || 'Gagal membuat folder')
      }
    } catch (error) {
      toast.error('Gagal membuat folder')
    } finally {
      setCreatingFolder(false)
    }
  }

  const handleCopy = (path: string, name: string, type: 'file' | 'folder') => {
    setClipboard({ sourcePath: path, type, operation: 'copy', name })
    toast.success(`${type === 'folder' ? 'Folder' : 'File'} copied to clipboard`)
  }

  const handleCut = (path: string, name: string, type: 'file' | 'folder') => {
    setClipboard({ sourcePath: path, type, operation: 'cut', name })
    toast.success(`${type === 'folder' ? 'Folder' : 'File'} cut to clipboard`)
  }

  const handlePaste = async () => {
    if (!clipboard) return
    setLoading(true)
    try {
      let result
      if (clipboard.type === 'file') {
        result = clipboard.operation === 'copy'
          ? await copyFile(clipboard.sourcePath, currentPath)
          : await moveFile(clipboard.sourcePath, currentPath)
      } else {
        result = clipboard.operation === 'copy'
          ? await copyFolder(clipboard.sourcePath, currentPath)
          : await moveFolder(clipboard.sourcePath, currentPath)
      }
      if (result.success) {
        toast.success(result.message)
        if (clipboard.operation === 'cut') setClipboard(null)
        fetchFiles(currentPath)
      } else {
        toast.error(result.message || 'Operation failed')
      }
    } catch (error) {
      toast.error('Gagal paste item')
    } finally {
      setLoading(false)
    }
  }

  const clearClipboard = () => setClipboard(null)

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const selectedItemsList = [
    ...filteredFiles.filter(f => selectedItems.has(f.path)),
    ...filteredFolders.filter(f => selectedItems.has(f.path))
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 text-gray-900 dark:text-white">
      <AnimatePresence>
        {clipboard && (
          <ClipboardIndicator
            clipboard={clipboard}
            onPaste={handlePaste}
            onClear={clearClipboard}
            hasItems={true}
          />
        )}
      </AnimatePresence>

      {/* Topbar */}
      <Breadcrumb items={[{ label: 'File Manager' }]} />

      <div className="px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">File Manager</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Kelola semua file upload</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => fetchFiles(currentPath)} className="text-gray-500 dark:text-slate-400">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsCreateFolderModalOpen(true)} className="gap-2">
              <FolderPlus className="w-4 h-4" />
              New Folder
            </Button>
            <UploadButton currentPath={currentPath} />
          </div>
        </motion.div>

        {/* File Upload Zone */}
        <FileUploadZone
          currentPath={currentPath}
          onUploadComplete={() => fetchFiles(currentPath)}
          uploadFile={async (file, folder) => {
            try {
              const result = await uploadFile(file, folder)
              if (result.success) {
                toast.success('File uploaded successfully')
              } else {
                toast.error(result.message || 'Upload failed')
              }
              return result
            } catch (error: any) {
              toast.error(error.message || 'Upload failed')
              throw error
            }
          }}
        />

        {/* Storage Stats */}
        {stats && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <File className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.fileCount}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Total Files</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <HardDrive className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.usedSpace}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Storage Used</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                  <Folder className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.folderCount}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Folders</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                  <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSpace}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Total Space</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Toolbar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button onClick={navigateHome} className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                <Home className="w-4 h-4" />
              </button>
              <button onClick={navigateBack} disabled={pathHistory.length === 0} className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              {/* Breadcrumb - Fixed: Make each segment clickable */}
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  onClick={navigateHome}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Folder className="w-4 h-4 text-amber-500" />
                  <span className="text-gray-700 dark:text-slate-300">uploads</span>
                </button>
                {currentPath && currentPath.split('/').map((segment, index, arr) => {
                  const pathSoFar = arr.slice(0, index + 1).join('/')
                  return (
                    <React.Fragment key={pathSoFar}>
                      <span className="text-gray-400">/</span>
                      <button
                        onClick={() => navigateToFolder(pathSoFar)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          index === arr.length - 1
                            ? 'bg-gray-200 dark:bg-slate-700 font-medium text-gray-900 dark:text-white'
                            : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300'
                        }`}
                      >
                        {segment}
                      </button>
                    </React.Fragment>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search files..." className="pl-10 h-10 w-full sm:w-64 bg-gray-100 dark:bg-slate-800 border-0" />
              </div>
              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-slate-700'}`}>
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-slate-700'}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
              <button onClick={toggleSelectAll} className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors" title="Select All">
                {selectedItems.size === filteredFiles.length + filteredFolders.length && filteredFiles.length + filteredFolders.length > 0
                  ? <CheckSquare className="w-4 h-4 text-emerald-500" />
                  : <Square className="w-4 h-4" />
                }
              </button>
              {selectedItems.size > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setIsDeleteModalOpen(true)} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete ({selectedItems.size})
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* File List */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          ) : viewMode === 'grid' ? (
            <div className="p-4">
              <GridView
                files={filteredFiles}
                folders={filteredFolders}
                selectedItems={selectedItems}
                onNavigate={navigateToFolder}
                onToggleSelect={toggleSelect}
                onPreview={setPreviewFile}
                onCopy={handleCopy}
                onCut={handleCut}
                onRename={(name, path, type) => setRenameModal({ name, path, type })}
                onDelete={handleDeleteSingle}
              />
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-700/50">
              <ListView
                files={filteredFiles}
                folders={filteredFolders}
                selectedItems={selectedItems}
                onToggleSelect={toggleSelect}
                onNavigate={navigateToFolder}
                onPreview={setPreviewFile}
                onCopy={handleCopy}
                onCut={handleCut}
                onRename={(name, path, type) => setRenameModal({ name, path, type })}
                onDelete={handleDeleteSingle}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        items={selectedItemsList.map(item => ({
          name: item.name,
          path: item.path,
          type: 'fileCount' in item ? 'folder' : 'file',
          sizeFormatted: 'sizeFormatted' in item ? (item as any).sizeFormatted : undefined,
          fileCount: 'fileCount' in item ? (item as any).fileCount : undefined,
        }))}
        onConfirm={handleDelete}
        deleting={deleting}
      />

      <RenameModal
        isOpen={!!renameModal}
        onClose={() => setRenameModal(null)}
        item={renameModal}
        onConfirm={handleRename}
        loading={renaming}
      />

      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onConfirm={handleCreateFolder}
        loading={creatingFolder}
        currentPath={currentPath}
      />

      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />
    </div>
  )
}

// Grid View Component
function GridView({
  files, folders, selectedItems, onNavigate, onToggleSelect, onPreview, onCopy, onCut, onRename, onDelete
}: {
  files: FileInfo[]
  folders: FolderInfo[]
  selectedItems: Set<string>
  onNavigate: (path: string) => void
  onToggleSelect: (path: string) => void
  onPreview: (file: FileInfo) => void
  onCopy: (path: string, name: string, type: 'file' | 'folder') => void
  onCut: (path: string, name: string, type: 'file' | 'folder') => void
  onRename: (name: string, path: string, type: 'file' | 'folder') => void
  onDelete: (path: string, type: 'file' | 'folder') => void
}) {
  const getFileIcon = (extension: string, isImage: boolean) => {
    if (isImage) return <ImageIcon className="w-5 h-5" />
    const ext = extension.toLowerCase()
    if (['.pdf'].includes(ext)) return <FileText className="w-5 h-5 text-red-500" />
    if (['.mp4', '.mov', '.avi'].includes(ext)) return <Film className="w-5 h-5 text-purple-500" />
    if (['.mp3', '.wav', '.flac'].includes(ext)) return <Music className="w-5 h-5 text-green-500" />
    if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) return <Archive className="w-5 h-5 text-amber-500" />
    return <File className="w-5 h-5 text-gray-400" />
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

  if (files.length === 0 && folders.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
          <Folder className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-slate-400">Tidak ada file di folder ini</p>
      </div>
    )
  }

  return (
    <>
      {folders.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-3">Folders</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {folders.map((folder) => (
              <motion.div key={folder.path} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="group relative">
                <button
                  onClick={() => onNavigate(folder.path)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all ${selectedItems.has(folder.path) ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20' : 'border-dashed border-gray-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-900/10'}`}
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-2">
                    <Folder className="w-6 h-6 text-amber-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{folder.name}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{folder.fileCount} files</p>
                </button>
                <button onClick={(e) => { e.stopPropagation(); onToggleSelect(folder.path); }} className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {selectedItems.has(folder.path) ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4 text-gray-400" />}
                </button>
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ActionButton icon={<Copy className="w-3 h-3 text-blue-500" />} onClick={() => onCopy(folder.path, folder.name, 'folder')} />
                  <ActionButton icon={<Scissors className="w-3 h-3 text-amber-500" />} onClick={() => onCut(folder.path, folder.name, 'folder')} />
                  <ActionButton icon={<Edit3 className="w-3 h-3 text-gray-500" />} onClick={() => onRename(folder.name, folder.path, 'folder')} />
                  <ActionButton icon={<Trash2 className="w-3 h-3 text-red-500" />} onClick={() => onDelete(folder.path, 'folder')} className="hover:bg-red-50 dark:hover:bg-red-900/20" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-3">Files</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {files.map((file) => (
              <motion.div key={file.path} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="group relative">
                <button
                  onClick={() => onPreview(file)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all ${selectedItems.has(file.path) ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20' : 'border-gray-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'}`}
                >
                  {file.isImage ? (
                    <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-gray-100 dark:bg-slate-800">
                      <img 
                        src={file.url} 
                        alt={file.name} 
                        className="w-full h-full object-cover"
                        // FIX Bug #3: Add error handling for broken image URLs
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-8 h-8"/></div>`
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 mx-auto rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                      <div className={getFileColor(file.extension, file.isImage)}>{getFileIcon(file.extension, file.isImage)}</div>
                    </div>
                  )}
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{file.sizeFormatted}</p>
                </button>
                <button onClick={(e) => { e.stopPropagation(); onToggleSelect(file.path); }} className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {selectedItems.has(file.path) ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4 text-gray-400" />}
                </button>
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ActionButton icon={<Copy className="w-3 h-3 text-blue-500" />} onClick={() => onCopy(file.path, file.name, 'file')} />
                  <ActionButton icon={<Scissors className="w-3 h-3 text-amber-500" />} onClick={() => onCut(file.path, file.name, 'file')} />
                  <ActionButton icon={<Edit3 className="w-3 h-3 text-gray-500" />} onClick={() => onRename(file.name, file.path, 'file')} />
                  <ActionButton icon={<Trash2 className="w-3 h-3 text-red-500" />} onClick={() => onDelete(file.path, 'file')} className="hover:bg-red-50 dark:hover:bg-red-900/20" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

// List View Component
function ListView({
  files, folders, selectedItems, onToggleSelect, onNavigate, onPreview, onCopy, onCut, onRename, onDelete
}: {
  files: FileInfo[]
  folders: FolderInfo[]
  selectedItems: Set<string>
  onToggleSelect: (path: string) => void
  onNavigate: (path: string) => void
  onPreview: (file: FileInfo) => void
  onCopy: (path: string, name: string, type: 'file' | 'folder') => void
  onCut: (path: string, name: string, type: 'file' | 'folder') => void
  onRename: (name: string, path: string, type: 'file' | 'folder') => void
  onDelete: (path: string, type: 'file' | 'folder') => void
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const getFileIcon = (extension: string, isImage: boolean) => {
    if (isImage) return <ImageIcon className="w-5 h-5" />
    const ext = extension.toLowerCase()
    if (['.pdf'].includes(ext)) return <FileText className="w-5 h-5 text-red-500" />
    if (['.mp4', '.mov', '.avi'].includes(ext)) return <Film className="w-5 h-5 text-purple-500" />
    if (['.mp3', '.wav', '.flac'].includes(ext)) return <Music className="w-5 h-5 text-green-500" />
    if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) return <Archive className="w-5 h-5 text-amber-500" />
    return <File className="w-5 h-5 text-gray-400" />
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

  if (files.length === 0 && folders.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
          <Folder className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-slate-400">Tidak ada file di folder ini</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50/50 dark:bg-slate-800/30 text-xs font-medium text-gray-500 dark:text-slate-400">
        <div className="col-span-6 flex items-center gap-2"><span>Name</span></div>
        <div className="col-span-2">Size</div>
        <div className="col-span-3">Modified</div>
        <div className="col-span-1"></div>
      </div>

      {folders.map((folder) => (
        <div key={folder.path} className={`grid grid-cols-12 gap-4 px-6 py-3 items-center hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${selectedItems.has(folder.path) ? 'bg-emerald-50/50 dark:bg-emerald-900/20' : ''}`}>
          <div className="col-span-6 flex items-center gap-3">
            <button onClick={() => onToggleSelect(folder.path)} className="text-gray-400 hover:text-gray-600">
              {selectedItems.has(folder.path) ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4" />}
            </button>
            <button onClick={() => onNavigate(folder.path)} className="flex items-center gap-3 flex-1 min-w-0">
              <Folder className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{folder.name}</span>
            </button>
          </div>
          <div className="col-span-2 text-sm text-gray-500 dark:text-slate-400">{folder.fileCount} files</div>
          <div className="col-span-3 text-sm text-gray-500 dark:text-slate-400">-</div>
          <div className="col-span-1 flex justify-end gap-1">
            <ActionButton icon={<Copy className="w-4 h-4 text-blue-500" />} onClick={() => onCopy(folder.path, folder.name, 'folder')} />
            <ActionButton icon={<Scissors className="w-4 h-4 text-amber-500" />} onClick={() => onCut(folder.path, folder.name, 'folder')} />
            <ActionButton icon={<Edit3 className="w-4 h-4 text-gray-500" />} onClick={() => onRename(folder.name, folder.path, 'folder')} />
            <ActionButton icon={<Trash2 className="w-4 h-4 text-red-500" />} onClick={() => onDelete(folder.path, 'folder')} />
          </div>
        </div>
      ))}

      {files.map((file) => (
        <div key={file.path} className={`grid grid-cols-12 gap-4 px-6 py-3 items-center hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${selectedItems.has(file.path) ? 'bg-emerald-50/50 dark:bg-emerald-900/20' : ''}`}>
          <div className="col-span-6 flex items-center gap-3">
            <button onClick={() => onToggleSelect(file.path)} className="text-gray-400 hover:text-gray-600">
              {selectedItems.has(file.path) ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4" />}
            </button>
            <button onClick={() => onPreview(file)} className="flex items-center gap-3 flex-1 min-w-0">
              <div className={getFileColor(file.extension, file.isImage)}>{getFileIcon(file.extension, file.isImage)}</div>
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</span>
            </button>
          </div>
          <div className="col-span-2 text-sm text-gray-500 dark:text-slate-400">{file.sizeFormatted}</div>
          <div className="col-span-3 text-sm text-gray-500 dark:text-slate-400">{formatDate(file.modifiedAt)}</div>
          <div className="col-span-1 flex justify-end gap-1">
            <ActionButton icon={<Copy className="w-4 h-4 text-blue-500" />} onClick={() => onCopy(file.path, file.name, 'file')} />
            <ActionButton icon={<Scissors className="w-4 h-4 text-amber-500" />} onClick={() => onCut(file.path, file.name, 'file')} />
            <ActionButton icon={<Edit3 className="w-4 h-4 text-gray-500" />} onClick={() => onRename(file.name, file.path, 'file')} />
            <ActionButton icon={<Trash2 className="w-4 h-4 text-red-500" />} onClick={() => onDelete(file.path, 'file')} />
          </div>
        </div>
      ))}
    </>
  )
}

// Shared Action Button Component
function ActionButton({ icon, onClick, className = '' }: { icon: React.ReactNode; onClick: () => void; className?: string }) {
  return (
    <button onClick={onClick} className={`p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${className}`}>
      {icon}
    </button>
  )
}
