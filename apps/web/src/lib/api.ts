const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

// Token management
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

// isAuthenticated check
export function isAuthenticated(): boolean {
  return !!getToken()
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Services
export async function getServices() {
  return fetchApi<any[]>('/services')
}

export async function getService(slug: string) {
  return fetchApi<any>(`/services/${slug}`)
}

// Blog
export async function getBlogPosts() {
  return fetchApi<any[]>('/blog')
}

export async function getBlogPost(slug: string) {
  return fetchApi<any>(`/blog/slug/${slug}`)
}

// Blog API
export const blogApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    const query = queryParams.toString()
    return fetchApi<any>(`/blog${query ? `?${query}` : ''}`)
  },
  getRecent: (limit = 3) => {
    return fetchApi<any>(`/blog?limit=${limit}`)
  },
  getBySlug: (slug: string) => {
    return fetchApi<any>(`/blog/slug/${slug}`)
  },
}

// Team Members (Public)
export async function getTeamMembers() {
  try {
    return await fetchApi<any[]>('/team-members')
  } catch {
    return []
  }
}

// Company Stats (Public)
export async function getCompanyStats() {
  try {
    return await fetchApi<any[]>('/company-stats')
  } catch {
    return []
  }
}

// Gallery (Public)
export async function getGalleryItems(category?: string) {
  try {
    const endpoint = category ? `/gallery/category/${category}` : '/gallery'
    return await fetchApi<any[]>(endpoint)
  } catch {
    return []
  }
}

// FAQ (Public)
export async function getFAQs(category?: string) {
  try {
    const endpoint = category ? `/faq/category/${category}` : '/faq'
    return await fetchApi<any[]>(endpoint)
  } catch {
    return []
  }
}

// Service Areas (Public)
export async function getServiceAreas() {
  try {
    return await fetchApi<any[]>('/service-areas')
  } catch {
    return []
  }
}

export async function getServiceArea(slug: string) {
  try {
    return await fetchApi<any>(`/service-areas/${slug}`)
  } catch {
    return null
  }
}

// Job Listings/Careers (Public)
export async function getJobListings() {
  try {
    return await fetchApi<any[]>('/careers')
  } catch {
    return []
  }
}

export async function getJobListing(id: string) {
  try {
    return await fetchApi<any>(`/careers/${id}`)
  } catch {
    return null
  }
}

// Pricing Plans (Public)
export async function getPricingPlans() {
  try {
    return await fetchApi<any[]>('/pricing-plans')
  } catch {
    return []
  }
}

// Testimonials (Public)
export async function getTestimonials() {
  try {
    return await fetchApi<any[]>('/testimonials')
  } catch {
    return []
  }
}

// Site Settings (Public)
export async function getSiteSettings() {
  try {
    return await fetchApi<any>('/site-settings')
  } catch {
    return null
  }
}

// Homepage Settings (Public)
export async function getHomepageSettings() {
  try {
    return await fetchApi<any>('/homepage-settings')
  } catch {
    return null
  }
}

// Navigation Settings (Public)
export async function getNavigationSettings() {
  try {
    return await fetchApi<any>('/navigation-settings')
  } catch {
    return null
  }
}

// Footer Settings (Public)
export async function getFooterSettings() {
  try {
    return await fetchApi<any>('/footer-settings')
  } catch {
    return null
  }
}

// Bookings
export async function createBooking(data: any) {
  return fetchApi<{ success: boolean; message: string; data: any }>('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Services API
export const servicesApi = {
  getAll: async () => {
    const data = await getServices()
    return { data }
  },
  get: async (slug: string) => {
    return { data: await getService(slug) }
  },
}

// Bookings API
export const bookingsApi = {
  create: (data: any) => createBooking(data),
  getMyBookings: async () => {
    return fetchApi<any>('/bookings/my-bookings')
  },
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetchApi<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (response.access_token) {
      setToken(response.access_token)
      setUser(response.user)
    }
    return response
  },
  register: async (data: any) => {
    const response = await fetchApi<{ access_token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (response.access_token) {
      setToken(response.access_token)
      setUser(response.user)
    }
    return response
  },
  getProfile: async () => {
    return fetchApi<any>('/auth/me')
  },
  logout: () => {
    removeToken()
  },
}
