'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, MapPin, Calendar, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/admin/Modal'
import { DataTable } from '@/components/admin/DataTable'
import { getServiceAreas, createServiceArea, updateServiceArea, deleteServiceArea } from '@/lib/api'
import { ServiceArea } from '@/types'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface AreaFormData {
  city: string
  slug: string
  region: string
  description: string
  coverage: string
  isActive: boolean
  isFeatured: boolean
}

function generateSlug(city: string): string {
  return city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
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
    region: '',
    description: '',
    coverage: '',
    isActive: true,
    isFeatured: false,
  })
  const [errors, setErrors] = React.useState<Partial<AreaFormData>>({})

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
      region: '',
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

  function handleCityChange(city: string) {
    setFormData(prev => ({
      ...prev,
      city,
      slug: generateSlug(city),
    }))
  }

  function validateForm(): boolean {
    const newErrors: Partial<AreaFormData> = {}
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required'
    if (!formData.region.trim()) newErrors.region = 'Region is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return

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
    }
  }

  async function handleDelete() {
    if (!selectedItem) return
    try {
      await deleteServiceArea(selectedItem.id)
      toast.success('Service area deleted successfully')
      setIsDeleteModalOpen(false)
      fetchItems()
    } catch (error) {
      toast.error('Failed to delete service area')
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

  const columns = [
    {
      key: 'city',
      label: 'Area',
      render: (value: string, row: ServiceArea) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{row.region}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'slug',
      label: 'Slug',
      render: (value: string) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{value}</code>
      ),
    },
    {
      key: 'coverage',
      label: 'Coverage Areas',
      render: (value: string[]) => (
        <span className="text-sm text-gray-500">
          {value?.length || 0} areas
        </span>
      ),
    },
    {
      key: 'isFeatured',
      label: 'Featured',
      render: (value: boolean, row: ServiceArea) => (
        <button onClick={() => handleToggleFeatured(row)}>
          <Star className={`h-5 w-5 ${value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
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
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(value)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: ServiceArea) => (
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
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Areas</h1>
          <p className="text-gray-500">Manage service coverage areas</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          New Service Area
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={items}
              loading={loading}
            />
          </CardContent>
        </Card>
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Service Area' : 'Create New Service Area'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              placeholder="e.g., Surabaya"
              value={formData.city}
              onChange={(e) => handleCityChange(e.target.value)}
              error={errors.city}
            />
            <Input
              label="Slug"
              placeholder="e.g., surabaya"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              error={errors.slug}
            />
          </div>

          <Input
            label="Region/Province"
            placeholder="e.g., East Java"
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            error={errors.region}
          />

          <Textarea
            label="Description (optional)"
            placeholder="Enter description..."
            className="min-h-[80px]"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Input
            label="Coverage Areas (Kelurahan)"
            placeholder="e.g., Gubeng, Tegalsari, Rungkut (comma separated)"
            value={formData.coverage}
            onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
          />

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary"
              />
              <span className="text-sm">Featured area</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary"
              />
              <span className="text-sm">Active</span>
            </label>
          </div>

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
        title="Delete Service Area"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedItem?.city}</strong>? This action cannot be undone.
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
  )
}
