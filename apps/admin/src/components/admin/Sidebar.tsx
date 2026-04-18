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
  Bell,
  ChevronDown,
  Mail,
  FolderOpen,
  Edit3,
  Home,
  Navigation,
  Globe,
  TrendingUp,
  Activity,
  Tag,
  Layers,
  MessageSquare,
  HardDrive,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/lib/api'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface NavItem {
  href?: string
  label: string
  icon: React.ElementType
  badge?: string | number
  badgeVariant?: 'emerald' | 'amber' | 'red' | 'blue'
  children?: NavItem[]
}

// ─── Nav structure ─────────────────────────────────────────────────────────────

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [
      { href: '/admin',           label: 'Dashboard',     icon: LayoutDashboard },
      { href: '/admin/analytics', label: 'Analytics',     icon: TrendingUp },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/admin/bookings',      label: 'Bookings',      icon: Calendar,    badge: 34, badgeVariant: 'amber' },
      { href: '/admin/services',      label: 'Services',      icon: Briefcase },
      { href: '/admin/customers',     label: 'Customers',     icon: Users },
      { href: '/admin/notifications', label: 'Notifications', icon: Bell,        badge: 5, badgeVariant: 'blue' },
      { href: '/admin/invoices',      label: 'Invoices',      icon: FileText },
    ],
  },
  {
    label: 'People',
    items: [
      { href: '/admin/team',  label: 'Team',  icon: Users },
      { href: '/admin/users', label: 'Users', icon: UserCircle },
    ],
  },
  {
    label: 'Content',
    items: [
      {
        label: 'Blog',
        icon: Edit3,
        children: [
          { href: '/admin/blog',            label: 'All Posts',  icon: Edit3 },
          { href: '/admin/blog/categories', label: 'Categories', icon: FolderOpen },
        ],
      },
      { href: '/admin/gallery',        label: 'Gallery',        icon: Image },
      { href: '/admin/file-manager',   label: 'File Manager',   icon: HardDrive },
      { href: '/admin/testimonials',   label: 'Testimonials',   icon: MessageSquare },
      { href: '/admin/faq',            label: 'FAQ',            icon: HelpCircle },
    ],
  },
  {
    label: 'Config',
    items: [
      { href: '/admin/areas',         label: 'Areas',    icon: MapPin },
      { href: '/admin/pricing',       label: 'Pricing',  icon: DollarSign },
      { href: '/admin/careers',       label: 'Careers',  icon: BriefcaseMedical },
      { href: '/admin/email-templates', label: 'Email & SMS', icon: Mail },
      {
        label: 'Settings',
        icon: Settings,
        children: [
          { href: '/admin/settings',                   label: 'General',       icon: Globe },
          { href: '/admin/settings?tab=navigation',    label: 'Navigation',    icon: Navigation },
          { href: '/admin/settings?tab=homepage',      label: 'Homepage',      icon: Home },
          { href: '/admin/settings?tab=footer',        label: 'Footer',        icon: Layers },
          { href: '/admin/settings?tab=notifications', label: 'Notifications', icon: Bell },
        ],
      },
      { href: '/admin/audit-logs', label: 'Audit Logs', icon: Activity },
    ],
  },
]

// ─── Badge component ────────────────────────────────────────────────────────────

const BADGE_STYLES = {
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  amber:   'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  red:     'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  blue:    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
}

function NavBadge({ value, variant = 'emerald' }: { value: string | number; variant?: 'emerald' | 'amber' | 'red' | 'blue' }) {
  return (
    <span className={cn(
      'flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full',
      BADGE_STYLES[variant]
    )}>
      {value}
    </span>
  )
}

// ─── Single nav item ────────────────────────────────────────────────────────────

function NavLink({
  item,
  collapsed,
  depth = 0,
}: {
  item: NavItem
  collapsed: boolean
  depth?: number
}) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const Icon = item.icon

  const isActive = React.useMemo(() => {
    if (!item.href) return false
    if (item.href === '/admin') return pathname === '/admin'
    return pathname.startsWith(item.href)
  }, [item.href, pathname])

  const hasChildren = !!item.children?.length

  // Auto-open if a child is active
  React.useEffect(() => {
    if (hasChildren && item.children?.some(c => c.href && pathname.startsWith(c.href))) {
      setOpen(true)
    }
  }, [pathname]) // eslint-disable-line

  // ── Group with children ──
  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(prev => !prev)}
          title={item.label}
          className={cn(
            'group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150',
            collapsed ? 'justify-center' : '',
            'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100'
          )}
        >
          <Icon className="w-[18px] h-[18px] flex-shrink-0 transition-colors" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left truncate text-[13px] font-medium">{item.label}</span>
              <motion.div
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.18 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="w-4 h-4 text-gray-400 dark:text-slate-500" />
              </motion.div>
            </>
          )}
        </button>

        {!collapsed && (
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="ml-4 mt-1 pl-4 border-l-2 border-gray-100 dark:border-slate-700 space-y-1 pb-1">
                  {item.children!.map(child => (
                    <ChildLink key={child.href} item={child} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    )
  }

  // ── Leaf item ──
  return (
    <Link
      href={item.href || '#'}
      title={item.label}
      className={cn(
        'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-150',
        collapsed ? 'justify-center' : '',
        isActive
          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
          : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100'
      )}
    >
      {isActive && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 dark:bg-emerald-500 rounded-r-full" />
      )}
      <Icon className={cn('w-[18px] h-[18px] flex-shrink-0 transition-colors', isActive ? 'text-emerald-600 dark:text-emerald-400' : '')} />
      {!collapsed && (
        <>
          <span className="flex-1 truncate font-medium">{item.label}</span>
          {item.badge !== undefined && (
            <NavBadge value={item.badge} variant={item.badgeVariant} />
          )}
        </>
      )}
    </Link>
  )
}

function ChildLink({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const isActive = item.href ? pathname.startsWith(item.href) : false
  const Icon = item.icon

  return (
    <Link
      href={item.href || '#'}
      className={cn(
        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all duration-150',
        isActive
          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium'
          : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-800'
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  )
}

// ─── Section label ──────────────────────────────────────────────────────────────

function SectionLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  return (
    <AnimatePresence>
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="px-3 pt-5 pb-2"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[1.5px] text-gray-400 dark:text-slate-600 select-none">
            {label}
          </span>
        </motion.div>
      )}
      {collapsed && <div className="h-3" />}
    </AnimatePresence>
  )
}

// ─── Main Sidebar ───────────────────────────────────────────────────────────────

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="fixed left-0 top-0 z-40 h-screen">
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="flex h-full flex-col bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 overflow-hidden"
      >
        {/* Header */}
        <div className="flex h-16 flex-shrink-0 items-center justify-between px-4 border-b border-gray-100 dark:border-slate-700">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                key="logo"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-3 overflow-hidden"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-bold text-gray-900 dark:text-white tracking-tight whitespace-nowrap">NingClean</div>
                  <div className="text-[10px] text-gray-500 dark:text-slate-400 whitespace-nowrap">Admin Panel</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {collapsed && (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <Layers className="w-5 h-5 text-white" />
            </div>
          )}

          {!collapsed && (
            <button
              onClick={onToggle}
              className="w-8 h-8 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {NAV_SECTIONS.map((section, si) => (
            <div key={si}>
              <SectionLabel label={section.label} collapsed={collapsed} />
              <div className="space-y-1">
                {section.items.map((item, ii) => (
                  <NavLink key={item.href ?? item.label + ii} item={item} collapsed={collapsed} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 p-3 border-t border-gray-100 dark:border-slate-700 space-y-1">
          {/* User card */}
          <div className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-all',
            collapsed && 'justify-center'
          )}>
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex-shrink-0">
              AA
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <div className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">Admin NingClean</div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400 truncate">Super Admin</div>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={cn(
              'group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-150',
              'text-gray-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400',
              collapsed && 'justify-center'
            )}
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Collapse toggle button - positioned outside aside to avoid overflow clipping */}
      <AnimatePresence>
        {collapsed && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={onToggle}
            className="absolute top-[72px] -right-3 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-lg z-50"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
