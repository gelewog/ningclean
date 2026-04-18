'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  showLive?: boolean
}

export function Breadcrumb({ items, showLive = true }: BreadcrumbProps) {
  const pathname = usePathname()
  
  // Build breadcrumb from items, prepend NingClean Admin / Dashboard
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    ...items,
  ]

  return (
    <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-700 px-4 md:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
        <Link 
          href="/admin" 
          className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          <span>NingClean</span>
        </Link>
        
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="h-3 w-3 text-gray-400 dark:text-slate-600" />
            {item.href && index < breadcrumbItems.length - 1 ? (
              <Link 
                href={item.href}
                className="hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700 dark:text-slate-200 font-medium">
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {showLive && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-gray-500 dark:text-slate-400">Live</span>
          </div>
        </div>
      )}
    </div>
  )
}