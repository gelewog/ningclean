import { Booking, Customer, Service, BlogPost, DashboardStats, PaginatedResponse } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

interface FetchOptions extends RequestInit {
  token?: string
}

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

// Auth
export async function login(email: string, password: string) {
  return fetchApi<{ token: string; user: any }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function logout() {
  return fetchApi('/auth/logout', { method: 'POST' })
}

// Dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
  // Mock data for demo
  return {
    totalBookings: 1247,
    totalRevenue: 156750000,
    totalCustomers: 892,
    pendingBookings: 23,
    bookingsTrend: 12.5,
    revenueTrend: 8.3,
  }
}

export async function getRecentBookings(limit = 5): Promise<Booking[]> {
  // Mock data
  return [
    {
      id: '1',
      customerId: 'c1',
      customerName: 'Budi Santoso',
      customerEmail: 'budi@email.com',
      customerPhone: '081234567890',
      serviceId: 's1',
      serviceName: 'Home Cleaning',
      servicePrice: 250000,
      area: 'Jakarta Selatan',
      address: 'Jl. Sudirman No. 123',
      scheduledDate: '2026-03-30',
      scheduledTime: '09:00',
      status: 'pending',
      createdAt: '2026-03-29T10:00:00Z',
    },
    {
      id: '2',
      customerId: 'c2',
      customerName: 'Ani Wijaya',
      customerEmail: 'ani@email.com',
      customerPhone: '081234567891',
      serviceId: 's2',
      serviceName: 'Office Cleaning',
      servicePrice: 500000,
      area: 'Jakarta Pusat',
      address: 'Jl. Thamrin No. 456',
      scheduledDate: '2026-03-30',
      scheduledTime: '14:00',
      status: 'confirmed',
      createdAt: '2026-03-29T11:00:00Z',
    },
    {
      id: '3',
      customerId: 'c3',
      customerName: 'Dewi Kusuma',
      customerEmail: 'dewi@email.com',
      customerPhone: '081234567892',
      serviceId: 's3',
      serviceName: 'Deep Cleaning',
      servicePrice: 750000,
      area: 'Tangerang',
      address: 'BSD Sector 1',
      scheduledDate: '2026-03-31',
      scheduledTime: '10:00',
      status: 'in_progress',
      createdAt: '2026-03-28T09:00:00Z',
    },
    {
      id: '4',
      customerId: 'c4',
      customerName: 'Eko Prasetyo',
      customerEmail: 'eko@email.com',
      customerPhone: '081234567893',
      serviceId: 's1',
      serviceName: 'Home Cleaning',
      servicePrice: 250000,
      area: 'Bogor',
      address: 'Cibubur Residence',
      scheduledDate: '2026-03-29',
      scheduledTime: '08:00',
      status: 'completed',
      createdAt: '2026-03-27T14:00:00Z',
    },
    {
      id: '5',
      customerId: 'c5',
      customerName: 'Fitri Handayani',
      customerEmail: 'fitri@email.com',
      customerPhone: '081234567894',
      serviceId: 's4',
      serviceName: 'Post-Construction Cleaning',
      servicePrice: 1200000,
      area: 'Depok',
      address: 'Pondok Cina',
      scheduledDate: '2026-03-28',
      scheduledTime: '07:00',
      status: 'completed',
      createdAt: '2026-03-26T16:00:00Z',
    },
  ]
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
  // Mock data
  const allBookings: Booking[] = [
    {
      id: '1',
      customerId: 'c1',
      customerName: 'Budi Santoso',
      customerEmail: 'budi@email.com',
      customerPhone: '081234567890',
      serviceId: 's1',
      serviceName: 'Home Cleaning',
      servicePrice: 250000,
      area: 'Jakarta Selatan',
      address: 'Jl. Sudirman No. 123',
      scheduledDate: '2026-03-30',
      scheduledTime: '09:00',
      status: 'pending',
      createdAt: '2026-03-29T10:00:00Z',
    },
    {
      id: '2',
      customerId: 'c2',
      customerName: 'Ani Wijaya',
      customerEmail: 'ani@email.com',
      customerPhone: '081234567891',
      serviceId: 's2',
      serviceName: 'Office Cleaning',
      servicePrice: 500000,
      area: 'Jakarta Pusat',
      address: 'Jl. Thamrin No. 456',
      scheduledDate: '2026-03-30',
      scheduledTime: '14:00',
      status: 'confirmed',
      createdAt: '2026-03-29T11:00:00Z',
    },
    {
      id: '3',
      customerId: 'c3',
      customerName: 'Dewi Kusuma',
      customerEmail: 'dewi@email.com',
      customerPhone: '081234567892',
      serviceId: 's3',
      serviceName: 'Deep Cleaning',
      servicePrice: 750000,
      area: 'Tangerang',
      address: 'BSD Sector 1',
      scheduledDate: '2026-03-31',
      scheduledTime: '10:00',
      status: 'in_progress',
      createdAt: '2026-03-28T09:00:00Z',
    },
    {
      id: '4',
      customerId: 'c4',
      customerName: 'Eko Prasetyo',
      customerEmail: 'eko@email.com',
      customerPhone: '081234567893',
      serviceId: 's1',
      serviceName: 'Home Cleaning',
      servicePrice: 250000,
      area: 'Bogor',
      address: 'Cibubur Residence',
      scheduledDate: '2026-03-29',
      scheduledTime: '08:00',
      status: 'completed',
      createdAt: '2026-03-27T14:00:00Z',
    },
    {
      id: '5',
      customerId: 'c5',
      customerName: 'Fitri Handayani',
      customerEmail: 'fitri@email.com',
      customerPhone: '081234567894',
      serviceId: 's4',
      serviceName: 'Post-Construction Cleaning',
      servicePrice: 1200000,
      area: 'Depok',
      address: 'Pondok Cina',
      scheduledDate: '2026-03-28',
      scheduledTime: '07:00',
      status: 'completed',
      createdAt: '2026-03-26T16:00:00Z',
    },
    {
      id: '6',
      customerId: 'c6',
      customerName: 'Hendra Gunawan',
      customerEmail: 'hendra@email.com',
      customerPhone: '081234567895',
      serviceId: 's2',
      serviceName: 'Office Cleaning',
      servicePrice: 500000,
      area: 'Jakarta Barat',
      address: 'Jl. Puri Indah',
      scheduledDate: '2026-03-30',
      scheduledTime: '13:00',
      status: 'pending',
      createdAt: '2026-03-29T08:00:00Z',
    },
    {
      id: '7',
      customerId: 'c7',
      customerName: 'Ika Permatasari',
      customerEmail: 'ika@email.com',
      customerPhone: '081234567896',
      serviceId: 's3',
      serviceName: 'Deep Cleaning',
      servicePrice: 750000,
      area: 'Bekasi',
      address: 'Kemang Pratama',
      scheduledDate: '2026-03-29',
      scheduledTime: '15:00',
      status: 'cancelled',
      createdAt: '2026-03-28T12:00:00Z',
    },
    {
      id: '8',
      customerId: 'c8',
      customerName: 'Joko Widodo',
      customerEmail: 'joko@email.com',
      customerPhone: '081234567897',
      serviceId: 's1',
      serviceName: 'Home Cleaning',
      servicePrice: 250000,
      area: 'Jakarta Utara',
      address: 'Kelapa Gading',
      scheduledDate: '2026-03-31',
      scheduledTime: '11:00',
      status: 'confirmed',
      createdAt: '2026-03-29T09:00:00Z',
    },
  ]

  let filtered = [...allBookings]

  if (params?.status) {
    filtered = filtered.filter((b) => b.status === params.status)
  }

  if (params?.search) {
    const search = params.search.toLowerCase()
    filtered = filtered.filter(
      (b) =>
        b.customerName.toLowerCase().includes(search) ||
        b.customerEmail.toLowerCase().includes(search) ||
        b.serviceName.toLowerCase().includes(search)
    )
  }

  if (params?.area) {
    filtered = filtered.filter((b) => b.area === params.area)
  }

  const page = params?.page || 1
  const limit = params?.limit || 10
  const start = (page - 1) * limit
  const end = start + limit

  return {
    data: filtered.slice(start, end),
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  }
}

export async function updateBookingStatus(id: string, status: string) {
  // Mock update
  return { success: true, message: 'Booking status updated' }
}

// Services
export async function getServices(): Promise<Service[]> {
  return [
    {
      id: '1',
      name: 'Home Cleaning',
      description: 'Pembersihan rumah lengkap termasuk debu, lantai, dan kamar mandi',
      price: 250000,
      duration: 180,
      category: 'basic',
      icon: 'Home',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Office Cleaning',
      description: 'Pembersihan kantor dan area kerja',
      price: 500000,
      duration: 240,
      category: 'commercial',
      icon: 'Building',
      isActive: true,
      createdAt: '2026-01-02T00:00:00Z',
    },
    {
      id: '3',
      name: 'Deep Cleaning',
      description: 'Pembersihan intensif termasuk semua sudut dan area tersembunyi',
      price: 750000,
      duration: 360,
      category: 'premium',
      icon: 'Sparkles',
      isActive: true,
      createdAt: '2026-01-03T00:00:00Z',
    },
    {
      id: '4',
      name: 'Post-Construction Cleaning',
      description: 'Pembersihan pasca konstruksi atau renovasi',
      price: 1200000,
      duration: 480,
      category: 'specialty',
      icon: 'HardHat',
      isActive: true,
      createdAt: '2026-01-04T00:00:00Z',
    },
    {
      id: '5',
      name: 'Carpet Cleaning',
      description: 'Pembersihan karpet dan upholstery',
      price: 350000,
      duration: 180,
      category: 'specialty',
      icon: 'Sofa',
      isActive: false,
      createdAt: '2026-01-05T00:00:00Z',
    },
    {
      id: '6',
      name: 'Window Cleaning',
      description: 'Pembersihan jendela interior dan eksterior',
      price: 200000,
      duration: 120,
      category: 'addon',
      icon: 'Square',
      isActive: true,
      createdAt: '2026-01-06T00:00:00Z',
    },
  ]
}

export async function createService(data: Partial<Service>) {
  return { success: true, message: 'Service created', data: { ...data, id: Math.random().toString() } }
}

export async function updateService(id: string, data: Partial<Service>) {
  return { success: true, message: 'Service updated' }
}

export async function deleteService(id: string) {
  return { success: true, message: 'Service deleted' }
}

// Customers
export async function getCustomers(params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<PaginatedResponse<Customer>> {
  const customers: Customer[] = [
    {
      id: 'c1',
      name: 'Budi Santoso',
      email: 'budi@email.com',
      phone: '081234567890',
      address: 'Jl. Sudirman No. 123, Jakarta Selatan',
      totalBookings: 12,
      totalSpent: 3000000,
      createdAt: '2026-01-15T00:00:00Z',
    },
    {
      id: 'c2',
      name: 'Ani Wijaya',
      email: 'ani@email.com',
      phone: '081234567891',
      address: 'Jl. Thamrin No. 456, Jakarta Pusat',
      totalBookings: 8,
      totalSpent: 4000000,
      createdAt: '2026-01-20T00:00:00Z',
    },
    {
      id: 'c3',
      name: 'Dewi Kusuma',
      email: 'dewi@email.com',
      phone: '081234567892',
      address: 'BSD Sector 1, Tangerang',
      totalBookings: 15,
      totalSpent: 11250000,
      createdAt: '2026-02-01T00:00:00Z',
    },
    {
      id: 'c4',
      name: 'Eko Prasetyo',
      email: 'eko@email.com',
      phone: '081234567893',
      address: 'Cibubur Residence, Bogor',
      totalBookings: 5,
      totalSpent: 1250000,
      createdAt: '2026-02-10T00:00:00Z',
    },
    {
      id: 'c5',
      name: 'Fitri Handayani',
      email: 'fitri@email.com',
      phone: '081234567894',
      address: 'Pondok Cina, Depok',
      totalBookings: 20,
      totalSpent: 15000000,
      createdAt: '2026-02-15T00:00:00Z',
    },
    {
      id: 'c6',
      name: 'Hendra Gunawan',
      email: 'hendra@email.com',
      phone: '081234567895',
      address: 'Jl. Puri Indah, Jakarta Barat',
      totalBookings: 3,
      totalSpent: 750000,
      createdAt: '2026-03-01T00:00:00Z',
    },
    {
      id: 'c7',
      name: 'Ika Permatasari',
      email: 'ika@email.com',
      phone: '081234567896',
      address: 'Kemang Pratama, Bekasi',
      totalBookings: 7,
      totalSpent: 1750000,
      createdAt: '2026-03-05T00:00:00Z',
    },
    {
      id: 'c8',
      name: 'Joko Widodo',
      email: 'joko@email.com',
      phone: '081234567897',
      address: 'Kelapa Gading, Jakarta Utara',
      totalBookings: 10,
      totalSpent: 2500000,
      createdAt: '2026-03-10T00:00:00Z',
    },
  ]

  let filtered = [...customers]
  if (params?.search) {
    const search = params.search.toLowerCase()
    filtered = filtered.filter(
      (c) => c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search)
    )
  }

  const page = params?.page || 1
  const limit = params?.limit || 10
  const start = (page - 1) * limit
  const end = start + limit

  return {
    data: filtered.slice(start, end),
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  }
}

export async function getCustomerBookings(customerId: string): Promise<Booking[]> {
  return getBookings().then((res) => res.data.filter((b) => b.customerId === customerId))
}

// Blog
export async function getBlogPosts(params?: {
  page?: number
  limit?: number
  status?: string
}): Promise<PaginatedResponse<BlogPost>> {
  const posts: BlogPost[] = [
    {
      id: '1',
      title: 'Tips Membersihkan Rumah Setelah Liburan',
      slug: 'tips-membersihkan-rumah-setelah-liburan',
      content: 'Setelah pulang liburan, rumah pasti kotor dan berantakan...',
      excerpt: 'Berikut tips membersihkan rumah dengan cepat setelah liburan panjang.',
      coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      status: 'published',
      author: 'Admin',
      tags: ['tips', 'home cleaning'],
      createdAt: '2026-03-15T00:00:00Z',
      updatedAt: '2026-03-15T00:00:00Z',
    },
    {
      id: '2',
      title: 'Keuntungan Menggunakan Jasa Cleaning Service Profesional',
      slug: 'keuntungan-jasa-cleaning-service-profesional',
      content: 'Menggunakan jasa cleaning service profesional memiliki banyak keuntungan...',
      excerpt: 'Kenapa Anda harus memilih layanan cleaning service profesional?',
      coverImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
      status: 'published',
      author: 'Admin',
      tags: ['jasa cleaning', 'profesional'],
      createdAt: '2026-03-20T00:00:00Z',
      updatedAt: '2026-03-20T00:00:00Z',
    },
    {
      id: '3',
      title: '5 Areas yang Sering Terlewatkan Saat Membersihkan',
      slug: '5-areas-sering-terlewatkan-saat-membersihkan',
      content: 'Ada beberapa area di rumah yang sering terlewat...',
      excerpt: 'Area-area ini sering terlewat saat cleaning, yuk cek!',
      coverImage: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800',
      status: 'draft',
      author: 'Admin',
      tags: ['tips', 'deep cleaning'],
      createdAt: '2026-03-25T00:00:00Z',
      updatedAt: '2026-03-28T00:00:00Z',
    },
    {
      id: '4',
      title: 'Panduan Deep Cleaning untuk Rumah Baru',
      slug: 'panduan-deep-cleaning-rumah-baru',
      content: 'Rumah baru butuh deep cleaning sebelum ditinggali...',
      excerpt: 'Langkah-langkah deep cleaning untuk rumah baru.',
      status: 'draft',
      author: 'Admin',
      tags: ['deep cleaning', 'panduan'],
      createdAt: '2026-03-28T00:00:00Z',
      updatedAt: '2026-03-28T00:00:00Z',
    },
  ]

  let filtered = [...posts]
  if (params?.status) {
    filtered = filtered.filter((p) => p.status === params.status)
  }

  const page = params?.page || 1
  const limit = params?.limit || 10
  const start = (page - 1) * limit
  const end = start + limit

  return {
    data: filtered.slice(start, end),
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  }
}

export async function createBlogPost(data: Partial<BlogPost>) {
  return { success: true, message: 'Blog post created', data: { ...data, id: Math.random().toString() } }
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>) {
  return { success: true, message: 'Blog post updated' }
}

export async function deleteBlogPost(id: string) {
  return { success: true, message: 'Blog post deleted' }
}
