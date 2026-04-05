'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, GripVertical, Tag, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/admin/Modal'
import { getBlogCategories, createBlogCategory, updateBlogCategory, deleteBlogCategory, BlogCategory } from '@/lib/api'
import { toast } from 'sonner'
import Link from 'next/link'

interface CategoryFormData {
  name: string
  slug: string
  description: string
}

export default function BlogCategoriesPage() {
  const [categories, setCategories] = React.useState<BlogCategory[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<BlogCategory | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<CategoryFormData>({ name: '', slug: '', description: '' })
  const [errors, setErrors] = React.useState<Partial<CategoryFormData>>({})

  React.useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    setLoading(true)
    try {
      const data = await getBlogCategories()
      setCategories(data)
    } catch (error) {
      toast.error('Gagal mengambil kategori')
    } finally {
      setLoading(false)
    }
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  function openCreateModal() {
    setIsEditing(false)
    setSelectedCategory(null)
    setFormData({ name: '', slug: '', description: '' })
    setErrors({})
    setIsModalOpen(true)
  }

  function openEditModal(category: BlogCategory) {
    setIsEditing(true)
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openDeleteModal(category: BlogCategory) {
    setSelectedCategory(category)
    setIsDeleteModalOpen(true)
  }

  async function handleSave() {
    // Validation
    const newErrors: Partial<CategoryFormData> = {}
    if (!formData.name.trim()) newErrors.name = 'Nama kategori harus diisi'
    if (!formData.slug.trim()) newErrors.slug = 'Slug harus diisi'
    if (!/^[a-z0-9-]+$/.test(formData.slug)) newErrors.slug = 'Slug hanya boleh huruf kecil, angka, dan strip'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      if (isEditing && selectedCategory) {
        await updateBlogCategory(selectedCategory.id, formData)
        toast.success('Kategori berhasil diperbarui')
      } else {
        await createBlogCategory(formData)
        toast.success('Kategori berhasil dibuat')
      }
      setIsModalOpen(false)
      fetchCategories()
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan kategori')
    }
  }

  async function handleDelete() {
    if (!selectedCategory) return
    try {
      await deleteBlogCategory(selectedCategory.id)
      toast.success('Kategori berhasil dihapus')
      setIsDeleteModalOpen(false)
      fetchCategories()
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus kategori')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kategori Blog</h1>
            <p className="text-gray-500">Kelola kategori untuk blog posts</p>
          </div>
        </div>
        <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kategori
        </Button>
      </motion.div>

      {/* Categories List */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada kategori</p>
              <Button onClick={openCreateModal} variant="outline" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kategori
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      {category._count?.posts ? (
                        <Badge variant="default">{category._count.posts} posts</Badge>
                      ) : null}
                    </div>
                    <p className="text-sm text-gray-500">/{category.slug}</p>
                    {category.description && (
                      <p className="text-sm text-gray-400 mt-1">{category.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(category)}
                      className="text-gray-500 hover:text-emerald-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteModal(category)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Kategori' : 'Tambah Kategori'}
        size="md"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nama Kategori</label>
            <Input
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })
                setErrors({ ...errors, name: '' })
              }}
              placeholder="Contoh: Tips Kebersihan"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Slug</label>
            <Input
              value={formData.slug}
              onChange={(e) => {
                setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })
                setErrors({ ...errors, slug: '' })
              }}
              placeholder="contoh-tips-kebersihan"
              className={errors.slug ? 'border-red-500' : ''}
            />
            {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
            <p className="text-xs text-gray-400">URL-friendly version of the name</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Deskripsi (opsional)</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Deskripsi singkat kategori"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
              {isEditing ? 'Simpan' : 'Buat'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus Kategori"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Yakin ingin menghapus kategori <strong>{selectedCategory?.name}</strong>?
          </p>
          {selectedCategory?._count?.posts ? (
            <p className="text-sm text-amber-600">
              Warning: Kategori ini memiliki {selectedCategory._count.posts} posts. Posts tidak akan dihapus.
            </p>
          ) : null}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

