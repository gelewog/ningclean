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
  getCustomerBookings,
  updateCustomer,
  getServices,
  createService,
  updateService,
  deleteService,
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
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getJobListings,
  createJobListing,
  updateJobListing,
  deleteJobListing,
  getServiceAreas,
  createServiceArea,
  updateServiceArea,
  deleteServiceArea,
  getPricingPlans,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  getCompanyStats,
  createCompanyStat,
  updateCompanyStat,
  deleteCompanyStat,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
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

export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Customer berhasil diperbarui')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal memperbarui customer')
    },
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

export function useCreateService() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service berhasil dibuat')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal membuat service')
    },
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service berhasil diperbarui')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal memperbarui service')
    },
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service berhasil dihapus')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menghapus service')
    },
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

export function useCreateTestimonial() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
      toast.success('Testimonial berhasil dibuat')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal membuat testimonial')
    },
  })
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateTestimonial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
      toast.success('Testimonial berhasil diperbarui')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal memperbarui testimonial')
    },
  })
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
      toast.success('Testimonial berhasil dihapus')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menghapus testimonial')
    },
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

export function useCreateTeamMember() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] })
      toast.success('Team member berhasil ditambahkan')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menambahkan team member')
    },
  })
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateTeamMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] })
      toast.success('Team member berhasil diperbarui')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal memperbarui team member')
    },
  })
}

export function useDeleteTeamMember() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] })
      toast.success('Team member berhasil dihapus')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menghapus team member')
    },
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

export function useCreateGalleryItem() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createGalleryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
      toast.success('Item gallery berhasil ditambahkan')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menambahkan item gallery')
    },
  })
}

export function useUpdateGalleryItem() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateGalleryItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
      toast.success('Item gallery berhasil diperbarui')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal memperbarui item gallery')
    },
  })
}

export function useDeleteGalleryItem() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteGalleryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
      toast.success('Item gallery berhasil dihapus')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menghapus item gallery')
    },
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

export function useCreateFaq() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createFAQ,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq'] })
      toast.success('FAQ berhasil ditambahkan')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menambahkan FAQ')
    },
  })
}

export function useUpdateFaq() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateFAQ(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq'] })
      toast.success('FAQ berhasil diperbarui')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal memperbarui FAQ')
    },
  })
}

export function useDeleteFaq() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteFAQ,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq'] })
      toast.success('FAQ berhasil dihapus')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menghapus FAQ')
    },
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

export function useCreateServiceArea() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createServiceArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-areas'] })
      toast.success('Area berhasil ditambahkan')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menambahkan area')
    },
  })
}

export function useUpdateServiceArea() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateServiceArea(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-areas'] })
      toast.success('Area berhasil diperbarui')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal memperbarui area')
    },
  })
}

export function useDeleteServiceArea() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteServiceArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-areas'] })
      toast.success('Area berhasil dihapus')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menghapus area')
    },
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

export function useCreatePricingPlan() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createPricingPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-plans'] })
      toast.success('Pricing plan berhasil ditambahkan')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menambahkan pricing plan')
    },
  })
}

export function useUpdatePricingPlan() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updatePricingPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-plans'] })
      toast.success('Pricing plan berhasil diperbarui')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal memperbarui pricing plan')
    },
  })
}

export function useDeletePricingPlan() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deletePricingPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-plans'] })
      toast.success('Pricing plan berhasil dihapus')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menghapus pricing plan')
    },
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

export function useCreateCompanyStat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCompanyStat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-stats'] })
      toast.success('Company stat berhasil dibuat')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal membuat company stat')
    },
  })
}

export function useUpdateCompanyStat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCompanyStat(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-stats'] })
      toast.success('Company stat berhasil diperbarui')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal memperbarui company stat')
    },
  })
}

export function useDeleteCompanyStat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCompanyStat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-stats'] })
      toast.success('Company stat berhasil dihapus')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menghapus company stat')
    },
  })
}

// ═══════════════════════════════════════════════════════════
// CAREER QUERIES
// ═══════════════════════════════════════════════════════════

export function useCareers() {
  return useQuery({
    queryKey: ['careers'],
    queryFn: getJobListings,
    staleTime: 10 * 60 * 1000,
  })
}

export function useCreateCareer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createJobListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careers'] })
      toast.success('Lowongan berhasil dibuat')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal membuat lowongan')
    },
  })
}

export function useUpdateCareer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateJobListing(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careers'] })
      toast.success('Lowongan berhasil diperbarui')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal memperbarui lowongan')
    },
  })
}

export function useDeleteCareer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteJobListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careers'] })
      toast.success('Lowongan berhasil dihapus')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menghapus lowongan')
    },
  })
}

// ═══════════════════════════════════════════════════════════
// USER QUERIES
// ═══════════════════════════════════════════════════════════

interface UseUsersParams {
  page?: number
  limit?: number
  search?: string
  role?: string
}

export function useUsers(params: UseUsersParams = {}) {
  const { page = 1, limit = 10, search, role } = params
  
  return useQuery({
    queryKey: ['users', { page, limit, search, role }],
    queryFn: () => getUsers({ page, limit, search, role }),
    staleTime: 5 * 60 * 1000, // 5 menit
    placeholderData: keepPreviousData,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User berhasil dibuat')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal membuat user')
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User berhasil diperbarui')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal memperbarui user')
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User berhasil dihapus')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gagal menghapus user')
    },
  })
}
