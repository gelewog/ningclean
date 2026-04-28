'use client'

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getDashboardStats,
  getRecentBookings,
  getBookings,
  updateBookingStatus,
  getCustomers,
  getServices,
  getBlogCategories,
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getTestimonials,
  getTeamMembers,
  getGalleryItems,
  getFAQs,
  getCareerItems,
  getServiceAreas,
  getPricingPlans,
  getCompanyStats,
} from './api'

// ═══════════════════════════════════════════════════════════
// DASHBOARD QUERIES
// ═══════════════════════════════════════════════════════════

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    staleTime: 2 * 60 * 1000, // 2 menit
    gcTime: 5 * 60 * 1000, // 5 menit
  })
}

export function useRecentBookings(limit = 5) {
  return useQuery({
    queryKey: ['recent-bookings', limit],
    queryFn: () => getRecentBookings(limit),
    staleTime: 1 * 60 * 1000, // 1 menit
  })
}

// ═══════════════════════════════════════════════════════════
// BOOKING QUERIES
// ═══════════════════════════════════════════════════════════

interface UseBookingsParams {
  page?: number
  limit?: number
  status?: string
  area?: string
  search?: string
}

export function useBookings(params: UseBookingsParams) {
  const { page = 1, limit = 10, status, area, search } = params
  
  return useQuery({
    queryKey: ['bookings', { page, limit, status, area, search }],
    queryFn: () => getBookings({ page, limit, status, area, search }),
    staleTime: 1 * 60 * 1000, // 1 menit
    gcTime: 5 * 60 * 1000, // 5 menit
    placeholderData: keepPreviousData, // Tampilkan data lama saat loading
  })
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateBookingStatus(id, status),
    onSuccess: () => {
      // Invalidate bookings cache setelah update
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['recent-bookings'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Status booking berhasil diperbarui')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal memperbarui status')
    },
  })
}

// ═══════════════════════════════════════════════════════════
// CUSTOMER QUERIES
// ═══════════════════════════════════════════════════════════

interface UseCustomersParams {
  page?: number
  limit?: number
  search?: string
}

export function useCustomers(params: UseCustomersParams = {}) {
  const { page = 1, limit = 10, search } = params
  
  return useQuery({
    queryKey: ['customers', { page, limit, search }],
    queryFn: () => getCustomers({ page, limit, search }),
    staleTime: 5 * 60 * 1000, // 5 menit
    placeholderData: keepPreviousData,
  })
}

// ═══════════════════════════════════════════════════════════
// SERVICE QUERIES
// ═══════════════════════════════════════════════════════════

export function useServices(includeInactive = false) {
  return useQuery({
    queryKey: ['services', includeInactive],
    queryFn: () => getServices(includeInactive),
    staleTime: 10 * 60 * 1000, // 10 menit (services jarang berubah)
  })
}

// ═══════════════════════════════════════════════════════════
// BLOG QUERIES
// ═══════════════════════════════════════════════════════════

export function useBlogCategories() {
  return useQuery({
    queryKey: ['blog-categories'],
    queryFn: getBlogCategories,
    staleTime: 30 * 60 * 1000, // 30 menit (categories jarang berubah)
  })
}

interface UseBlogPostsParams {
  page?: number
  limit?: number
  status?: 'all' | 'draft' | 'published'
}

export function useBlogPosts(params: UseBlogPostsParams = {}) {
  const { page = 1, limit = 10, status = 'all' } = params
  
  return useQuery({
    queryKey: ['blog-posts', { page, limit, status }],
    queryFn: () => getBlogPosts({ page, limit, status }),
    staleTime: 5 * 60 * 1000, // 5 menit
    placeholderData: keepPreviousData,
  })
}

export function useBlogPost(id: string) {
  return useQuery({
    queryKey: ['blog-post', id],
    queryFn: () => getBlogPostById(id),
    staleTime: 2 * 60 * 1000,
    enabled: !!id && id !== 'new', // Hanya fetch jika id ada dan bukan 'new'
  })
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      // Invalidate blog posts cache
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Blog post berhasil dibuat')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal membuat blog post')
    },
  })
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateBlogPost(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific post dan list
      queryClient.invalidateQueries({ queryKey: ['blog-post', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
      toast.success('Blog post berhasil diperbarui')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal memperbarui blog post')
    },
  })
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Blog post berhasil dihapus')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menghapus blog post')
    },
  })
}

export function useCreateBlogCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createBlogCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] })
      toast.success('Kategori berhasil dibuat')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal membuat kategori')
    },
  })
}

export function useUpdateBlogCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateBlogCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] })
      toast.success('Kategori berhasil diperbarui')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal memperbarui kategori')
    },
  })
}

export function useDeleteBlogCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteBlogCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] })
      toast.success('Kategori berhasil dihapus')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menghapus kategori')
    },
  })
}

// ═══════════════════════════════════════════════════════════
// TESTIMONIAL QUERIES
// ═══════════════════════════════════════════════════════════

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: getTestimonials,
    staleTime: 10 * 60 * 1000,
  })
}

// ═══════════════════════════════════════════════════════════
// TEAM MEMBER QUERIES
// ═══════════════════════════════════════════════════════════

export function useTeamMembers() {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: getTeamMembers,
    staleTime: 10 * 60 * 1000,
  })
}

// ═══════════════════════════════════════════════════════════
// GALLERY QUERIES
// ═══════════════════════════════════════════════════════════

export function useGallery() {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: getGalleryItems,
    staleTime: 10 * 60 * 1000,
  })
}

// ═══════════════════════════════════════════════════════════
// FAQ QUERIES
// ═══════════════════════════════════════════════════════════

export function useFaq() {
  return useQuery({
    queryKey: ['faq'],
    queryFn: getFAQs,
    staleTime: 30 * 60 * 1000,
  })
}

// ═══════════════════════════════════════════════════════════
// SERVICE AREA QUERIES
// ═══════════════════════════════════════════════════════════

export function useServiceAreas() {
  return useQuery({
    queryKey: ['service-areas'],
    queryFn: getServiceAreas,
    staleTime: 30 * 60 * 1000,
  })
}

// ═══════════════════════════════════════════════════════════
// PRICING QUERIES
// ═══════════════════════════════════════════════════════════

export function usePricingPlans() {
  return useQuery({
    queryKey: ['pricing-plans'],
    queryFn: getPricingPlans,
    staleTime: 30 * 60 * 1000,
  })
}

// ═══════════════════════════════════════════════════════════
// COMPANY STATS QUERIES
// ═══════════════════════════════════════════════════════════

export function useCompanyStats() {
  return useQuery({
    queryKey: ['company-stats'],
    queryFn: getCompanyStats,
    staleTime: 10 * 60 * 1000,
  })
}

// ═══════════════════════════════════════════════════════════
// CAREER QUERIES
// ═══════════════════════════════════════════════════════════

export function useCareers() {
  return useQuery({
    queryKey: ['careers'],
    queryFn: getCareers,
    staleTime: 10 * 60 * 1000,
  })
}
