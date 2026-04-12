'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Star, Image as ImageIcon, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/admin/Modal'
import { DataTable } from '@/components/admin/DataTable'
import { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '@/lib/api'
import { GalleryItem } from '@/types'
import { formatDate, truncate } from '@/lib/utils'
import { toast } from 'sonner'

interface GalleryFormData {
  title: string
  description: string
  category: string
  imageUrl: string
  location: string
  isFeatured: boolean
  isActive: boolean
  order: number
}

const categories = ['Residential', 'Commercial', 'Deep Cleaning', 'Post Construction', 'Move In/Out', 'Regular']

export default function GalleryPage() {
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
    location: '',
    isFeatured: false,
    isActive: true,
    order: 0,
  })
  const [errors, setErrors] = React.useState<Partial<GalleryFormData>>({})

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
      imageUrl: item.imageUrl,
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
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return

    const itemData = {
      title: formData.title,
      description: formData.description || undefined,
      category: formData.category,
      imageUrl: formData.imageUrl,
      location: formData.location || undefined,
      isFeatured: formData.isFeatured,
      isActive: formData.isActive,
      order: formData.order,
    }

    try {
      if (isEditing && selectedItem) {
        await updateGalleryItem(selectedItem.id, itemData)
        toast.success('Gallery item updated successfully')
      } else {
        await createGalleryItem(itemData)
        toast.success('Gallery item created successfully')
      }
      setIsModalOpen(false)
      fetchItems()
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} gallery item`)
    }
  }

  async function handleDelete() {
    if (!selectedItem) return
    try {
      await deleteGalleryItem(selectedItem.id)
      toast.success('Gallery item deleted successfully')
      setIsDeleteModalOpen(false)
      fetchItems()
    } catch (error) {
      toast.error('Failed to delete gallery item')
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
            src={row.imageUrl}
            alt=""
            className="h-14 w-14 rounded-lg object-cover"
          />
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            {row.location && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
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
      key: 'order',
      label: 'Order',
      render: (value: number) => <span className="text-sm">{value}</span>,
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
      render: (_: any, row: GalleryItem) => (
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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Topbar */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>NingClean Admin</span>
          <span>/</span>
          <span className="text-gray-700">Gallery</span>
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
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Gallery</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage gallery items and portfolio</p>
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            New Gallery Item
          </Button>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <DataTable
              columns={columns}
              data={items}
              loading={loading}
            />
          </div>
        </motion.div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Gallery Item' : 'Create New Gallery Item'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            placeholder="Enter gallery item title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-sm text-error">{errors.category}</p>}
            </div>
            <Input
              label="Display Order"
              type="number"
              placeholder="0"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
            />
          </div>

          <Textarea
            label="Description (optional)"
            placeholder="Enter description..."
            className="min-h-[80px]"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Input
            label="Image URL"
            placeholder="https://images.unsplash.com/..."
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            error={errors.imageUrl}
            icon={<ImageIcon className="h-4 w-4" />}
          />

          <Input
            label="Location (optional)"
            placeholder="e.g., Surabaya, East Java"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            icon={<MapPin className="h-4 w-4" />}
          />

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary"
              />
              <span className="text-sm">Featured item</span>
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
        title="Delete Gallery Item"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
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
  )
}