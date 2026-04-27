import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getToken,
  setToken,
  removeToken,
  fetchApi,
  login,
  logout,
  getDashboardStats,
} from '@/lib/api'

// Mock global fetch
global.fetch = vi.fn()

describe('API Layer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Token Management', () => {
    it('getToken returns null when no token in localStorage', () => {
      // RED - No token set
      const localStorageMock = {
        getItem: vi.fn().mockReturnValue(null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      }
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      })
      
      const token = getToken()
      
      // Should return null
      expect(token).toBeNull()
      expect(window.localStorage.getItem).toHaveBeenCalledWith('admin_token')
    })

    it('getToken returns token from localStorage', () => {
      // RED - Set a token
      const localStorageMock = {
        getItem: vi.fn().mockReturnValue('my-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      }
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      })
      
      const token = getToken()
      
      // GREEN - Should return the token
      expect(token).toBe('my-token')
    })

    it('setToken saves token to localStorage', () => {
      // RED - Save token
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      }
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      })
      
      setToken('new-token')
      
      // GREEN - Should call setItem
      expect(window.localStorage.setItem).toHaveBeenCalledWith('admin_token', 'new-token')
    })

    it('removeToken clears tokens from localStorage', () => {
      // RED - Remove token
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      }
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      })
      
      removeToken()
      
      // GREEN - Should remove both token and user
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('admin_token')
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('admin_user')
    })
  })

  describe('fetchApi', () => {
    it('makes GET request with authorization header', async () => {
      // RED - Mock successful response
      const mockResponse = { data: 'test', success: true }
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
      
      await fetchApi('/test', { token: 'test-token' })
      
      // GREEN - Should call fetch with correct headers
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
            'Content-Type': 'application/json',
          }),
        })
      )
    })

    it('throws error on failed request', async () => {
      // RED - Mock failed response
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Server error' }),
      } as Response)
      
      // Should throw error
      await expect(fetchApi('/test')).rejects.toThrow('Server error')
    })

    it('throws generic error when response has no message', async () => {
      // RED - Mock failed response without message
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({}),
      } as Response)
      
      // Should throw HTTP error
      await expect(fetchApi('/test')).rejects.toThrow('HTTP error')
    })
  })

  describe('login', () => {
    it('login returns token on success', async () => {
      // Setup localStorage mock for setToken
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      }
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      })
      
      // RED - Mock successful login
      const mockResponse = {
        access_token: 'new-jwt-token',
        user: { id: '1', name: 'Test User', email: 'test@test.com', role: 'admin' },
      }
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
      
      const result = await login('test@test.com', 'password')
      
      // GREEN - Should save token and return response
      expect(result.access_token).toBe('new-jwt-token')
      expect(window.localStorage.setItem).toHaveBeenCalledWith('admin_token', 'new-jwt-token')
    })

    it('login throws error on failure', async () => {
      // RED - Mock failed login
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      } as Response)
      
      // Should throw error
      await expect(login('test@test.com', 'wrong')).rejects.toThrow('Invalid credentials')
    })
  })

  describe('logout', () => {
    it('logout clears tokens', () => {
      // Setup localStorage mock
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      }
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      })
      
      logout()
      
      // GREEN - Should remove tokens
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('admin_token')
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('admin_user')
    })
  })

  describe('getDashboardStats', () => {
    it('fetches and transforms dashboard stats', async () => {
      // Setup localStorage mock
      const localStorageMock = {
        getItem: vi.fn().mockReturnValue('test-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      }
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      })
      
      // RED - Mock API response
      const mockResponse = {
        bookings: { total: 100, pending: 20 },
        revenue: { total: 5000000 },
        users: { customers: 50 },
      }
      
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
      
      const stats = await getDashboardStats()
      
      // GREEN - Should transform data correctly
      expect(stats.totalBookings).toBe(100)
      expect(stats.totalRevenue).toBe(5000000)
      expect(stats.totalCustomers).toBe(50)
      expect(stats.pendingBookings).toBe(20)
    })
  })
})