'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Briefcase, Calendar, MapPin, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/admin/Modal'
import { DataTable } from '@/components/admin/DataTable'
import { getJobListings, createJobListing, updateJobListing, deleteJobListing } from '@/lib/api'
import { JobListing } from '@/types'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

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

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return

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
    }
  }

  async function handleDelete() {
    if (!selectedItem) return
    try {
      await deleteJobListing(selectedItem.id)
      toast.success('Job listing deleted successfully')
      setIsDeleteModalOpen(false)
      fetchItems()
    } catch (error) {
      toast.error('Failed to delete job listing')
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Position',
      render: (value: string, row: JobListing) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">{row.department}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (value: string) => (
        <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5" /> {value}
        </span>
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
        <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
          {value ? <><DollarSign className="h-3.5 w-3.5" /> {value}</> : '-'}
        </span>
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
      label: 'Actions',
      render: (_: any, row: JobListing) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEditModal(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => openDeleteModal(row)}>
            <Trash2 className="h-4 w-4 text-error" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
      {/* Topbar */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-700 px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
          <span>NingClean Admin</span>
          <span>/</span>
          <span className="text-gray-700 dark:text-slate-200">Careers</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-gray-500 dark:text-slate-400">Live</span>
          </div>
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
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Careers</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Manage job listings and openings</p>
          </div>
          <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            New Job Listing
          </Button>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="bg-white border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm dark:shadow-slate-900/50">
            <DataTable
              columns={columns}
              data={items}
              loading={loading}
            />
          </div>
        </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Job Listing' : 'Create New Job Listing'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Job Title"
            placeholder="e.g., Cleaning Supervisor"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Department"
              placeholder="e.g., Operations"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              error={errors.department}
            />
            <Input
              label="Location"
              placeholder="e.g., Surabaya"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={errors.location}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-200">Job Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.type && <p className="text-sm text-error">{errors.type}</p>}
            </div>
          </div>

          <Textarea
            label="Job Description"
            placeholder="Enter detailed job description..."
            className="min-h-[100px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 dark:focus:ring-emerald-400/30"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={errors.description}
          />

          <Textarea
            label="Requirements (one per line)"
            placeholder="e.g., Minimum 2 years experience&#10;Familiar with cleaning equipment&#10;Good communication skills"
            className="min-h-[80px] bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-400"
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
          />

          <Textarea
            label="Benefits (one per line)"
            placeholder="e.g., Competitive salary&#10;Health insurance&#10;Professional development"
            className="min-h-[80px] bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-400"
            value={formData.benefits}
            onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
          />

          <Input
            label="Salary Range (optional)"
            placeholder="e.g., Rp 5.000.000 - 8.000.000"
            value={formData.salaryRange}
            onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
            icon={<DollarSign className="h-4 w-4" />}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-primary"
            />
            <span className="text-sm">Active (visible to applicants)</span>
          </label>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Job Listing"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-slate-300">
            Are you sure you want to delete <strong>{selectedItem?.title}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="error" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      </div>
    </div>
  )
}
