'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Home, Building, Sparkles, HardHat, Sofa, Square, ToggleLeft, ToggleRight, Image as ImageIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/admin/Modal'
import { getServices, createService, updateService, deleteService } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import * as Icons from 'lucide-react'

const SERVICE_ICONS = [
  { name: 'Home', component: Home },
  { name: 'Building', component: Building },
  { name: 'Sparkles', component: Sparkles },
  { name: 'HardHat', component: HardHat },
  { name: 'Sofa', component: Sofa },
  { name: 'Square', component: Square },
]

const CATEGORY_OPTIONS = [
  { value: 'basic', label: 'Basic' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'premium', label: 'Premium' },
  { value: 'specialty', label: 'Specialty' },
  { value: 'addon', label: 'Add-on' },
]

interface ServiceFormData {
  name: string
  description: string
  price: string
  duration: string
  category: string
  icon: string
}

export default function ServicesPage() {
  const [services, setServices] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedService, setSelectedService] = React.useState<any>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<ServiceFormData>({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: 'basic',
    icon: 'Home',
  })
  const [errors, setErrors] = React.useState<Partial<ServiceFormData>>({})

  React.useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    setLoading(true)
    try {
      const data = await getServices()
      setServices(data)
    } catch (error) {
      toast.error('Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  function openCreateModal() {
    setIsEditing(false)
    setSelectedService(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: 'basic',
      icon: 'Home',
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openEditModal(service: any) {
    setIsEditing(true)
    setSelectedService(service)
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category,
      icon: service.icon || 'Home',
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openDeleteModal(service: any) {
    setSelectedService(service)
    setIsDeleteModalOpen(true)
  }

  function validateForm(): boolean {
    const newErrors: Partial<ServiceFormData> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required'
    }
    if (!formData.duration || isNaN(Number(formData.duration)) || Number(formData.duration) <= 0) {
      newErrors.duration = 'Valid duration is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return

    const serviceData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      duration: Number(formData.duration),
      category: formData.category,
      icon: formData.icon,
      isActive: selectedService?.isActive ?? true,
    }

    try {
      if (isEditing && selectedService) {
        await updateService(selectedService.id, serviceData)
        toast.success('Service updated successfully')
      } else {
        await createService(serviceData)
        toast.success('Service created successfully')
      }
      setIsModalOpen(false)
      fetchServices()
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} service`)
    }
  }

  async function handleToggleActive(service: any) {
    try {
      await updateService(service.id, { ...service, isActive: !service.isActive })
      toast.success(`Service ${service.isActive ? 'deactivated' : 'activated'}`)
      fetchServices()
    } catch (error) {
      toast.error('Failed to update service status')
    }
  }

  async function handleDelete() {
    if (!selectedService) return
    try {
      await deleteService(selectedService.id)
      toast.success('Service deleted successfully')
      setIsDeleteModalOpen(false)
      fetchServices()
    } catch (error) {
      toast.error('Failed to delete service')
    }
  }

  function getIconComponent(iconName: string) {
    const Icon = (Icons as any)[iconName]
    return Icon || Home
  }

  function getCategoryBadge(category: string) {
    const colors: Record<string, string> = {
      basic: 'bg-blue-100 text-blue-800',
      commercial: 'bg-purple-100 text-purple-800',
      premium: 'bg-amber-100 text-amber-800',
      specialty: 'bg-green-100 text-green-800',
      addon: 'bg-gray-100 text-gray-800',
    }
    return colors[category] || colors.basic
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-500">Manage cleaning services and pricing</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </motion.div>

      {/* Services Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="skeleton mb-2 h-12 w-12 rounded-lg" />
                  <div className="skeleton h-6 w-3/4 rounded" />
                </CardHeader>
                <CardContent>
                  <div className="skeleton mb-2 h-4 w-full rounded" />
                  <div className="skeleton h-4 w-2/3 rounded" />
                </CardContent>
              </Card>
            ))
          : services.map((service, index) => {
              const IconComponent = getIconComponent(service.icon)
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`overflow-hidden transition-shadow hover:shadow-lg ${!service.isActive && 'opacity-60'}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-lg p-3 ${service.isActive ? 'bg-primary/10' : 'bg-gray-100'}`}>
                            <IconComponent className={`h-6 w-6 ${service.isActive ? 'text-primary' : 'text-gray-400'}`} />
                          </div>
                          <div>
                            <CardTitle className="text-base">{service.name}</CardTitle>
                            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryBadge(service.category)}`}>
                              {service.category}
                            </span>
                          </div>
                        </div>
                        <Badge variant={service.isActive ? 'success' : 'default'}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-sm text-gray-500 line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-primary">{formatCurrency(service.price)}</p>
                          <p className="text-xs text-gray-400">{service.duration} minutes</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(service)}
                          >
                            {service.isActive ? (
                              <ToggleRight className="h-5 w-5 text-success" />
                            ) : (
                              <ToggleLeft className="h-5 w-5 text-gray-400" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(service)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDeleteModal(service)}>
                            <Trash2 className="h-4 w-4 text-error" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
      </motion.div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Service' : 'Create Service'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Service Name"
            placeholder="e.g. Home Cleaning"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />

          <Textarea
            label="Description"
            placeholder="Describe the service..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={errors.description}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Price (IDR)"
              type="number"
              placeholder="250000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              error={errors.price}
            />
            <Input
              label="Duration (minutes)"
              type="number"
              placeholder="180"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              error={errors.duration}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
            <select
              className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {SERVICE_ICONS.map((icon) => {
                const IconComponent = icon.component
                return (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: icon.name })}
                    className={`flex items-center justify-center rounded-lg p-3 transition-colors ${
                      formData.icon === icon.name
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </button>
                )
              })}
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
        title="Delete Service"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedService?.name}</strong>? This action cannot be undone.
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
