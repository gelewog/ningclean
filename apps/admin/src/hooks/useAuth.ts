'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getToken } from '@/lib/api'

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const token = getToken()
    
    // Allow login page
    if (pathname === '/login') {
      setIsLoading(false)
      return
    }

    // Redirect to login if no token
    if (!token) {
      router.push('/login')
    } else {
      setIsLoading(false)
    }
  }, [pathname, router])

  return { isLoading }
}
