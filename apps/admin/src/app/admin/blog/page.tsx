'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search, Eye, Image as ImageIcon, Calendar, FolderOpen, Star, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/admin/Pagination'
import { getBlogPosts, deleteBlogPost } from '@/lib/api'
import { Breadcrumb } from '@/components/admin/Breadcrumb'
import { BlogPost } from '@/types'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'

export default function BlogPage() {
  const [posts, setPosts] = React.useState<BlogPost[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [pagination, setPagination] = React.useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [statusFilter, setStatusFilter] = React.useState('')
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  React.useEffect(() => {
    fetchPosts()
  }, [pagination.page, statusFilter])

  async function fetchPosts() {
    setLoading(true)
    try {
      const response = await getBlogPosts({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter || undefined,
      })
      setPosts(response.data)
      setPagination((prev) => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages,
      }))
    } catch (error) {
      toast.error('Gagal memuat posts')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(true)
    try {
      await deleteBlogPost(id)
      toast.success('Post berhasil dihapus')
      setDeleteId(null)
      fetchPosts()
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus post')
    } finally {
      setDeleting(false)
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.slug.toLowerCase().includes(search.toLowerCase())
  )

  // Helper untuk mendapatkan URL thumbnail
  const getThumbnailUrl = (coverImage: string | undefined): string => {
    if (!coverImage) return '';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';
    const fullUrl = coverImage.startsWith('http') ? coverImage : `${baseUrl}${coverImage}`;
    // Ganti path ke thumbs
    return fullUrl.replace('/gallery/', '/gallery/thumbs/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Blog' }]} />

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Blog</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Kelola artikel blog</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/blog/categories">
              <Button variant="outline">
                <FolderOpen className="mr-2 h-4 w-4" />
                Kategori
              </Button>
            </Link>
            <Link href="/admin/blog/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Post Baru
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
            <Input
              placeholder="Cari post..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-900"
            />
          </div>
          <select
            className="h-10 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm dark:text-slate-200"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
          >
            <option value="">Semua Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </motion.div>

        {/* Posts List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm dark:shadow-slate-900/50">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 dark:border-slate-700 border-t-emerald-500" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                  <Eye className="h-8 w-8 text-gray-400 dark:text-slate-500" />
                </div>
                <p className="text-gray-500 dark:text-slate-400 mb-4">Belum ada post</p>
                <Link href="/admin/blog/new">
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Post Pertama
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="h-16 w-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800 flex-shrink-0">
                      {post.coverImage ? (
                        <img
                          src={getThumbnailUrl(post.coverImage)}
                          alt={post.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">{post.title}</h3>
                        {post.isFeatured && (
                          <Star className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.createdAt)}
                        </span>
                        <Badge
                          variant={post.status === 'published' ? 'success' : 'default'}
                          className="text-xs"
                        >
                          {post.status}
                        </Badge>
                        {post.category && (
                          <Badge variant="info" className="text-xs">
                            {post.category.name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link href={`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3001'}/blog/${post.slug}`} target="_blank">
                        <Button variant="ghost" size="sm" className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:text-slate-300">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/blog/${post.id}`}>
                        <Button variant="ghost" size="sm" className="text-gray-400 dark:text-slate-500 hover:text-emerald-600">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(post.id)}
                        className="text-gray-400 dark:text-slate-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="border-t border-gray-100 dark:border-slate-700 px-4 py-3">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hapus Post?</h3>
            <p className="text-gray-600 dark:text-slate-300 mb-6">
              Yakin ingin menghapus post ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Batal
              </Button>
              <Button
                onClick={() => handleDelete(deleteId)}
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
