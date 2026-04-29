'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Edit, Trash2, Star, Calendar, Quote, X,
  AlertCircle, MessageSquare, User, MapPin, Building2, Eye, EyeOff, ArrowUpDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ImageUpload, useImageUpload } from '@/components/ui/ImageUpload'
import { DataTable } from '@/components/admin/DataTable'
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from '@/lib/use-queries'
import { Testimonial } from '@/types'
import { Breadcrumb } from '@/components/admin/Breadcrumb'
import { formatDate, getDiceBearAvatar, cn } from '@/lib/utils'
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
          className="pointer-events-auto w-full max-w-lg bg-white dark:bg-slate-900 sm:rounded-2xl shadow-2xl border-0 sm:border border-gray-200 dark:border-slate-600 overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-900/20 dark:to-transparent flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit Testimoni' : 'Tambah Testimoni'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {isEditing ? 'Perbarui data testimoni' : 'Buat testimoni baru'}
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
            <div className="p-4 sm:p-6 space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Nama Pelanggan <span className="text-red-500">*</span>
                </label>
                <Input
                  icon={<User className="h-4 w-4 text-gray-400" />}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    setErrors({ ...errors, name: undefined })
                  }}
                  placeholder="Masukkan nama pelanggan"
                  className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Penilaian <span className="text-red-500">*</span>
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
                  Isi Testimoni <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => {
                    setFormData({ ...formData, content: e.target.value })
                    setErrors({ ...errors, content: undefined })
                  }}
                  placeholder="Tulis isi testimoni di sini..."
                  rows={4}
                  className={`w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500 ${errors.content ? 'border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400'}`}
                />
                {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
              </div>

              {/* Image Upload */}
              <ImageUpload
                label="Foto Pelanggan"
                folder="testimonials"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                onFileSelect={(file) => setSelectedImageFile(file)}
                autoUpload={false}
                previewClassName="h-32 w-32 mx-auto"
              />

              {/* Role & Company Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Jabatan
                  </label>
                  <Input
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Contoh: Manajer, Ibu Rumah Tangga"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Perusahaan
                  </label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Contoh: PT Maju Jaya"
                  />
                </div>
              </div>

              {/* Area Slug */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Area (Kota)
                </label>
                <select
                  value={formData.areaSlug}
                  onChange={(e) => setFormData({ ...formData, areaSlug: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
                  Urutan Tampilan
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
              <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Aktif</span>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Tampilkan testimoni publik</p>
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
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Unggulan</span>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Tampilkan di beranda</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 flex-shrink-0">
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
                  {isEditing ? 'Simpan Perubahan' : 'Tambah Testimoni'}
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
          className="pointer-events-auto w-full h-full sm:h-auto sm:max-w-md bg-white dark:bg-slate-900 sm:rounded-2xl shadow-2xl border-0 sm:border border-gray-200 dark:border-slate-600 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hapus Testimoni</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
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

// Modern Mobile Card Component
function TestimonialMobileCard({ 
  testimonial, 
  onEdit, 
  onDelete 
}: { 
  testimonial: Testimonial
  onEdit: (t: Testimonial) => void
  onDelete: (t: Testimonial) => void
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
      {/* Header with Avatar and Status */}
      <div className="p-4 flex items-start gap-3 border-b border-gray-100 dark:border-slate-700/50">
        {testimonial.image ? (
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-emerald-100 dark:ring-emerald-900/30 flex-shrink-0"
          />
        ) : (
          <img
            src={getDiceBearAvatar(testimonial.name, 'adventurer')}
            alt={testimonial.name}
            className="h-14 w-14 rounded-full bg-emerald-50 dark:bg-slate-700 ring-2 ring-emerald-100 dark:ring-emerald-900/30 flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {testimonial.name}
            </h3>
            <div className="flex gap-1">
              {testimonial.isFeatured && (
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3.5 w-3.5 ${star <= testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-slate-600'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400 dark:text-slate-500">
              ({testimonial.rating})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Badge variant={testimonial.isActive ? 'success' : 'default'} className="text-xs">
              {testimonial.isActive ? 'Aktif' : 'Nonaktif'}
            </Badge>
            {testimonial.isFeatured && (
              <Badge variant="warning" className="text-xs">
                Unggulan
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="relative">
          <Quote className="absolute top-0 left-0 h-5 w-5 text-emerald-200 dark:text-emerald-800/50 -translate-x-1 -translate-y-1" />
          <p className="text-sm text-gray-600 dark:text-slate-300 pl-3 line-clamp-3">
            {testimonial.content}
          </p>
        </div>
        
        {/* Role & Company */}
        <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-slate-700/50">
          {testimonial.role && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
              <User className="h-3.5 w-3.5" />
              <span>{testimonial.role}</span>
            </div>
          )}
          {testimonial.company && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
              <Building2 className="h-3.5 w-3.5" />
              <span className="truncate max-w-[120px]">{testimonial.company}</span>
            </div>
          )}
        </div>

        {/* Area & Date */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500">
            <MapPin className="h-3 w-3" />
            <span>{testimonial.areaSlug || 'Semua Area'}</span>
          </div>
          <span className="text-xs text-gray-400 dark:text-slate-500">
            {formatDate(testimonial.createdAt)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 px-4 py-3 bg-gray-50/50 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-700/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(testimonial)}
          className="h-8 px-3 text-sm text-gray-600 dark:text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        >
          <Edit className="h-3.5 w-3.5 mr-1.5" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(testimonial)}
          className="h-8 px-3 text-sm text-gray-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
          Hapus
        </Button>
      </div>
    </div>
  )
}

// Mobile Skeleton Card
function TestimonialMobileSkeleton({ index }: { index: number }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-600 overflow-hidden animate-pulse">
      <div className="p-4 flex items-start gap-3 border-b border-gray-100 dark:border-slate-700/50">
        <div className="h-14 w-14 rounded-full bg-gray-200 dark:bg-slate-700 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-4 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="h-3 w-20 bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="flex gap-1.5">
            <div className="h-5 w-12 bg-gray-200 dark:bg-slate-700 rounded-full" />
            <div className="h-5 w-16 bg-gray-200 dark:bg-slate-700 rounded-full" />
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="h-3 w-5/6 bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="h-3 w-4/6 bg-gray-200 dark:bg-slate-700 rounded" />
        </div>
        <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-slate-700/50">
          <div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="h-3 w-20 bg-gray-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100 dark:border-slate-700/50">
        <div className="h-8 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-8 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
  )
}

export default function TestimonialsPage() {
  const { data: testimonials = [], isLoading: loading } = useTestimonials()
  const createMutation = useCreateTestimonial()
  const updateMutation = useUpdateTestimonial()
  const deleteMutation = useDeleteTestimonial()
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
  const [search, setSearch] = React.useState('')
  const [selectedImageFile, setSelectedImageFile] = React.useState<File | null>(null)
  const { uploadImage } = useImageUpload()

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
    if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi'
    if (!formData.content.trim()) newErrors.content = 'Isi testimoni wajib diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validateForm()) return

    // Upload image if there's a new file selected
    let imageUrl = formData.image
    if (selectedImageFile) {
      const uploadedUrl = await uploadImage(selectedImageFile, 'testimonials')
      if (uploadedUrl) {
        imageUrl = uploadedUrl
      } else {
        toast.error('Gagal mengunggah gambar')
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
        await updateMutation.mutateAsync({ id: selectedTestimonial.id, data: testimonialData })
      } else {
        await createMutation.mutateAsync(testimonialData)
      }
      setSelectedImageFile(null)
      setIsModalOpen(false)
      toast.success(isEditing ? 'Testimoni berhasil diperbarui' : 'Testimoni berhasil ditambahkan')
    } catch (error) {
      toast.error(`Gagal ${isEditing ? 'memperbarui' : 'menambah'} testimoni`)
    }
  }

  async function handleDelete() {
    if (!selectedTestimonial) return
    try {
      await deleteMutation.mutateAsync(selectedTestimonial.id)
      setIsDeleteModalOpen(false)
      toast.success('Testimoni berhasil dihapus')
    } catch (error) {
      toast.error('Gagal menghapus testimoni')
    }
  }

  const filteredTestimonials = React.useMemo(() => {
    if (!search) return testimonials
    const term = search.toLowerCase()
    return testimonials.filter(t => 
      t.name.toLowerCase().includes(term) || 
      t.content.toLowerCase().includes(term) ||
      (t.company && t.company.toLowerCase().includes(term))
    )
  }, [testimonials, search])

  const columns = [
    {
      key: 'name',
      label: 'Pelanggan',
      render: (value: string, row: Testimonial) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img
              src={row.image}
              alt=""
              className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-100 dark:ring-emerald-900/30"
            />
          ) : (
            <img
              src={getDiceBearAvatar(row.name, 'adventurer')}
              alt=""
              className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-slate-700 ring-2 ring-emerald-100 dark:ring-emerald-900/30"
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
      label: 'Perusahaan',
      render: (value: string) => (
        <span className="text-sm text-gray-600 dark:text-slate-400">{value || '—'}</span>
      ),
    },
    {
      key: 'areaSlug',
      label: 'Area',
      render: (value: string) => (
        <Badge variant={value ? 'info' : 'outline'}>
          {value || 'Semua'}
        </Badge>
      ),
    },
    {
      key: 'rating',
      label: 'Penilaian',
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
      label: 'Status',
      render: (value: boolean, row: Testimonial) => (
        <div className="flex flex-wrap gap-1">
          {value && (
            <Badge variant="warning" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              Unggulan
            </Badge>
          )}
          {row.isActive ? (
            <Badge variant="success" className="text-xs">Aktif</Badge>
          ) : (
            <Badge variant="default" className="text-xs">Nonaktif</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'order',
      label: 'Urutan',
      render: (value: number) => (
        <span className="text-sm text-gray-500 dark:text-slate-400">{value}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Dibuat',
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

  // Custom renderCard untuk mobile
  const renderCard = (row: Testimonial) => (
    <TestimonialMobileCard
      testimonial={row}
      onEdit={openEditModal}
      onDelete={openDeleteModal}
    />
  )

  // Custom skeletonCard untuk mobile
  const skeletonCard = (i: number) => (
    <TestimonialMobileSkeleton key={i} index={i} />
  )

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Testimoni' }]} />

      <div className="w-full px-3 sm:px-6 py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-start justify-between gap-4"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Testimoni</h1>
              <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700 h-8 text-xs px-3 flex-shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1 truncate">Kelola testimoni dan ulasan pelanggan</p>
          </div>
          <div className="flex-shrink-0">
            <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-slate-600">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Total: </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{testimonials.length}</span>
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
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500 z-10 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              placeholder="Cari testimoni..."
              className="pl-10 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 relative z-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Table / Mobile Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="sm:bg-white sm:dark:bg-slate-900 sm:shadow-sm sm:border sm:border-gray-200 dark:sm:border-slate-700 sm:rounded-2xl overflow-hidden"
        >
          <DataTable
            columns={columns}
            data={filteredTestimonials}
            loading={loading}
            renderCard={renderCard}
            skeletonCard={skeletonCard}
            emptyState={
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-gray-100 dark:bg-slate-800 p-4">
                  <MessageSquare className="h-8 w-8 text-gray-400 dark:text-slate-500" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {search ? 'Tidak ada testimoni ditemukan' : 'Belum ada testimoni'}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  {search ? 'Coba kata kunci lain' : 'Klik tombol Tambah untuk membuat testimoni pertama'}
                </p>
              </div>
            }
          />
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
        saving={createMutation.isPending || updateMutation.isPending}
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
        deleting={deleteMutation.isPending}
      />
    </div>
  )
}
