// Types for Ningclean API

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: 'CUSTOMER' | 'ADMIN';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  image?: string;
  category: string;
  features: string[];
  isActive: boolean;
  isPopular?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  serviceId: string;
  service?: Service;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  notes?: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  customer?: User;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  tags: string[];
  authorId: string;
  author?: User;
  category?: {
    slug: string;
    name: string;
  };
  publishedAt?: string;
  readTime?: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  image?: string;
  rating: number;
  content: string;
  role?: string;
  company?: string;
  service?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  order?: number;
  areaSlug?: string;
  createdAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface CreateBookingRequest {
  serviceId: string;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  notes?: string;
}

export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
}