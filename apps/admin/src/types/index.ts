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
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
  image?: string
  icon?: string
  isActive: boolean
  createdAt: string
}

export interface Booking {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceId: string
  serviceName: string
  servicePrice: number
  area: string
  address: string
  scheduledDate: string
  scheduledTime: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
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
