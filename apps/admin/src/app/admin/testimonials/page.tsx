'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Star, Image as ImageIcon, Calendar, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/admin/Modal'
import { DataTable } from '@/components/admin/DataTable'
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/api'
import { Testimonial } from '@/types'
import { formatDate, truncate } from '@/lib/utils'
import { toast } from 'sonner'

interface TestimonialFormData {
  name: string
  content: string
  rating: string
  image: string
  isActive: boolean
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = React.useState<Testimonial | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<TestimonialFormData>({
    name: '',
    content: '',
    rating: '5',
    image: '',
    isActive: true,
  })
  const [errors, setErrors] = React.useState<Partial<TestimonialFormData>>({})

  React.useEffect(() => {
    fetchTestimonials()
  }, [])

  async function fetchTestimonials() {
    setLoading(true)
    try {
      const data = await getTestimonials()
      setTestimonials(data)
    } catch (error) {
      toast.error('Failed to fetch testimonials')
    } finally {
      setLoading(false)
    }
  }

  function openCreateModal() {
    setIsEditing(false)
    setSelectedTestimonial(null)
    setFormData({
      name: '',
      content: '',
      rating: '5',
      image: '',
      isActive: true,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openEditModal(testimonial: Testimonial) {
    setIsEditing(true)
    setSelectedTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      content: testimonial.content,
      rating: String(testimonial.rating),
      image: testimonial.avatar || '',
      isActive: testimonial.isActive,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openDeleteModal(testimonial: Testimonial) {
    setSelectedTestimonial(testimonial)
    setIsDeleteModalOpen(true)
  }

  function validateForm(): boolean {
    const newErrors: Partial<TestimonialFormData> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.content.trim()) newErrors.content = 'Content is required'
    if (Number(formData.rating) < 1 || Number(formData.rating) > 5) newErrors.rating = 'Rating must be between 1 and 5'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return

    const testimonialData = {
      name: formData.name,
      content: formData.content,
      rating: Number(formData.rating),
      image: formData.image || undefined,
      isActive: formData.isActive,
    }

    try {
      if (isEditing && selectedTestimonial) {
        await updateTestimonial(selectedTestimonial.id, testimonialData)
        toast.success('Testimonial updated successfully')
      } else {
        await createTestimonial(testimonialData)
        toast.success('Testimonial created successfully')
      }
      setIsModalOpen(false)
      fetchTestimonials()
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} testimonial`)
    }
  }

  async function handleDelete() {
    if (!selectedTestimonial) return
    try {
      await deleteTestimonial(selectedTestimonial.id)
      toast.success('Testimonial deleted successfully')
      setIsDeleteModalOpen(false)
      fetchTestimonials()
    } catch (error) {
      toast.error('Failed to delete testimonial')
    }
  }

  async function handleToggleActive(testimonial: Testimonial) {
    try {
      await updateTestimonial(testimonial.id, { isActive: !testimonial.isActive })
      toast.success(`Testimonial ${!testimonial.isActive ? 'activated' : 'deactivated'}`)
      fetchTestimonials()
    } catch (error) {
      toast.error('Failed to update testimonial status')
    }
  }

  function renderStars(rating: number) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  function StarRatingInput({ value, onChange }: { value: number; onChange: (val: number) => void }) {
    const [hoverRating, setHoverRating] = React.useState(0)

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-1 transition-transform hover:scale-110"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onChange(star)}
          >
            <Star
              className={`h-6 w-6 ${star <= (hoverRating || value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-500">{value} / 5</span>
      </div>
    )
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value: string, row: Testimonial) => (
        <div className="flex items-center gap-3">
          {row.avatar ? (
            <img
              src={row.avatar}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <span className="text-sm font-medium text-primary">{value.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{value}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (value: number) => renderStars(value),
    },
    {
      key: 'content',
      label: 'Content',
      render: (value: string) => (
        <div className="max-w-xs">
          <div className="flex items-start gap-1 text-gray-500">
            <Quote className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
            <span className="text-sm">{truncate(value, 80)}</span>
          </div>
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
      render: (_: any, row: Testimonial) => (
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
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>NingClean Admin</span>
          <span>/</span>
          <span className="text-gray-700">Testimonials</span>
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
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Testimonials</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage customer testimonials and reviews</p>
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            New Testimonial
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
              data={testimonials}
              loading={loading}
            />
          </div>
        </motion.div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Testimonial' : 'Create New Testimonial'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Customer Name"
            placeholder="Enter customer name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Rating
            </label>
            <StarRatingInput
              value={Number(formData.rating)}
              onChange={(val) => setFormData({ ...formData, rating: String(val) })}
            />
            {errors.rating && <p className="text-sm text-error">{errors.rating}</p>}
          </div>

          <Textarea
            label="Testimonial Content"
            placeholder="Write the testimonial content here..."
            className="min-h-[120px] bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-400"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            error={errors.content}
          />

          <Input
            label="Image URL (optional)"
            placeholder="https://images.unsplash.com/..."
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            icon={<ImageIcon className="h-4 w-4" />}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="isActive"
                  value="true"
                  checked={formData.isActive === true}
                  onChange={() => setFormData({ ...formData, isActive: true })}
                  className="h-4 w-4 text-primary"
                />
                <span className="text-sm">Active</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="isActive"
                  value="false"
                  checked={formData.isActive === false}
                  onChange={() => setFormData({ ...formData, isActive: false })}
                  className="h-4 w-4 text-primary"
                />
                <span className="text-sm">Inactive</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Testimonial"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the testimonial from <strong>{selectedTestimonial?.name}</strong>? This action cannot be undone.
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