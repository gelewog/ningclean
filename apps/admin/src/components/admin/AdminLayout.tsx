'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/admin/Sidebar'
import { Header } from '@/components/admin/Header'
import { usePathname } from 'next/navigation'
import { getToken } from '@/lib/api'
import { useAdminPreferences } from '@/lib/useAdminPreferences'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { preferences } = useAdminPreferences()

  // Auth check
  React.useEffect(() => {
    const token = getToken()
    if (!token && pathname !== '/login') {
      router.push('/login')
    }
  }, [pathname, router])

  // Don't render layout on login page
  if (pathname === '/login') {
    return <>{children}</>
  }

  return (
    <div className={cn('min-h-screen bg-slate-50 dark:bg-slate-950', preferences.compactView && 'admin-compact')}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 68 : 256 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex min-h-screen flex-col"
      >
        <Header onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  )
}
