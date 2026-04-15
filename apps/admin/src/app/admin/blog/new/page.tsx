'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Image as ImageIcon, Eye, Star, FolderOpen, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { RichTextEditor } from '@/components/editor/RichTextEditor'
import Link from 'next/link'
import { createBlogPost, getBlogCategories, BlogCategory } from '@/lib/api'
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
      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      await createBlogPost({
        ...formData,
        tags,
      })
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
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-700 px-4 md:px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
          <span>Admin</span>
          <ChevronRight className="w-4 h-4" />
          <Link href="/admin/blog" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Blog</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium">Post Baru</span>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <Link href="/admin/blog" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-slate-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Buat Post Baru</h1>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Tulis artikel blog baru</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push('/admin/blog')}>
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Menyimpan...' : 'Simpan'}
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
              <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                <h3 className="font-semibold text-gray-900 dark:text-white">Judul Artikel</h3>
              </div>
              <div className="p-6">
                <Input
                  placeholder="Judul artikel..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`text-xl font-semibold border-0 p-0 h-auto focus:ring-0 placeholder:text-gray-300 dark:text-slate-600 bg-transparent ${errors.title ? 'border-red-500' : ''}`}
                  style={{ fontSize: '24px', fontWeight: 600 }}
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
              <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                <h3 className="font-semibold text-gray-900 dark:text-white">Cover Image</h3>
              </div>
              <div className="p-6">
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
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => setFormData({ ...formData, coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' })}
                    className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl p-12 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    <ImageIcon className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-slate-400">Klik untuk set cover image (demo)</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">atau paste URL image</p>
                  </div>
                )}
                <Input
                  placeholder="Atau paste URL gambar..."
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="mt-3 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700"
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
              <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                <h3 className="font-semibold text-gray-900 dark:text-white">Excerpt</h3>
              </div>
              <div className="p-6">
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
              <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Content</h3>
                <Badge variant="info" className="text-xs">Rich Text</Badge>
              </div>
              <div className="p-6">
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
          <div className="space-y-6">
            {/* Publish */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                <h3 className="font-semibold text-gray-900 dark:text-white">Publish</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-2 block">Status</label>
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
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
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
              <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  Kategori
                </h3>
              </div>
              <div className="p-6">
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
              <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  Featured Post
                </h3>
              </div>
              <div className="p-6">
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
              <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                <h3 className="font-semibold text-gray-900 dark:text-white">Tags</h3>
              </div>
              <div className="p-6 space-y-3">
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
