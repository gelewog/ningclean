'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, TrendingUp, Calendar, Activity } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/admin/Modal'
import { DataTable } from '@/components/admin/DataTable'
import { CompanyStat } from '@/types'
import { Breadcrumb } from '@/components/admin/Breadcrumb'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import {
  useCompanyStats,
  useCreateCompanyStat,
  useUpdateCompanyStat,
  useDeleteCompanyStat,
} from '@/lib/use-queries'

interface CompanyStatFormData {
  title: string
  value: string
  description: string
  icon: string
  order: number
  isActive: boolean
}

const iconOptions = [
  { value: 'Calendar', label: 'Calendar' },
  { value: 'Users', label: 'Users' },
  { value: 'UserCheck', label: 'User Check' },
  { value: 'CheckCircle', label: 'Check Circle' },
  { value: 'TrendingUp', label: 'Trending Up' },
  { value: 'Award', label: 'Award' },
  { value: 'Star', label: 'Star' },
  { value: 'Heart', label: 'Heart' },
  { value: 'Zap', label: 'Zap' },
  { value: 'Shield', label: 'Shield' },
  { value: 'Clock', label: 'Clock' },
  { value: 'MapPin', label: 'Map Pin' },
]

export default function CompanyStatsPage() {
  const { data: stats = [], isLoading, error } = useCompanyStats()
  const { mutate: createStat, isPending: isCreating } = useCreateCompanyStat()
  const { mutate: updateStat, isPending: isUpdating } = useUpdateCompanyStat()
  const { mutate: deleteStat, isPending: isDeleting } = useDeleteCompanyStat()

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedStat, setSelectedStat] = React.useState<CompanyStat | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<CompanyStatFormData>({
    title: '',
    value: '',
    description: '',
    icon: 'TrendingUp',
    order: 0,
    isActive: true,
  })
  const [errors, setErrors] = React.useState<Partial<CompanyStatFormData>>({})

  // Show error toast if query fails
  React.useEffect(() => {
    if (error) {
      toast.error('Failed to fetch company stats')
    }
  }, [error])

  function openCreateModal() {
    setIsEditing(false)
    setSelectedStat(null)
    setFormData({
      title: '',
      value: '',
      description: '',
      icon: 'TrendingUp',
      order: stats.length,
      isActive: true,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openEditModal(stat: CompanyStat) {
    setIsEditing(true)
    setSelectedStat(stat)
    setFormData({
      title: stat.title,
      value: stat.value,
      description: stat.description || '',
      icon: stat.icon || 'TrendingUp',
      order: stat.order,
      isActive: stat.isActive,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openDeleteModal(stat: CompanyStat) {
    setSelectedStat(stat)
    setIsDeleteModalOpen(true)
  }

  function validateForm(): boolean {
    const newErrors: Partial<CompanyStatFormData> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.value.trim()) newErrors.value = 'Value is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return

    const statData = {
      title: formData.title,
      value: formData.value,
      description: formData.description || undefined,
      icon: formData.icon,
      order: formData.order,
      isActive: formData.isActive,
    }

    if (isEditing && selectedStat) {
      updateStat(
        { id: selectedStat.id, data: statData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
          },
          onError: () => {
            toast.error('Failed to update company stat')
          },
        }
      )
    } else {
      createStat(statData, {
        onSuccess: () => {
          setIsModalOpen(false)
        },
        onError: () => {
          toast.error('Failed to create company stat')
        },
      })
    }
  }

  async function handleDelete() {
    if (!selectedStat) return
    deleteStat(selectedStat.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false)
      },
      onError: () => {
        toast.error('Failed to delete company stat')
      },
    })
  }

  const columns = [
    {
      key: 'title',
      label: 'Stat',
      render: (value: string, row: CompanyStat) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            {row.description && (
              <p className="text-xs text-gray-500 dark:text-slate-400">{row.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'value',
      label: 'Value',
      render: (value: string) => (
        <span className="text-2xl font-bold text-emerald-600">{value}</span>
      ),
    },
    {
      key: 'icon',
      label: 'Icon',
      render: (value: string) => (
        <Badge variant="info" className="font-mono text-xs">
          {value || 'TrendingUp'}
        </Badge>
      ),
    },
    {
      key: 'order',
      label: 'Order',
      render: (value: number) => (
        <span className="text-sm text-gray-600 dark:text-slate-300">{value}</span>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean) => (
        <Badge
          variant={value ? 'default' : 'info'}
          className={value ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''}
        >
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
      render: (_: any, row: CompanyStat) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEditModal(row)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openDeleteModal(row)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const loading = isLoading || isCreating || isUpdating || isDeleting

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Company Stats' }]} />

      <div className="w-full px-3 sm:px-6 py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Company Stats</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              Manage company statistics displayed on the website
            </p>
          </div>
          <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            New Stat
          </Button>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-2">Total Stats</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-2">Active</p>
              <p className="text-3xl font-bold text-emerald-600">
                {stats.filter((s) => s.isActive).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-2">Inactive</p>
              <p className="text-3xl font-bold text-gray-600 dark:text-slate-300">
                {stats.filter((s) => !s.isActive).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-2">Featured</p>
              <p className="text-3xl font-bold text-amber-600">
                {stats.filter((s) => s.order <= 4).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
            <CardContent className="p-0">
              <DataTable columns={columns} data={stats} loading={loading} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Company Stat' : 'New Company Stat'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Title *</label>
              <Input
                placeholder="e.g., Years Experience"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Value *</label>
              <Input
                placeholder="e.g., 10+"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              />
              {errors.value && (
                <p className="text-xs text-red-500">{errors.value}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Description (optional)</label>
            <Textarea
              placeholder="Brief description of this stat"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Icon</label>
              <select
                className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Display Order</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Active
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isCreating || isUpdating}>
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Company Stat"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-slate-300">
            Are you sure you want to delete{' '}
            <strong>{selectedStat?.title}</strong>?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="error" onClick={handleDelete} disabled={isDeleting}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
