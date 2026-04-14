'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit, Trash2, DollarSign, Calendar, Star, X, 
  AlertCircle, Tag, Search, Hash
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/admin/DataTable'
import { getPricingPlans, createPricingPlan, updatePricingPlan, deletePricingPlan } from '@/lib/api'
import { PricingPlan } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface PricingFormData {
  name: string
  slug: string
  description: string
  price: string
  billingCycle: string
  features: string
  isPopular: boolean
  isActive: boolean
  order: number
}

const billingCycles = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'one-time', label: 'One-time' }
]

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// Modern Modal Component for Pricing Form
function PricingFormModal({
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
  formData: PricingFormData
  setFormData: (data: PricingFormData) => void
  errors: Partial<PricingFormData>
  setErrors: (errors: Partial<PricingFormData>) => void
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
                <Tag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit Pricing Plan' : 'Create Pricing Plan'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {isEditing ? 'Perbarui paket harga' : 'Buat paket harga baru'}
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
              {/* Name & Slug */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Plan Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value
                      setFormData(prev => ({ ...prev, name, slug: isEditing ? prev.slug : generateSlug(name) }))
                      setErrors({ ...errors, name: '' })
                    }}
                    placeholder="e.g., Premium"
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
                        setFormData({ ...formData, slug: e.target.value })
                        setErrors({ ...errors, slug: '' })
                      }}
                      placeholder="e.g., premium"
                      className={`pl-7 ${errors.slug ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value })
                    setErrors({ ...errors, description: '' })
                  }}
                  placeholder="Enter plan description..."
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500 ${errors.description ? 'border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400'}`}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Price, Billing & Order */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Price (IDR) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => {
                        setFormData({ ...formData, price: e.target.value })
                        setErrors({ ...errors, price: '' })
                      }}
                      placeholder="299000"
                      className={`pl-10 ${errors.price ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Billing Cycle
                  </label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400"
                  >
                    {billingCycles.map(cycle => (
                      <option key={cycle.value} value={cycle.value}>{cycle.label}</option>
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

              {/* Features */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Features (one per line)
                </label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Full house cleaning&#10;Weekend availability&#10;Priority support"
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-sm text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
                />
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  Masukkan fitur per baris
                </p>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Popular/Recommended</span>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Tandai sebagai paket paling populer</p>
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
                    <p className="text-xs text-gray-500 dark:text-slate-400">Paket tersedia untuk publik</p>
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
                  {isEditing ? 'Simpan Perubahan' : 'Buat Paket'}
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
function PricingDeleteModal({
  isOpen,
  onClose,
  item,
  onConfirm,
  deleting,
}: {
  isOpen: boolean
  onClose: () => void
  item: PricingPlan | null
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
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hapus Pricing Plan</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {formatCurrency(item.price)} / {item.billingCycle}
                  </p>
                  {item.isPopular && (
                    <span className="inline-flex items-center gap-1 mt-1 text-xs text-amber-600 dark:text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" /> Popular
                    </span>
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

export default function PricingPage() {
  const [items, setItems] = React.useState<PricingPlan[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<PricingPlan | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<PricingFormData>({
    name: '',
    slug: '',
    description: '',
    price: '',
    billingCycle: 'monthly',
    features: '',
    isPopular: false,
    isActive: true,
    order: 0,
  })
  const [errors, setErrors] = React.useState<Partial<PricingFormData>>({})
  const [saving, setSaving] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    setLoading(true)
    try {
      const data = await getPricingPlans()
      setItems(data)
    } catch (error) {
      toast.error('Failed to fetch pricing plans')
    } finally {
      setLoading(false)
    }
  }

  function openCreateModal() {
    setIsEditing(false)
    setSelectedItem(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      billingCycle: 'monthly',
      features: '',
      isPopular: false,
      isActive: true,
      order: 0,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openEditModal(item: PricingPlan) {
    setIsEditing(true)
    setSelectedItem(item)
    setFormData({
      name: item.name,
      slug: item.slug,
      description: item.description,
      price: String(item.price),
      billingCycle: item.billingCycle,
      features: item.features?.join('\n') || '',
      isPopular: item.isPopular,
      isActive: item.isActive,
      order: item.order,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openDeleteModal(item: PricingPlan) {
    setSelectedItem(item)
    setIsDeleteModalOpen(true)
  }

  function validateForm(): boolean {
    const newErrors: Partial<PricingFormData> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required'
    if (!formData.price.trim()) newErrors.price = 'Price is required'
    if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'Price must be a valid number'
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validateForm()) return

    setSaving(true)
    const featuresArray = formData.features
      ? formData.features.split('\n').map(f => f.trim()).filter(Boolean)
      : []

    const itemData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      price: Number(formData.price),
      billingCycle: formData.billingCycle,
      features: featuresArray,
      isPopular: formData.isPopular,
      isActive: formData.isActive,
      order: formData.order,
    }

    try {
      if (isEditing && selectedItem) {
        await updatePricingPlan(selectedItem.id, itemData)
        toast.success('Pricing plan updated successfully')
      } else {
        await createPricingPlan(itemData)
        toast.success('Pricing plan created successfully')
      }
      setIsModalOpen(false)
      fetchItems()
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} pricing plan`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!selectedItem) return
    setDeleting(true)
    try {
      await deletePricingPlan(selectedItem.id)
      toast.success('Pricing plan deleted successfully')
      setIsDeleteModalOpen(false)
      fetchItems()
    } catch (error) {
      toast.error('Failed to delete pricing plan')
    } finally {
      setDeleting(false)
    }
  }

  async function handleTogglePopular(item: PricingPlan) {
    try {
      await updatePricingPlan(item.id, { isPopular: !item.isPopular })
      toast.success(`Plan ${!item.isPopular ? 'marked as popular' : 'unmarked'}`)
      fetchItems()
    } catch (error) {
      toast.error('Failed to update plan')
    }
  }

  const filteredItems = React.useMemo(() => {
    if (!search) return items
    const term = search.toLowerCase()
    return items.filter(item => 
      item.name.toLowerCase().includes(term) || 
      item.description.toLowerCase().includes(term)
    )
  }, [items, search])

  const columns = [
    {
      key: 'name',
      label: 'Plan',
      render: (value: string, row: PricingPlan) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <Tag className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
              {row.isPopular && (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 capitalize">{row.billingCycle}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
            <DollarSign className="h-3 w-3 text-green-600 dark:text-green-400" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(value)}
          </span>
        </div>
      ),
    },
    {
      key: 'features',
      label: 'Features',
      render: (value: string[]) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <Hash className="h-3 w-3 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm text-gray-700 dark:text-slate-300">
            {value?.length || 0} fitur
          </span>
        </div>
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
      render: (_: any, row: PricingPlan) => (
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
          <span className="text-gray-900 dark:text-white font-medium">Pricing</span>
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
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Pricing Plans</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage pricing tiers and plans</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <span className="text-sm text-gray-500 dark:text-slate-400">Total: </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{items.length}</span>
            </div>
            <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <Plus className="h-4 w-4" />
              New Plan
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
              placeholder="Search pricing plans..."
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
                    <Tag className="h-8 w-8 text-gray-400 dark:text-slate-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {search ? 'No plans found' : 'No pricing plans yet'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    {search ? 'Try different keywords' : 'Click the button above to add your first plan'}
                  </p>
                </div>
              }
            />
          </div>
        </motion.div>
      </div>

      {/* Form Modal */}
      <PricingFormModal
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
      <PricingDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        item={selectedItem}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </div>
  )
}
