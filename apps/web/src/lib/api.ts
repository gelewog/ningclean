import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth cookie and redirect to login
      Cookies.remove('auth_token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      Cookies.set('auth_token', response.data.access_token, { expires: 7 });
    }
    return response.data;
  },
  
  register: async (data: { email: string; password: string; name: string; phone?: string }) => {
    const response = await api.post('/auth/register', data);
    if (response.data.access_token) {
      Cookies.set('auth_token', response.data.access_token, { 
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }
    return response.data;
  },
  
  logout: () => {
    Cookies.remove('auth_token');
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Services API
export const servicesApi = {
  getAll: async () => {
    const response = await api.get('/services');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },
  
  getFeatured: async () => {
    const response = await api.get('/services?featured=true');
    return response.data;
  },
};

// Bookings API
export const bookingsApi = {
  getAll: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  
  create: async (data: {
    serviceId: string;
    scheduledDate: string;
    scheduledTime: string;
    address: string;
    notes?: string;
  }) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },
  
  getMyBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },
  
  getUpcoming: async () => {
    const response = await api.get('/bookings/my/upcoming');
    return response.data;
  },
};

// Blog API
export const blogApi = {
  getAll: async (params?: { page?: number; limit?: number; tag?: string }) => {
    const response = await api.get('/blog', { params });
    return response.data;
  },
  
  getBySlug: async (slug: string) => {
    const response = await api.get(`/blog/${slug}`);
    return response.data;
  },
  
  getRecent: async (limit: number = 3) => {
    const response = await api.get('/blog', { params: { limit } });
    return response.data;
  },
};

// Admin API
export const adminApi = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};

// Testimonials API (for public homepage)
export const testimonialsApi = {
  getAll: async () => {
    const response = await api.get('/testimonials');
    return response.data;
  },
};

// Helper to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!Cookies.get('auth_token');
};

// Helper to get auth token
export const getAuthToken = (): string | undefined => {
  return Cookies.get('auth_token');
};