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

// Modern Switch Component
function Switch({ checked, onChange, disabled = false }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
        checked ? 'bg-emerald-500 dark:bg-emerald-500' : 'bg-gray-300 dark:bg-slate-600'
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
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
          className="pointer-events-auto w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/20 dark:to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                {isEditing ? <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" /> : <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{isEditing ? 'Edit Service' : 'Create Service'}</h2>
                <p className="text-xs text-gray-500 dark:text-slate-400">{isEditing ? 'Update service details' : 'Add a new cleaning service'}</p>
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

          {/* Tabs */}
          <div className="px-6 border-b border-gray-100 dark:border-slate-700">
            <div className="flex gap-1">
              {[
                { key: 'basic', label: 'Basic Info', icon: Package },
                { key: 'details', label: 'Details', icon: List },
                { key: 'features', label: 'Features', icon: CheckCircle2 },
                { key: 'cities', label: 'Available Cities', icon: Building },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={onSubmit} className="p-6 space-y-6">
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
                      Service Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g. Home Deep Cleaning"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white dark:bg-slate-900"
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* Slug */}
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Slug <span className="text-gray-400 text-xs">(URL friendly name)</span>
                    </label>
                    <Input
                      placeholder="e.g. home-deep-cleaning"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="bg-white dark:bg-slate-900 font-mono text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">Auto-generated from name if left empty</p>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      placeholder="Describe what this service includes..."
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
                          Price (IDR) <span className="text-red-500">*</span>
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
                          Duration (minutes) <span className="text-red-500">*</span>
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
                        Category
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
                                : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-500'
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
                      Service Icon
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
                                : 'bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-600'
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
                      label="Service Image"
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
                        Features
                      </div>
                    </label>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">Enter one feature per line. These will be displayed on the service page.</p>
                    <Textarea
                      placeholder="Pembersihan dinding & langit-langit&#10;Sikat & vacuum karpet/sofa&#10;Sterilisasi kamar mandi"
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      className="bg-white dark:bg-slate-900 min-h-[200px]"
                    />
                    {formData.features && (
                      <div className="mt-4">
                        <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">Preview:</p>
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
                        Featured Service
                      </label>
                    </div>
                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 ml-8">This service will be highlighted on the homepage</p>
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
                        Available Cities
                      </div>
                    </label>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
                      Select cities where this service is available. Leave all unchecked for all cities.
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
                        No cities selected = available in all cities
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
              <span className="text-red-500">*</span> Required fields
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={onSubmit} disabled={loading} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isEditing ? 'Update Service' : 'Create Service'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
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
          className="pointer-events-auto w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Service</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{serviceName}</strong>?
              <br />This action cannot be undone.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="error" 
              onClick={onConfirm}
              disabled={loading}
              className="gap-2"
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
  const [services, setServices] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedService, setSelectedService] = React.useState<any>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [filterActive, setFilterActive] = React.useState<'all' | 'active' | 'inactive'>('all')
  const [formLoading, setFormLoading] = React.useState(false)
  const [deleteLoading, setDeleteLoading] = React.useState(false)
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

  React.useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    setLoading(true)
    try {
      const data = await getServices(true)
      setServices(data)
    } catch (error) {
      toast.error('Failed to fetch services')
    } finally {
      setLoading(false)
    }
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
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required'
    }
    if (!formData.duration || isNaN(Number(formData.duration)) || Number(formData.duration) <= 0) {
      newErrors.duration = 'Valid duration is required'
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
      const uploadedUrl = await uploadImage(selectedImageFile, 'services')
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

    setFormLoading(true)
    try {
      if (isEditing && selectedService) {
        await updateService(selectedService.id, serviceData)
        toast.success('Service updated successfully')
      } else {
        await createService(serviceData)
        toast.success('Service created successfully')
      }
      setSelectedImageFile(null)
      setIsModalOpen(false)
      fetchServices()
    } catch (error: any) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} service: ${error.message}`)
    } finally {
      setFormLoading(false)
    }
  }

  async function handleToggleActive(service: any) {
    const newIsActive = !service.isActive
    const serviceName = service.name

    setServices(prev => prev.map(s =>
      s.id === service.id ? { ...s, isActive: newIsActive } : s
    ))

    try {
      await updateService(service.id, { isActive: newIsActive })
      toast.success(`Service "${serviceName}" ${newIsActive ? 'activated' : 'deactivated'}`)
    } catch (error: any) {
      setServices(prev => prev.map(s =>
        s.id === service.id ? { ...s, isActive: !newIsActive } : s
      ))
      toast.error(`Failed to update: ${error.message || 'Unknown error'}`)
    }
  }

  async function handleDelete() {
    if (!selectedService) return
    setDeleteLoading(true)
    try {
      await deleteService(selectedService.id)
      toast.success('Service deleted successfully')
      setIsDeleteModalOpen(false)
      fetchServices()
    } catch (error) {
      toast.error('Failed to delete service')
    } finally {
      setDeleteLoading(false)
    }
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
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Services' }]} />

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Services</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage cleaning services and pricing</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <span className="text-sm text-gray-500 dark:text-slate-400">Total: </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{services.length}</span>
            </div>
            <Button onClick={openCreateModal} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          {[
            { key: 'all', label: 'All', count: services.length, color: 'blue' },
            { key: 'active', label: 'Active', count: services.filter(s => s.isActive).length, color: 'emerald' },
            { key: 'inactive', label: 'Inactive', count: services.filter(s => !s.isActive).length, color: 'gray' },
          ].map((tab: any) => (
            <button
              key={tab.key}
              onClick={() => setFilterActive(tab.key as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all border ${
                filterActive === tab.key
                  ? `bg-${tab.color}-500 text-white border-${tab.color}-500 shadow-lg shadow-${tab.color}-500/25`
                  : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-600'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
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
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <motion.div key={`skeleton-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Card className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="skeleton mb-2 h-12 w-12 rounded-lg" />
                        <div className="skeleton h-6 w-3/4 rounded" />
                      </CardHeader>
                      <CardContent>
                        <div className="skeleton mb-2 h-4 w-full rounded" />
                        <div className="skeleton h-4 w-2/3 rounded" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              : filteredServices.map((service, index) => {
                  const IconComponent = getIconComponent(service.icon)
                  return (
                    <motion.div
                      key={service.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`group overflow-hidden transition-all hover:shadow-xl dark:hover:shadow-slate-900/50 ${!service.isActive ? 'opacity-60 grayscale' : ''} dark:bg-slate-800 dark:border-slate-700`}>
                        {/* Image */}
                        <div className="relative">
                          {service.image ? (
                            <img
                              src={service.image}
                              alt={service.name}
                              className="h-40 w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-700 dark:to-slate-600">
                              <IconComponent className="h-16 w-16 text-gray-300 dark:text-slate-500" />
                            </div>
                          )}
                          {service.isFeatured && (
                            <div className="absolute right-2 top-2">
                              <Badge variant="warning" className="gap-1 shadow-lg">
                                <Star className="h-3 w-3 fill-current" />
                                Featured
                              </Badge>
                            </div>
                          )}
                          {!service.isActive && (
                            <div className="absolute left-2 top-2">
                              <Badge variant="default" className="shadow-lg dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600">Inactive</Badge>
                            </div>
                          )}
                        </div>
                        
                        <CardHeader className="pb-2 dark:bg-slate-800">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`rounded-xl p-3 ${service.isActive ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' : 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-400'}`}>
                                <IconComponent className="h-6 w-6" />
                              </div>
                              <div>
                                <CardTitle className="text-base font-bold dark:text-white">{service.name}</CardTitle>
                                <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium border ${getCategoryBadge(service.category)} mt-1`}>
                                  {service.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="dark:bg-slate-800">
                          <p className="mb-4 text-sm text-gray-500 dark:text-slate-400 line-clamp-2">{service.description}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(service.price)}</p>
                              <p className="text-xs text-gray-400 dark:text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {service.duration} min
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600">
                                <span className="text-xs text-gray-500 dark:text-slate-300">Active</span>
                                <Switch
                                  checked={service.isActive}
                                  onChange={() => handleToggleActive(service)}
                                />
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => openEditModal(service)} className="hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:text-slate-400">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openDeleteModal(service)} className="hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:text-slate-400">
                                <Trash2 className="h-4 w-4" />
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
            className="py-16 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-400 dark:text-slate-600" />
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">No services found</p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Get started by creating your first service</p>
            <Button onClick={openCreateModal} className="mt-4 gap-2">
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
        loading={formLoading}
        selectedImageFile={selectedImageFile}
        setSelectedImageFile={setSelectedImageFile}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        serviceName={selectedService?.name || ''}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  )
}
