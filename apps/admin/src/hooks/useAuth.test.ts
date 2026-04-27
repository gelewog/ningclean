import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useAuth } from '@/hooks/useAuth'
import { getToken } from '@/lib/api'

// Mock the api module
vi.mock('@/lib/api', () => ({
  getToken: vi.fn(),
}))

const mockPush = vi.fn()

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: vi.fn(),
}))

import { usePathname } from 'next/navigation'

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('redirects to login when no token', async () => {
    // RED - Mock no token
    vi.mocked(getToken).mockReturnValue(null)
    vi.mocked(usePathname).mockReturnValue('/admin')
    
    const { result } = renderHook(() => useAuth())
    
    // Wait for effect - need longer timeout
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    }, { timeout: 1000 })
    
    // GREEN if implemented
  })

  it('allows access when token exists', async () => {
    // RED - Mock valid token
    vi.mocked(getToken).mockReturnValue('valid-token')
    vi.mocked(usePathname).mockReturnValue('/admin')
    
    const { result } = renderHook(() => useAuth())
    
    await waitFor(() => {
      // Should finish loading
      expect(result.current.isLoading).toBe(false)
    }, { timeout: 1000 })
    
    // Should NOT call push
    expect(mockPush).not.toHaveBeenCalled()
    
    // GREEN - No redirect happened
  })

  it('allows access on login page without token', async () => {
    // RED - On login page with no token should not redirect
    vi.mocked(getToken).mockReturnValue(null)
    vi.mocked(usePathname).mockReturnValue('/login')
    
    const { result } = renderHook(() => useAuth())
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    }, { timeout: 1000 })
    
    // Should NOT redirect on login page
    expect(mockPush).not.toHaveBeenCalled()
    
    // GREEN - No redirect on login page
  })
})