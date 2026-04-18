'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit, Trash2, MapPin, Calendar, Star, X, 
  AlertCircle, Globe, Search, Hash
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/admin/DataTable'
import { getServiceAreas, createServiceArea, updateServiceArea, deleteServiceArea } from '@/lib/api'
import { ServiceArea } from '@/types'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { Breadcrumb } from '@/components/admin/Breadcrumb'

interface AreaFormData {
  city: string
  slug: string
  region: string
  description: string
  coverage: string
  isActive: boolean
  isFeatured: boolean
}

const regions = ['East Java', 'Central Java', 'West Java', 'DKI Jakarta', 'Bali', 'Other']

function generateSlug(city: string): string {
  return city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// Modern Modal Component for Area Form
function AreaFormModal({
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
  formData: AreaFormData
  setFormData: (data: AreaFormData | ((prev: AreaFormData) => AreaFormData)) => void
  errors: Partial<AreaFormData>
  setErrors: (errors: Partial<AreaFormData>) => void
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
                <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit Service Area' : 'Create Service Area'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {isEditing ? 'Perbarui area layanan' : 'Buat area layanan baru'}
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
              {/* City & Slug */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.city}
                      onChange={(e) => {
                        const city = e.target.value
                        setFormData(prev => ({ ...prev, city, slug: generateSlug(city) }))
                        setErrors({ ...errors, city: '' })
                      }}
                      placeholder="e.g., Surabaya"
                      className={`pl-10 ${errors.city ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
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
                        setFormData({ ...formData, slug: e.target.value })
                        setErrors({ ...errors, slug: '' })
                      }}
                      placeholder="e.g., surabaya"
                      className={`pl-7 ${errors.slug ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                </div>
              </div>

              {/* Region */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Region/Province <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => {
                    setFormData({ ...formData, region: e.target.value })
                    setErrors({ ...errors, region: '' })
                  }}
                  className={`w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 ${
                    errors.region ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                  }`}
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                {errors.region && <p className="text-sm text-red-500">{errors.region}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description about this service area..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-sm text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Coverage Areas */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Coverage Areas (Kecamatan)
                </label>
                <textarea
                  value={formData.coverage}
                  onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
                  placeholder="Gubeng, Tegalsari, Rungkut, Genteng, Wonokromo (comma separated)"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-sm text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
                />
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  Masukkan nama kecamatan yang dicakup, pisahkan dengan koma
                </p>
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
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Featured Area</span>
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
                    <p className="text-xs text-gray-500 dark:text-slate-400">Area tersedia untuk booking</p>
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
                  {isEditing ? 'Simpan Perubahan' : 'Buat Area'}
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
function AreaDeleteModal({
  isOpen,
  onClose,
  item,
  onConfirm,
  deleting,
}: {
  isOpen: boolean
  onClose: () => void
  item: ServiceArea | null
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
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hapus Service Area</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.city}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{item.region}</p>
                  {item.coverage && (
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                      {item.coverage.length} coverage areas
                    </p>
                  )}
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

export default function AreasPage() {
  const [items, setItems] = React.useState<ServiceArea[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<ServiceArea | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<AreaFormData>({
    city: '',
    slug: '',
    region: 'East Java',
    description: '',
    coverage: '',
    isActive: true,
    isFeatured: false,
  })
  const [errors, setErrors] = React.useState<Partial<AreaFormData>>({})
  const [saving, setSaving] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    setLoading(true)
    try {
      const data = await getServiceAreas()
      setItems(data)
    } catch (error) {
      toast.error('Failed to fetch service areas')
    } finally {
      setLoading(false)
    }
  }

  function openCreateModal() {
    setIsEditing(false)
    setSelectedItem(null)
    setFormData({
      city: '',
      slug: '',
      region: 'East Java',
      description: '',
      coverage: '',
      isActive: true,
      isFeatured: false,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openEditModal(item: ServiceArea) {
    setIsEditing(true)
    setSelectedItem(item)
    setFormData({
      city: item.city,
      slug: item.slug,
      region: item.region,
      description: item.description || '',
      coverage: item.coverage?.join(', ') || '',
      isActive: item.isActive,
      isFeatured: item.isFeatured,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openDeleteModal(item: ServiceArea) {
    setSelectedItem(item)
    setIsDeleteModalOpen(true)
  }

  function validateForm(): boolean {
    const newErrors: Partial<AreaFormData> = {}
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required'
    if (!formData.region.trim()) newErrors.region = 'Region is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validateForm()) return

    setSaving(true)
    const coverageArray = formData.coverage
      ? formData.coverage.split(',').map(p => p.trim()).filter(Boolean)
      : []

    const itemData = {
      city: formData.city,
      slug: formData.slug,
      region: formData.region,
      description: formData.description || undefined,
      coverage: coverageArray,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
    }

    try {
      if (isEditing && selectedItem) {
        await updateServiceArea(selectedItem.id, itemData)
        toast.success('Service area updated successfully')
      } else {
        await createServiceArea(itemData)
        toast.success('Service area created successfully')
      }
      setIsModalOpen(false)
      fetchItems()
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} service area`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!selectedItem) return
    setDeleting(true)
    try {
      await deleteServiceArea(selectedItem.id)
      toast.success('Service area deleted successfully')
      setIsDeleteModalOpen(false)
      fetchItems()
    } catch (error) {
      toast.error('Failed to delete service area')
    } finally {
      setDeleting(false)
    }
  }

  async function handleToggleFeatured(item: ServiceArea) {
    try {
      await updateServiceArea(item.id, { isFeatured: !item.isFeatured })
      toast.success(`Area ${!item.isFeatured ? 'featured' : 'unfeatured'}`)
      fetchItems()
    } catch (error) {
      toast.error('Failed to update area')
    }
  }

  const filteredItems = React.useMemo(() => {
    if (!search) return items
    const term = search.toLowerCase()
    return items.filter(item => 
      item.city.toLowerCase().includes(term) || 
      item.region.toLowerCase().includes(term) ||
      item.slug.toLowerCase().includes(term)
    )
  }, [items, search])

  const columns = [
    {
      key: 'city',
      label: 'Area',
      render: (value: string, row: ServiceArea) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">{row.region}</p>
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
          <code className="text-xs bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded text-gray-600 dark:text-slate-400">{value}</code>
        </div>
      ),
    },
    {
      key: 'coverage',
      label: 'Coverage',
      render: (value: string[]) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
            <Globe className="h-3 w-3 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="text-sm text-gray-700 dark:text-slate-300">
            {value?.length || 0} kecamatan
          </span>
        </div>
      ),
    },
    {
      key: 'isFeatured',
      label: 'Featured',
      render: (value: boolean, row: ServiceArea) => (
        <button onClick={() => handleToggleFeatured(row)}>
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
      render: (_: any, row: ServiceArea) => (
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
      <Breadcrumb items={[{ label: 'Service Areas' }]} />

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Service Areas</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage service coverage areas</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <span className="text-sm text-gray-500 dark:text-slate-400">Total: </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{items.length}</span>
            </div>
            <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <Plus className="h-4 w-4" />
              New Area
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
              placeholder="Search areas..."
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
              data={filteredItems}
              loading={loading}
              emptyState={
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 rounded-full bg-gray-100 dark:bg-slate-800 p-4">
                    <Globe className="h-8 w-8 text-gray-400 dark:text-slate-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {search ? 'No areas found' : 'No service areas yet'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    {search ? 'Try different keywords' : 'Click the button above to add your first area'}
                  </p>
                </div>
              }
            />
          </div>
        </motion.div>
      </div>

      {/* Form Modal */}
      <AreaFormModal
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
      <AreaDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        item={selectedItem}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </div>
  )
}
