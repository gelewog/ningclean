'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Edit, Trash2, Star, Image as ImageIcon, Calendar, MapPin, X,
  AlertCircle, Folder, ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/admin/DataTable'
import { ImageUpload, useImageUpload } from '@/components/ui/ImageUpload'
import { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '@/lib/api'
import { GalleryItem } from '@/types'
import { Breadcrumb } from '@/components/admin/Breadcrumb'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface GalleryFormData {
  title: string
  description: string
  category: string
  imageUrl: string
  beforeImage: string
  afterImage: string
  location: string
  isFeatured: boolean
  isActive: boolean
  order: number
}

const categories = ['Residential', 'Commercial', 'Deep Cleaning', 'Post Construction', 'Move In/Out', 'Regular']

// Before/After Slider Preview Component
function BeforeAfterPreview({ beforeImage, afterImage }: { beforeImage: string; afterImage: string }) {
  const [sliderPosition, setSliderPosition] = React.useState(50)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    handleMove(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX)
  }

  const handleMouseUp = () => {}

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-col-resize select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Before Image (full width, fixed) - NO FILTER */}
      <div className="absolute inset-0 z-0">
        <img
          src={beforeImage}
          alt="Before"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* After Image (uses clip-path to reveal right portion) */}
      <div className="absolute inset-0 z-10">
        <img
          src={afterImage}
          alt="After"
          className="w-full h-full object-cover"
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/80 cursor-col-resize z-20"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-white shadow-lg flex items-center justify-center">
          <div className="flex items-center gap-0.5">
            <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-[10px] font-medium text-white/80">
        Before
      </div>
      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-emerald-500/80 backdrop-blur-sm text-[10px] font-medium text-white">
        After
      </div>
    </div>
  )
}

// Modern Modal Component for Gallery Form - Redesigned
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
  selectedImageFile,
  setSelectedImageFile,
  selectedBeforeFile,
  setSelectedBeforeFile,
  selectedAfterFile,
  setSelectedAfterFile,
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
  selectedImageFile: File | null
  setSelectedImageFile: (file: File | null) => void
  selectedBeforeFile: File | null
  setSelectedBeforeFile: (file: File | null) => void
  selectedAfterFile: File | null
  setSelectedAfterFile: (file: File | null) => void
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
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-black/70 via-black/60 to-black/80 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-6 pointer-events-none">
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="pointer-events-auto w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700/50 overflow-hidden">
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent px-6 py-5 border-b border-gray-100 dark:border-slate-700/50">
              <div className="flex items-center gap-4">
                {/* Animated Icon Container */}
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-xl animate-pulse" />
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Folder className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {isEditing ? 'Edit Gallery Item' : 'Create Gallery Item'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                    {isEditing ? 'Perbarui informasi gallery item' : 'Buat gallery item baru'}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-md"
                type="button"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-slate-400" />
              </button>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="p-6 space-y-5">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({ ...formData, title: e.target.value })
                        setErrors({ ...errors, title: '' })
                      }}
                      placeholder="Enter gallery item title"
                      className={`h-11 px-4 ${errors.title ? 'border-red-500 focus:border-red-500 ring-2 ring-red-500/20' : 'border-gray-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'}`}
                    />
                  </div>
                  {errors.title && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Before & After Image Upload - Side by Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Before Image Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                      Before Image <span className="text-red-500">*</span>
                    </label>
                    <div className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all ${
                      errors.beforeImage
                        ? 'border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-900/10'
                        : 'border-gray-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500'
                    }`}>
                      {formData.beforeImage ? (
                        <div className="relative aspect-[4/3]">
                          <img
                            src={formData.beforeImage.startsWith('http') || formData.beforeImage.startsWith('blob:')
                              ? formData.beforeImage
                              : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}${formData.beforeImage}`
                            }
                            alt="Before"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-[10px] font-medium text-white uppercase tracking-wide">
                            Before
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, beforeImage: '' })
                              setSelectedBeforeFile(null)
                            }}
                            className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-500/80 backdrop-blur-sm hover:bg-red-500 flex items-center justify-center text-white transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center aspect-[4/3] cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const previewUrl = URL.createObjectURL(file)
                                setFormData({ ...formData, beforeImage: previewUrl })
                                setSelectedBeforeFile(file)
                              }
                            }}
                          />
                          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-slate-400">Click to upload</p>
                        </label>
                      )}
                    </div>
                    {errors.beforeImage && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.beforeImage}
                      </p>
                    )}
                  </div>

                  {/* After Image Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                      After Image <span className="text-red-500">*</span>
                    </label>
                    <div className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all ${
                      errors.afterImage
                        ? 'border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-900/10'
                        : 'border-gray-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500'
                    }`}>
                      {formData.afterImage ? (
                        <div className="relative aspect-[4/3]">
                          <img
                            src={formData.afterImage.startsWith('http') || formData.afterImage.startsWith('blob:')
                              ? formData.afterImage
                              : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}${formData.afterImage}`
                            }
                            alt="After"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-emerald-500/80 backdrop-blur-sm text-[10px] font-medium text-white uppercase tracking-wide">
                            After
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, afterImage: '' })
                              setSelectedAfterFile(null)
                            }}
                            className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-500/80 backdrop-blur-sm hover:bg-red-500 flex items-center justify-center text-white transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center aspect-[4/3] cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const previewUrl = URL.createObjectURL(file)
                                setFormData({ ...formData, afterImage: previewUrl })
                                setSelectedAfterFile(file)
                              }
                            }}
                          />
                          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-slate-400">Click to upload</p>
                        </label>
                      )}
                    </div>
                    {errors.afterImage && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.afterImage}
                      </p>
                    )}
                  </div>
                </div>

                {/* Before/After Slider Preview */}
                {(formData.beforeImage || formData.afterImage) && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                      Before/After Preview
                    </label>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800">
                      {formData.beforeImage && formData.afterImage ? (
                        <BeforeAfterPreview
                          beforeImage={formData.beforeImage.startsWith('http') || formData.beforeImage.startsWith('blob:')
                            ? formData.beforeImage
                            : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}${formData.beforeImage}`
                          }
                          afterImage={formData.afterImage.startsWith('http') || formData.afterImage.startsWith('blob:')
                            ? formData.afterImage
                            : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}${formData.afterImage}`
                          }
                        />
                      ) : formData.beforeImage ? (
                        <div className="relative w-full h-full">
                          <img
                            src={formData.beforeImage.startsWith('http') || formData.beforeImage.startsWith('blob:')
                              ? formData.beforeImage
                              : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}${formData.beforeImage}`
                            }
                            alt="Before"
                            className="w-full h-full object-cover grayscale sepia-[0.3]"
                          />
                          <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-[10px] font-medium text-white uppercase tracking-wide">
                            Before Only
                          </div>
                        </div>
                      ) : formData.afterImage ? (
                        <div className="relative w-full h-full">
                          <img
                            src={formData.afterImage.startsWith('http') || formData.afterImage.startsWith('blob:')
                              ? formData.afterImage
                              : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}${formData.afterImage}`
                            }
                            alt="After"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-emerald-500/80 backdrop-blur-sm text-[10px] font-medium text-white uppercase tracking-wide">
                            After Only
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Category & Order */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          setFormData({ ...formData, category: e.target.value })
                          setErrors({ ...errors, category: '' })
                        }}
                        className={`w-full h-11 rounded-xl border px-4 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                          errors.category
                            ? 'border-red-500 ring-2 ring-red-500/20'
                            : 'border-gray-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500'
                        }`}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.category && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.category}
                      </p>
                    )}
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
                      className="h-11 border-gray-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Surabaya, East Java"
                      className="h-11 pl-11 border-gray-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 text-sm text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Toggles */}
                <div className="flex flex-col gap-3 p-5 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className={`relative w-11 h-6 rounded-full transition-colors ${formData.isFeatured ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform ${formData.isFeatured ? 'translate-x-6' : 'translate-x-1'}`} />
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="sr-only"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Featured Item</span>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Tampilkan di halaman utama</p>
                    </div>
                    {formData.isFeatured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </label>
                  <div className="h-px bg-gray-200 dark:bg-slate-700/50" />
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className={`relative w-11 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="sr-only"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Active</span>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Item akan ditampilkan publik</p>
                    </div>
                    {formData.isActive && (
                      <div className="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                        <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Visible</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-700/50 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                onClick={onSave}
                disabled={saving}
                className="group relative px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                {/* Loading spinner */}
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4" />
                    <span>{isEditing ? 'Simpan Perubahan' : 'Buat Item'}</span>
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

// Delete Confirmation Modal - Modern & Professional Design
function GalleryDeleteModal({
  isOpen,
  onClose,
  item,
  onConfirm,
  deleting,
  getImageUrl,
}: {
  isOpen: boolean
  onClose: () => void
  item: GalleryItem | null
  onConfirm: () => void
  deleting: boolean
  getImageUrl: (url: string | undefined | null) => string
}) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isOpen || !item) return null

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-black/70 via-black/60 to-black/80 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="pointer-events-auto w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700/50 overflow-hidden">
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent px-6 py-5 border-b border-gray-100 dark:border-slate-700/50">
              <div className="flex items-center gap-4">
                {/* Animated Icon Container */}
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl animate-pulse" />
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                    <Trash2 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hapus Gallery Item</h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-md"
                type="button"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              {/* Item Preview Card */}
              <div className="relative p-4 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 rounded-2xl border border-gray-200 dark:border-slate-700/50 overflow-hidden">
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/10 to-transparent rounded-bl-full" />

                <div className="relative flex items-center gap-4">
                  {/* Image Thumbnail with glow effect */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-red-500/20 rounded-xl blur-md" />
                    <div className="relative rounded-xl overflow-hidden border-2 border-white dark:border-slate-600 shadow-lg">
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.title}
                        className="w-20 h-20 object-cover"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">{item.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{item.category}</p>
                    {item.location && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-400 dark:text-slate-500">{item.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Warning Badge */}
                <div className="absolute bottom-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Danger Zone
                  </span>
                </div>
              </div>

              {/* Confirmation Text */}
              <div className="mt-5 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Apakah Anda yakin ingin menghapus item ini? Semua data terkait akan dihapus secara permanen dan tidak dapat dipulihkan.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-700/50 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                disabled={deleting}
                className="group relative px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30 hover:shadow-red-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                {/* Loading spinner */}
                {deleting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

export default function GalleryPage() {
  // Helper to get full image URL
  const getImageUrl = (url: string | undefined | null): string => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    return `${API_BASE.replace('/api', '')}${url}`;
  };

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
    beforeImage: '',
    afterImage: '',
    location: '',
    isFeatured: false,
    isActive: true,
    order: 0,
  })
  const [errors, setErrors] = React.useState<Partial<GalleryFormData>>({})
  const [saving, setSaving] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const [selectedImageFile, setSelectedImageFile] = React.useState<File | null>(null)
  const [selectedBeforeFile, setSelectedBeforeFile] = React.useState<File | null>(null)
  const [selectedAfterFile, setSelectedAfterFile] = React.useState<File | null>(null)
  const { uploadImage } = useImageUpload()

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
      beforeImage: '',
      afterImage: '',
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
      imageUrl: item.imageUrl || '',
      beforeImage: (item as any).beforeImage || '',
      afterImage: (item as any).afterImage || '',
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
    // Both before and after images are required
    if (!formData.beforeImage.trim()) newErrors.beforeImage = 'Before image is required'
    if (!formData.afterImage.trim()) newErrors.afterImage = 'After image is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validateForm()) return

    setSaving(true)
    console.log('[Gallery] handleSubmit started')
    console.log('[Gallery] selectedImageFile:', selectedImageFile)
    console.log('[Gallery] selectedBeforeFile:', selectedBeforeFile)
    console.log('[Gallery] selectedAfterFile:', selectedAfterFile)
    console.log('[Gallery] formData.imageUrl:', formData.imageUrl)
    console.log('[Gallery] formData.beforeImage:', formData.beforeImage)
    console.log('[Gallery] formData.afterImage:', formData.afterImage)

    // Upload images if there are new files selected
    let imageUrl = formData.imageUrl
    let beforeImage = formData.beforeImage
    let afterImage = formData.afterImage

    if (selectedImageFile) {
      console.log('[Gallery] Uploading imageFile...')
      const uploadedUrl = await uploadImage(selectedImageFile, 'gallery')
      console.log('[Gallery] imageFile upload result:', uploadedUrl)
      if (uploadedUrl) {
        imageUrl = uploadedUrl
      } else {
        toast.error('Failed to upload image')
        setSaving(false)
        return
      }
    } else {
      console.log('[Gallery] No imageFile selected')
    }

    if (selectedBeforeFile) {
      console.log('[Gallery] Uploading beforeFile...')
      const uploadedUrl = await uploadImage(selectedBeforeFile, 'gallery', 'before-after')
      console.log('[Gallery] beforeFile upload result:', uploadedUrl)
      if (uploadedUrl) {
        beforeImage = uploadedUrl
      } else {
        toast.error('Failed to upload before image')
        setSaving(false)
        return
      }
    } else {
      console.log('[Gallery] No beforeFile selected')
    }

    if (selectedAfterFile) {
      console.log('[Gallery] Uploading afterFile...')
      const uploadedUrl = await uploadImage(selectedAfterFile, 'gallery', 'before-after')
      console.log('[Gallery] afterFile upload result:', uploadedUrl)
      if (uploadedUrl) {
        afterImage = uploadedUrl
      } else {
        toast.error('Failed to upload after image')
        setSaving(false)
        return
      }
    } else {
      console.log('[Gallery] No afterFile selected')
    }

    const itemData = {
      title: formData.title,
      description: formData.description || undefined,
      category: formData.category,
      // Always ensure imageUrl is set - use beforeImage or afterImage as fallback
      imageUrl: imageUrl || beforeImage || afterImage || '',
      beforeImage: beforeImage || undefined,
      afterImage: afterImage || undefined,
      location: formData.location || undefined,
      isFeatured: formData.isFeatured,
      isActive: formData.isActive,
      order: formData.order,
    }

    // Final validation - imageUrl must be valid
    if (!itemData.imageUrl) {
      toast.error('At least one image is required')
      setSaving(false)
      return
    }

    console.log('[Gallery] Submitting itemData:', itemData)

    try {
      if (isEditing && selectedItem) {
        await updateGalleryItem(selectedItem.id, itemData)
        toast.success('Gallery item updated successfully')
      } else {
        const result = await createGalleryItem(itemData)
        console.log('[Gallery] Create result:', result)
        toast.success('Gallery item created successfully')
      }
      setSelectedImageFile(null)
      setSelectedBeforeFile(null)
      setSelectedAfterFile(null)
      setIsModalOpen(false)
      fetchItems()
    } catch (error: any) {
      console.error('[Gallery] Error:', error)
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} gallery item: ${error?.message || error}`)
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
            src={getImageUrl((row as any).afterImage || row.imageUrl)}
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
      <Breadcrumb items={[{ label: 'Gallery' }]} />

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
        selectedImageFile={selectedImageFile}
        setSelectedImageFile={setSelectedImageFile}
        selectedBeforeFile={selectedBeforeFile}
        setSelectedBeforeFile={setSelectedBeforeFile}
        selectedAfterFile={selectedAfterFile}
        setSelectedAfterFile={setSelectedAfterFile}
      />

      {/* Delete Modal */}
      <GalleryDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        item={selectedItem}
        onConfirm={handleDelete}
        deleting={deleting}
        getImageUrl={getImageUrl}
      />
    </div>
  )
}
