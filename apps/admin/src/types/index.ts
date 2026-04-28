export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: 'admin' | 'staff' | 'customer'
  createdAt: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  totalBookings: number
  totalSpent: number
  createdAt: string
  isVip?: boolean
  notes?: string
  addresses?: Array<{
    label: string
    address: string
    city: string
    phone: string
  }>
  source?: 'registered' | 'guest'
}

export interface Service {
  id: string
  name: string
  slug: string
  description: string
  price: number
  duration: number
  category: string
  image?: string
  icon?: string
  features?: string[]
  isActive: boolean
  isFeatured?: boolean
  availableCities?: string[]
  createdAt: string
}

export interface Booking {
  id: string
  orderNumber?: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceId: string
  serviceName: string
  servicePrice: number
  totalAmount?: number
  area: string
  address: string
  scheduledDate: string
  scheduledTime: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
  items?: any[]
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  coverImage?: string
  status: 'draft' | 'published'
  author: string
  tags?: string[]
  categoryId?: string
  category?: { id: string; name: string; slug: string }
  isFeatured?: boolean
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  totalCustomers: number
  pendingBookings: number
  bookingsTrend: number
  revenueTrend: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface TeamMember {
  id: string
  name: string
  position: string
  department: string
  bio?: string
  avatar?: string
  email?: string
  phone?: string
  isActive: boolean
  order: number
  socialLinks?: { linkedin?: string; twitter?: string; facebook?: string }
  createdAt: string
  updatedAt: string
}

export interface CompanyStat {
  id: string
  title: string
  value: string
  description?: string
  icon?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface GalleryItem {
  id: string
  title: string
  description?: string
  category: string
  imageUrl: string
  beforeImage?: string
  afterImage?: string
  location?: string
  serviceId?: string
  isFeatured: boolean
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ServiceArea {
  id: string
  city: string
  slug: string
  region: string
  description?: string
  coverage?: string[]
  isActive: boolean
  isFeatured: boolean
  image?: string
  createdAt: string
  updatedAt: string
}

export interface JobListing {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements?: string[]
  benefits?: string[]
  salaryRange?: string
  isActive: boolean
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

export interface PricingPlan {
  id: string
  name: string
  slug: string
  description: string
  price: number
  billingCycle: string
  features?: string[]
  isPopular: boolean
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface Testimonial {
  id: string
  name: string
  role?: string
  company?: string
  content: string
  rating: number
  image?: string
  isActive: boolean
  isFeatured: boolean
  order: number
  areaSlug?: string
  createdAt: string
  updatedAt: string
}
