'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit, Trash2, Star, Image as ImageIcon, Calendar, MapPin, X, 
  AlertCircle, Folder
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/admin/DataTable'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '@/lib/api'
import { GalleryItem } from '@/types'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface GalleryFormData {
  title: string
  description: string
  category: string
  imageUrl: string
  location: string
  isFeatured: boolean
  isActive: boolean
  order: number
}

const categories = ['Residential', 'Commercial', 'Deep Cleaning', 'Post Construction', 'Move In/Out', 'Regular']

// Modern Modal Component for Gallery Form
function GalleryFormModal({
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
  formData: GalleryFormData
  setFormData: (data: GalleryFormData) => void
  errors: Partial<GalleryFormData>
  setErrors: (errors: Partial<GalleryFormData>) => void
  saving: boolean
  onSave: () => void
}) {
  const modalRef = React.useRef<HTMLDivElement>(null)
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
          ref={modalRef}
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
                <Folder className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit Gallery Item' : 'Create Gallery Item'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {isEditing ? 'Perbarui informasi gallery item' : 'Buat gallery item baru'}
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
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value })
                    setErrors({ ...errors, title: '' })
                  }}
                  placeholder="Enter gallery item title"
                  className={errors.title ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>

              {/* Image Upload */}
              <ImageUpload
                label="Gallery Image"
                folder="gallery"
                value={formData.imageUrl}
                onChange={(url) => {
                  setFormData({ ...formData, imageUrl: url })
                  setErrors({ ...errors, imageUrl: '' })
                }}
                required
                error={errors.imageUrl}
                previewClassName="h-48 w-full"
              />

              {/* Category & Order */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value })
                      setErrors({ ...errors, category: '' })
                    }}
                    className={`w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 ${
                      errors.category ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                    }`}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
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

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-sm text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Surabaya, East Java"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Featured Item</span>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Tampilkan di halaman utama</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Active</span>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Item akan ditampilkan publik</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 flex-shrink-0">
            <Button 
              type="button"
              variant="outline" 
              onClick={onClose}
            >
              Batal
            </Button>
            <Button 
              type="button"
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
                  {isEditing ? 'Simpan Perubahan' : 'Buat Item'}
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
function GalleryDeleteModal({
  isOpen,
  onClose,
  item,
  onConfirm,
  deleting,
}: {
  isOpen: boolean
  onClose: () => void
  item: GalleryItem | null
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
          className="pointer-events-auto w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hapus Gallery Item</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{item.category}</p>
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

export default function GalleryPage() {
  const [items, setItems] = React.useState<GalleryItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<GalleryItem | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<GalleryFormData>({
    title: '',
    description: '',
    category: 'Residential',
    imageUrl: '',
    location: '',
    isFeatured: false,
    isActive: true,
    order: 0,
  })
  const [errors, setErrors] = React.useState<Partial<GalleryFormData>>({})
  const [saving, setSaving] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  React.useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    setLoading(true)
    try {
      const data = await getGalleryItems()
      setItems(data)
    } catch (error) {
      toast.error('Failed to fetch gallery items')
    } finally {
      setLoading(false)
    }
  }

  function openCreateModal() {
    setIsEditing(false)
    setSelectedItem(null)
    setFormData({
      title: '',
      description: '',
      category: 'Residential',
      imageUrl: '',
      location: '',
      isFeatured: false,
      isActive: true,
      order: 0,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openEditModal(item: GalleryItem) {
    setIsEditing(true)
    setSelectedItem(item)
    setFormData({
      title: item.title,
      description: item.description || '',
      category: item.category,
      imageUrl: item.imageUrl,
      location: item.location || '',
      isFeatured: item.isFeatured,
      isActive: item.isActive,
      order: item.order,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openDeleteModal(item: GalleryItem) {
    setSelectedItem(item)
    setIsDeleteModalOpen(true)
  }

  function validateForm(): boolean {
    const newErrors: Partial<GalleryFormData> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.category.trim()) newErrors.category = 'Category is required'
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validateForm()) return

    setSaving(true)
    const itemData = {
      title: formData.title,
      description: formData.description || undefined,
      category: formData.category,
      imageUrl: formData.imageUrl,
      location: formData.location || undefined,
      isFeatured: formData.isFeatured,
      isActive: formData.isActive,
      order: formData.order,
    }

    try {
      if (isEditing && selectedItem) {
        await updateGalleryItem(selectedItem.id, itemData)
        toast.success('Gallery item updated successfully')
      } else {
        await createGalleryItem(itemData)
        toast.success('Gallery item created successfully')
      }
      setIsModalOpen(false)
      fetchItems()
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} gallery item`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!selectedItem) return
    setDeleting(true)
    try {
      await deleteGalleryItem(selectedItem.id)
      toast.success('Gallery item deleted successfully')
      setIsDeleteModalOpen(false)
      fetchItems()
    } catch (error) {
      toast.error('Failed to delete gallery item')
    } finally {
      setDeleting(false)
    }
  }

  async function handleToggleFeatured(item: GalleryItem) {
    try {
      await updateGalleryItem(item.id, { isFeatured: !item.isFeatured })
      toast.success(`Item ${!item.isFeatured ? 'featured' : 'unfeatured'}`)
      fetchItems()
    } catch (error) {
      toast.error('Failed to update item')
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Image',
      render: (value: string, row: GalleryItem) => (
        <div className="flex items-center gap-3">
          <img
            src={row.imageUrl}
            alt=""
            className="h-14 w-14 rounded-lg object-cover"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            {row.location && (
              <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {row.location}
              </p>
            )}
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
      key: 'isFeatured',
      label: 'Featured',
      render: (value: boolean) => (
        <button onClick={() => {
          const item = items.find(i => i.isFeatured === value)
          if (item) handleToggleFeatured(item)
        }}>
          <Star className={`h-5 w-5 ${value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-slate-600'}`} />
        </button>
      ),
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
      key: 'order',
      label: 'Order',
      render: (value: number) => <span className="text-sm text-gray-700 dark:text-slate-300">{value}</span>,
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
      label: 'Actions',
      render: (_: any, row: GalleryItem) => (
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
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 text-gray-900 dark:text-white">
      {/* Topbar */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-700 px-4 md:px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
          <span>Admin</span>
          <span className="text-gray-400 dark:text-slate-500">/</span>
          <span className="text-gray-900 dark:text-white font-medium">Gallery</span>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Gallery</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage gallery items and portfolio</p>
          </div>
          <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
            <Plus className="h-4 w-4" />
            New Gallery Item
          </Button>
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
              data={items}
              loading={loading}
            />
          </div>
        </motion.div>
      </div>

      {/* Form Modal */}
      <GalleryFormModal
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
        onSave={handleSubmit}
      />

      {/* Delete Modal */}
      <GalleryDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        item={selectedItem}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </div>
  )
}
