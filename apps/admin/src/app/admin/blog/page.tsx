'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search, Eye, Image as ImageIcon, Calendar, Tag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/admin/Modal'
import { Pagination } from '@/components/admin/Pagination'
import { DataTable } from '@/components/admin/DataTable'
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/api'
import { formatDate, truncate } from '@/lib/utils'
import { toast } from 'sonner'

interface BlogFormData {
  title: string
  content: string
  excerpt: string
  coverImage: string
  status: 'draft' | 'published'
  tags: string
}

export default function BlogPage() {
  const [posts, setPosts] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false)
  const [selectedPost, setSelectedPost] = React.useState<any>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [pagination, setPagination] = React.useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [statusFilter, setStatusFilter] = React.useState('')
  const [formData, setFormData] = React.useState<BlogFormData>({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    status: 'draft',
    tags: '',
  })
  const [errors, setErrors] = React.useState<Partial<BlogFormData>>({})

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
      toast.error('Failed to fetch blog posts')
    } finally {
      setLoading(false)
    }
  }

  function openCreateModal() {
    setIsEditing(false)
    setSelectedPost(null)
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      coverImage: '',
      status: 'draft',
      tags: '',
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openEditModal(post: any) {
    setIsEditing(true)
    setSelectedPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      coverImage: post.coverImage || '',
      status: post.status,
      tags: post.tags?.join(', ') || '',
    })
    setErrors({})
    setIsModalOpen(true)
  }

  function openDeleteModal(post: any) {
    setSelectedPost(post)
    setIsDeleteModalOpen(true)
  }

  function openPreview(post: any) {
    setSelectedPost(post)
    setIsPreviewOpen(true)
  }

  function validateForm(): boolean {
    const newErrors: Partial<BlogFormData> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.content.trim()) newErrors.content = 'Content is required'
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return

    const postData = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      coverImage: formData.coverImage,
      status: formData.status,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
    }

    try {
      if (isEditing && selectedPost) {
        await updateBlogPost(selectedPost.id, postData)
        toast.success('Blog post updated successfully')
      } else {
        await createBlogPost(postData)
        toast.success('Blog post created successfully')
      }
      setIsModalOpen(false)
      fetchPosts()
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} blog post`)
    }
  }

  async function handleDelete() {
    if (!selectedPost) return
    try {
      await deleteBlogPost(selectedPost.id)
      toast.success('Blog post deleted successfully')
      setIsDeleteModalOpen(false)
      fetchPosts()
    } catch (error) {
      toast.error('Failed to delete blog post')
    }
  }

  async function handleToggleStatus(post: any) {
    try {
      const newStatus = post.status === 'published' ? 'draft' : 'published'
      await updateBlogPost(post.id, { ...post, status: newStatus })
      toast.success(`Post ${newStatus === 'published' ? 'published' : 'unpublished'}`)
      fetchPosts()
    } catch (error) {
      toast.error('Failed to update post status')
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          {row.coverImage ? (
            <img
              src={row.coverImage}
              alt=""
              className="h-10 w-10 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <ImageIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{truncate(value, 40)}</p>
            <p className="text-xs text-gray-500">{row.author}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'excerpt',
      label: 'Excerpt',
      render: (value: string) => (
        <span className="text-sm text-gray-500">{truncate(value || '', 60)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'published' ? 'success' : 'default'}>
          {value === 'published' ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value?.slice(0, 2).map((tag, i) => (
            <span key={i} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              <Tag className="mr-1 h-3 w-3" />
              {tag}
            </span>
          ))}
          {value?.length > 2 && (
            <span className="text-xs text-gray-400">+{value.length - 2}</span>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value: string) => (
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(value)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => openPreview(row)}>
            <Eye className="h-4 w-4" />
          </Button>
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

  const STATUS_OPTIONS = [
    { value: '', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-500">Manage blog posts and articles</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-4 md:flex-row"
      >
        <select
          className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPagination((prev) => ({ ...prev, page: 1 })); }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Posts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={posts}
              loading={loading}
              onRowClick={openPreview}
            />
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Post' : 'Create New Post'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            placeholder="Enter post title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
          />

          <Textarea
            label="Excerpt"
            placeholder="Brief description of the post..."
            className="h-20"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            error={errors.excerpt}
          />

          <Textarea
            label="Content (Markdown supported)"
            placeholder="Write your post content here..."
            className="min-h-[200px]"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            error={errors.content}
          />

          <Input
            label="Cover Image URL"
            placeholder="https://images.unsplash.com/..."
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            icon={<ImageIcon className="h-4 w-4" />}
          />

          <Input
            label="Tags (comma separated)"
            placeholder="tips, cleaning, home"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={formData.status === 'draft'}
                  onChange={() => setFormData({ ...formData, status: 'draft' })}
                  className="h-4 w-4 text-primary"
                />
                <span className="text-sm">Draft</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={formData.status === 'published'}
                  onChange={() => setFormData({ ...formData, status: 'published' })}
                  className="h-4 w-4 text-primary"
                />
                <span className="text-sm">Published</span>
              </label>
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

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Post Preview"
        size="xl"
      >
        {selectedPost && (
          <div className="space-y-4">
            {selectedPost.coverImage && (
              <img
                src={selectedPost.coverImage}
                alt=""
                className="h-48 w-full rounded-lg object-cover"
              />
            )}
            <div className="flex items-center gap-2">
              <Badge variant={selectedPost.status === 'published' ? 'success' : 'default'}>
                {selectedPost.status === 'published' ? 'Published' : 'Draft'}
              </Badge>
              <span className="text-sm text-gray-500">
                {formatDate(selectedPost.createdAt)}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedPost.title}</h1>
            {selectedPost.excerpt && (
              <p className="text-lg text-gray-600">{selectedPost.excerpt}</p>
            )}
            <div className="prose max-w-none border-t pt-4">
              <p className="whitespace-pre-wrap text-gray-700">{selectedPost.content}</p>
            </div>
            {selectedPost.tags && selectedPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t pt-4">
                {selectedPost.tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                Close
              </Button>
              <Button onClick={() => { setIsPreviewOpen(false); openEditModal(selectedPost); }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Post"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedPost?.title}</strong>? This action cannot be undone.
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
