'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Eye, Star, FolderOpen, ChevronRight } from 'lucide-react'
import { ImageUpload, useImageUpload } from '@/components/ui/ImageUpload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { RichTextEditor } from '@/components/editor/RichTextEditor'
import Link from 'next/link'
import { createBlogPost, getBlogCategories, BlogCategory } from '@/lib/api'
import { toast } from 'sonner'
import { Breadcrumb } from '@/components/admin/Breadcrumb'

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

export default function NewBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [categories, setCategories] = React.useState<BlogCategory[]>([])
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
  const [selectedCoverFile, setSelectedCoverFile] = React.useState<File | null>(null)
  const { uploadImage } = useImageUpload()

  React.useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      const data = await getBlogCategories()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories')
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

    setLoading(true)
    try {
      // Upload cover image jika ada file yang dipilih
      let coverImageUrl = formData.coverImage
      if (selectedCoverFile) {
        const uploadedUrl = await uploadImage(selectedCoverFile, 'gallery')
        if (uploadedUrl) {
          coverImageUrl = uploadedUrl
        } else {
          toast.error('Gagal upload cover image')
          setLoading(false)
          return
        }
      }

      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      
      // Konversi status ke publishedAt untuk database
      const publishedAt = formData.status === 'published' ? new Date().toISOString() : null
      
      await createBlogPost({
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        content: formData.content,
        excerpt: formData.excerpt,
        coverImage: coverImageUrl,
        author: 'Admin', // Default author
        tags,
        categoryId: formData.categoryId || undefined,
        isFeatured: formData.isFeatured,
        publishedAt,
      })
      setSelectedCoverFile(null)
      toast.success('Post berhasil dibuat')
      router.push('/admin/blog')
    } catch (error: any) {
      toast.error(error.message || 'Gagal membuat post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Blog', href: '/admin/blog' }, { label: 'New Post' }]} />

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
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">Buat Post Baru</h1>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Tulis artikel blog baru</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" onClick={() => router.push('/admin/blog')} className="h-9 sm:h-10 px-3 sm:px-4">
              <span className="hidden sm:inline">Batal</span>
              <span className="sm:hidden">Batal</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                // Simpan draft ke localStorage untuk preview (fallback untuk local dev)
                const draftData = {
                  title: formData.title || 'Untitled',
                  content: formData.content,
                  excerpt: formData.excerpt,
                  coverImage: formData.coverImage,
                  author: 'Admin Ningclean',
                  tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                  readTime: 5,
                  createdAt: new Date().toISOString(),
                  slug: '',
                  category: undefined,
                }
                localStorage.setItem('blog_draft_preview', JSON.stringify(draftData))
                // Open preview dengan URL dari environment variable
                const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3001'
                window.open(`${webUrl}/admin/blog/preview`, '_blank')
              }}
              className="h-9 sm:h-10 px-2 sm:px-4"
            >
              <Eye className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Preview Draft</span>
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 h-9 sm:h-10 px-3 sm:px-4"
            >
              <Save className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">{loading ? 'Menyimpan...' : 'Simpan'}</span>
              <span className="sm:hidden">{loading ? '...' : 'Simpan'}</span>
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
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 h-10"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Post'}
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
          </div>
        </div>
      </div>
    </div>
  )
}
