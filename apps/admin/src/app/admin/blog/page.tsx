'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search, Eye, Image as ImageIcon, Calendar, FolderOpen, Star, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/admin/Pagination'
import { getBlogPosts, deleteBlogPost } from '@/lib/api'
import { useBlogPosts, useDeleteBlogPost } from '@/lib/use-queries'
import { Breadcrumb } from '@/components/admin/Breadcrumb'
import { DataTable } from '@/components/admin/DataTable'
import { BlogPost } from '@/types'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'

export default function BlogPage() {
  const [search, setSearch] = React.useState('')
  const [pagination, setPagination] = React.useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'draft' | 'published'>('all')
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  const { data: postsResponse, isLoading: loading, refetch } = useBlogPosts({
    page: pagination.page,
    limit: pagination.limit,
    status: statusFilter === 'all' ? undefined : statusFilter || undefined,
  })

  const posts = postsResponse?.data || []
  const total = postsResponse?.total || 0
  const totalPages = postsResponse?.totalPages || 0

  React.useEffect(() => {
    if (postsResponse) {
      setPagination(prev => ({
        ...prev,
        total,
        totalPages
      }))
    }
  }, [postsResponse])

  async function handleDelete(id: string) {
    setDeleting(true)
    try {
      await deleteBlogPost(id)
      toast.success('Post berhasil dihapus')
      setDeleteId(null)
      refetch()
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

  // Helper untuk mendapatkan badge color berdasarkan status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'draft':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-400 border-gray-200 dark:border-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Blog' }]} />

      <div className="w-full px-3 sm:px-6 py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-start justify-between gap-3 sm:gap-4"
        >
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Blog</h1>
              <div className="flex items-center gap-2">
                <Link href="/admin/blog/categories">
                  <Button variant="outline" className="h-8 px-3">
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/admin/blog/new">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 h-8 px-3">
                    <Plus className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-0.5">Kelola artikel blog</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-slate-600">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Total: </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{total}</span>
            </div>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-3 sm:p-4"
        >
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500 z-10 pointer-events-none" />
              <Input
                placeholder="Cari post..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 relative z-1"
              />
            </div>
            <div className="flex gap-2 flex-1 sm:flex-none">
              <select
                className="h-10 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm text-gray-700 dark:text-slate-200 flex-1 sm:flex-none"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value as 'all' | 'draft' | 'published'); setPagination(prev => ({ ...prev, page: 1 })); }}
              >
                <option value="all">Semua Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Posts List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="sm:bg-white sm:dark:bg-slate-900 sm:shadow-sm sm:border sm:border-gray-200 dark:sm:border-slate-700 sm:rounded-2xl overflow-hidden">
            <DataTable
              columns={[
                {
                  key: 'coverImage',
                  label: '',
                  render: (value: string, row: BlogPost) => (
                    <div className="h-12 w-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800 flex-shrink-0">
                      {value ? (
                        <img
                          src={getThumbnailUrl(value)}
                          alt={row.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-gray-300 dark:text-slate-600" />
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  key: 'title',
                  label: 'Judul',
                  render: (value: string, row: BlogPost) => (
                    <div className="flex flex-col"
                    >
                      <span className="font-medium text-gray-900 dark:text-white"
                      >{value}</span>
                      <div className="flex items-center gap-2 mt-1"
                      >
                        {row.isFeatured && (
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusBadgeClass(row.status)}`}
                        >
                          {row.status}
                        </span>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'category',
                  label: 'Kategori',
                  render: (value: any, row: BlogPost) => (
                    row.category?.name || '-'
                  )
                },
                {
                  key: 'createdAt',
                  label: 'Dibuat',
                  render: (value: string) => (
                    <span className="text-sm text-gray-500 dark:text-slate-400">{formatDate(value)}</span>
                  ),
                },
              ]}
              data={filteredPosts}
              loading={loading}
              renderCard={(row: BlogPost) => (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.99] overflow-hidden"
                >
                  {/* Cover Image */}
                  <div className="relative h-32 bg-gray-100 dark:bg-slate-800">
                    {row.coverImage ? (
                      <img
                        src={getThumbnailUrl(row.coverImage)}
                        alt={row.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-gray-300 dark:text-slate-600" />
                      </div>
                    )}
                    {/* Status Badge - Top Right */}
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusBadgeClass(row.status)}`}>
                        {row.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    {/* Featured Badge - Top Left */}
                    {row.isFeatured && (
                      <div className="absolute top-3 left-3">
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          <Star className="h-3 w-3 fill-amber-500" />
                          FEATURED
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Title */}
                    <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-2 mb-2">
                      {row.title}
                    </h3>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(row.createdAt)}
                      </span>
                      <span>•</span>
                      <span className="truncate max-w-[100px]" title={row.slug}>
                        /{row.slug}
                      </span>
                    </div>

                    {/* Category */}
                    {row.category && row.category.name && (
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800"
                        >
                          <FolderOpen className="h-3 w-3" />
                          {row.category.name}
                        </span>
                      </div>
                    )}

                    {/* Footer - Views & Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700/50">
                      <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-slate-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {(row as BlogPost).views || 0} views
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link href={`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3001'}/blog/${row.slug}`} target="_blank">
                          <button className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-slate-500">
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </Link>
                        <Link href={`/admin/blog/${row.id}`}>
                          <button className="h-8 w-8 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400">
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setDeleteId(row.id); }}
                          className="h-8 w-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              skeletonCard={(i: number) => (
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                  {/* Cover Image Skeleton */}
                  <div className="h-32 bg-gray-200 dark:bg-slate-700" />
                  {/* Content Skeleton */}
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-full rounded bg-gray-200 dark:bg-slate-700" />
                    <div className="h-4 w-3/4 rounded bg-gray-100 dark:bg-slate-700" />
                    <div className="h-6 w-20 rounded-full bg-blue-100 dark:bg-slate-700" />
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                      <div className="h-4 w-16 rounded bg-gray-100 dark:bg-slate-700" />
                      <div className="flex gap-1">
                        <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-slate-700" />
                        <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-slate-700" />
                        <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-slate-700" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              emptyState={
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
              }
            />
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-100 dark:border-slate-700 px-4 py-3">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={totalPages}
                  onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-6 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 sm:rounded-2xl p-6 w-full h-full sm:h-auto sm:max-w-md shadow-2xl"
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
