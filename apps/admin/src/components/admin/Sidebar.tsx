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
  badgeVariant?: 'blue' | 'amber' | 'red'
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
      { href: '/admin/notifications', label: 'Notifications', icon: Bell,        badge: 5 },
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
      { href: '/admin/gallery',      label: 'Gallery',      icon: Image },
      { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
      { href: '/admin/faq',          label: 'FAQ',          icon: HelpCircle },
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
  blue:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  red:   'bg-red-500/10 text-red-400 border-red-500/20',
}

function NavBadge({ value, variant = 'blue' }: { value: string | number; variant?: 'blue' | 'amber' | 'red' }) {
  return (
    <span className={cn(
      'flex-shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border',
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
            'group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150',
            collapsed ? 'justify-center' : '',
            'text-zinc-600 hover:bg-white/[0.04] hover:text-zinc-400'
          )}
        >
          <Icon className="w-4 h-4 flex-shrink-0 transition-colors" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left truncate text-[13px]">{item.label}</span>
              <motion.div
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.18 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="w-3 h-3 text-zinc-700" />
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
                <div className="ml-3.5 mt-0.5 pl-3.5 border-l border-white/[0.05] space-y-0.5 pb-1">
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
        'group relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all duration-150',
        collapsed ? 'justify-center' : '',
        isActive
          ? 'bg-blue-500/10 text-blue-400'
          : 'text-zinc-600 hover:bg-white/[0.04] hover:text-zinc-400'
      )}
    >
      {isActive && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-400 rounded-r-full" />
      )}
      <Icon className={cn('w-4 h-4 flex-shrink-0 transition-colors', isActive ? 'text-blue-400' : '')} />
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
        'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] transition-all duration-150',
        isActive
          ? 'bg-blue-500/10 text-blue-400'
          : 'text-zinc-700 hover:text-zinc-400 hover:bg-white/[0.03]'
      )}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
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
          className="px-2.5 pt-4 pb-1"
        >
          <span className="text-[9px] font-semibold uppercase tracking-[1.2px] text-zinc-800 select-none">
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
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 68 : 256 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col bg-[#0e0e10] border-r border-white/[0.05] overflow-hidden"
    >
      {/* Header */}
      <div className="flex h-[60px] flex-shrink-0 items-center justify-between px-3.5 border-b border-white/[0.05]">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2.5 overflow-hidden"
            >
              <div className="w-8 h-8 rounded-[9px] bg-[#1a3a5c] border border-[#1e4a7a] flex items-center justify-center flex-shrink-0">
                <Layers className="w-4 h-4 text-blue-400" />
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-zinc-100 tracking-tight whitespace-nowrap">NingClean</div>
                <div className="text-[10px] text-zinc-700 whitespace-nowrap">Admin Panel</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed && (
          <div className="w-8 h-8 rounded-[9px] bg-[#1a3a5c] border border-[#1e4a7a] flex items-center justify-center mx-auto">
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
        )}

        {!collapsed && (
          <button
            onClick={onToggle}
            className="w-7 h-7 rounded-lg border border-white/[0.06] bg-transparent flex items-center justify-center text-zinc-700 hover:text-zinc-400 hover:bg-white/[0.04] transition-all flex-shrink-0"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}

        {collapsed && (
          <button
            onClick={onToggle}
            className="absolute bottom-[72px] -right-3 w-6 h-6 rounded-full bg-[#1a1a1e] border border-white/[0.08] flex items-center justify-center text-zinc-600 hover:text-zinc-300 hover:bg-[#222226] transition-all shadow-lg"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
        {NAV_SECTIONS.map((section, si) => (
          <div key={si}>
            <SectionLabel label={section.label} collapsed={collapsed} />
            <div className="space-y-0.5">
              {section.items.map((item, ii) => (
                <NavLink key={item.href ?? item.label + ii} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 p-2 border-t border-white/[0.05] space-y-0.5">
        {/* User card */}
        <div className={cn(
          'flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-white/[0.04] transition-all',
          collapsed && 'justify-center'
        )}>
          <div className="w-7 h-7 rounded-lg bg-[#1a2540] border border-[#1e3060] flex items-center justify-center text-[10px] font-semibold text-blue-400 flex-shrink-0">
            AA
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="text-[12px] font-semibold text-zinc-500 truncate">Admin NingClean</div>
              <div className="text-[10px] text-zinc-700 truncate">Super Admin</div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={cn(
            'group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all duration-150',
            'text-zinc-700 hover:bg-red-500/5 hover:text-red-500',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </motion.aside>
  )
}