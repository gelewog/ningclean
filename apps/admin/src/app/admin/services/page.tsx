'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Home, Building, Sparkles, HardHat, Sofa, Image as ImageIcon, Star } from 'lucide-react'
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
]

const CATEGORY_OPTIONS = [
  { value: 'Deep Cleaning', label: 'Deep Cleaning' },
  { value: 'Regular Cleaning', label: 'Regular Cleaning' },
  { value: 'Post Construction', label: 'Post Construction' },
  { value: 'Sofa Cleaning', label: 'Sofa Cleaning' },
  { value: 'Office Cleaning', label: 'Office Cleaning' },
]

interface ServiceFormData {
  name: string
  slug: string
  description: string
  price: string
  duration: string
  category: string
  icon: string
  image: string
  features: string
  isFeatured: boolean
}

// Switch Component
function Switch({ checked, onChange, disabled = false }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        checked ? 'bg-success' : 'bg-gray-300'
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

export default function ServicesPage() {
  const [services, setServices] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedService, setSelectedService] = React.useState<any>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [filterActive, setFilterActive] = React.useState<'all' | 'active' | 'inactive'>('all')
  const [formData, setFormData] = React.useState<ServiceFormData>({
    name: '',
    slug: '',
    description: '',
    price: '',
    duration: '',
    category: 'Deep Cleaning',
    icon: 'Home',
    image: '',
    features: '',
    isFeatured: false,
  })
  const [errors, setErrors] = React.useState<Partial<ServiceFormData>>({})

  React.useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    setLoading(true)
    try {
      // Get all services including inactive (admin sees all)
      const data = await getServices(true)
      setServices(data)
    } catch (error) {
      toast.error('Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  function generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  function openCreateModal() {
    setIsEditing(false)
    setSelectedService(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      duration: '',
      category: 'Deep Cleaning',
      icon: 'Home',
      image: '',
      features: '',
      isFeatured: false,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openEditModal(service: any) {
    setIsEditing(true)
    setSelectedService(service)
    setFormData({
      name: service.name,
      slug: service.slug,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category || 'Deep Cleaning',
      icon: service.icon || 'Home',
      image: service.image || '',
      features: service.features?.join('\n') || '',
      isFeatured: service.isFeatured || false,
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

    const slug = formData.slug || generateSlug(formData.name)
    const serviceData = {
      name: formData.name,
      slug: slug,
      description: formData.description,
      price: Number(formData.price),
      duration: Number(formData.duration),
      category: formData.category,
      icon: formData.icon,
      image: formData.image || undefined,
      features: formData.features.split('\n').map(f => f.trim()).filter(f => f.length > 0),
      isActive: selectedService?.isActive ?? true,
      isFeatured: formData.isFeatured,
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
    } catch (error: any) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} service: ${error.message}`)
    }
  }

  // Optimistic update for toggle
  async function handleToggleActive(service: any) {
    const newIsActive = !service.isActive
    const serviceName = service.name

    // Optimistic update - update UI immediately
    setServices(prev => prev.map(s =>
      s.id === service.id ? { ...s, isActive: newIsActive } : s
    ))

    try {
      await updateService(service.id, { isActive: newIsActive })
      toast.success(`Service "${serviceName}" ${newIsActive ? 'activated' : 'deactivated'}`)
    } catch (error: any) {
      // Revert on error
      setServices(prev => prev.map(s =>
        s.id === service.id ? { ...s, isActive: !newIsActive } : s
      ))
      toast.error(`Failed to update: ${error.message || 'Unknown error'}`)
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
      'Deep Cleaning': 'bg-blue-100 text-blue-800',
      'Regular Cleaning': 'bg-green-100 text-green-800',
      'Post Construction': 'bg-orange-100 text-orange-800',
      'Sofa Cleaning': 'bg-purple-100 text-purple-800',
      'Office Cleaning': 'bg-cyan-100 text-cyan-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  // Filter services based on active status
  const filteredServices = React.useMemo(() => {
    switch (filterActive) {
      case 'active':
        return services.filter(s => s.isActive)
      case 'inactive':
        return services.filter(s => !s.isActive)
      default:
        return services
    }
  }, [services, filterActive])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white">
      {/* Topbar */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-700 px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
          <span>NingClean Admin</span>
          <span>/</span>
          <span className="text-gray-700 dark:text-slate-200">Services</span>
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
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Services</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Manage cleaning services and pricing</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchServices}>
              Refresh
            </Button>
            <Button onClick={openCreateModal}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterActive('all')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filterActive === 'all' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            All ({services.length})
          </button>
          <button
            onClick={() => setFilterActive('active')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filterActive === 'active' ? 'bg-success text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            Active ({services.filter(s => s.isActive).length})
          </button>
          <button
            onClick={() => setFilterActive('inactive')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filterActive === 'inactive' ? 'bg-gray-500 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            Inactive ({services.filter(s => !s.isActive).length})
          </button>
        </div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <motion.div key={`skeleton-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Card className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="skeleton mb-2 h-12 w-12 rounded-lg" />
                        <div className="skeleton h-6 w-3/4 rounded" />
                      </CardHeader>
                      <CardContent>
                        <div className="skeleton mb-2 h-4 w-full rounded" />
                        <div className="skeleton h-4 w-2/3 rounded" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              : filteredServices.map((service, index) => {
                  const IconComponent = getIconComponent(service.icon)
                  return (
                    <motion.div
                      key={service.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`overflow-hidden transition-shadow hover:shadow-lg dark:shadow-slate-900/30 ${!service.isActive ? 'opacity-60 grayscale' : ''}`}>
                        <div className="relative">
                          {service.image ? (
                            <img
                              src={service.image}
                              alt={service.name}
                              className="h-40 w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-40 w-full items-center justify-center bg-gray-100 dark:bg-slate-800">
                              <IconComponent className="h-16 w-16 text-gray-300 dark:text-slate-600" />
                            </div>
                          )}
                          {service.isFeatured && (
                            <div className="absolute right-2 top-2">
                              <Badge variant="warning" className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                Featured
                              </Badge>
                            </div>
                          )}
                          {!service.isActive && (
                            <div className="absolute left-2 top-2">
                              <Badge variant="default">Inactive</Badge>
                            </div>
                          )}
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`rounded-lg p-3 ${service.isActive ? 'bg-primary/10' : 'bg-gray-200'}`}>
                                <IconComponent className={`h-6 w-6 ${service.isActive ? 'text-primary' : 'text-gray-400'}`} />
                              </div>
                              <div>
                                <CardTitle className="text-base">{service.name}</CardTitle>
                                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryBadge(service.category)}`}>
                                  {service.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4 text-sm text-gray-500 dark:text-slate-400 line-clamp-2">{service.description}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-lg font-bold text-primary dark:text-emerald-400">{formatCurrency(service.price)}</p>
                              <p className="text-xs text-gray-400 dark:text-slate-500">{service.duration} minutes</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Active</span>
                                <Switch
                                  checked={service.isActive}
                                  onChange={() => handleToggleActive(service)}
                                />
                              </div>
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
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {!loading && filteredServices.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No services found</p>
          </div>
        )}
      </div>

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

          <Input
            label="Slug"
            placeholder="e.g. home-cleaning"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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

          <div className="grid gap-4 sm:grid-cols-2">
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
                      className={`flex items-center justify-center rounded-lg p-2 transition-colors ${
                        formData.icon === icon.name
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <Input
            label="Image URL"
            placeholder="https://images.unsplash.com/..."
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            icon={<ImageIcon className="h-4 w-4" />}
          />

          <Textarea
            label="Features (one per line)"
            placeholder="Pembersihan dinding & langit-langit&#10;Sikat & vacuum karpet/sofa&#10;Sterilisasi kamar mandi"
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            className="min-h-[100px] bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-400"
          />

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
              Featured Service
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