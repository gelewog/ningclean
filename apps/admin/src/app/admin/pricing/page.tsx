'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, DollarSign, Calendar, Check, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/admin/Modal'
import { DataTable } from '@/components/admin/DataTable'
import { getPricingPlans, createPricingPlan, updatePricingPlan, deletePricingPlan } from '@/lib/api'
import { PricingPlan } from '@/types'
import { formatDate } from '@/lib/utils'
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

const billingCycles = ['monthly', 'yearly', 'one-time']

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
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

  function handleNameChange(name: string) {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return

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
    }
  }

  async function handleDelete() {
    if (!selectedItem) return
    try {
      await deletePricingPlan(selectedItem.id)
      toast.success('Pricing plan deleted successfully')
      setIsDeleteModalOpen(false)
      fetchItems()
    } catch (error) {
      toast.error('Failed to delete pricing plan')
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

  const columns = [
    {
      key: 'name',
      label: 'Plan',
      render: (value: string, row: PricingPlan) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900">{value}</p>
              {row.isPopular && (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              )}
            </div>
            <p className="text-xs text-gray-500">{row.billingCycle}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (value: number) => (
        <span className="font-semibold text-gray-900">
          Rp {value.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'features',
      label: 'Features',
      render: (value: string[]) => (
        <span className="text-sm text-gray-500">
          {value?.length || 0} features
        </span>
      ),
    },
    {
      key: 'order',
      label: 'Order',
      render: (value: number) => <span className="text-sm">{value}</span>,
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
      render: (_: any, row: PricingPlan) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Pricing Plans</h1>
          <p className="text-gray-500">Manage pricing tiers and plans</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          New Pricing Plan
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
        title={isEditing ? 'Edit Pricing Plan' : 'Create New Pricing Plan'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Plan Name"
              placeholder="e.g., Premium"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              error={errors.name}
            />
            <Input
              label="Slug"
              placeholder="e.g., premium"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              error={errors.slug}
            />
          </div>

          <Textarea
            label="Description"
            placeholder="Enter plan description..."
            className="min-h-[80px]"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={errors.description}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Price (IDR)"
              type="number"
              placeholder="e.g., 299000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              error={errors.price}
              icon={<DollarSign className="h-4 w-4" />}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Billing Cycle</label>
              <select
                value={formData.billingCycle}
                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {billingCycles.map(cycle => (
                  <option key={cycle} value={cycle}>{cycle}</option>
                ))}
              </select>
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
            label="Features (one per line)"
            placeholder="e.g., Full house cleaning&#10;Weekend availability&#10;Priority support"
            className="min-h-[100px]"
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
          />

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary"
              />
              <span className="text-sm">Mark as popular/recommended</span>
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
        title="Delete Pricing Plan"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedItem?.name}</strong>? This action cannot be undone.
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
