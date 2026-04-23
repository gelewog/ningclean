'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Plus, Edit, Trash2, Tag, ArrowLeft, X, Folder, 
  FileText, ChevronRight, Hash, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/admin/DataTable'
import { getBlogCategories, createBlogCategory, updateBlogCategory, deleteBlogCategory, BlogCategory } from '@/lib/api'
import { toast } from 'sonner'
import Link from 'next/link'
import { Breadcrumb } from '@/components/admin/Breadcrumb'

interface CategoryFormData {
  name: string
  slug: string
  description: string
}

// Modern Modal Component for Category Form
function CategoryModal({
  isOpen,
  onClose,
  isEditing,
  formData,
  setFormData,
  errors,
  setErrors,
  saving,
  onSave,
  category,
}: {
  isOpen: boolean
  onClose: () => void
  isEditing: boolean
  formData: CategoryFormData
  setFormData: (data: CategoryFormData) => void
  errors: Partial<CategoryFormData>
  setErrors: (errors: Partial<CategoryFormData>) => void
  saving: boolean
  onSave: () => void
  category: BlogCategory | null
}) {
  const modalRef = React.useRef<HTMLDivElement>(null)

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

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  if (!isOpen) return null

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
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="pointer-events-auto w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-900/20 dark:to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Folder className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit Kategori' : 'Tambah Kategori'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {isEditing ? 'Perbarui informasi kategori' : 'Buat kategori baru untuk blog'}
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

          {/* Content */}
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                Nama Kategori <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value
                  setFormData({ 
                    ...formData, 
                    name, 
                    slug: isEditing ? formData.slug : generateSlug(name) 
                  })
                  setErrors({ ...errors, name: '' })
                }}
                placeholder="Contoh: Tips Kebersihan"
                className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                Slug <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">/</span>
                <Input
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData({ 
                      ...formData, 
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') 
                    })
                    setErrors({ ...errors, slug: '' })
                  }}
                  placeholder="contoh-tips-kebersihan"
                  className={`pl-7 ${errors.slug ? 'border-red-500 focus:border-red-500' : ''}`}
                />
              </div>
              {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
              <p className="text-xs text-gray-400 dark:text-slate-500">
                URL-friendly version untuk akses kategori
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                Deskripsi
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi singkat tentang kategori ini..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 text-sm text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
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
                  {isEditing ? 'Simpan Perubahan' : 'Buat Kategori'}
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
function DeleteModal({
  isOpen,
  onClose,
  category,
  onConfirm,
  deleting,
}: {
  isOpen: boolean
  onClose: () => void
  category: BlogCategory | null
  onConfirm: () => void
  deleting: boolean
}) {
  if (!isOpen || !category) return null

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
          className="pointer-events-auto w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hapus Kategori</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
              <p className="text-sm text-gray-600 dark:text-slate-300">
                Apakah Anda yakin ingin menghapus kategori{' '}
                <strong className="text-gray-900 dark:text-white">{category.name}</strong>?
              </p>
              {category._count?.posts ? (
                <div className="mt-3 flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>Kategori ini memiliki {category._count.posts} posts</span>
                </div>
              ) : null}
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

export default function BlogCategoriesPage() {
  const [categories, setCategories] = React.useState<BlogCategory[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<BlogCategory | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<CategoryFormData>({ name: '', slug: '', description: '' })
  const [errors, setErrors] = React.useState<Partial<CategoryFormData>>({})
  const [saving, setSaving] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    setLoading(true)
    try {
      const data = await getBlogCategories()
      setCategories(data)
    } catch (error) {
      toast.error('Gagal mengambil kategori')
    } finally {
      setLoading(false)
    }
  }

  function openCreateModal() {
    setIsEditing(false)
    setSelectedCategory(null)
    setFormData({ name: '', slug: '', description: '' })
    setErrors({})
    setIsModalOpen(true)
  }

  function openEditModal(category: BlogCategory) {
    setIsEditing(true)
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openDeleteModal(category: BlogCategory) {
    setSelectedCategory(category)
    setIsDeleteModalOpen(true)
  }

  async function handleSave() {
    // Validation
    const newErrors: Partial<CategoryFormData> = {}
    if (!formData.name.trim()) newErrors.name = 'Nama kategori harus diisi'
    if (!formData.slug.trim()) newErrors.slug = 'Slug harus diisi'
    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug hanya boleh huruf kecil, angka, dan strip'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSaving(true)
    try {
      if (isEditing && selectedCategory) {
        await updateBlogCategory(selectedCategory.id, formData)
        toast.success('Kategori berhasil diperbarui')
      } else {
        await createBlogCategory(formData)
        toast.success('Kategori berhasil dibuat')
      }
      setIsModalOpen(false)
      fetchCategories()
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan kategori')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!selectedCategory) return
    setDeleting(true)
    try {
      await deleteBlogCategory(selectedCategory.id)
      toast.success('Kategori berhasil dihapus')
      setIsDeleteModalOpen(false)
      fetchCategories()
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus kategori')
    } finally {
      setDeleting(false)
    }
  }

  const filteredCategories = React.useMemo(() => {
    if (!search) return categories
    const term = search.toLowerCase()
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(term) || 
      cat.slug.toLowerCase().includes(term) ||
      (cat.description && cat.description.toLowerCase().includes(term))
    )
  }, [categories, search])

  const columns = [
    {
      key: 'name',
      label: 'Kategori',
      render: (value: string, row: BlogCategory) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-500/20">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
            {row.description && (
              <p className="text-xs text-gray-500 dark:text-slate-400 truncate max-w-xs">
                {row.description}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'slug',
      label: 'Slug',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <Hash className="h-3 w-3 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm text-gray-600 dark:text-slate-400">/{value}</span>
        </div>
      ),
    },
    {
      key: '_count',
      label: 'Posts',
      render: (_: any, row: BlogCategory) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
            <FileText className="h-3 w-3 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
            {row._count?.posts || 0}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_: any, row: BlogCategory) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              openEditModal(row)
            }}
            className="text-gray-500 dark:text-slate-400 hover:text-emerald-600"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              openDeleteModal(row)
            }}
            className="text-gray-500 dark:text-slate-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Blog', href: '/admin/blog' }, { label: 'Categories' }]} />

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Kategori Blog</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Kelola kategori untuk mengelompokkan blog posts</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <span className="text-sm text-gray-500 dark:text-slate-400">Total: </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{categories.length}</span>
            </div>
            <Button 
              onClick={openCreateModal} 
              className="bg-emerald-600 hover:bg-emerald-700 gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Kategori
            </Button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari kategori..."
              className="pl-10 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
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
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
            <DataTable
              columns={columns}
              data={filteredCategories}
              loading={loading}
              emptyState={
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 rounded-full bg-gray-100 dark:bg-slate-800 p-4">
                    <Tag className="h-8 w-8 text-gray-400 dark:text-slate-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {search ? 'Tidak ada kategori yang cocok' : 'Belum ada kategori'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    {search ? 'Coba kata kunci lain' : 'Klik tombol di atas untuk membuat kategori pertama'}
                  </p>
                </div>
              }
            />
          </div>
        </motion.div>
      </div>

      {/* Category Form Modal */}
      <CategoryModal
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
        saving={saving}
        onSave={handleSave}
        category={selectedCategory}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        category={selectedCategory}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </div>
  )
}
