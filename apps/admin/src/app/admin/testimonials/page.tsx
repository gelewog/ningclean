'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Edit, Trash2, Star, Calendar, Quote, X,
  AlertCircle, MessageSquare, User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ImageUpload, useImageUpload } from '@/components/ui/ImageUpload'
import { DataTable } from '@/components/admin/DataTable'
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/api'
import { Testimonial } from '@/types'
import { Breadcrumb } from '@/components/admin/Breadcrumb'
import { formatDate, getDiceBearAvatar } from '@/lib/utils'
import { toast } from 'sonner'

interface TestimonialFormData {
  name: string
  role: string
  company: string
  content: string
  rating: number
  image: string
  isActive: boolean
  isFeatured: boolean
  order: number
  areaSlug: string
}

// Modern Modal Component for Testimonial Form
function TestimonialFormModal({
  isOpen,
  onClose,
  isEditing,
  formData,
  setFormData,
  errors,
  setErrors,
  saving,
  onSave,
  selectedImageFile,
  setSelectedImageFile,
}: {
  isOpen: boolean
  onClose: () => void
  isEditing: boolean
  formData: TestimonialFormData
  setFormData: (data: TestimonialFormData) => void
  errors: Partial<TestimonialFormData>
  setErrors: (errors: Partial<TestimonialFormData>) => void
  saving: boolean
  onSave: () => void
  selectedImageFile: File | null
  setSelectedImageFile: (file: File | null) => void
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
          className="pointer-events-auto w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-900/20 dark:to-transparent flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit Testimonial' : 'Create Testimonial'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {isEditing ? 'Perbarui testimonial' : 'Buat testimonial baru'}
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
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      setErrors({ ...errors, name: undefined })
                    }}
                    placeholder="Enter customer name"
                    className={`pl-10 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                </div>
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-7 w-7 ${star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-slate-600'}`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500 dark:text-slate-400">{formData.rating} / 5</span>
                </div>
                {errors.rating && <p className="text-sm text-red-500">{errors.rating}</p>}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Testimonial Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => {
                    setFormData({ ...formData, content: e.target.value })
                    setErrors({ ...errors, content: undefined })
                  }}
                  placeholder="Write the testimonial content here..."
                  rows={4}
                  className={`w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500 ${errors.content ? 'border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400'}`}
                />
                {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
              </div>

              {/* Image Upload */}
              <ImageUpload
                label="Customer Image"
                folder="testimonials"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                onFileSelect={(file) => setSelectedImageFile(file)}
                autoUpload={false}
                previewClassName="h-32 w-32 mx-auto"
              />

              {/* Role & Company Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Role
                  </label>
                  <Input
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Manager, Ibu RT"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Company
                  </label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g., PT Maju Jaya"
                  />
                </div>
              </div>

              {/* Area Slug */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Area (City)
                </label>
                <select
                  value={formData.areaSlug}
                  onChange={(e) => setFormData({ ...formData, areaSlug: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">Semua Area</option>
                  <option value="surabaya">Surabaya</option>
                  <option value="sidoarjo">Sidoarjo</option>
                  <option value="gresik">Gresik</option>
                </select>
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  Kosongkan untuk menampilkan di semua area
                </p>
              </div>

              {/* Order */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Display Order
                </label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  Angka lebih kecil ditampilkan lebih dulu
                </p>
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
                    <p className="text-xs text-gray-500 dark:text-slate-400">Tampilkan testimonial publik</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Featured</span>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Tampilkan di homepage</p>
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
                  {isEditing ? 'Simpan Perubahan' : 'Buat Testimonial'}
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
function TestimonialDeleteModal({
  isOpen,
  onClose,
  testimonial,
  onConfirm,
  deleting,
}: {
  isOpen: boolean
  onClose: () => void
  testimonial: Testimonial | null
  onConfirm: () => void
  deleting: boolean
}) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isOpen || !testimonial) return null

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
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hapus Testimonial</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                {testimonial.image ? (
                  <img src={testimonial.image} alt="" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <img
                    src={getDiceBearAvatar(testimonial.name, 'adventurer')}
                    alt=""
                    className="h-12 w-12 rounded-full bg-gray-100 dark:bg-slate-700"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{testimonial.name}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${star <= testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-slate-600'}`}
                      />
                    ))}
                  </div>
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

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = React.useState<Testimonial | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<TestimonialFormData>({
    name: '',
    content: '',
    rating: 5,
    image: '',
    role: '',
    company: '',
    isActive: true,
    isFeatured: false,
    order: 0,
    areaSlug: '',
  })
  const [errors, setErrors] = React.useState<Partial<TestimonialFormData>>({})
  const [saving, setSaving] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [selectedImageFile, setSelectedImageFile] = React.useState<File | null>(null)
  const { uploadImage } = useImageUpload()

  React.useEffect(() => {
    fetchTestimonials()
  }, [])

  async function fetchTestimonials() {
    setLoading(true)
    try {
      const data = await getTestimonials()
      setTestimonials(data)
    } catch (error) {
      toast.error('Failed to fetch testimonials')
    } finally {
      setLoading(false)
    }
  }

  function openCreateModal() {
    setIsEditing(false)
    setSelectedTestimonial(null)
    setFormData({
      name: '',
      content: '',
      rating: 5,
      image: '',
      role: '',
      company: '',
      isActive: true,
      isFeatured: false,
      order: 0,
      areaSlug: '',
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openEditModal(testimonial: Testimonial) {
    setIsEditing(true)
    setSelectedTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      content: testimonial.content,
      rating: testimonial.rating,
      image: testimonial.image || '',
      role: testimonial.role || '',
      company: testimonial.company || '',
      isActive: testimonial.isActive,
      isFeatured: testimonial.isFeatured,
      order: testimonial.order,
      areaSlug: testimonial.areaSlug || '',
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openDeleteModal(testimonial: Testimonial) {
    setSelectedTestimonial(testimonial)
    setIsDeleteModalOpen(true)
  }

  function validateForm(): boolean {
    const newErrors: Partial<TestimonialFormData> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.content.trim()) newErrors.content = 'Content is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validateForm()) return

    setSaving(true)
    
    // Upload image if there's a new file selected
    let imageUrl = formData.image
    if (selectedImageFile) {
      const uploadedUrl = await uploadImage(selectedImageFile, 'testimonials')
      if (uploadedUrl) {
        imageUrl = uploadedUrl
      } else {
        toast.error('Failed to upload image')
        setSaving(false)
        return
      }
    }
    
    const testimonialData = {
      name: formData.name,
      content: formData.content,
      rating: formData.rating,
      image: imageUrl || undefined,
      role: formData.role || undefined,
      company: formData.company || undefined,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
      order: formData.order,
      areaSlug: formData.areaSlug || undefined,
    }

    try {
      if (isEditing && selectedTestimonial) {
        await updateTestimonial(selectedTestimonial.id, testimonialData)
        toast.success('Testimonial updated successfully')
      } else {
        await createTestimonial(testimonialData)
        toast.success('Testimonial created successfully')
      }
      setSelectedImageFile(null)
      setIsModalOpen(false)
      fetchTestimonials()
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} testimonial`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!selectedTestimonial) return
    setDeleting(true)
    try {
      await deleteTestimonial(selectedTestimonial.id)
      toast.success('Testimonial deleted successfully')
      setIsDeleteModalOpen(false)
      fetchTestimonials()
    } catch (error) {
      toast.error('Failed to delete testimonial')
    } finally {
      setDeleting(false)
    }
  }

  const filteredTestimonials = React.useMemo(() => {
    if (!search) return testimonials
    const term = search.toLowerCase()
    return testimonials.filter(t => 
      t.name.toLowerCase().includes(term) || 
      t.content.toLowerCase().includes(term)
    )
  }, [testimonials, search])

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      render: (value: string, row: Testimonial) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img
              src={row.image}
              alt=""
              className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-slate-700"
            />
          ) : (
            <img
              src={getDiceBearAvatar(row.name, 'adventurer')}
              alt=""
              className="h-10 w-10 rounded-full bg-gray-100 dark:bg-slate-700"
            />
          )}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
            {row.role && <p className="text-xs text-gray-500 dark:text-slate-400">{row.role}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'company',
      label: 'Company',
      render: (value: string) => (
        <span className="text-sm text-gray-600 dark:text-slate-400">{value || '—'}</span>
      ),
    },
    {
      key: 'areaSlug',
      label: 'Area',
      render: (value: string) => (
        <Badge variant={value ? 'info' : 'outline'}>
          {value || 'All'}
        </Badge>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (value: number) => (
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-slate-600'}`}
            />
          ))}
        </div>
      ),
    },
    {
      key: 'isFeatured',
      label: 'Featured',
      render: (value: boolean) => (
        <Badge variant={value ? 'warning' : 'default'}>
          {value ? '★ Featured' : '—'}
        </Badge>
      ),
    },
    {
      key: 'order',
      label: 'Order',
      render: (value: number) => (
        <span className="text-sm text-gray-500 dark:text-slate-400">{value}</span>
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
      render: (_: any, row: Testimonial) => (
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
      <Breadcrumb items={[{ label: 'Testimonials' }]} />

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Testimonials</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage customer testimonials and reviews</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <span className="text-sm text-gray-500 dark:text-slate-400">Total: </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{testimonials.length}</span>
            </div>
            <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <Plus className="h-4 w-4" />
              New Testimonial
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
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              placeholder="Search testimonials..."
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
              data={filteredTestimonials}
              loading={loading}
              emptyState={
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 rounded-full bg-gray-100 dark:bg-slate-800 p-4">
                    <MessageSquare className="h-8 w-8 text-gray-400 dark:text-slate-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {search ? 'No testimonials found' : 'No testimonials yet'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    {search ? 'Try different keywords' : 'Click the button above to add your first testimonial'}
                  </p>
                </div>
              }
            />
          </div>
        </motion.div>
      </div>

      {/* Form Modal */}
      <TestimonialFormModal
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
        selectedImageFile={selectedImageFile}
        setSelectedImageFile={setSelectedImageFile}
      />

      {/* Delete Modal */}
      <TestimonialDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        testimonial={selectedTestimonial}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </div>
  )
}
