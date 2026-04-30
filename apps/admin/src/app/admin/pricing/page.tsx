'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit, Trash2, DollarSign, Calendar, Star, X, 
  AlertCircle, Tag, Search, Hash, CheckCircle2, XCircle, Clock,
  Package, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/admin/DataTable'
import { usePricingPlans, useCreatePricingPlan, useUpdatePricingPlan, useDeletePricingPlan } from '@/lib/use-queries'
import { PricingPlan } from '@/types'
import { Breadcrumb } from '@/components/admin/Breadcrumb'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
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
  { value: 'monthly', label: 'Bulanan' },
  { value: 'yearly', label: 'Tahunan' },
  { value: 'one-time', label: 'Sekali Bayar' }
]

const billingCycleLabels: Record<string, string> = {
  monthly: 'Bulanan',
  yearly: 'Tahunan',
  'one-time': 'Sekali Bayar'
}

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
          className="pointer-events-auto w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-600 overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-900/20 dark:to-transparent flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Tag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit Paket Harga' : 'Tambah Paket Harga'}
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
            <div className="p-4 sm:p-6 space-y-5">
              {/* Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Nama Paket <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value
                      setFormData({ ...formData, name, slug: isEditing ? formData.slug : generateSlug(name) })
                      setErrors({ ...errors, name: '' })
                    }}
                    placeholder="Contoh: Premium"
                    className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-slate-300 text-sm font-bold z-10 pointer-events-none">/</span>
                    <Input
                      value={formData.slug}
                      onChange={(e) => {
                        setFormData({ ...formData, slug: e.target.value })
                        setErrors({ ...errors, slug: '' })
                      }}
                      placeholder="Contoh: premium"
                      className={`pl-7 ${errors.slug ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value })
                    setErrors({ ...errors, description: '' })
                  }}
                  placeholder="Masukkan deskripsi paket..."
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500 ${errors.description ? 'border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400'}`}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Price, Billing & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Harga (IDR) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-slate-300 text-sm font-bold z-10 pointer-events-none">Rp</span>
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
                    Siklus Tagihan
                  </label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400"
                  >
                    {billingCycles.map(cycle => (
                      <option key={cycle.value} value={cycle.value}>{cycle.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Urutan Tampilan
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
                  Fitur (satu per baris)
                </label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Membersihkan seluruh rumah&#10;Tersedia akhir pekan&#10;Dukungan prioritas"
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 text-sm text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
                />
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  Masukkan fitur per baris
                </p>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Populer/Rekomendasi</span>
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
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Aktif</span>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Paket tersedia untuk publik</p>
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
                  {isEditing ? 'Simpan Perubahan' : 'Tambah Paket'}
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
          className="pointer-events-auto w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-600 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hapus Paket Harga</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {formatCurrency(item.price)} / {billingCycleLabels[item.billingCycle] || item.billingCycle}
                  </p>
                  {item.isPopular && (
                    <span className="inline-flex items-center gap-1 mt-1 text-xs text-amber-600 dark:text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" /> Populer
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

// Modern Mobile Card Component
function PricingMobileCard({ 
  plan, 
  onEdit, 
  onDelete 
}: { 
  plan: PricingPlan
  onEdit: (p: PricingPlan) => void
  onDelete: (p: PricingPlan) => void
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
      {/* Header with Icon and Badges */}
      <div className="p-4 flex items-start gap-3 border-b border-gray-100 dark:border-slate-700/50">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 flex-shrink-0">
          <Tag className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {plan.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 capitalize">
                {billingCycleLabels[plan.billingCycle] || plan.billingCycle}
              </p>
            </div>
            {plan.isPopular && (
              <Star className="h-5 w-5 fill-amber-400 text-amber-400 flex-shrink-0" />
            )}
          </div>
          
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Badge variant={plan.isActive ? 'success' : 'default'} className="text-xs">
              {plan.isActive ? 'Aktif' : 'Nonaktif'}
            </Badge>
            {plan.isPopular && (
              <Badge variant="warning" className="text-xs">
                Populer
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
              {formatCurrency(plan.price)}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              per {billingCycleLabels[plan.billingCycle] || plan.billingCycle}
            </p>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-2 mb-3">
          {plan.description}
        </p>
        
        {/* Features Count */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-slate-700/50">
          <div className="w-6 h-6 rounded bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <Hash className="h-3 w-3 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm text-gray-600 dark:text-slate-400">
            {plan.features?.length || 0} fitur
          </span>
        </div>

        {/* Order & Date */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400 dark:text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Urutan: {plan.order}</span>
          </div>
          <span>{formatDate(plan.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 px-4 py-3 bg-gray-50/50 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-700/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(plan)}
          className="h-8 px-3 text-sm text-gray-600 dark:text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        >
          <Edit className="h-3.5 w-3.5 mr-1.5" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(plan)}
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
function PricingMobileSkeleton({ index }: { index: number }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-600 overflow-hidden animate-pulse">
      <div className="p-4 flex items-start gap-3 border-b border-gray-100 dark:border-slate-700/50">
        <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-slate-700 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="h-5 w-5 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="h-3 w-20 bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="flex gap-1.5">
            <div className="h-5 w-12 bg-gray-200 dark:bg-slate-700 rounded-full" />
            <div className="h-5 w-16 bg-gray-200 dark:bg-slate-700 rounded-full" />
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gray-200 dark:bg-slate-700 rounded-lg" />
          <div className="space-y-1">
            <div className="h-5 w-28 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="h-3 w-20 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
        <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-4 w-4/5 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-slate-700/50">
          <div className="h-6 w-6 bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100 dark:border-slate-700/50">
        <div className="h-8 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-8 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
  )
}

export default function PricingPage() {
  const { data: plansData, isLoading: loading } = usePricingPlans()
  const createMutation = useCreatePricingPlan()
  const updateMutation = useUpdatePricingPlan()
  const deleteMutation = useDeletePricingPlan()
  
  const plans = plansData || []
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
    if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi'
    if (!formData.slug.trim()) newErrors.slug = 'Slug wajib diisi'
    if (!formData.price.trim()) newErrors.price = 'Harga wajib diisi'
    if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'Harga harus berupa angka valid'
    }
    if (!formData.description.trim()) newErrors.description = 'Deskripsi wajib diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validateForm()) return
    
    setSaving(true)
    try {
      const data = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: Number(formData.price),
        billingCycle: formData.billingCycle,
        features: formData.features.split('\n').filter(f => f.trim()),
        isPopular: formData.isPopular,
        isActive: formData.isActive,
        order: formData.order,
      }

      if (isEditing && selectedItem) {
        await updateMutation.mutateAsync({ id: selectedItem.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      setIsModalOpen(false)
    } catch (error) {
      // Toast error handled by mutation hook
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!selectedItem) return
    
    setDeleting(true)
    try {
      await deleteMutation.mutateAsync(selectedItem.id)
      setIsDeleteModalOpen(false)
    } catch (error) {
      // Toast error handled by mutation hook
    } finally {
      setDeleting(false)
    }
  }

  const filteredPlans = React.useMemo(() => {
    if (!search) return plans
    const term = search.toLowerCase()
    return plans.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term) ||
      p.slug.toLowerCase().includes(term)
    )
  }, [plans, search])

  const columns = [
    {
      key: 'name',
      label: 'Paket',
      render: (value: string, row: PricingPlan) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <Tag className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Harga',
      render: (value: number, row: PricingPlan) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(value)}</p>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            /{billingCycleLabels[row.billingCycle] || row.billingCycle}
          </p>
        </div>
      ),
    },
    {
      key: 'billingCycle',
      label: 'Siklus',
      render: (value: string) => (
        <Badge variant="outline">
          {billingCycleLabels[value] || value}
        </Badge>
      ),
    },
    {
      key: 'features',
      label: 'Fitur',
      render: (value: string[]) => (
        <span className="text-sm text-gray-600 dark:text-slate-400">
          {value?.length || 0} fitur
        </span>
      ),
    },
    {
      key: 'isPopular',
      label: 'Status',
      render: (value: boolean, row: PricingPlan) => (
        <div className="flex flex-wrap gap-1">
          {value && (
            <Badge variant="warning" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              Populer
            </Badge>
          )}
          <Badge variant={row.isActive ? 'success' : 'default'} className="text-xs">
            {row.isActive ? 'Aktif' : 'Nonaktif'}
          </Badge>
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

  // Custom renderCard untuk mobile
  const renderCard = (row: PricingPlan) => (
    <PricingMobileCard
      plan={row}
      onEdit={openEditModal}
      onDelete={openDeleteModal}
    />
  )

  // Custom skeletonCard untuk mobile
  const skeletonCard = (i: number) => (
    <PricingMobileSkeleton key={i} index={i} />
  )

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Harga' }]} />

      <div className="w-full px-3 sm:px-6 py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-start justify-between gap-4"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Paket Harga</h1>
              <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700 gap-2 h-8 text-xs px-3 flex-shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1 truncate">Kelola paket harga dan layanan</p>
          </div>
          <div className="flex-shrink-0">
            <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-slate-600">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Total: </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{plans.length}</span>
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
              placeholder="Cari paket harga..."
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
            data={filteredPlans}
            loading={loading}
            renderCard={renderCard}
            skeletonCard={skeletonCard}
            emptyState={
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-gray-100 dark:bg-slate-800 p-4">
                  <Tag className="h-8 w-8 text-gray-400 dark:text-slate-500" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {search ? 'Tidak ada paket ditemukan' : 'Belum ada paket harga'}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  {search ? 'Coba kata kunci lain' : 'Klik tombol Tambah untuk membuat paket pertama'}
                </p>
              </div>
            }
          />
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
