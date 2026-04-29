'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Plus, FileText, Save, Edit, Trash2, User, Calendar, Mail, Phone, GripVertical, Facebook, Instagram, Linkedin, Twitter, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ImageUpload, useImageUpload } from '@/components/ui/ImageUpload'
import { Modal } from '@/components/admin/Modal'
import { DataTable } from '@/components/admin/DataTable'
import { useTeamMembers, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember } from '@/lib/use-queries'
import { Breadcrumb } from '@/components/admin/Breadcrumb'
import { TeamMember } from '@/types'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface TeamFormData {
  name: string
  position: string
  department: string
  bio: string
  email: string
  phone: string
  avatar: string
  isActive: boolean
  order: number
  socialLinks: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
  }
}

const departments = ['Cleaning', 'Management', 'Support', 'Marketing', 'Technical', 'HR']

export default function TeamPage() {
  const { data: items = [], isLoading: loading, refetch } = useTeamMembers()
  const createMutation = useCreateTeamMember()
  const updateMutation = useUpdateTeamMember()
  const deleteMutation = useDeleteTeamMember()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<TeamMember | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<TeamFormData>({
    name: '',
    position: '',
    department: 'Cleaning',
    bio: '',
    email: '',
    phone: '',
    avatar: '',
    isActive: true,
    order: 0,
    socialLinks: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
    },
  })
  const [errors, setErrors] = React.useState<Partial<TeamFormData>>({})
  const [selectedImageFile, setSelectedImageFile] = React.useState<File | null>(null)
  const { uploadImage } = useImageUpload()

  function openCreateModal() {
    setIsEditing(false)
    setSelectedItem(null)
    setFormData({
      name: '',
      position: '',
      department: 'Cleaning',
      bio: '',
      email: '',
      phone: '',
      avatar: '',
      isActive: true,
      order: 0,
      socialLinks: {
        facebook: '',
        instagram: '',
        linkedin: '',
        twitter: '',
      },
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openEditModal(item: TeamMember) {
    setIsEditing(true)
    setSelectedItem(item)
    setFormData({
      name: item.name,
      position: item.position,
      department: item.department,
      bio: item.bio || '',
      email: item.email || '',
      phone: item.phone || '',
      avatar: item.avatar || '',
      isActive: item.isActive,
      order: item.order,
      socialLinks: {
        facebook: (item.socialLinks as any)?.facebook || '',
        instagram: (item.socialLinks as any)?.instagram || '',
        linkedin: (item.socialLinks as any)?.linkedin || '',
        twitter: (item.socialLinks as any)?.twitter || '',
      },
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openDeleteModal(item: TeamMember) {
    setSelectedItem(item)
    setIsDeleteModalOpen(true)
  }

  async function checkDuplicate(): Promise<{ nameExists: boolean; emailExists: boolean }> {
    const nameExists = items.some(
      item => item.name.toLowerCase() === formData.name.trim().toLowerCase() &&
              (!isEditing || item.id !== selectedItem?.id)
    )
    const emailExists = formData.email.trim() ? items.some(
      item => item.email?.toLowerCase() === formData.email.trim().toLowerCase() &&
              (!isEditing || item.id !== selectedItem?.id)
    ) : false
    return { nameExists, emailExists }
  }

  async function validateForm(): Promise<boolean> {
    const newErrors: Partial<TeamFormData> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.position.trim()) newErrors.position = 'Position is required'
    if (!formData.department.trim()) newErrors.department = 'Department is required'
    
    // Check for duplicates
    const { nameExists, emailExists } = await checkDuplicate()
    if (nameExists) newErrors.name = 'Team member with this name already exists'
    if (emailExists) newErrors.email = 'Email already exists'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return

    // Upload image if there's a new file selected
    let avatarUrl = formData.avatar
    if (selectedImageFile) {
      const uploadedUrl = await uploadImage(selectedImageFile, 'team')
      if (uploadedUrl) {
        avatarUrl = uploadedUrl
      } else {
        toast.error('Failed to upload image')
        return
      }
    }

    const itemData = {
      name: formData.name,
      position: formData.position,
      department: formData.department,
      bio: formData.bio || undefined,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      avatar: avatarUrl || undefined,
      isActive: formData.isActive,
      order: formData.order,
      socialLinks: {
        facebook: formData.socialLinks.facebook || undefined,
        instagram: formData.socialLinks.instagram || undefined,
        linkedin: formData.socialLinks.linkedin || undefined,
        twitter: formData.socialLinks.twitter || undefined,
      },
    }

    try {
      if (isEditing && selectedItem) {
        await updateMutation.mutateAsync({ id: selectedItem.id, data: itemData })
        toast.success('Team member updated successfully')
      } else {
        await createMutation.mutateAsync(itemData)
        toast.success('Team member created successfully')
      }
      setSelectedImageFile(null)
      setIsModalOpen(false)
      refetch()
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} team member`)
    }
  }

  async function handleDelete() {
    if (!selectedItem) return
    try {
      await deleteMutation.mutateAsync(selectedItem.id)
      toast.success('Team member deleted successfully')
      setIsDeleteModalOpen(false)
      refetch()
    } catch (error) {
      toast.error('Failed to delete team member')
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Member',
      render: (value: string, row: TeamMember) => (
        <div className="flex items-center gap-3">
          {row.avatar ? (
            <img src={row.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 dark:bg-emerald-900/30">
              <User className="h-5 w-5 text-primary" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">{row.position}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      key: 'email',
      label: 'Contact',
      render: (value: string) => (
        <div className="flex flex-col gap-0.5">
          {value && (
            <span className="text-xs flex items-center gap-1 text-gray-500 dark:text-slate-400">
              <Mail className="h-3 w-3" /> {value}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'order',
      label: 'Urutan',
      render: (value: number) => (
        <div className="flex items-center gap-1">
          <GripVertical className="h-4 w-4 text-gray-400 dark:text-slate-500" />
          <span className="text-sm">{value}</span>
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
      key: 'socialLinks',
      label: 'Media Sosial',
      render: (value: any) => {
        const links = value as { facebook?: string; instagram?: string; linkedin?: string; twitter?: string } | null
        const hasSocial = links?.facebook || links?.instagram || links?.linkedin || links?.twitter
        if (!hasSocial) return <span className="text-gray-400 text-xs">-</span>
        return (
          <div className="flex items-center gap-1.5">
            {links?.facebook && <a href={links.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700"><Facebook className="h-4 w-4" /></a>}
            {links?.instagram && <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700"><Instagram className="h-4 w-4" /></a>}
            {links?.linkedin && <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800"><Linkedin className="h-4 w-4" /></a>}
            {links?.twitter && <a href={links.twitter} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-600"><Twitter className="h-4 w-4" /></a>}
          </div>
        )
      },
    },
    {
      key: 'createdAt',
      label: 'Dibuat',
      render: (value: string) => (
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(value)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_: any, row: TeamMember) => (
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Team' }]} />

      <div className="w-full px-3 sm:px-6 py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-start justify-between gap-3 sm:gap-4"
        >
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Team Members</h1>
              <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700 h-8 text-xs px-3">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-0.5">Manage team members and staff</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-slate-600">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Total: </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{items.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="sm:bg-white sm:dark:bg-slate-900 sm:shadow-sm sm:border sm:border-gray-200 dark:sm:border-slate-700 sm:rounded-2xl overflow-hidden">
            <DataTable
              columns={columns}
              data={items}
              loading={loading}
          renderCard={(row: TeamMember) => (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 p-4 active:scale-[0.99]">
              {/* Header - Avatar with gradient background */}
              <div className="flex items-start gap-4 border-b border-gray-100 dark:border-slate-700 pb-4">
                {row.avatar ? (
                  <div className="relative flex-shrink-0">
                    <img 
                      src={row.avatar} 
                      alt={row.name}
                      className="h-16 w-16 rounded-2xl object-cover shadow-lg shadow-emerald-500/10 ring-2 ring-white dark:ring-slate-700"
                    />
                    <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                      row.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                    }`}>
                      <div className="h-full w-full rounded-full flex items-center justify-center">
                        {row.isActive ? (
                          <User className="h-3 w-3 text-white" />
                        ) : (
                          <User className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative flex-shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl font-bold text-white shadow-lg shadow-emerald-500/20 ring-2 ring-white dark:ring-slate-700">
                      {row.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                      row.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                    }}`}
                    >
                      <div className="h-full w-full rounded-full flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white text-lg truncate">{row.name}</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{row.position}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      row.isActive 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400'
                    }`}>
                      {row.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 font-medium">
                      Urutan {row.order}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid - Department */}
              <div className="py-4">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/80">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-white">{row.department?.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 dark:text-slate-500">Departemen</p>
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{row.department}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              {(row.email || row.phone) && (
                <div className="pb-4 space-y-2">
                  {row.email && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 p-2 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                      <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="truncate">{row.email}</span>
                    </div>
                  )}
                  {row.phone && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 p-2 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                      <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                      <span>{row.phone}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Social Links */}
              {(row.socialLinks?.facebook || row.socialLinks?.linkedin || row.socialLinks?.twitter || row.socialLinks?.instagram) && (
                <div className="pb-4 border-t border-gray-100 dark:border-slate-700/50 pt-3">
                  <p className="text-xs text-gray-400 dark:text-slate-500 mb-2">Media Sosial</p>
                  <div className="flex items-center gap-2">
                    {row.socialLinks?.facebook && (
                      <a 
                        href={row.socialLinks.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Facebook className="h-4 w-4" />
                      </a>
                    )}
                    {row.socialLinks?.instagram && (
                      <a 
                        href={row.socialLinks.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="h-8 w-8 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Instagram className="h-4 w-4" />
                      </a>
                    )}
                    {row.socialLinks?.linkedin && (
                      <a 
                        href={row.socialLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {row.socialLinks?.twitter && (
                      <a 
                        href={row.socialLinks.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="h-8 w-8 rounded-xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center text-sky-500 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                <div className="text-xs text-gray-400 dark:text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(row.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); openEditModal(row); }}
                    className="h-9 w-9 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-gray-600 dark:text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400 transition-colors shadow-sm"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); openDeleteModal(row); }}
                    className="h-9 w-9 rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors shadow-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
          skeletonCard={(i: number) => (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 animate-pulse shadow-sm">
              {/* Header Skeleton - Avatar & Name */}
              <div className="flex items-start gap-4 border-b border-gray-100 dark:border-slate-700 pb-4">
                <div className="h-16 w-16 rounded-2xl bg-emerald-100 dark:bg-slate-700 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 rounded bg-gray-200 dark:bg-slate-700" />
                  <div className="h-4 w-24 rounded bg-gray-100 dark:bg-slate-700" />
                  <div className="flex gap-2 mt-2">
                    <div className="h-5 w-14 rounded-full bg-gray-200 dark:bg-slate-700" />
                    <div className="h-5 w-16 rounded-full bg-blue-100 dark:bg-slate-700" />
                  </div>
                </div>
              </div>
              
              {/* Department Skeleton */}
              <div className="py-4">
                <div className="h-16 rounded-xl bg-gray-200 dark:bg-slate-700" />
              </div>
              
              {/* Contact Skeleton */}
              <div className="pb-4 space-y-2">
                <div className="h-10 rounded-lg bg-gray-100 dark:bg-slate-700" />
              </div>
              
              {/* Actions Skeleton */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                <div className="h-4 w-24 rounded bg-gray-100 dark:bg-slate-700" />
                <div className="flex gap-2">
                  <div className="h-9 w-9 rounded-xl bg-gray-200 dark:bg-slate-700" />
                  <div className="h-9 w-9 rounded-xl bg-red-100 dark:bg-slate-700" />
                </div>
              </div>
            </div>
          )}
            />
          </div>
        </motion.div>
      </div>

      {/* Create/Edit Modal - Redesigned with Social Links */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Team Member' : 'Create New Team Member'}
        size="xl"
        titleIcon={<User className="w-5 h-5" />}
        accentColor="emerald"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Card with Avatar Preview */}
          <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-900 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 p-6">
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 overflow-hidden">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {formData.name || 'New Member'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                  {formData.position || 'Position not set'} • {formData.department}
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-600" />
              </div>
              Informasi Dasar
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-500 dark:text-slate-400">Nama Lengkap *</label>
                  <Input
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-500 dark:text-slate-400">Posisi/Jabatan *</label>
                  <Input
                    placeholder="Contoh: Cleaning Supervisor"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"
                  />
                  {errors.position && <p className="text-xs text-red-500">{errors.position}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-500 dark:text-slate-400">Departemen *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full h-10 rounded-lg border border-gray-200 dark:border-slate-600 px-3 text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && <p className="text-xs text-red-500">{errors.department}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-500 dark:text-slate-400">Urutan Tampilan</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              Biografi
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-5">
              <Textarea
                placeholder="Ceritakan tentang anggota tim ini..."
                className="min-h-[100px] bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 resize-none"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
          </div>

          {/* Section 3: Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Mail className="w-4 h-4 text-purple-600" />
              </div>
              Kontak & Avatar
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-500 dark:text-slate-400">Email</label>
                  <Input
                    type="email"
                    placeholder="email@contoh.com"
                    icon={<Mail className="h-4 w-4 text-gray-400" />}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-500 dark:text-slate-400">Telepon</label>
                  <Input
                    placeholder="+62 xxx xxxx xxxx"
                    icon={<Phone className="h-4 w-4 text-gray-400" />}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <ImageUpload
                  label="Avatar"
                  folder="team"
                  value={formData.avatar}
                  onChange={(url) => setFormData({ ...formData, avatar: url })}
                  onFileSelect={(file) => setSelectedImageFile(file)}
                  autoUpload={false}
                  previewClassName="h-32 w-32 mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Social Links */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
              <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <Instagram className="w-4 h-4 text-pink-600" />
              </div>
              Media Sosial
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-slate-400">
                    <Facebook className="w-3.5 h-3.5 text-blue-600" /> Facebook
                  </label>
                  <Input
                    placeholder="https://facebook.com/username"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, facebook: e.target.value } })}
                    className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-slate-400">
                    <Instagram className="w-3.5 h-3.5 text-pink-600" /> Instagram
                  </label>
                  <Input
                    placeholder="https://instagram.com/username"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, instagram: e.target.value } })}
                    className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-slate-400">
                    <Linkedin className="w-3.5 h-3.5 text-blue-700" /> LinkedIn
                  </label>
                  <Input
                    placeholder="https://linkedin.com/in/username"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                    className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-slate-400">
                    <Twitter className="w-3.5 h-3.5 text-sky-500" /> Twitter
                  </label>
                  <Input
                    placeholder="https://twitter.com/username"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                    className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Status */}
          <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-5 h-5 rounded border-emerald-300 text-emerald-500 focus:ring-emerald-500"
            />
            <label htmlFor="isActive" className="flex items-center gap-2 font-medium text-emerald-800 dark:text-emerald-300">
              Anggota Aktif
            </label>
            <span className="text-sm text-emerald-600 dark:text-emerald-400">— Tampilkan di halaman team website</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <Save className="w-4 h-4" />
              {isEditing ? 'Simpan Perubahan' : 'Tambah Member'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal - Consistent with Customer Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Team Member"
        size="sm"
        titleIcon={<Trash2 className="w-5 h-5" />}
        accentColor="red"
      >
        <div className="space-y-6">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/50">
            <p className="text-gray-700 dark:text-slate-300">
              Are you sure you want to delete <strong className="text-red-600 dark:text-red-400">{selectedItem?.name}</strong>?
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-2">This action cannot be undone. All associated data will be permanently removed.</p>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="error" onClick={handleDelete} loading={deleteMutation.isPending} className="gap-2">
              <Trash2 className="w-4 h-4" />
              Delete Member
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
