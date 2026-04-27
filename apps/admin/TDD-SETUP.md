================================================================================
                         TDD SETUP FOR NINGCLEAN ADMIN
================================================================================

STATUS: ✅ SETUP COMPLETE (Tunggu npm install selesai)

================================================================================
                              YANG HARUS DIINSTALL
================================================================================

Jalankan perintah berikut di terminal:

  cd /mnt/c/Users/user/.openclaw/workspace/ningclean/apps/admin
  npm install -D \
    vitest @testing-library/react @testing-library/jest-dom \
    @testing-library/user-event jsdom @testing-library/dom \
    @vitest/ui @vitest/coverage-istanbul @vitejs/plugin-react \
    happy-dom

ATAU update package.json dan install:

  # Backup dulu
  cp package.json package.json.backup
  
  # Update package.json dengan devDependencies testing
  # (Lihat file TDD-SETUP-NEW.md untuk detail)
  
  npm install

================================================================================
                           FILES YANG TELAH DIBUAT
================================================================================

1. vitest.config.ts
   - Konfigurasi Vitest untuk Next.js
   - Coverage report (v8 provider)
   - Path alias @/

2. tests/setup.ts
   - Test environment setup
   - Mock untuk next/navigation
   - Mock untuk next-themes
   - Mock untuk sonner/toast
   - Mock untuk localStorage & matchMedia

3. src/components/ui/button.test.tsx
   - Contoh test TDD untuk UI component
   - Test: render, disabled, variant, asChild, className, loading

4. src/hooks/useAuth.test.ts
   - Contoh test untuk custom hook
   - Test: token management, redirect behavior

5. src/lib/api.test.ts
   - Test untuk API layer
   - Test: token management, fetchApi, login/logout, dashboard stats

6. src/lib/utils.test.ts
   - Test untuk utility functions
   - Test: cn(className merging), tailwind conflict resolution

7. src/app/login/page.test.tsx
   - Integration test untuk login page
   - Test: form render, password toggle, error handling, success flow

================================================================================
                              COMMAND YANG TERSEDIA
================================================================================

Menambahkan scripts ke package.json:

  "scripts": {
    "test": "vitest",
    "test:ci": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:watch": "vitest --watch",
    "coverage": "vitest run --coverage"
  }

Usage:

  # Run tests dalam watch mode (development)
  npm test

  # Run tests sekali (CI)
  npm run test:ci

  # Buka UI untuk menjalankan test
  npm run test:ui

  # Coverage report
  npm run coverage

================================================================================
                           HOW TO WRITE TDD TESTS
================================================================================

PATTERN RED-GREEN-REFACTOR:

1. RED - Tulis test yang FAIL dulu
2. GREEN - Tulis kode MINIMAL untuk PASS
3. REFACTOR - Perbaiki kode tanpa merusak test

CONTOH PATTERN:

  import { describe, it, expect, vi } from 'vitest'
  import { render, screen } from '@testing-library/react'
  import MyComponent from '@/components/MyComponent'
  
  describe('MyComponent', () => {
    // RED - Test sebelum implementasi
    it('renders with correct text', () => {
      render(<MyComponent title="Test" />)
      expect(screen.getByRole('heading')).toHaveTextContent('Test')
    })
    
    // GREEN - Test passing setelah implementasi minimalist
    
    // REFACTOR - Perbaiki kode, test tetap passing
  })

================================================================================
                              TEST PATTERNS
================================================================================

1. COMPONENT TESTS:
   
   import { render, screen, fireEvent } from '@testing-library/react'
   
   it('handles click events', () => {
     const onClick = vi.fn()
     render(<Button onClick={onClick}>Click</Button>)
     fireEvent.click(screen.getByRole('button'))
     expect(onClick).toHaveBeenCalled()
   })

2. HOOK TESTS:
   
   import { renderHook, waitFor } from '@testing-library/react'
   
   it('updates state correctly', async () => {
     const { result } = renderHook(() => useMyHook())
     await waitFor(() => {
       expect(result.current.data).toBeDefined()
     })
   })

3. API TESTS:
   
   it('makes correct API call', async () => {
     vi.mocked(fetch).mockResolvedValueOnce({
       ok: true,
       json: () => Promise.resolve({ data: [] })
     } as Response)
     
     await fetchData()
     expect(fetch).toHaveBeenCalledWith('/api/data')
   })

================================================================================
                          TESTING BEST PRACTICES
================================================================================

✅ DO:
   - Test behavior, not implementation
   - Satu behavior = satu test
   - Test real code, avoid excessive mocking
   - WATCH test FAIL terlebih dahulu
   - Tulis minimal code untuk PASS
   - Coverage target: 70-80%

❌ DON'T:
   - Test implementation details
   - Mock kode bisnis logic
   - Skip RED phase
   - Hardcode test data tanpa context
   - Test setiap internal method

================================================================================
                    NEXT: TEST FILES YANG PERLU DIBUAT
================================================================================

Priority tinggi untuk ditambahkan:

1. src/components/admin/Sidebar.test.tsx
2. src/components/admin/DataTable.test.tsx
3. src/components/admin/Modal.test.tsx
4. src/app/admin/bookings/page.test.tsx
5. src/app/admin/services/page.test.tsx
6. src/app/admin/customers/page.test.tsx
7. src/app/admin/file-manager/page.test.tsx

================================================================================
