'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit, Trash2, HelpCircle, Calendar, X, 
  AlertCircle, MessageCircle, Search, Eye, Hash, EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/admin/DataTable'
import { useFaq, useCreateFaq, useUpdateFaq, useDeleteFaq } from '@/lib/use-queries'
import { FAQ } from '@/types'
import { formatDate } from '@/lib/utils'
import { Breadcrumb } from '@/components/admin/Breadcrumb'

interface FAQFormData {
  question: string
  answer: string
  category: string
  order: number
  isActive: boolean
}

const categories = ['General', 'Services', 'Pricing', 'Booking', 'Technical', 'Other']

// Modern Modal Component for FAQ Form
function FAQFormModal({
  isOpen,
  onClose,
  isEditing,
  formData,
  setFormData,
  errors,
  setErrors,
  saving,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  isEditing: boolean
  formData: FAQFormData
  setFormData: (data: FAQFormData) => void
  errors: Partial<FAQFormData>
  setErrors: (errors: Partial<FAQFormData>) => void
  saving: boolean
  onSave: () => void
}) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="pointer-events-auto w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-900/20 dark:to-transparent flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit FAQ' : 'Create FAQ'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {isEditing ? 'Perbarui pertanyaan' : 'Buat FAQ baru'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-lg"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-5">
              {/* Question */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Question <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.question}
                  onChange={(e) => {
                    setFormData({ ...formData, question: e.target.value })
                    setErrors({ ...errors, question: undefined })
                  }}
                  placeholder="Enter the question"
                  className={errors.question ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.question && <p className="text-sm text-red-500">{errors.question}</p>}
              </div>

              {/* Category & Order */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Display Order
                  </label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Answer */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => {
                    setFormData({ ...formData, answer: e.target.value })
                    setErrors({ ...errors, answer: undefined })
                  }}
                  placeholder="Enter the answer..."
                  rows={5}
                  className={`w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500 ${errors.answer ? 'border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400'}`}
                />
                {errors.answer && <p className="text-sm text-red-500">{errors.answer}</p>}
              </div>

              {/* Status Toggle */}
              <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Active</span>
                    <p className="text-xs text-gray-500 dark:text-slate-400">FAQ akan ditampilkan publik</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 flex-shrink-0">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button 
              onClick={onSave} 
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  {isEditing ? 'Simpan Perubahan' : 'Buat FAQ'}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// Delete Confirmation Modal
function FAQDeleteModal({
  isOpen,
  onClose,
  item,
  onConfirm,
  deleting,
}: {
  isOpen: boolean
  onClose: () => void
  item: FAQ | null
  onConfirm: () => void
  deleting: boolean
}) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isOpen || !item) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="pointer-events-auto w-full h-full sm:h-auto sm:max-w-md bg-white dark:bg-slate-900 sm:rounded-2xl shadow-2xl border-0 sm:border border-gray-200 dark:border-slate-700 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hapus FAQ</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{item.question}</p>
                  <Badge variant="outline" className="mt-2">{item.category}</Badge>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button 
                onClick={onConfirm} 
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default function FAQPage() {
  const { data: items = [], isLoading: loading } = useFaq()
  const createMutation = useCreateFaq()
  const updateMutation = useUpdateFaq()
  const deleteMutation = useDeleteFaq()
  
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<FAQ | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<FAQFormData>({
    question: '',
    answer: '',
    category: 'General',
    order: 0,
    isActive: true,
  })
  const [errors, setErrors] = React.useState<Partial<FAQFormData>>({})
  const [search, setSearch] = React.useState('')

  function openCreateModal() {
    setIsEditing(false)
    setSelectedItem(null)
    setFormData({
      question: '',
      answer: '',
      category: 'General',
      order: 0,
      isActive: true,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openEditModal(item: FAQ) {
    setIsEditing(true)
    setSelectedItem(item)
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category,
      order: item.order,
      isActive: item.isActive,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openDeleteModal(item: FAQ) {
    setSelectedItem(item)
    setIsDeleteModalOpen(true)
  }

  function validateForm(): boolean {
    const newErrors: Partial<FAQFormData> = {}
    if (!formData.question.trim()) newErrors.question = 'Question is required'
    if (!formData.answer.trim()) newErrors.answer = 'Answer is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validateForm()) return

    const itemData = {
      question: formData.question,
      answer: formData.answer,
      category: formData.category,
      order: formData.order,
      isActive: formData.isActive,
    }

    try {
      if (isEditing && selectedItem) {
        await updateMutation.mutateAsync({ id: selectedItem.id, data: itemData })
      } else {
        await createMutation.mutateAsync(itemData)
      }
      setIsModalOpen(false)
    } catch (error) {
      // Error toast is handled by mutation hook
    }
  }

  async function handleDelete() {
    if (!selectedItem) return
    try {
      await deleteMutation.mutateAsync(selectedItem.id)
      setIsDeleteModalOpen(false)
    } catch (error) {
      // Error toast is handled by mutation hook
    }
  }

  const filteredItems = React.useMemo(() => {
    if (!search) return items
    const term = search.toLowerCase()
    return items.filter(item => 
      item.question.toLowerCase().includes(term) || 
      item.answer.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term)
    )
  }, [items, search])

  const columns = [
    {
      key: 'question',
      label: 'Question',
      render: (value: string, row: FAQ) => (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <HelpCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-white line-clamp-2">{value}</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1 line-clamp-1">{row.answer}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      key: 'order',
      label: 'Order',
      render: (value: number) => <span className="text-sm text-gray-700 dark:text-slate-300">{value}</span>,
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'default'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value: string) => (
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(value)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_: any, row: FAQ) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEditModal(row)} className="text-gray-500 dark:text-slate-400 hover:text-emerald-600">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openDeleteModal(row)} className="text-gray-500 dark:text-slate-400 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'FAQ' }]} />

      <div className="w-full px-3 sm:px-6 py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-start justify-between gap-4"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">FAQ</h1>
              <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700 h-8 text-xs px-3 flex-shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1 truncate">Manage frequently asked questions</p>
          </div>
          <div className="flex-shrink-0">
            <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-slate-600">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Total: </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{items.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-3 sm:p-4"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500 z-10 pointer-events-none" />
            <Input
              placeholder="Search FAQs..."
              className="pl-10 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 relative z-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="sm:bg-white sm:dark:bg-slate-900 sm:border sm:border-gray-200 dark:sm:border-slate-700 sm:rounded-2xl overflow-hidden shadow-sm">
            <DataTable
              columns={columns}
              data={filteredItems}
              loading={loading}
              renderCard={(row: FAQ) => (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 p-3 active:scale-[0.99]">
                  <div className="space-y-2">
                    {/* Header - Category + Status */}
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700/50 pb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                          <HelpCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 font-medium">
                          {row.category}
                        </Badge>
                      </div>
                      <Badge 
                        variant={row.isActive ? 'success' : 'default'}
                        className="text-[10px] px-1.5 py-0.5"
                      >
                        {row.isActive ? (
                          <span className="flex items-center gap-1"><Eye className="w-2.5 h-2.5" /> Active</span>
                        ) : (
                          <span className="flex items-center gap-1"><EyeOff className="w-2.5 h-2.5" /> Inactive</span>
                        )}
                      </Badge>
                    </div>

                    {/* Question & Answer */}
                    <div className="space-y-1.5 min-w-0 pt-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                        {row.question}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {row.answer}
                      </p>
                    </div>

                    {/* Footer - Order, Views, Date, Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-slate-400" title="Display Order">
                          <Hash className="w-3 h-3" />
                          {row.order}
                        </span>
                        {(row as any).views !== undefined && (
                          <span className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-slate-400" title="Views">
                            <Eye className="w-3 h-3" />
                            {(row as any).views}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {formatDate(row.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditModal(row)} 
                          className="h-7 w-7 p-0 text-gray-500 dark:text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openDeleteModal(row)} 
                          className="h-7 w-7 p-0 text-gray-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              skeletonCard={(i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 animate-pulse shadow-sm"
                >
                  <div className="space-y-2">
                    {/* Header - Icon + Category + Status */}
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700/50 pb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="skeleton h-7 w-7 rounded-lg dark:bg-slate-700" />
                        <div className="skeleton h-5 w-20 rounded-full dark:bg-slate-700" />
                      </div>
                      <div className="skeleton h-5 w-14 rounded-full dark:bg-slate-700" />
                    </div>

                    {/* Question + Answer */}
                    <div className="space-y-1.5 pt-1 min-w-0">
                      <div className="skeleton h-4 w-full max-w-[280px] rounded dark:bg-slate-700" />
                      <div className="skeleton h-3 w-full max-w-[250px] rounded dark:bg-slate-700" />
                      <div className="skeleton h-3 w-3/4 rounded dark:bg-slate-700" />
                    </div>

                    {/* Footer - Stats + Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className="skeleton h-3 w-10 rounded dark:bg-slate-700" />
                        <div className="skeleton h-3 w-16 rounded dark:bg-slate-700" />
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="skeleton h-7 w-7 rounded-lg dark:bg-slate-700" />
                        <div className="skeleton h-7 w-7 rounded-lg dark:bg-slate-700" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              emptyState={
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 rounded-full bg-gray-100 dark:bg-slate-800 p-4">
                    <MessageCircle className="h-8 w-8 text-gray-400 dark:text-slate-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {search ? 'No FAQs found' : 'No FAQs yet'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    {search ? 'Try different keywords' : 'Click the button above to add your first FAQ'}
                  </p>
                </div>
              }
            />
          </div>
        </motion.div>
      </div>

      {/* Form Modal */}
      <FAQFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setIsEditing(false)
        }}
        isEditing={isEditing}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        saving={createMutation.isPending || updateMutation.isPending}
        onSave={handleSubmit}
      />

      {/* Delete Modal */}
      <FAQDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        item={selectedItem}
        onConfirm={handleDelete}
        deleting={deleteMutation.isPending}
      />
    </div>
  )
}
