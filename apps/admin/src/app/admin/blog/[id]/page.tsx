'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Image as ImageIcon, Star, FolderOpen, Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { getBlogPostById, updateBlogPost, deleteBlogPost, getBlogCategories, BlogCategory } from '@/lib/api'
import { BlogPost } from '@/types'
import { toast } from 'sonner'

interface BlogFormData {
  title: string
  content: string
  excerpt: string
  coverImage: string
  status: 'draft' | 'published'
  tags: string
  categoryId: string
  isFeatured: boolean
}

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const [categories, setCategories] = React.useState<BlogCategory[]>([])
  const [post, setPost] = React.useState<BlogPost | null>(null)
  const [formData, setFormData] = React.useState<BlogFormData>({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    status: 'draft',
    tags: '',
    categoryId: '',
    isFeatured: false,
  })
  const [errors, setErrors] = React.useState<Partial<BlogFormData>>({})
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)

  React.useEffect(() => {
    fetchData()
  }, [postId])

  async function fetchData() {
    setLoading(true)
    try {
      const [postData, catsData] = await Promise.all([
        getBlogPostById(postId),
        getBlogCategories(),
      ])
      setPost(postData)
      setCategories(catsData)
      setFormData({
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt || '',
        coverImage: postData.coverImage || '',
        status: postData.status,
        tags: postData.tags?.join(', ') || '',
        categoryId: postData.categoryId || '',
        isFeatured: postData.isFeatured || false,
      })
    } catch (error) {
      toast.error('Gagal memuat post')
      router.push('/admin/blog')
    } finally {
      setLoading(false)
    }
  }

  function validateForm(): boolean {
    const newErrors: Partial<BlogFormData> = {}
    if (!formData.title.trim()) newErrors.title = 'Title harus diisi'
    if (!formData.content.trim()) newErrors.content = 'Content harus diisi'
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt harus diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return

    setSaving(true)
    try {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      await updateBlogPost(postId, {
        ...formData,
        tags,
      })
      toast.success('Post berhasil diperbarui')
      router.push('/admin/blog')
    } catch (error: any) {
      toast.error(error.message || 'Gagal memperbarui post')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteBlogPost(postId)
      toast.success('Post berhasil dihapus')
      router.push('/admin/blog')
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus post')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500" />
      </div>
    )
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
            <p className="text-gray-500">Edit artikel blog</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus
          </Button>
          <Button variant="outline" onClick={() => window.open(`/blog/${post?.slug}`, '_blank')}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <Card>
            <CardContent className="p-6">
              <Input
                placeholder="Judul artikel..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="text-xl font-semibold border-0 p-0 h-auto focus:ring-0 placeholder:text-gray-300"
                style={{ fontSize: '24px', fontWeight: 600 }}
              />
              {errors.title && <p className="text-sm text-red-500 mt-2">{errors.title}</p>}
            </CardContent>
          </Card>

          {/* Cover Image */}
          <Card>
            <CardContent className="p-6">
              <label className="text-sm font-medium text-gray-700 mb-3 block">Cover Image</label>
              {formData.coverImage ? (
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={formData.coverImage}
                    alt="Cover"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => setFormData({ ...formData, coverImage: '' })}
                    className="absolute top-3 right-3 p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setFormData({ ...formData, coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' })}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
                >
                  <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Klik untuk set cover image (demo)</p>
                  <p className="text-xs text-gray-400 mt-1">atau paste URL image</p>
                </div>
              )}
              <Input
                placeholder="Atau paste URL gambar..."
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="mt-3"
              />
            </CardContent>
          </Card>

          {/* Excerpt */}
          <Card>
            <CardContent className="p-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Excerpt</label>
              <Textarea
                placeholder="Ringkasan singkat artikel..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className={errors.excerpt ? 'border-red-500' : ''}
              />
              {errors.excerpt && <p className="text-sm text-red-500 mt-2">{errors.excerpt}</p>}
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardContent className="p-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Content (Markdown supported)</label>
              <Textarea
                placeholder="Tulis konten artikel di sini... Markdown formatting didukung."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={20}
                className={`font-mono text-sm ${errors.content ? 'border-red-500' : ''}`}
              />
              {errors.content && <p className="text-sm text-red-500 mt-2">{errors.content}</p>}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Publish</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {post?.status === 'published' ? (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">Published</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">Draft</span>
                  )}
                  {post?.isFeatured && (
                    <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={formData.status === 'draft'}
                        onChange={() => setFormData({ ...formData, status: 'draft' })}
                        className="h-4 w-4 text-emerald-600"
                      />
                      <span className="text-sm">Draft</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={formData.status === 'published'}
                        onChange={() => setFormData({ ...formData, status: 'published' })}
                        className="h-4 w-4 text-emerald-600"
                      />
                      <span className="text-sm">Published</span>
                    </label>
                  </div>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                Kategori
              </h3>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
              >
                <option value="">Tidak ada kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Featured */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="font-medium text-gray-900">Featured Post</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Post ini akan ditampilkan di homepage</p>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
              <Input
                placeholder="tips, cleaning, rumah (pisah dengan koma)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-2">Pisahkan dengan koma</p>
            </CardContent>
          </Card>

          {/* Post Info */}
          {post && (
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Info Post</h3>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>Slug: <code className="text-xs bg-gray-200 px-1 rounded">/{post.slug}</code></p>
                  <p>Created: {new Date(post.createdAt).toLocaleDateString('id-ID')}</p>
                  <p>Updated: {new Date(post.updatedAt).toLocaleDateString('id-ID')}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Post?</h3>
            <p className="text-gray-600 mb-6">
              Yakin ingin menghapus post <strong>"{post?.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Batal
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting ? 'Menghapus...' : 'Hapus'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
