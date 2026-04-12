'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, HelpCircle, Calendar, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/admin/Modal'
import { DataTable } from '@/components/admin/DataTable'
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '@/lib/api'
import { FAQ } from '@/types'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface FAQFormData {
  question: string
  answer: string
  category: string
  order: number
  isActive: boolean
}

const categories = ['General', 'Services', 'Pricing', 'Booking', 'Technical', 'Other']

export default function FAQPage() {
  const [items, setItems] = React.useState<FAQ[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<FAQ | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<FAQFormData>({
    question: '',
    answer: '',
    category: 'General',
    order: 0,
    isActive: true,
  })
  const [errors, setErrors] = React.useState<Partial<FAQFormData>>({})

  React.useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    setLoading(true)
    try {
      const data = await getFAQs()
      setItems(data)
    } catch (error) {
      toast.error('Failed to fetch FAQs')
    } finally {
      setLoading(false)
    }
  }

  function openCreateModal() {
    setIsEditing(false)
    setSelectedItem(null)
    setFormData({
      question: '',
      answer: '',
      category: 'General',
      order: 0,
      isActive: true,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openEditModal(item: FAQ) {
    setIsEditing(true)
    setSelectedItem(item)
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category,
      order: item.order,
      isActive: item.isActive,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openDeleteModal(item: FAQ) {
    setSelectedItem(item)
    setIsDeleteModalOpen(true)
  }

  function validateForm(): boolean {
    const newErrors: Partial<FAQFormData> = {}
    if (!formData.question.trim()) newErrors.question = 'Question is required'
    if (!formData.answer.trim()) newErrors.answer = 'Answer is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return

    const itemData = {
      question: formData.question,
      answer: formData.answer,
      category: formData.category,
      order: formData.order,
      isActive: formData.isActive,
    }

    try {
      if (isEditing && selectedItem) {
        await updateFAQ(selectedItem.id, itemData)
        toast.success('FAQ updated successfully')
      } else {
        await createFAQ(itemData)
        toast.success('FAQ created successfully')
      }
      setIsModalOpen(false)
      fetchItems()
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} FAQ`)
    }
  }

  async function handleDelete() {
    if (!selectedItem) return
    try {
      await deleteFAQ(selectedItem.id)
      toast.success('FAQ deleted successfully')
      setIsDeleteModalOpen(false)
      fetchItems()
    } catch (error) {
      toast.error('Failed to delete FAQ')
    }
  }

  const columns = [
    {
      key: 'question',
      label: 'Question',
      render: (value: string) => (
        <div className="max-w-md">
          <p className="font-medium text-gray-900">{value}</p>
        </div>
      ),
    },
    {
      key: 'answer',
      label: 'Answer',
      render: (value: string) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-500 truncate">{value}</p>
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
      render: (_: any, row: FAQ) => (
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
          <span className="text-gray-700">FAQ</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-gray-500">Live</span>
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
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">FAQ</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage frequently asked questions</p>
          </div>
          <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            New FAQ
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit FAQ' : 'Create New FAQ'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Question"
            placeholder="Enter the question"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            error={errors.question}
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
            label="Answer"
            placeholder="Enter the answer..."
            className="min-h-[120px]"
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            error={errors.answer}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary"
            />
            <span className="text-sm">Active</span>
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
        title="Delete FAQ"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this FAQ? This action cannot be undone.
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
