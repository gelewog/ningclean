'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Image,
  HelpCircle,
  MapPin,
  BriefcaseMedical,
  DollarSign,
  UserCircle,
  Sparkles,
  Bell,
  ChevronDown,
  Mail,
  FolderOpen,
  Edit3,
  Plus,
  Home,
  Navigation,
  Globe,
  Tag,
  TrendingUp,
  Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/lib/api'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface NavItem {
  href?: string
  label: string
  icon: React.ElementType
  children?: NavItem[]
  badge?: string
}

const sidebarLinks: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/users', label: 'Users', icon: UserCircle },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: Activity },
  {
    label: 'Blog',
    icon: FileText,
    children: [
      { href: '/admin/blog', label: 'All Posts', icon: Edit3 },
      { href: '/admin/blog/categories', label: 'Categories', icon: FolderOpen },
    ]
  },
  { href: '/admin/email-templates', label: 'Email & SMS', icon: Mail },
  { href: '/admin/invoices', label: 'Invoice', icon: FileText },
  { href: '/admin/team', label: 'Team', icon: UserCircle },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/areas', label: 'Areas', icon: MapPin },
  { href: '/admin/careers', label: 'Careers', icon: BriefcaseMedical },
  { href: '/admin/pricing', label: 'Pricing', icon: DollarSign },
  { href: '/admin/testimonials', label: 'Testimonials', icon: UserCircle },
  {
    label: 'Settings',
    icon: Settings,
    children: [
      { href: '/admin/settings', label: 'General', icon: Globe },
      { href: '/admin/settings?tab=navigation', label: 'Navigation', icon: Navigation },
      { href: '/admin/settings?tab=homepage', label: 'Homepage', icon: Home },
      { href: '/admin/settings?tab=footer', label: 'Footer', icon: Globe },
      { href: '/admin/settings?tab=notifications', label: 'Notifications', icon: Bell },
    ]
  },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({})

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }))
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isOpen = openMenus[item.label]
    const active = item.href ? isActive(item.href) : false
    const Icon = item.icon

    // Collapsed state - no children shown
    if (collapsed) {
      if (hasChildren) {
        return (
          <div
            key={item.label}
            className={cn(
              'group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
              'text-slate-400 cursor-pointer'
            )}
            title={item.label}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
          </div>
        )
      }
      return (
        <Link
          key={item.href}
          href={item.href || '#'}
          className={cn(
            'group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
            active
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-slate-300 hover:bg-white/5 hover:text-white'
          )}
          title={item.label}
        >
          <Icon className="h-5 w-5 flex-shrink-0" />
        </Link>
      )
    }

    // Expanded state
    if (hasChildren) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleMenu(item.label)}
            className={cn(
              'group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
              active
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            )}
          >
            {active && (
              <>
                <div className="absolute -left-3 h-8 w-1 rounded-r-full bg-white/50" />
                <div className="absolute inset-0 rounded-xl bg-white/10" />
              </>
            )}
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1 text-left">{item.label}</span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="ml-6 mt-1 space-y-1 border-l border-white/10 pl-4">
                  {item.children!.map(child => (
                    <Link
                      key={child.href}
                      href={child.href || '#'}
                      className={cn(
                        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                        isActive(child.href || '')
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <child.icon className="h-4 w-4 flex-shrink-0" />
                      <span>{child.label}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    }

    return (
      <motion.div
        key={item.href}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link
          href={item.href || '#'}
          className={cn(
            'group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
            active
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-slate-300 hover:bg-white/5 hover:text-white'
          )}
        >
          {active && (
            <>
              <div className="absolute -left-3 h-8 w-1 rounded-r-full bg-white/50" />
              <div className="absolute inset-0 rounded-xl bg-white/10" />
            </>
          )}
          <Icon className={cn(
            'h-5 w-5 flex-shrink-0 transition-transform duration-200',
            !active && 'group-hover:scale-110'
          )} />
          {!collapsed && (
            <span className="truncate">{item.label}</span>
          )}
          {!collapsed && active && (
            <div className="ml-auto h-2 w-2 rounded-full bg-white/50" />
          )}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 88 : 280 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white shadow-2xl"
    >
      {/* Decorative gradient orb */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-10 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl" />

      {/* Logo */}
      <div className="relative flex h-20 items-center justify-between border-b border-white/10 px-4 backdrop-blur-sm">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                <Sparkles className="h-5 w-5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight">Ningclean</span>
                <p className="text-xs text-slate-400">Admin Panel</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={onToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 transition-all duration-200 hover:bg-white/10 hover:shadow-lg active:scale-95"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-slate-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 space-y-1 overflow-y-auto p-3 custom-scrollbar">
        {sidebarLinks.map((link) => renderNavItem(link))}
      </nav>

      {/* Logout */}
      <div className="relative border-t border-white/10 p-3 backdrop-blur-sm">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="truncate"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
