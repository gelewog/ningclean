'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Users,
  FileText,
  Settings,
  LogOut,
  Image,
  HelpCircle,
  MapPin,
  BriefcaseMedical,
  DollarSign,
  UserCircle,
  Bell,
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
  ChevronDown,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/lib/api'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface MobileSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface NavItem {
  href?: string
  label: string
  icon: React.ElementType
  badge?: string | number
  badgeVariant?: 'emerald' | 'amber' | 'red' | 'blue'
  children?: NavItem[]
}

// ─── Nav structure (same as Sidebar) ─────────────────────────────────────────────

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Ringkasan',
    items: [
      { href: '/admin',           label: 'Dashboard',     icon: LayoutDashboard },
      { href: '/admin/analytics', label: 'Analitik',     icon: TrendingUp },
    ],
  },
  {
    label: 'Operasional',
    items: [
      { href: '/admin/bookings',      label: 'Booking',      icon: Calendar,    badge: 34, badgeVariant: 'amber' },
      { href: '/admin/services',      label: 'Layanan',      icon: Briefcase },
      { href: '/admin/customers',     label: 'Customer',     icon: Users },
      { href: '/admin/notifications', label: 'Notifikasi', icon: Bell,        badge: 5, badgeVariant: 'blue' },
      { href: '/admin/newsletter',    label: 'Newsletter',   icon: Mail },
      { href: '/admin/invoices',      label: 'Invoice',      icon: FileText },
    ],
  },
  {
    label: 'Tim',
    items: [
      { href: '/admin/team',  label: 'Tim',  icon: Users },
      { href: '/admin/users', label: 'User', icon: UserCircle },
    ],
  },
  {
    label: 'Konten',
    items: [
      {
        label: 'Blog',
        icon: Edit3,
        children: [
          { href: '/admin/blog',            label: 'Semua Post',  icon: Edit3 },
          { href: '/admin/blog/categories', label: 'Kategori', icon: FolderOpen },
        ],
      },
      { href: '/admin/gallery',        label: 'Galeri',        icon: Image },
      { href: '/admin/file-manager',   label: 'File Manager',   icon: HardDrive },
      { href: '/admin/testimonials',   label: 'Testimoni',   icon: MessageSquare },
      { href: '/admin/faq',            label: 'FAQ',            icon: HelpCircle },
    ],
  },
  {
    label: 'Konfigurasi',
    items: [
      { href: '/admin/areas',         label: 'Area',    icon: MapPin },
      { href: '/admin/pricing',       label: 'Harga',  icon: DollarSign },
      { href: '/admin/careers',       label: 'Karir',  icon: BriefcaseMedical },
      { href: '/admin/email-templates', label: 'Email & SMS', icon: Mail },
      {
        label: 'Pengaturan',
        icon: Settings,
        children: [
          { href: '/admin/settings',                   label: 'Umum',       icon: Globe },
          { href: '/admin/settings?tab=navigation',    label: 'Navigasi',    icon: Navigation },
          { href: '/admin/settings?tab=homepage',      label: 'Beranda',      icon: Home },
          { href: '/admin/settings?tab=footer',        label: 'Footer',        icon: Layers },
          { href: '/admin/settings?tab=notifications', label: 'Notifikasi', icon: Bell },
        ],
      },
      { href: '/admin/audit-logs', label: 'Log Audit', icon: Activity },
    ],
  },
]

// ─── Badge styles ───────────────────────────────────────────────────────────────

const BADGE_STYLES = {
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  amber:   'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  red:     'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  blue:    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
}

// ─── Components ────────────────────────────────────────────────────────────────

function NavBadge({ value, variant = 'emerald' }: { 
  value: string | number
  variant?: 'emerald' | 'amber' | 'red' | 'blue' 
}) {
  return (
    <span className={cn(
      'flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full',
      BADGE_STYLES[variant]
    )}>
      {value}
    </span>
  )
}

function MobileNavLink({ 
  item, 
  onClick 
}: { 
  item: NavItem
  onClick?: () => void
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
  }, [pathname, hasChildren, item.children])

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm transition-all',
            'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          )}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{item.label}</span>
          </div>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </button>

        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden"
          >
            <div className="ml-4 mt-1 pl-4 border-l-2 border-gray-100 dark:border-slate-700 space-y-1 pb-1">
              {item.children!.map(child => (
                <Link
                  key={child.href}
                  href={child.href || '#'}
                  onClick={onClick}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                    pathname.startsWith(child.href || '')
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium'
                      : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
                  )}
                >
                  <child.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{child.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href || '#'}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all',
        isActive
          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium'
          : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-emerald-600 dark:text-emerald-400')} />
      <span className="flex-1">{item.label}</span>
      {item.badge !== undefined && (
        <NavBadge value={item.badge} variant={item.badgeVariant} />
      )}
    </Link>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────────

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full max-w-[300px] p-0 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-4 py-4 border-b border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-base font-bold text-gray-900 dark:text-white">NingClean</SheetTitle>
                <p className="text-[11px] text-gray-500 dark:text-slate-400">Panel Admin</p>
              </div>
            </div>
          </SheetHeader>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {NAV_SECTIONS.map((section) => (
              <div key={section.label}>
                <h3 className="px-4 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
                  {section.label}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item, idx) => (
                    <MobileNavLink 
                      key={item.href ?? item.label + idx} 
                      item={item} 
                      onClick={() => onOpenChange(false)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-slate-700 space-y-3">
            {/* User card */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex-shrink-0">
                AA
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">Admin NingClean</div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400 truncate">Super Admin</div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Keluar</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
