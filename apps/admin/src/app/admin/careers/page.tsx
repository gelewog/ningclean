'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit, Trash2, Briefcase, Calendar, MapPin, DollarSign, X, 
  AlertCircle, Building2, Search, Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/admin/DataTable'
import { getJobListings, createJobListing, updateJobListing, deleteJobListing } from '@/lib/api'
import { JobListing } from '@/types'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { Breadcrumb } from '@/components/admin/Breadcrumb'

interface JobFormData {
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string
  benefits: string
  salaryRange: string
  isActive: boolean
}

const jobTypes = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Freelance', label: 'Freelance' }
]

// Modern Modal Component for Job Form
function JobFormModal({
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
  formData: JobFormData
  setFormData: (data: JobFormData) => void
  errors: Partial<JobFormData>
  setErrors: (errors: Partial<JobFormData>) => void
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
      
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="pointer-events-auto w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-900/20 dark:to-transparent flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit Job Listing' : 'Create Job Listing'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {isEditing ? 'Perbarui lowongan kerja' : 'Buat lowongan kerja baru'}
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
              {/* Job Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value })
                      setErrors({ ...errors, title: '' })
                    }}
                    placeholder="e.g., Cleaning Supervisor"
                    className={`pl-10 ${errors.title ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                </div>
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>

              {/* Department, Location, Type */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.department}
                      onChange={(e) => {
                        setFormData({ ...formData, department: e.target.value })
                        setErrors({ ...errors, department: '' })
                      }}
                      placeholder="e.g., Operations"
                      className={`pl-10 ${errors.department ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.location}
                      onChange={(e) => {
                        setFormData({ ...formData, location: e.target.value })
                        setErrors({ ...errors, location: '' })
                      }}
                      placeholder="e.g., Surabaya"
                      className={`pl-10 ${errors.location ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      setFormData({ ...formData, type: e.target.value })
                      setErrors({ ...errors, type: '' })
                    }}
                    className={`w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 ${
                      errors.type ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                    }`}
                  >
                    {jobTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value })
                    setErrors({ ...errors, description: '' })
                  }}
                  placeholder="Enter detailed job description..."
                  rows={4}
                  className={`w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500 ${errors.description ? 'border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400'}`}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Requirements (one per line)
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="Minimum 2 years experience&#10;Familiar with cleaning equipment&#10;Good communication skills"
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-sm text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
                />
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  Masukkan setiap persyaratan di baris baru
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Benefits (one per line)
                </label>
                <textarea
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  placeholder="Competitive salary&#10;Health insurance&#10;Professional development"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-sm text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Salary Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  Salary Range
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={formData.salaryRange}
                    onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                    placeholder="e.g., Rp 5.000.000 - 8.000.000"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-400 dark:text-slate-500">
                    Opsional, akan ditampilkan di halaman karir
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
                    <p className="text-xs text-gray-500 dark:text-slate-400">Lowongan tersedia untuk pelamar</p>
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
                  {isEditing ? 'Simpan Perubahan' : 'Buat Lowongan'}
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
function JobDeleteModal({
  isOpen,
  onClose,
  item,
  onConfirm,
  deleting,
}: {
  isOpen: boolean
  onClose: () => void
  item: JobListing | null
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
      
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="pointer-events-auto w-full h-full sm:h-auto sm:max-w-md bg-white dark:bg-slate-900 sm:rounded-2xl shadow-2xl border-0 sm:border border-gray-200 dark:border-slate-700 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hapus Lowongan</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{item.department} • {item.location}</p>
                  <Badge variant="outline" className="mt-1">{item.type}</Badge>
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

export default function CareersPage() {
  const [items, setItems] = React.useState<JobListing[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<JobListing | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<JobFormData>({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    benefits: '',
    salaryRange: '',
    isActive: true,
  })
  const [errors, setErrors] = React.useState<Partial<JobFormData>>({})
  const [saving, setSaving] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    setLoading(true)
    try {
      const data = await getJobListings()
      setItems(data)
    } catch (error) {
      toast.error('Failed to fetch job listings')
    } finally {
      setLoading(false)
    }
  }

  function openCreateModal() {
    setIsEditing(false)
    setSelectedItem(null)
    setFormData({
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      description: '',
      requirements: '',
      benefits: '',
      salaryRange: '',
      isActive: true,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openEditModal(item: JobListing) {
    setIsEditing(true)
    setSelectedItem(item)
    setFormData({
      title: item.title,
      department: item.department,
      location: item.location,
      type: item.type,
      description: item.description,
      requirements: item.requirements?.join('\n') || '',
      benefits: item.benefits?.join('\n') || '',
      salaryRange: item.salaryRange || '',
      isActive: item.isActive,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openDeleteModal(item: JobListing) {
    setSelectedItem(item)
    setIsDeleteModalOpen(true)
  }

  function validateForm(): boolean {
    const newErrors: Partial<JobFormData> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.department.trim()) newErrors.department = 'Department is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.type.trim()) newErrors.type = 'Job type is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validateForm()) return

    setSaving(true)
    const requirementsArray = formData.requirements
      ? formData.requirements.split('\n').map(r => r.trim()).filter(Boolean)
      : []
    const benefitsArray = formData.benefits
      ? formData.benefits.split('\n').map(b => b.trim()).filter(Boolean)
      : []

    const itemData = {
      title: formData.title,
      department: formData.department,
      location: formData.location,
      type: formData.type,
      description: formData.description,
      requirements: requirementsArray,
      benefits: benefitsArray,
      salaryRange: formData.salaryRange || undefined,
      isActive: formData.isActive,
    }

    try {
      if (isEditing && selectedItem) {
        await updateJobListing(selectedItem.id, itemData)
        toast.success('Job listing updated successfully')
      } else {
        await createJobListing(itemData)
        toast.success('Job listing created successfully')
      }
      setIsModalOpen(false)
      fetchItems()
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} job listing`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!selectedItem) return
    setDeleting(true)
    try {
      await deleteJobListing(selectedItem.id)
      toast.success('Job listing deleted successfully')
      setIsDeleteModalOpen(false)
      fetchItems()
    } catch (error) {
      toast.error('Failed to delete job listing')
    } finally {
      setDeleting(false)
    }
  }

  const filteredItems = React.useMemo(() => {
    if (!search) return items
    const term = search.toLowerCase()
    return items.filter(item => 
      item.title.toLowerCase().includes(term) || 
      item.department.toLowerCase().includes(term) ||
      item.location.toLowerCase().includes(term)
    )
  }, [items, search])

  const columns = [
    {
      key: 'title',
      label: 'Position',
      render: (value: string, row: JobListing) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">{row.department}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <MapPin className="h-3 w-3 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm text-gray-700 dark:text-slate-300">{value}</span>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      key: 'salaryRange',
      label: 'Salary',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
            <DollarSign className="h-3 w-3 text-green-600 dark:text-green-400" />
          </div>
          <span className="text-sm text-gray-700 dark:text-slate-300">
            {value || '-'}
          </span>
        </div>
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
      label: 'Posted',
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
      render: (_: any, row: JobListing) => (
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
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Careers' }]} />

      <div className="w-full px-3 sm:px-6 py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-start justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Careers</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">Manage job listings and openings</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Total: </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{items.length}</span>
            </div>
            <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <Plus className="h-4 w-4" />
              New Job
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
              placeholder="Search job listings..."
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
          <div className="sm:bg-white sm:dark:bg-slate-900 sm:border sm:border-gray-200 dark:sm:border-slate-700 sm:rounded-2xl overflow-hidden shadow-sm">
            <DataTable
              columns={columns}
              data={filteredItems}
              loading={loading}
              emptyState={
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 rounded-full bg-gray-100 dark:bg-slate-800 p-4">
                    <Users className="h-8 w-8 text-gray-400 dark:text-slate-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {search ? 'No jobs found' : 'No job listings yet'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    {search ? 'Try different keywords' : 'Click the button above to add your first job listing'}
                  </p>
                </div>
              }
              renderCard={(row: JobListing) => (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 p-3 cursor-pointer active:scale-[0.99]">
                  {/* Header - Icon & Title */}
                  <div className="flex items-start gap-3 pb-2 border-b border-gray-100 dark:border-slate-700/50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 flex-shrink-0">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{row.title}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{row.department}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEditModal(row); }}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-700/50 transition-all flex-shrink-0"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 py-2">
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-2.5 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-500 dark:text-slate-400">Lokasi</p>
                        <p className="text-xs font-medium text-gray-700 dark:text-slate-300 truncate">{row.location}</p>
                      </div>
                    </div>

                    <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-xl p-2.5 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                          {row.type?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 dark:text-slate-400">Tipe</p>
                        <p className="text-xs font-medium text-gray-700 dark:text-slate-300">{row.type}</p>
                      </div>
                    </div>
                  </div>

                  {/* Applicants & Expiry */}
                  <div className="grid grid-cols-2 gap-2 pb-2">
                    <div className="bg-sky-50/50 dark:bg-sky-900/10 rounded-xl p-2.5 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                        <Users className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 dark:text-slate-400">Pelamar</p>
                        <p className="text-xs font-medium text-sky-600 dark:text-sky-400">{row.applicantCount || 0}</p>
                      </div>
                    </div>

                    <div className="bg-rose-50/50 dark:bg-rose-900/10 rounded-xl p-2.5 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-500 dark:text-slate-400">Deadline</p>
                        <p className="text-xs font-medium text-rose-600 dark:text-rose-400 truncate">
                          {row.expiresAt ? formatDate(row.expiresAt) : '—'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer - Status & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700/50">
                    <Badge variant={row.isActive ? 'success' : 'default'} className="text-[10px]">
                      {row.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); openEditModal(row); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); openDeleteModal(row); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              skeletonCard={(i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 animate-pulse shadow-sm"
                >
                  {/* Header - Icon & Title */}
                  <div className="flex items-start gap-3 pb-2 border-b border-gray-100 dark:border-slate-700/50">
                    <div className="skeleton h-12 w-12 rounded-xl flex-shrink-0 dark:bg-slate-700" />
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="skeleton h-4 w-28 rounded dark:bg-slate-700 mb-2" />
                      <div className="skeleton h-3 w-full max-w-[120px] rounded dark:bg-slate-700" />
                    </div>
                    <div className="skeleton h-8 w-8 rounded-lg flex-shrink-0 dark:bg-slate-700" />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 py-2">
                    <div className="bg-blue-50/50 dark:bg-slate-800/50 rounded-xl p-2.5 flex items-center gap-2">
                      <div className="skeleton h-8 w-8 rounded-lg flex-shrink-0 dark:bg-slate-700" />
                      <div className="flex-1 min-w-0">
                        <div className="skeleton h-2.5 w-10 rounded dark:bg-slate-700 mb-1.5" />
                        <div className="skeleton h-3.5 w-16 rounded dark:bg-slate-700" />
                      </div>
                    </div>
                    <div className="bg-amber-50/50 dark:bg-slate-800/50 rounded-xl p-2.5 flex items-center gap-2">
                      <div className="skeleton h-8 w-8 rounded-lg flex-shrink-0 dark:bg-slate-700" />
                      <div className="flex-1 min-w-0">
                        <div className="skeleton h-2.5 w-8 rounded dark:bg-slate-700 mb-1.5" />
                        <div className="skeleton h-3.5 w-12 rounded dark:bg-slate-700" />
                      </div>
                    </div>
                  </div>

                  {/* Applicants & Expiry */}
                  <div className="grid grid-cols-2 gap-2 pb-2">
                    <div className="bg-sky-50/50 dark:bg-slate-800/50 rounded-xl p-2.5 flex items-center gap-2">
                      <div className="skeleton h-8 w-8 rounded-lg flex-shrink-0 dark:bg-slate-700" />
                      <div className="flex-1 min-w-0">
                        <div className="skeleton h-2.5 w-12 rounded dark:bg-slate-700 mb-1.5" />
                        <div className="skeleton h-3.5 w-6 rounded dark:bg-slate-700" />
                      </div>
                    </div>
                    <div className="bg-rose-50/50 dark:bg-slate-800/50 rounded-xl p-2.5 flex items-center gap-2">
                      <div className="skeleton h-8 w-8 rounded-lg flex-shrink-0 dark:bg-slate-700" />
                      <div className="flex-1 min-w-0">
                        <div className="skeleton h-2.5 w-12 rounded dark:bg-slate-700 mb-1.5" />
                        <div className="skeleton h-3.5 w-14 rounded dark:bg-slate-700" />
                      </div>
                    </div>
                  </div>

                  {/* Footer - Status & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700/50">
                    <div className="skeleton h-5 w-14 rounded-full dark:bg-slate-700" />
                    <div className="flex items-center gap-1">
                      <div className="skeleton h-7 w-7 rounded-lg dark:bg-slate-700" />
                      <div className="skeleton h-7 w-7 rounded-lg dark:bg-slate-700" />
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </motion.div>
      </div>

      {/* Form Modal */}
      <JobFormModal
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
      <JobDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        item={selectedItem}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </div>
  )
}
