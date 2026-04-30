'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit, Trash2, Home, Building, Sparkles, HardHat, Sofa, Image as ImageIcon, Star,
  Briefcase, Clock, DollarSign, Tag, CheckCircle2, AlertCircle, X, ChevronRight, Package,
  List, Wand2, Save, Loader2, Trash
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ImageUpload, useImageUpload } from '@/components/ui/ImageUpload'
import { getServices, createService, updateService, deleteService } from '@/lib/api'
import { useServices, useCreateService, useUpdateService, useDeleteService } from '@/lib/use-queries'
import { formatCurrency } from '@/lib/utils'
import { Breadcrumb } from '@/components/admin/Breadcrumb'
import { toast } from 'sonner'
import * as Icons from 'lucide-react'

const SERVICE_ICONS = [
  { name: 'Home', component: Home },
  { name: 'Building', component: Building },
  { name: 'Sparkles', component: Sparkles },
  { name: 'HardHat', component: HardHat },
  { name: 'Sofa', component: Sofa },
  { name: 'Package', component: Package },
  { name: 'Wand2', component: Wand2 },
  { name: 'Star', component: Star },
]

const CATEGORY_OPTIONS = [
  { value: 'Deep Cleaning', label: 'Deep Cleaning', color: 'blue' },
  { value: 'Regular Cleaning', label: 'Regular Cleaning', color: 'green' },
  { value: 'Post Construction', label: 'Post Construction', color: 'orange' },
  { value: 'Sofa Cleaning', label: 'Sofa Cleaning', color: 'purple' },
  { value: 'Office Cleaning', label: 'Office Cleaning', color: 'cyan' },
]

interface ServiceFormData {
  name: string
  slug: string
  description: string
  price: string
  duration: string
  category: string
  icon: string
  image: string
  features: string
  isFeatured: boolean
  availableCities: string[]
}

// Modern Switch Component dengan Optimistic UI support
function Switch({ 
  checked, 
  onChange, 
  disabled = false,
  loading = false 
}: { 
  checked: boolean; 
  onChange: () => void; 
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled || loading}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
        checked ? 'bg-emerald-500 dark:bg-emerald-500' : 'bg-gray-300 dark:bg-slate-600'
      } ${disabled || loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
          loading ? 'bg-gray-200' : 'bg-white'
        } ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
      {/* Loading indicator */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-2 h-2 bg-white/50 rounded-full animate-pulse" />
        </span>
      )}
    </button>
  )
}

// Modern Service Modal Component
function ServiceModal({
  isOpen,
  onClose,
  isEditing,
  formData,
  setFormData,
  errors,
  onSubmit,
  loading,
  selectedImageFile,
  setSelectedImageFile,
}: {
  isOpen: boolean
  onClose: () => void
  isEditing: boolean
  formData: ServiceFormData
  setFormData: (data: ServiceFormData) => void
  errors: Partial<ServiceFormData>
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  selectedImageFile: File | null
  setSelectedImageFile: (file: File | null) => void
}) {
  const modalRef = React.useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = React.useState<'basic' | 'details' | 'features' | 'cities'>('basic')

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setActiveTab('basic')
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const getCategoryColor = (category: string) => {
    const cat = CATEGORY_OPTIONS.find(c => c.value === category)
    return cat?.color || 'gray'
  }

  // Predefined color mappings for Tailwind (avoid dynamic template strings)
  const CATEGORY_COLOR_STYLES: Record<string, { 
    light: string
    dark: string 
    border: string
    borderDark: string
    text: string
    textDark: string
  }> = {
    blue: {
      light: 'bg-blue-50',
      dark: 'dark:bg-blue-900/20',
      border: 'border-blue-500',
      borderDark: 'dark:border-blue-500',
      text: 'text-blue-700',
      textDark: 'dark:text-blue-300',
    },
    green: {
      light: 'bg-green-50',
      dark: 'dark:bg-green-900/20',
      border: 'border-green-500',
      borderDark: 'dark:border-green-500',
      text: 'text-green-700',
      textDark: 'dark:text-green-300',
    },
    orange: {
      light: 'bg-orange-50',
      dark: 'dark:bg-orange-900/20',
      border: 'border-orange-500',
      borderDark: 'dark:border-orange-500',
      text: 'text-orange-700',
      textDark: 'dark:text-orange-300',
    },
    purple: {
      light: 'bg-purple-50',
      dark: 'dark:bg-purple-900/20',
      border: 'border-purple-500',
      borderDark: 'dark:border-purple-500',
      text: 'text-purple-700',
      textDark: 'dark:text-purple-300',
    },
    cyan: {
      light: 'bg-cyan-50',
      dark: 'dark:bg-cyan-900/20',
      border: 'border-cyan-500',
      borderDark: 'dark:border-cyan-500',
      text: 'text-cyan-700',
      textDark: 'dark:text-cyan-300',
    },
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        key="service-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        key="service-modal-container"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
      >
        <div 
          ref={modalRef}
          className="pointer-events-auto w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/20 dark:to-transparent">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                {isEditing ? <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white truncate">{isEditing ? 'Edit Layanan' : 'Buat Layanan'}</h2>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 hidden xs:block">{isEditing ? 'Perbarui detail layanan' : 'Tambah layanan pembersih baru'}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-lg h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>

          {/* Tabs - Horizontal scroll on mobile with hidden scrollbar */}
          <div className="px-4 sm:px-6 border-b border-gray-100 dark:border-slate-700">
            <div className="flex justify-between sm:justify-start sm:gap-1">
              {[
                { key: 'basic', label: 'Dasar', icon: Package, shortLabel: 'Dasar' },
                { key: 'details', label: 'Detail', icon: List, shortLabel: 'Info' },
                { key: 'features', label: 'Fitur', icon: CheckCircle2, shortLabel: 'Fitur' },
                { key: 'cities', label: 'Kota', icon: Building, shortLabel: 'Kota' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm font-medium transition-all border-b-2 ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span className="sm:hidden truncate">{tab.shortLabel}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={onSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Service Name */}
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Nama Layanan <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Contoh: Pembersihan Rumah Mendalam"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white dark:bg-slate-900"
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* Slug */}
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Slug <span className="text-gray-400 text-xs">(Nama ramah URL)</span>
                    </label>
                    <Input
                      placeholder="Contoh: pembersihan-rumah-mendalam"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="bg-white dark:bg-slate-900 font-mono text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">Dibuat otomatis dari nama jika dikosongkan</p>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Deskripsi <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      placeholder="Jelaskan apa yang termasuk dalam layanan ini..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-white dark:bg-slate-900 min-h-[100px]"
                    />
                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                  </div>
                </motion.div>
              )}

              {/* Details Tab */}
              {activeTab === 'details' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Price & Duration */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-500" />
                          Harga <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <Input
                        type="number"
                        placeholder="250000"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="bg-white dark:bg-slate-900"
                      />
                      {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          Durasi (menit) <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <Input
                        type="number"
                        placeholder="180"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="bg-white dark:bg-slate-900"
                      />
                      {errors.duration && <p className="text-xs text-red-500 mt-1">{errors.duration}</p>}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-purple-500" />
                        Kategori
                      </div>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {CATEGORY_OPTIONS.map((opt) => {
                        const colorStyle = CATEGORY_COLOR_STYLES[opt.color]
                        const isSelected = formData.category === opt.value
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, category: opt.value })}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border-2 ${
                              isSelected
                                ? `${colorStyle.border} ${colorStyle.borderDark} ${colorStyle.light} ${colorStyle.dark} ${colorStyle.text} ${colorStyle.textDark}`
                                : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-500'
                            }`}
                          >
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Icon Selection */}
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                      Ikon Layanan
                    </label>
                    <div className="grid grid-cols-8 gap-2">
                      {SERVICE_ICONS.map((icon) => {
                        const IconComponent = icon.component
                        return (
                          <button
                            key={icon.name}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: icon.name })}
                            className={`flex items-center justify-center aspect-square rounded-xl transition-all ${
                              formData.icon === icon.name
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                                : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-600'
                            }`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                    <ImageUpload
                      label="Gambar Layanan"
                      folder="services"
                      value={formData.image}
                      onChange={(url) => setFormData({ ...formData, image: url })}
                      onFileSelect={(file) => setSelectedImageFile(file)}
                      autoUpload={false}
                      previewClassName="h-40 w-full"
                    />
                  </div>
                </motion.div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Features */}
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      <div className="flex items-center gap-2">
                        <List className="w-4 h-4 text-amber-500" />
                        Fitur
                      </div>
                    </label>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">Masukkan satu fitur per baris. Ini akan ditampilkan di halaman layanan.</p>
                    <Textarea
                      placeholder="Pembersihan dinding & langit-langit&#10;Sikat & vacuum karpet/sofa&#10;Sterilisasi kamar mandi"
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      className="bg-white dark:bg-slate-900 min-h-[200px]"
                    />
                    {formData.features && (
                      <div className="mt-4">
                        <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">Pratinjau:</p>
                        <div className="space-y-2">
                          {formData.features.split('\n').filter(f => f.trim()).map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-slate-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Featured Toggle */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800/50">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-5 h-5 rounded border-amber-300 text-amber-500 focus:ring-amber-500"
                      />
                      <label htmlFor="isFeatured" className="flex items-center gap-2 font-medium text-amber-800 dark:text-amber-300">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        Layanan Unggulan
                      </label>
                    </div>
                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 ml-8">Layanan ini akan ditampilkan di halaman utama</p>
                  </div>
                </motion.div>
              )}

              {/* Cities Tab */}
              {activeTab === 'cities' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Available Cities */}
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-blue-500" />
                        Kota Tersedia
                      </div>
                    </label>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
                      Pilih kota di mana layanan ini tersedia. Kosongkan semua jika tersedia di semua kota.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'surabaya', label: 'Surabaya' },
                        { value: 'sidoarjo', label: 'Sidoarjo' },
                        { value: 'gresik', label: 'Gresik' },
                      ].map((city) => (
                        <label
                          key={city.value}
                          className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 cursor-pointer hover:border-emerald-500 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.availableCities.includes(city.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, availableCities: [...formData.availableCities, city.value] })
                              } else {
                                setFormData({ ...formData, availableCities: formData.availableCities.filter(c => c !== city.value) })
                              }
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-slate-300">{city.label}</span>
                        </label>
                      ))}
                    </div>
                    {formData.availableCities.length === 0 && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-3">
                        Tidak ada kota dipilih = tersedia di semua kota
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 px-4 sm:px-6 py-4 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2">
              <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1 sm:flex-none bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                Batal
              </Button>
              <Button onClick={onSubmit} disabled={loading} className="flex-1 sm:flex-none gap-2 bg-emerald-600 hover:bg-emerald-700">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span className="sm:hidden">{isEditing ? 'Simpan' : 'Buat'}</span>
                <span className="hidden sm:inline">{isEditing ? 'Perbarui Layanan' : 'Buat Layanan'}</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Modern Delete Confirmation Modal
function DeleteModal({
  isOpen,
  onClose,
  serviceName,
  onConfirm,
  loading
}: {
  isOpen: boolean
  onClose: () => void
  serviceName: string
  onConfirm: () => void
  loading: boolean
}) {
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

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="pointer-events-auto w-full h-full sm:h-auto sm:max-w-md bg-white dark:bg-slate-900 sm:rounded-2xl shadow-2xl border-0 sm:border border-gray-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="p-4 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Service</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
              Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{serviceName}</strong>?
              <br />This action cannot be undone.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
            <Button variant="outline" onClick={onClose} disabled={loading} className="w-full sm:w-auto text-sm order-1 sm:order-1">
              Cancel
            </Button>
            <Button
              variant="error" 
              onClick={onConfirm}
              disabled={loading}
              className="w-full sm:w-auto gap-2 text-sm order-2 sm:order-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
              Delete Service
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default function ServicesPage() {
  const { data: services = [], isLoading: loading, refetch } = useServices(true)
  const createServiceMutation = useCreateService()
  const updateServiceMutation = useUpdateService()
  const deleteServiceMutation = useDeleteService()
  
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedService, setSelectedService] = React.useState<any>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [filterActive, setFilterActive] = React.useState<'all' | 'active' | 'inactive'>('all')
  const [formData, setFormData] = React.useState<ServiceFormData>({
    name: '',
    slug: '',
    description: '',
    price: '',
    duration: '',
    category: 'Deep Cleaning',
    icon: 'Home',
    image: '',
    features: '',
    isFeatured: false,
    availableCities: [],
  })
  const [errors, setErrors] = React.useState<Partial<ServiceFormData>>({})
  const [selectedImageFile, setSelectedImageFile] = React.useState<File | null>(null)
  const { uploadImage } = useImageUpload()

  // Optimistic UI state for toggle active
  const [optimisticStates, setOptimisticStates] = React.useState<Record<string, { isActive: boolean; isLoading: boolean }>>({})

  // Get effective state for a service (optimistic > actual)
  const getServiceState = (service: any) => {
    const optimistic = optimisticStates[service.id]
    if (optimistic) {
      return { ...service, isActive: optimistic.isActive }
    }
    return service
  }

  function generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  function openCreateModal() {
    setIsEditing(false)
    setSelectedService(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      duration: '',
      category: 'Deep Cleaning',
      icon: 'Home',
      image: '',
      features: '',
      isFeatured: false,
      availableCities: [],
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openEditModal(service: any) {
    setIsEditing(true)
    setSelectedService(service)
    setFormData({
      name: service.name,
      slug: service.slug,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category || 'Deep Cleaning',
      icon: service.icon || 'Home',
      image: service.image || '',
      features: service.features?.join('\n') || '',
      isFeatured: service.isFeatured || false,
      availableCities: service.availableCities || [],
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openDeleteModal(service: any) {
    setSelectedService(service)
    setIsDeleteModalOpen(true)
  }

  function validateForm(): boolean {
    const newErrors: Partial<ServiceFormData> = {}
    if (!formData.name.trim()) newErrors.name = 'Nama layanan wajib diisi'
    if (!formData.description.trim()) newErrors.description = 'Deskripsi wajib diisi'
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Harga wajib diisi dengan nilai yang valid'
    }
    if (!formData.duration || isNaN(Number(formData.duration)) || Number(formData.duration) <= 0) {
      newErrors.duration = 'Durasi wajib diisi dengan nilai yang valid'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return

    // Upload image if there's a new file selected
    let imageUrl = formData.image
    if (selectedImageFile) {
      const uploadedUrl = await uploadImage(selectedImageFile, 'services') as string
      if (uploadedUrl) {
        imageUrl = uploadedUrl
      } else {
        toast.error('Failed to upload image')
        return
      }
    }

    const slug = formData.slug || generateSlug(formData.name)
    const serviceData = {
      name: formData.name,
      slug: slug,
      description: formData.description,
      price: Number(formData.price),
      duration: Number(formData.duration),
      category: formData.category,
      icon: formData.icon,
      image: imageUrl || undefined,
      features: formData.features.split('\n').map(f => f.trim()).filter(f => f.length > 0),
      isActive: selectedService?.isActive ?? true,
      isFeatured: formData.isFeatured,
      availableCities: formData.availableCities,
    }

    if (isEditing && selectedService) {
      updateServiceMutation.mutate(
        { id: selectedService.id, data: serviceData },
        {
          onSuccess: () => {
            setSelectedImageFile(null)
            setIsModalOpen(false)
            refetch()
          },
        }
      )
    } else {
      createServiceMutation.mutate(serviceData, {
        onSuccess: () => {
          setSelectedImageFile(null)
          setIsModalOpen(false)
          refetch()
        },
      })
    }
  }

  async function handleToggleActive(service: any) {
    const newIsActive = !service.isActive
    const serviceId = service.id
    
    // 1. IMMEDIATE: Set optimistic state (UI instantly updates)
    setOptimisticStates(prev=>({
      ...prev,
      [serviceId]: { isActive: newIsActive, isLoading: true }
    }))
    
    // 2. Send request to server
    updateServiceMutation.mutate(
      { id: serviceId, data: { isActive: newIsActive } },
      {
        onSuccess: () => {
          // 3. Success: Clear optimistic state, show success toast
          setOptimisticStates(prev=> {
            const newState = { ...prev }
            delete newState[serviceId]
            return newState
          })
          toast.success(`Service "${service.name}" ${newIsActive ? 'aktif' : 'nonaktif'}`)
          refetch()
        },
        onError: (error: any) => {
          // 4. Error: Rollback optimistic state, show error toast
          setOptimisticStates(prev=> {
            const newState = { ...prev }
            delete newState[serviceId]
            return newState
          })
          toast.error(`Gagal mengupdate: ${error.message || 'Error unknown'}`)
        },
      }
    )
  }

  async function handleDelete() {
    if (!selectedService) return
    deleteServiceMutation.mutate(selectedService.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false)
        refetch()
      },
    })
  }

  function getIconComponent(iconName: string) {
    const Icon = (Icons as any)[iconName]
    return Icon || Home
  }

  function getCategoryBadge(category: string) {
    const colors: Record<string, string> = {
      'Deep Cleaning': 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      'Regular Cleaning': 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
      'Post Construction': 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      'Sofa Cleaning': 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      'Office Cleaning': 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    }
    return colors[category] || 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-300 border-gray-200 dark:border-slate-600'
  }

  const filteredServices = React.useMemo(() => {
    switch (filterActive) {
      case 'active':
        return services.filter(s => s.isActive)
      case 'inactive':
        return services.filter(s => !s.isActive)
      default:
        return services
    }
  }, [services, filterActive])

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Layanan' }]} />

      <div className="w-full px-3 sm:px-6 py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-start justify-between gap-4"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Layanan</h1>
              <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700 h-8 text-xs px-3 flex-shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-0.5 sm:mt-1 truncate">Kelola layanan cleaning dan harga</p>
          </div>
          <div className="flex-shrink-0">
            <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-slate-600">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Total: </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{services.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0"
        >
          {[
            { key: 'all', label: 'Semua', count: services.length, color: 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/25', inactiveColor: 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-600' },
            { key: 'active', label: 'Aktif', count: services.filter(s => s.isActive).length, color: 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25', inactiveColor: 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-600' },
            { key: 'inactive', label: 'Nonaktif', count: services.filter(s => !s.isActive).length, color: 'bg-gray-500 text-white border-gray-500 shadow-lg shadow-gray-500/25', inactiveColor: 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-600' },
          ].map((tab: any) => (
            <button
              key={tab.key}
              onClick={() => setFilterActive(tab.key as any)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium transition-all border whitespace-nowrap flex-shrink-0 ${
                filterActive === tab.key
                  ? tab.color
                  : tab.inactiveColor
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-[10px] sm:text-xs ${
                filterActive === tab.key
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <motion.div key={`skeleton-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Card className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="skeleton mb-2 h-10 w-10 sm:h-12 sm:w-12 rounded-lg" />
                        <div className="skeleton h-5 sm:h-6 w-3/4 rounded" />
                      </CardHeader>
                      <CardContent>
                        <div className="skeleton mb-2 h-3 sm:h-4 w-full rounded" />
                        <div className="skeleton h-3 sm:h-4 w-2/3 rounded" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              : filteredServices.map((service, index) => {
                  const IconComponent = getIconComponent(service.icon || 'Package')
                  // Dapatkan effective state dengan optimistic UI
                  const serviceState = getServiceState(service)
                  const isOptimisticLoading = optimisticStates[service.id]?.isLoading || false
                  return (
                    <motion.div
                      key={service.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`group overflow-hidden transition-all hover:shadow-xl dark:hover:shadow-slate-900/50 ${!serviceState.isActive ? 'opacity-60 grayscale' : ''} bg-white dark:bg-slate-900 dark:border-slate-700`}>
                        {/* Image */}
                        <div className="relative">
                          {service.image ? (
                            <img
                              src={service.image}
                              alt={service.name}
                              className="h-32 sm:h-40 w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-32 sm:h-40 w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-700 dark:to-slate-600">
                              <IconComponent className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 dark:text-slate-500" />
                            </div>
                          )}
                          {service.isFeatured && (
                            <div className="absolute right-2 top-2">
                              <Badge variant="warning" className="gap-1 shadow-lg text-[10px] sm:text-xs py-0.5">
                                <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
                                <span className="hidden sm:inline">Featured</span>
                              </Badge>
                            </div>
                          )}
                          {!serviceState.isActive && (
                            <div className="absolute left-2 top-2">
                              <Badge variant="default" className="shadow-lg text-[10px] sm:text-xs py-0.5 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600">Inactive</Badge>
                            </div>
                          )}
                        </div>
                        
                        <CardHeader className="pb-2 dark:bg-slate-900 p-3 sm:p-6 border-b border-gray-100 dark:border-slate-700">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className={`rounded-lg sm:rounded-xl p-2 sm:p-3 ${serviceState.isActive ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' : 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-400'}`}>
                                <IconComponent className="h-4 w-4 sm:h-6 sm:w-6" />
                              </div>
                              <div className="min-w-0">
                                <CardTitle className="text-sm sm:text-base font-bold dark:text-white truncate">{service.name}</CardTitle>
                                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-medium border mt-0.5 sm:mt-1 ${getCategoryBadge(service.category)}`}>
                                  {service.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="dark:bg-slate-900 p-3 sm:p-6 pt-3 sm:pt-4">
                          <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500 dark:text-slate-400 line-clamp-2">{service.description}</p>
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(service.price)}</p>
                              <p className="text-[10px] sm:text-xs text-gray-400 dark:text-slate-400 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                {service.duration} min
                              </p>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-1">
                              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-900">
                                <span className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-300 hidden xs:inline">Active</span>
                                <Switch
                                  checked={serviceState.isActive}
                                  onChange={() => handleToggleActive(service)}
                                  loading={isOptimisticLoading}
                                />
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => openEditModal(service)} className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:text-slate-400">
                                <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openDeleteModal(service)} className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:text-slate-400">
                                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {!loading && filteredServices.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-12 sm:py-16 text-center px-4"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
              <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-slate-600" />
            </div>
            <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">No services found</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">Get started by creating your first service</p>
            <Button onClick={openCreateModal} className="mt-4 gap-2 text-sm">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </motion.div>
        )}
      </div>

      {/* Service Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditing={isEditing}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleSubmit}
        loading={createServiceMutation.isPending || updateServiceMutation.isPending}
        selectedImageFile={selectedImageFile}
        setSelectedImageFile={setSelectedImageFile}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        serviceName={selectedService?.name || ''}
        onConfirm={handleDelete}
        loading={deleteServiceMutation.isPending}
      />
    </div>
  )
}
