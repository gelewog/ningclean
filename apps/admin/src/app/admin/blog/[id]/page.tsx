'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Image as ImageIcon, Star, FolderOpen, Eye, Trash2, ChevronRight } from 'lucide-react'
import { ImageUpload, useImageUpload } from '@/components/ui/ImageUpload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { RichTextEditor } from '@/components/editor/RichTextEditor'
import Link from 'next/link'
import { getBlogPostById, updateBlogPost, deleteBlogPost, getBlogCategories, BlogCategory, createDraftPreview } from '@/lib/api'
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
  const [selectedCoverFile, setSelectedCoverFile] = React.useState<File | null>(null)
  const { uploadImage } = useImageUpload()

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
      // Upload cover image jika ada file yang dipilih
      let coverImageUrl = formData.coverImage
      if (selectedCoverFile) {
        const uploadedUrl = await uploadImage(selectedCoverFile, 'gallery')
        if (uploadedUrl) {
          coverImageUrl = uploadedUrl
        } else {
          toast.error('Gagal upload cover image')
          setSaving(false)
          return
        }
      }

      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean)

      // Konversi status ke publishedAt untuk database
      const publishedAt = formData.status === 'published' ? new Date().toISOString() : null

      await updateBlogPost(postId, {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        coverImage: coverImageUrl,
        tags,
        categoryId: formData.categoryId || undefined,
        isFeatured: formData.isFeatured,
        publishedAt,
      })
      setSelectedCoverFile(null)
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
      <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 dark:border-slate-700 border-t-emerald-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white">
      {/* Topbar */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-700 px-4 md:px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
          <span>Admin</span>
          <ChevronRight className="w-4 h-4" />
          <Link href="/admin/blog" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Blog</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium">Edit Post</span>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <Link href="/admin/blog" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0">
              <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-slate-400" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">Edit Post</h1>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Edit artikel blog</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 h-9 sm:h-10 px-2 sm:px-4"
            >
              <Trash2 className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Hapus</span>
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                // Build draft data
                const draftData = {
                  title: formData.title,
                  content: formData.content,
                  excerpt: formData.excerpt,
                  coverImage: formData.coverImage,
                  author: post?.author || 'Admin Ningclean',
                  tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                  readTime: 5,
                  createdAt: new Date().toISOString(),
                  slug: post?.slug || 'draft-preview',
                  category: categories.find(c => c.id === formData.categoryId),
                }
                // Save to API and get temp ID
                try {
                  const { id } = await createDraftPreview(draftData)
                  // Open preview dengan URL dari environment variable
                  const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3001'
                  window.open(`${webUrl}/blog/draft-preview/preview?id=${id}`, '_blank')
                } catch (e) {
                  console.error('Failed to create draft preview:', e)
                  toast.error('Gagal membuat preview')
                }
              }}
              className="h-9 sm:h-10 px-2 sm:px-4"
            >
              <Eye className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Preview Draft</span>
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 h-9 sm:h-10 px-3 sm:px-4"
            >
              <Save className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">{saving ? 'Menyimpan...' : 'Simpan'}</span>
              <span className="sm:hidden">{saving ? '...' : 'Simpan'}</span>
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Judul Artikel</h3>
              </div>
              <div className="p-4 sm:p-6">
                <Input
                  placeholder="Judul artikel..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`text-lg sm:text-xl font-semibold border-0 p-0 h-auto focus:ring-0 placeholder:text-gray-300 dark:text-slate-600 bg-transparent ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && <p className="text-sm text-red-500 mt-2">{errors.title}</p>}
              </div>
            </motion.div>

            {/* Cover Image */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Cover Image</h3>
              </div>
              <div className="p-4 sm:p-6">
                <ImageUpload
                  folder="gallery"
                  value={formData.coverImage}
                  onChange={(url) => setFormData({ ...formData, coverImage: url })}
                  onFileSelect={(file) => setSelectedCoverFile(file)}
                  autoUpload={false}
                  label=""
                  placeholder="https://... atau paste URL gambar"
                  previewClassName="h-48 sm:h-64 w-full"
                />
              </div>
            </motion.div>

            {/* Excerpt */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Excerpt</h3>
              </div>
              <div className="p-4 sm:p-6">
                <Textarea
                  placeholder="Ringkasan singkat artikel..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className={`w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 dark:focus:ring-1 dark:focus:ring-emerald-400/30 resize-none ${errors.excerpt ? 'border-red-500 dark:border-red-500' : ''}`}
                />
                {errors.excerpt && <p className="text-sm text-red-500 mt-2">{errors.excerpt}</p>}
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Content</h3>
                <Badge variant="info" className="text-xs">Rich Text</Badge>
              </div>
              <div className="p-4 sm:p-6">
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  placeholder="Tulis konten artikel di sini..."
                  editable={true}
                />
                {errors.content && <p className="text-sm text-red-500 mt-2">{errors.content}</p>}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6 order-first lg:order-last">
            {/* Publish */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Publish</h3>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {post?.status === 'published' ? (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium">Published</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 text-xs font-medium">Draft</span>
                  )}
                  {post?.isFeatured && (
                    <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-2 block">Status</label>
                  <div className="flex gap-4 flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={formData.status === 'draft'}
                        onChange={() => setFormData({ ...formData, status: 'draft' })}
                        className="h-4 w-4 text-emerald-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-slate-300">Draft</span>
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
                      <span className="text-sm text-gray-700 dark:text-slate-300">Published</span>
                    </label>
                  </div>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 h-10"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </div>
            </motion.div>

            {/* Category */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                  <FolderOpen className="w-4 h-4" />
                  Kategori
                </h3>
              </div>
              <div className="p-4 sm:p-6">
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-slate-700 text-sm bg-gray-50 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Tidak ada kategori</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Featured */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                  <Star className="w-4 h-4 text-amber-500" />
                  Featured Post
                </h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-slate-300">Tampilkan di homepage</span>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Tags</h3>
              </div>
              <div className="p-4 sm:p-6 space-y-3">
                <Input
                  placeholder="tips, cleaning, rumah (pisah dengan koma)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                />
                <p className="text-xs text-gray-400 dark:text-slate-500">Pisahkan dengan koma</p>
              </div>
            </motion.div>

            {/* Post Info */}
            {post && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden"
              >
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-slate-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Info Post</h3>
                </div>
                <div className="p-4 sm:p-6 space-y-3 text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                    <span className="text-gray-500 dark:text-slate-400">Slug</span>
                    <code className="text-xs bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded text-gray-700 dark:text-slate-300 truncate max-w-[200px] sm:max-w-none">/{post.slug}</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-slate-400">Created</span>
                    <span className="text-gray-700 dark:text-slate-300">{new Date(post.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-slate-400">Updated</span>
                    <span className="text-gray-700 dark:text-slate-300">{new Date(post.updatedAt).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-6 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 sm:rounded-2xl p-6 w-full h-full sm:h-auto sm:max-w-md shadow-2xl"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hapus Post?</h3>
            <p className="text-gray-600 dark:text-slate-300 mb-6">
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
