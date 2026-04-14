import { Booking, Customer, Service, BlogPost, DashboardStats, PaginatedResponse } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

interface FetchOptions extends RequestInit {
  token?: string | null
}

// Helper: fetch with auth
async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Token management
const TOKEN_KEY = 'admin_token'
const USER_KEY = 'admin_user'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getUser(): { id: string; name: string; email: string; role: string } | null {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

export function setUser(user: { id: string; name: string; email: string; role: string }): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// Auth
export async function login(email: string, password: string) {
  try {
    const response = await fetchApi<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    if (response.access_token) {
      setToken(response.access_token)
      setUser(response.user)
    }
    
    return response
  } catch (error: any) {
    throw new Error(error.message || 'Login failed')
  }
}

export async function logout() {
  removeToken()
}

// Dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
  const token = getToken()
  const data = await fetchApi<any>('/admin/stats', { token })
  
  return {
    totalBookings: data.bookings?.total || 0,
    totalRevenue: data.revenue?.total || 0,
    totalCustomers: data.users?.customers || 0,
    pendingBookings: data.bookings?.pending || 0,
    bookingsTrend: 0,
    revenueTrend: 0,
  }
}

export async function getRecentBookings(limit = 5): Promise<Booking[]> {
  const token = getToken()
  // Use the bookings endpoint with limit
  const data = await fetchApi<{
    data: any[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>(`/bookings?limit=${limit}`, { token })
  
  if (!data.data || !Array.isArray(data.data)) {
    return []
  }
  
  return data.data.map((b: any) => {
    const firstItem = b.items?.[0]
    const firstItemPrice = firstItem ? Number(firstItem.price) : 0
    
    return {
      id: b.id,
      customerId: b.customerId,
      customerName: b.customer?.name || 'Unknown',
      customerEmail: b.customer?.email || '',
      customerPhone: b.customer?.phone || '',
      serviceId: firstItem?.service?.id || '',
      serviceName: firstItem?.service?.name || 'Unknown Service',
      servicePrice: firstItemPrice,
      totalAmount: Number(b.totalAmount) || 0,
      area: b.area || '',
      address: b.address || '',
      scheduledDate: b.serviceDate,
      scheduledTime: b.serviceTime,
      status: b.status?.toLowerCase() || 'pending',
      notes: b.notes || '',
      createdAt: b.createdAt,
      items: b.items,
    }
  })
}

// Bookings
export async function getBookings(params?: {
  page?: number
  limit?: number
  status?: string
  search?: string
  area?: string
  dateFrom?: string
  dateTo?: string
}): Promise<PaginatedResponse<Booking>> {
  const token = getToken()
  
  if (!token) {
    console.error('No auth token found')
    return {
      data: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 10,
      totalPages: 0,
    }
  }
  
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.set('page', params.page.toString())
  if (params?.limit) queryParams.set('limit', params.limit.toString())
  if (params?.status) queryParams.set('status', params.status)
  if (params?.search) queryParams.set('search', params.search)
  if (params?.area) queryParams.set('area', params.area)
  if (params?.dateFrom) queryParams.set('dateFrom', params.dateFrom)
  if (params?.dateTo) queryParams.set('dateTo', params.dateTo)
  
  const query = queryParams.toString()
  const endpoint = `/bookings${query ? `?${query}` : ''}`
  
  try {
    const data = await fetchApi<{
      data: any[]
      total: number
      page: number
      limit: number
      totalPages: number
    }>(endpoint, { token })
    
    return {
      data: data.data.map((b: any) => {
        // Get first item's service info for display
        const firstItem = b.items?.[0]
        const firstItemPrice = firstItem ? Number(firstItem.price) : 0
        
        return {
          id: b.id,
          orderNumber: b.orderNumber,
          customerId: b.customerId,
          customerName: b.customer?.name || b.guestName || 'Guest',
          customerEmail: b.customer?.email || b.guestEmail || '',
          customerPhone: b.customer?.phone || b.guestPhone || '',
          serviceId: firstItem?.service?.id || '',
          serviceName: firstItem?.service?.name || 'Unknown Service',
          servicePrice: firstItemPrice,
          totalAmount: Number(b.totalAmount) || 0,
          area: b.area || '',
          address: b.address || '',
          scheduledDate: b.serviceDate,
          scheduledTime: b.serviceTime,
          status: b.status?.toLowerCase() || 'pending',
          notes: b.notes || '',
          createdAt: b.createdAt,
          items: b.items,
        }
      }),
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: data.totalPages,
    }
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    return {
      data: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 10,
      totalPages: 0,
    }
  }
}

export async function updateBookingStatus(id: string, status: string) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/bookings/${id}/status`, {
    method: 'PUT',
    token,
    body: JSON.stringify({ status: status.toUpperCase() }),
  })
}

// Services
export async function getServices(includeInactive = false): Promise<Service[]> {
  const endpoint = includeInactive ? '/services?all=true' : '/services'
  const data = await fetchApi<any[]>(endpoint)
  
  return data.map((s: any) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.description,
    price: Number(s.price),
    duration: s.duration,
    category: s.category || 'general',
    image: s.image,
    icon: s.icon,
    features: s.features || [],
    isActive: s.isActive,
    isFeatured: s.isFeatured || false,
    createdAt: s.createdAt,
  }))
}

export async function createService(data: Partial<Service>) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string; data: Service }>('/services', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })
}

export async function updateService(id: string, data: Partial<Service>) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/services/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  })
}

export async function deleteService(id: string) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/services/${id}`, {
    method: 'DELETE',
    token,
  })
}

// Customers
export async function getCustomers(params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<PaginatedResponse<Customer>> {
  const token = getToken()
  
  const data = await fetchApi<any[]>('/admin/customers', { token })
  
  let filtered = [...data]
  
  if (params?.search) {
    const search = params.search.toLowerCase()
    filtered = filtered.filter(
      (c) => c.name?.toLowerCase().includes(search) || c.email?.toLowerCase().includes(search)
    )
  }
  
  const page = params?.page || 1
  const limit = params?.limit || 10
  const start = (page - 1) * limit
  const end = start + limit
  
  return {
    data: filtered.slice(start, end).map((c: any) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone || '',
      address: '',
      totalBookings: c._count?.bookings || 0,
      totalSpent: 0,
      createdAt: c.createdAt,
      isVip: c.isVip,
      notes: c.notes,
      addresses: c.addresses,
      source: c.source,
    })),
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  }
}

export async function getCustomerBookings(customerId: string): Promise<Booking[]> {
  const token = getToken()

  if (!token) {
    console.error('No auth token found for getCustomerBookings')
    return []
  }

  if (!customerId) {
    console.error('No customerId provided to getCustomerBookings')
    return []
  }

  try {
    const data = await fetchApi<{
      data: any[]
      total: number
      page: number
      limit: number
      totalPages: number
    }>(`/bookings?customerId=${customerId}&limit=100`, { token })

    if (!data || !Array.isArray(data.data)) {
      console.error('Invalid response from bookings API:', data)
      return []
    }

    return data.data.map((b: any) => {
      const firstItem = b.items?.[0]
      const firstItemPrice = firstItem ? Number(firstItem.price) : 0

      return {
        id: b.id,
        customerId: b.customerId,
        customerName: b.customer?.name || 'Unknown',
        customerEmail: b.customer?.email || '',
        customerPhone: b.customer?.phone || '',
        serviceId: firstItem?.service?.id || '',
        serviceName: firstItem?.service?.name || 'Unknown Service',
        servicePrice: firstItemPrice,
        totalAmount: Number(b.totalAmount) || 0,
        area: b.area || '',
        address: b.address || '',
        scheduledDate: b.serviceDate,
        scheduledTime: b.serviceTime,
        status: b.status?.toLowerCase() || 'pending',
        notes: b.notes || '',
        createdAt: b.createdAt,
        items: b.items,
      }
    })
  } catch (error) {
    console.error('Failed to fetch customer bookings:', error)
    return []
  }
}

// Blog
export async function getBlogPosts(params?: {
  page?: number
  limit?: number
  status?: string
}): Promise<PaginatedResponse<BlogPost>> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.set('page', params.page.toString())
  if (params?.limit) queryParams.set('limit', params.limit.toString())
  
  const query = queryParams.toString()
  const endpoint = `/blog${query ? `?${query}` : ''}`
  
  const data = await fetchApi<any[]>(endpoint)
  
  let posts: BlogPost[] = data.map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    content: p.content,
    excerpt: p.excerpt,
    coverImage: p.coverImage,
    status: (p.publishedAt ? 'published' : 'draft') as 'draft' | 'published',
    author: p.author,
    tags: p.tags || [],
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }))
  
  if (params?.status) {
    posts = posts.filter((p) => p.status === params.status)
  }
  
  return {
    data: posts,
    total: posts.length,
    page: 1,
    limit: 10,
    totalPages: 1,
  }
}

export async function createBlogPost(data: Partial<BlogPost>) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string; data: BlogPost }>('/blog', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/blog/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  })
}

export async function deleteBlogPost(id: string) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/blog/${id}`, {
    method: 'DELETE',
    token,
  })
}

export async function getBlogPostById(id: string): Promise<BlogPost> {
  const token = getToken()
  const data = await fetchApi<any>(`/blog/${id}`, { token })
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    content: data.content,
    excerpt: data.excerpt,
    coverImage: data.coverImage,
    status: (data.publishedAt ? 'published' : 'draft') as 'draft' | 'published',
    author: data.author,
    tags: data.tags || [],
    categoryId: data.categoryId,
    category: data.category,
    isFeatured: data.isFeatured || false,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

// Testimonials
export async function getTestimonials() {
  const token = getToken()
  try {
    return await fetchApi<any[]>('/testimonials/admin/all', { token })
  } catch {
    return []
  }
}

export async function createTestimonial(data: any) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>('/testimonials', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })
}

export async function updateTestimonial(id: string, data: any) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/testimonials/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  })
}

export async function deleteTestimonial(id: string) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/testimonials/${id}`, {
    method: 'DELETE',
    token,
  })
}

// Team Members
export async function getTeamMembers() {
  const token = getToken()
  try {
    return await fetchApi<any[]>('/team-members/admin/all', { token })
  } catch {
    return []
  }
}

export async function createTeamMember(data: any) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>('/team-members', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })
}

export async function updateTeamMember(id: string, data: any) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/team-members/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  })
}

export async function deleteTeamMember(id: string) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/team-members/${id}`, {
    method: 'DELETE',
    token,
  })
}

// Company Stats
export async function getCompanyStats() {
  const token = getToken()
  try {
    return await fetchApi<any[]>('/company-stats/admin/all', { token })
  } catch {
    return []
  }
}

export async function createCompanyStat(data: any) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>('/company-stats', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })
}

export async function updateCompanyStat(id: string, data: any) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/company-stats/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  })
}

export async function deleteCompanyStat(id: string) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/company-stats/${id}`, {
    method: 'DELETE',
    token,
  })
}

// Gallery
export async function getGalleryItems() {
  const token = getToken()
  try {
    return await fetchApi<any[]>('/gallery/admin/all', { token })
  } catch {
    return []
  }
}

export async function createGalleryItem(data: any) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>('/gallery', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })
}

export async function updateGalleryItem(id: string, data: any) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/gallery/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  })
}

export async function deleteGalleryItem(id: string) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/gallery/${id}`, {
    method: 'DELETE',
    token,
  })
}

// FAQ
export async function getFAQs() {
  const token = getToken()
  try {
    return await fetchApi<any[]>('/faq/admin/all', { token })
  } catch {
    return []
  }
}

export async function createFAQ(data: any) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>('/faq', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })
}

export async function updateFAQ(id: string, data: any) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/faq/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  })
}

export async function deleteFAQ(id: string) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/faq/${id}`, {
    method: 'DELETE',
    token,
  })
}

// Service Areas
export async function getServiceAreas() {
  const token = getToken()
  try {
    return await fetchApi<any[]>('/service-areas/admin/all', { token })
  } catch {
    return []
  }
}

export async function createServiceArea(data: any) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>('/service-areas', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })
}

export async function updateServiceArea(id: string, data: any) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/service-areas/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  })
}

export async function deleteServiceArea(id: string) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/service-areas/${id}`, {
    method: 'DELETE',
    token,
  })
}

// Job Listings (Careers)
export async function getJobListings() {
  const token = getToken()
  try {
    return await fetchApi<any[]>('/careers/admin/all', { token })
  } catch {
    return []
  }
}

export async function createJobListing(data: any) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>('/careers', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })
}

export async function updateJobListing(id: string, data: any) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/careers/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  })
}

export async function deleteJobListing(id: string) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/careers/${id}`, {
    method: 'DELETE',
    token,
  })
}

// Pricing Plans
export async function getPricingPlans() {
  const token = getToken()
  try {
    return await fetchApi<any[]>('/pricing-plans/admin/all', { token })
  } catch {
    return []
  }
}

export async function createPricingPlan(data: any) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>('/pricing-plans', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })
}

export async function updatePricingPlan(id: string, data: any) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/pricing-plans/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  })
}

export async function deletePricingPlan(id: string) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>(`/pricing-plans/${id}`, {
    method: 'DELETE',
    token,
  })
}

// Notification Settings
export async function getNotificationSettings() {
  const token = getToken()
  try {
    const data = await fetchApi<any>('/notifications/settings', { token })
    // Return defaults if API returns null
    if (!data) {
      return {
        whatsappNumber: '',
        whatsappMessage: '',
        whatsappEnabled: false,
        emailEnabled: false,
        emailHost: 'smtp.gmail.com',
        emailPort: 587,
        emailUser: '',
        emailFrom: '',
        adminEmail: '',
        twilioAccountSid: '',
        twilioAuthToken: '',
        twilioFromNumber: '',
        hasTwilio: false,
        hasPassword: false,
      }
    }
    return data
  } catch (error: any) {
    console.error('Failed to load notification settings:', error)
    // Return defaults on error
    return {
      whatsappNumber: '',
      whatsappMessage: '',
      whatsappEnabled: false,
      emailEnabled: false,
      emailHost: 'smtp.gmail.com',
      emailPort: 587,
      emailUser: '',
      emailFrom: '',
      adminEmail: '',
      twilioAccountSid: '',
      twilioAuthToken: '',
      twilioFromNumber: '',
      hasTwilio: false,
      hasPassword: false,
    }
  }
}

export async function updateNotificationSettings(data: {
  whatsappNumber?: string
  whatsappMessage?: string
  whatsappEnabled?: boolean
  emailEnabled?: boolean
  emailHost?: string
  emailPort?: number
  emailUser?: string
  emailPassword?: string
  emailFrom?: string
  adminEmail?: string
  twilioAccountSid?: string
  twilioAuthToken?: string
  twilioFromNumber?: string
}) {
  const token = getToken()
  return fetchApi<{ success: boolean; message: string }>('/notifications/settings', {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  })
}

// Generic API methods for notifications
export const api = {
  async get(endpoint: string) {
    const token = getToken()
    return fetchApi<any>(endpoint, { token })
  },
  async post(endpoint: string, data?: any) {
    const token = getToken()
    return fetchApi<any>(endpoint, { method: 'POST', token, body: data ? JSON.stringify(data) : undefined })
  },
  async put(endpoint: string, data?: any) {
    const token = getToken()
    return fetchApi<any>(endpoint, { method: 'PUT', token, body: data ? JSON.stringify(data) : undefined })
  },
  async delete(endpoint: string) {
    const token = getToken()
    return fetchApi<any>(endpoint, { method: 'DELETE', token })
  },
}

// Notifications
export interface Notification {
  id: string
  type: 'BOOKING_NEW' | 'BOOKING_STATUS' | 'SYSTEM'
  title: string
  message: string
  isRead: boolean
  data?: any
  createdAt: string
  readAt?: string | null
}

export interface NotificationsResponse {
  data: Notification[]
  total: number
  page: number
  limit: number
  totalPages: number
  unreadCount: number
}

export async function getNotifications(params?: {
  page?: number
  limit?: number
  unreadOnly?: boolean
}): Promise<NotificationsResponse> {
  const token = getToken()
  
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.set('page', params.page.toString())
  if (params?.limit) queryParams.set('limit', params.limit?.toString() || '20')
  if (params?.unreadOnly) queryParams.set('unreadOnly', 'true')
  
  const query = queryParams.toString()
  const endpoint = `/notifications${query ? `?${query}` : ''}`
  
  return fetchApi<NotificationsResponse>(endpoint, { token })
}

export async function getUnreadCount(): Promise<number> {
  const token = getToken()
  const data = await fetchApi<{ count: number }>('/notifications/unread-count', { token })
  return data.count
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const token = getToken()
  await fetchApi<{ success: boolean }>(`/notifications/${id}/read`, {
    method: 'PUT',
    token,
  })
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const token = getToken()
  await fetchApi<{ success: boolean }>('/notifications/read-all', {
    method: 'PUT',
    token,
  })
}

// Site Settings
export interface SiteSettings {
  id: string
  companyName: string
  tagline: string | null
  description: string | null
  logo: string | null
  favicon: string | null
  logoDark: string | null
  email: string | null
  phone: string | null
  whatsapp: string | null
  address: string | null
  city: string | null
  province: string | null
  postalCode: string | null
  googleMapsUrl: string | null
  facebook: string | null
  instagram: string | null
  twitter: string | null
  youtube: string | null
  linkedin: string | null
  tiktok: string | null
  metaTitle: string | null
  metaDescription: string | null
  ogImage: string | null
  keywords: string | null
  footerText: string | null
  copyrightText: string | null
  mondayOpen: string
  mondayClose: string
  tuesdayOpen: string
  tuesdayClose: string
  wednesdayOpen: string
  wednesdayClose: string
  thursdayOpen: string
  thursdayClose: string
  fridayOpen: string
  fridayClose: string
  saturdayOpen: string
  saturdayClose: string
  sundayOpen: string
  sundayClose: string
  is24Hours: boolean
  minAdvanceDays: number
  maxAdvanceDays: number
  cancellationHours: number
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const token = getToken()
  try {
    return await fetchApi<SiteSettings>('/site-settings', { token })
  } catch {
    return null
  }
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const token = getToken()
  return fetchApi<SiteSettings>('/site-settings', {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  })
}

// Navigation Settings
export interface NavLink {
  label: string
  href: string
  order: number
  isActive: boolean
  isDropdown: boolean
  dropdownItems?: NavLink[]
}

export interface NavigationSettings {
  id: string
  navLinks: NavLink[]
  showServicesDropdown: boolean
  servicesDropdownLabel: string
  ctaButtonText: string
  ctaButtonLink: string
  showCtaButton: boolean
  mobileMenuType: string
  activeIndicatorStyle: string
}

export async function getNavigationSettings(): Promise<NavigationSettings | null> {
  const token = getToken()
  try {
    return await fetchApi<NavigationSettings>('/navigation-settings', { token })
  } catch {
    return null
  }
}

export async function updateNavigationSettings(data: Partial<NavigationSettings>): Promise<NavigationSettings> {
  const token = getToken()
  return fetchApi<NavigationSettings>('/navigation-settings', {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  })
}

// Homepage Settings
export interface BeforeAfterSlide {
  before: string
  after: string
  title: string
}

export interface HomepageSettings {
  id: string
  heroHeadline: string
  heroSubheadline: string
  heroImage: string | null
  heroBadge: string
  ctaPrimaryText: string
  ctaPrimaryLink: string
  ctaSecondaryText: string
  ctaSecondaryLink: string
  statsHomesCleaned: string
  statsRating: string
  statsSatisfaction: string
  statsResponseTime: string
  showFeaturesSection: boolean
  showServicesSection: boolean
  showTestimonialsSection: boolean
  showAreasSection: boolean
  showBlogSection: boolean
  showImageShowcase: boolean
  showCTASection: boolean
  featuredServiceIds: string[]
  beforeAfterSlides: BeforeAfterSlide[]
}

export async function getHomepageSettings(): Promise<HomepageSettings | null> {
  const token = getToken()
  try {
    return await fetchApi<HomepageSettings>('/homepage-settings', { token })
  } catch {
    return null
  }
}

export async function updateHomepageSettings(data: Partial<HomepageSettings>): Promise<HomepageSettings> {
  const token = getToken()
  return fetchApi<HomepageSettings>('/homepage-settings', {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  })
}

// Footer Settings
export interface FooterColumn {
  title: string
  links: { label: string; href: string }[]
}

export interface SocialLink {
  name: string
  href: string
  icon: string
}

export interface FooterSettings {
  id: string
  footerColumns: FooterColumn[]
  showContact: boolean
  contactEmail: string | null
  contactPhone: string | null
  contactWhatsapp: string | null
  contactAddress: string | null
  showSocials: boolean
  socialLinks: SocialLink[]
  showNewsletter: boolean
  newsletterTitle: string
  newsletterSubtitle: string | null
  showStatusBadge: boolean
  statusBadgeText: string
  copyrightText: string
}

export async function getFooterSettings(): Promise<FooterSettings | null> {
  const token = getToken()
  try {
    return await fetchApi<FooterSettings>('/footer-settings', { token })
  } catch {
    return null
  }
}

export async function updateFooterSettings(data: Partial<FooterSettings>): Promise<FooterSettings> {
  const token = getToken()
  return fetchApi<FooterSettings>('/footer-settings', {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  })
}

// Blog Categories
export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string | null
  order: number
  _count?: { posts: number }
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const token = getToken()
  try {
    return await fetchApi<BlogCategory[]>('/blog-categories', { token })
  } catch {
    return []
  }
}

export async function createBlogCategory(data: { name: string; slug: string; description?: string; order?: number }): Promise<BlogCategory> {
  const token = getToken()
  return fetchApi<BlogCategory>('/blog-categories', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })
}

export async function updateBlogCategory(id: string, data: { name?: string; slug?: string; description?: string; order?: number }): Promise<BlogCategory> {
  const token = getToken()
  return fetchApi<BlogCategory>(`/blog-categories/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  })
}

export async function deleteBlogCategory(id: string): Promise<void> {
  const token = getToken()
  return fetchApi<void>(`/blog-categories/${id}`, {
    method: 'DELETE',
    token,
  })
}

export async function reorderBlogCategories(categories: { id: string; order: number }[]): Promise<void> {
  const token = getToken()
  return fetchApi<void>('/blog-categories/reorder', {
    method: 'PUT',
    token,
    body: JSON.stringify(categories),
  })
}

// Email Templates
export interface EmailTemplate {
  id: string
  type: string
  name: string
  subject: string
  body: string
  smsBody: string | null
  isActive: boolean
}

export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  const token = getToken()
  try {
    return await fetchApi<EmailTemplate[]>('/email-templates', { token })
  } catch {
    return []
  }
}

export async function getEmailTemplateByType(type: string): Promise<EmailTemplate | null> {
  const token = getToken()
  try {
    return await fetchApi<EmailTemplate>(`/email-templates/${type}`, { token })
  } catch {
    return null
  }
}

export async function updateEmailTemplate(id: string, data: { subject?: string; body?: string; smsBody?: string; isActive?: boolean }): Promise<EmailTemplate> {
  const token = getToken()
  return fetchApi<EmailTemplate>(`/email-templates/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  })
}

// Invoices
export interface InvoiceTemplate {
  id: string
  name: string
  headerText: string
  companyName: string
  companyAddress: string | null
  companyPhone: string | null
  companyEmail: string | null
  companyLogo: string | null
  footerText: string | null
  taxRate: number
  notes: string | null
  isDefault: boolean
}

export interface InvoiceData {
  template: InvoiceTemplate
  booking: any
  invoice: {
    number: string
    date: string
    customerName: string
    customerEmail: string
    customerPhone: string
  }
  items: {
    name: string
    description: string
    quantity: number
    price: number
    total: number
  }[]
  summary: {
    subtotal: number
    taxRate: number
    taxAmount: number
    total: number
  }
  status: string
}

export async function getInvoiceTemplate(): Promise<InvoiceTemplate | null> {
  const token = getToken()
  try {
    return await fetchApi<InvoiceTemplate>('/invoices/template', { token })
  } catch {
    return null
  }
}

export async function updateInvoiceTemplate(id: string, data: Partial<InvoiceTemplate>): Promise<InvoiceTemplate> {
  const token = getToken()
  return fetchApi<InvoiceTemplate>(`/invoices/template/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  })
}

export async function getBookingInvoice(bookingId: string): Promise<InvoiceData | null> {
  const token = getToken()
  try {
    return await fetchApi<InvoiceData>(`/invoices/booking/${bookingId}`, { token })
  } catch {
    return null
  }
}

export async function updateCustomer(id: string, data: { isVip?: boolean; notes?: string; addresses?: any }): Promise<any> {
  const token = getToken()
  return fetchApi<any>(`/admin/customers/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  })
}
