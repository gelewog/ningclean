'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, Search, Menu, LogOut, User, Check, CheckCheck,
  Calendar, AlertCircle, Settings, ChevronDown, Sun, Moon,
  X, FileText, Users, ArrowRight, Clock, Plus, Phone, MapPin,
  History, Trash2
} from 'lucide-react'
import { getUser, removeToken, getBookings, getCustomers } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { useAdminPreferences } from '@/lib/useAdminPreferences'
import { useDebounce } from '@/hooks/useDebounce'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface HeaderProps {
  onMenuClick: () => void
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  data?: any
  createdAt: string
  readAt?: string | null
}

interface SearchResult {
  id: string
  type: 'booking' | 'customer'
  title: string
  subtitle: string
  status?: string
  date?: string
  highlightMatch?: string
}

interface RecentSearch {
  id: string
  type: 'booking' | 'customer'
  title: string
  subtitle: string
  timestamp: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const RECENT_SEARCHES_KEY = 'ningclean_recent_searches'
const MAX_RECENT_SEARCHES = 5

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(mins / 60)
  const days = Math.floor(hrs / 24)
  if (mins < 1) return 'Baru saja'
  if (mins < 60) return `${mins}m lalu`
  if (hrs < 24) return `${hrs}j lalu`
  if (days < 7) return `${days}h lalu`
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

// ─── Status Badge Helper ─────────────────────────────────────────────────────────

function getStatusColor(status?: string) {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
    case 'confirmed':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
    case 'in_progress':
      return 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400'
    case 'completed':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
    case 'cancelled':
      return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-400'
  }
}

// ─── Recent Searches Storage ────────────────────────────────────────────────────

function getRecentSearches(): RecentSearch[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveRecentSearch(item: Omit<RecentSearch, 'timestamp'>) {
  if (typeof window === 'undefined') return
  try {
    const current = getRecentSearches()
    // Remove duplicates
    const filtered = current.filter(s => !(s.id === item.id && s.type === item.type))
    // Add new at front
    const updated = [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, MAX_RECENT_SEARCHES)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch (e) {
    console.error('Failed to save recent search:', e)
  }
}

function clearRecentSearches() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(RECENT_SEARCHES_KEY)
}

// ─── Notification icon ──────────────────────────────────────────────────────────

function NotifIcon({ type }: { type: string }) {
  if (type === 'BOOKING_NEW') {
    return (
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/40">
        <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      </div>
    )
  }
  if (type === 'BOOKING_STATUS') {
    return (
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-amber-100 dark:bg-amber-900/40">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
      </div>
    )
  }
  return (
    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-100 dark:bg-blue-900/40">
      <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
    </div>
  )
}

// ─── Quick Actions Component ────────────────────────────────────────────────────

function QuickActions({ onAction }: { onAction: (path: string) => void }) {
  const actions = [
    { id: 'new-booking', label: 'New Booking', icon: Plus, path: '/admin/bookings', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' },
    { id: 'new-customer', label: 'New Customer', icon: Users, path: '/admin/customers', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  ]

  return (
    <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700">
      <div className="flex items-center gap-2">
        {actions.map(action => (
          <button
            key={action.id}
            onClick={() => onAction(action.path)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          >
            <action.icon className="w-3.5 h-3.5" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Recent Searches Component ──────────────────────────────────────────────────

function RecentSearches({
  searches,
  onSelect,
  onClear,
}: {
  searches: RecentSearch[]
  onSelect: (item: RecentSearch) => void
  onClear: () => void
}) {
  if (searches.length === 0) return null

  return (
    <div className="px-2 py-2 border-b border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between px-2 mb-1.5">
        <span className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
          Recent
        </span>
        <button
          onClick={onClear}
          className="text-[10px] text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-0.5"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>
      <div className="space-y-0.5">
        {searches.map((item) => (
          <button
            key={`${item.type}-${item.id}`}
            onClick={() => onSelect(item)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-left group"
          >
            <History className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-slate-300" />
            <div className="flex-1 min-w-0">
              <span className="text-[12px] text-gray-700 dark:text-slate-300 truncate block">
                {item.title}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-slate-500 truncate block">
                {item.subtitle}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 dark:text-slate-500">
              {formatTimeAgo(new Date(item.timestamp).toISOString())}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Search Results Panel ────────────────────────────────────────────────────────

function SearchResultsPanel({
  results,
  loading,
  query,
  recentSearches,
  onClose,
  onSelect,
  onRecentSelect,
  onClearRecent,
  onAction,
}: {
  results: SearchResult[]
  loading: boolean
  query: string
  recentSearches: RecentSearch[]
  onClose: () => void
  onSelect: (result: SearchResult) => void
  onRecentSelect: (item: RecentSearch) => void
  onClearRecent: () => void
  onAction: (path: string) => void
}) {
  const hasQuery = query.trim().length >= 2
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.14 }}
      className="absolute left-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-[420px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden z-50 shadow-xl shadow-gray-200/50 dark:shadow-slate-900/50"
      onClick={e => e.stopPropagation()}
    >
      {/* Quick Actions - Always visible */}
      <QuickActions onAction={onAction} />

      {/* Recent Searches - Show when no query */}
      {!hasQuery && recentSearches.length > 0 && (
        <RecentSearches
          searches={recentSearches}
          onSelect={onRecentSelect}
          onClear={onClearRecent}
        />
      )}

      {/* Search Results Header */}
      {hasQuery && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-slate-700">
          <span className="text-[12px] font-semibold text-gray-700 dark:text-slate-300">
            Results for &quot;{query}&quot;
          </span>
          <button
            onClick={onClose}
            className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Results List */}
      <div className="max-h-[320px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {hasQuery ? (
          loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-6 h-6 rounded-full border-2 border-gray-200 border-t-emerald-500 animate-spin" />
              <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-2">Searching...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                <Search className="w-5 h-5 text-gray-400 dark:text-slate-500" />
              </div>
              <p className="text-[12px] text-gray-500 dark:text-slate-400">
                No results for &quot;{query}&quot;
              </p>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">
                Try different keywords or check spelling
              </p>
            </div>
          ) : (
            <div className="py-1">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => onSelect(result)}
                  className="w-full flex items-start gap-3 px-4 py-2.5 border-b border-gray-100 dark:border-slate-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left group"
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                    result.type === 'booking'
                      ? 'bg-emerald-100 dark:bg-emerald-900/40'
                      : 'bg-blue-100 dark:bg-blue-900/40'
                  )}>
                    {result.type === 'booking' ? (
                      <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-[12px] font-semibold text-gray-900 dark:text-white truncate">
                        {result.title}
                      </span>
                      {result.status && (
                        <span className={cn(
                          'text-[9px] px-1.5 py-0.5 rounded-full font-medium',
                          getStatusColor(result.status)
                        )}>
                          {result.status}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 truncate">
                      {result.subtitle}
                    </p>
                    {result.date && (
                      <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {result.date}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 dark:text-slate-600 group-hover:text-gray-500 dark:group-hover:text-slate-400 flex-shrink-0 mt-1.5" />
                </button>
              ))}
            </div>
          )
        ) : (
          /* Empty state when no query and no recent searches */
          recentSearches.length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 px-4">
              <p className="text-[11px] text-gray-400 dark:text-slate-500">
                Type at least 2 characters to search
              </p>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">
                Search by name, phone, address, or order number
              </p>
            </div>
          )
        )}
      </div>

      {/* Footer */}
      {hasQuery && results.length > 0 && !loading && (
        <div className="px-4 py-2 border-t border-gray-100 dark:border-slate-700 text-center">
          <p className="text-[10px] text-gray-400 dark:text-slate-500">
            Press Enter to view all results
          </p>
        </div>
      )}
    </motion.div>
  )
}

// ─── Notification dropdown ──────────────────────────────────────────────────────

function NotificationPanel({
  notifications,
  unreadCount,
  loading,
  onMarkRead,
  onMarkAllRead,
  onNotifClick,
  onViewAll,
}: {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  onMarkRead: (id: string, e: React.MouseEvent) => void
  onMarkAllRead: (e: React.MouseEvent) => void
  onNotifClick: (n: Notification) => void
  onViewAll: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.14 }}
      className="fixed inset-x-4 sm:absolute sm:right-0 sm:left-auto sm:inset-x-auto top-20 sm:top-full sm:mt-2 w-auto sm:w-[360px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden z-50 shadow-xl shadow-gray-200/50 dark:shadow-slate-900/50"
      onClick={e => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-gray-900 dark:text-white">Notifikasi</span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400">
              {unreadCount} baru
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            disabled={loading}
            className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors disabled:opacity-50"
          >
            <CheckCheck className="w-3 h-3" />
            Tandai semua
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-[320px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-3">
              <Bell className="w-5 h-5 text-gray-400 dark:text-slate-500" />
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">Tidak ada notifikasi</p>
          </div>
        ) : (
          <div>
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => onNotifClick(n)}
                className={cn(
                  'group relative flex items-start gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-slate-700 cursor-pointer transition-colors',
                  'hover:bg-gray-50 dark:hover:bg-slate-800',
                  !n.isRead && 'bg-emerald-50/50 dark:bg-emerald-900/10'
                )}
              >
                <NotifIcon type={n.type} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 justify-between">
                    <span className={cn(
                      'text-[12px] leading-tight',
                      n.isRead ? 'font-medium text-gray-500 dark:text-slate-500' : 'font-semibold text-gray-900 dark:text-white'
                    )}>
                      {n.title}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 whitespace-nowrap flex-shrink-0">
                      {formatTimeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                    {n.message}
                  </p>
                  {!n.isRead && (
                    <button
                      onClick={e => onMarkRead(n.id, e)}
                      disabled={loading}
                      className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                    >
                      <Check className="w-2.5 h-2.5" />
                      Tandai dibaca
                    </button>
                  )}
                </div>
                {!n.isRead && (
                  <span className="absolute right-3.5 bottom-3.5 w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-500" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-slate-700 text-center">
          <button
            onClick={onViewAll}
            className="text-[11px] text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
          >
            Lihat semua notifikasi →
          </button>
        </div>
      )}
    </motion.div>
  )
}

// ─── User dropdown ──────────────────────────────────────────────────────────────

function UserPanel({
  user,
  onLogout,
  onClose,
  onNavigate,
}: {
  user: { name: string; email: string; role: string } | null
  onLogout: () => void
  onClose: () => void
  onNavigate: (path: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.14 }}
      className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden z-50 shadow-xl shadow-gray-200/50 dark:shadow-slate-900/50"
      onClick={e => e.stopPropagation()}
    >
      {/* User info */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-slate-700">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-sm font-bold text-emerald-700 dark:text-emerald-400 flex-shrink-0">
          {user?.name ? getInitials(user.name) : 'AU'}
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-bold text-gray-900 dark:text-white truncate">{user?.name || 'Admin User'}</div>
          <div className="text-[11px] text-gray-500 dark:text-slate-400 truncate">{user?.email || 'admin@ningclean.com'}</div>
        </div>
      </div>

      {/* Items */}
      <div className="p-1.5 space-y-0.5">
        <button
          onClick={() => { onClose(); onNavigate('/admin/profile-settings') }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100 transition-all text-left"
        >
          <User className="w-4 h-4 flex-shrink-0" />
          Profile Settings
        </button>
        <button
          onClick={() => { onClose(); onNavigate('/admin/settings?tab=personal') }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100 transition-all text-left"
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          Preferences
        </button>
        <div className="h-px bg-gray-100 dark:bg-slate-700 my-1" />
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-gray-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all text-left"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </motion.div>
  )
}

// ─── Header ────────────────────────────────────────────────────────────────────

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { preferences } = useAdminPreferences()

  const [searchQuery, setSearchQuery] = React.useState('')
  const [user, setUser] = React.useState<{ name: string; email: string; role: string } | null>(null)
  const [showUserMenu, setShowUserMenu] = React.useState(false)
  const [showNotifications, setShowNotifications] = React.useState(false)
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  // Search states
  const [showSearchResults, setShowSearchResults] = React.useState(false)
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([])
  const [searchLoading, setSearchLoading] = React.useState(false)
  const [recentSearches, setRecentSearches] = React.useState<RecentSearch[]>([])

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const notifRef = React.useRef<HTMLDivElement>(null)
  const userRef = React.useRef<HTMLDivElement>(null)
  const searchRef = React.useRef<HTMLDivElement>(null)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  // ── Init ──
  React.useEffect(() => {
    setMounted(true)
    setUser(getUser())
    setRecentSearches(getRecentSearches())
  }, [])

  // ── Fetch notifs ──
  const fetchNotifications = React.useCallback(async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return
    try {
      const res = await fetch(`${API_BASE}/notifications?limit=10`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.data || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (e) { console.error(e) }
  }, [])

  React.useEffect(() => {
    fetchNotifications()
    if (preferences.autoRefresh) {
      const interval = setInterval(fetchNotifications, (preferences.refreshInterval || 30) * 1000)
      return () => clearInterval(interval)
    }
  }, [fetchNotifications, preferences.autoRefresh, preferences.refreshInterval])

  // ── Enhanced Search functionality ──
  const performSearch = React.useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      // Enhanced search: include phone in search params
      const searchLower = query.toLowerCase()

      // Parallel fetch bookings and customers
      const [bookingsRes, customersRes] = await Promise.allSettled([
        getBookings({ search: query, limit: 5 }),
        getCustomers({ search: query, limit: 5 }),
      ])

      const results: SearchResult[] = []

      // Process bookings with enhanced details
      if (bookingsRes.status === 'fulfilled' && bookingsRes.value.data) {
        bookingsRes.value.data.forEach((booking) => {
          // Include phone in the subtitle
          const phoneInfo = booking.customerPhone ? ` • ${booking.customerPhone}` : ''
          const addressInfo = booking.area ? ` • ${booking.area}` : ''

          results.push({
            id: booking.id,
            type: 'booking',
            title: booking.orderNumber || `Booking #${booking.id.slice(0, 8)}`,
            subtitle: `${booking.customerName}${phoneInfo}${addressInfo}`,
            status: booking.status,
            date: booking.scheduledDate || booking.createdAt,
          })
        })
      }

      // Process customers - also fetch phone details
      if (customersRes.status === 'fulfilled' && customersRes.value.data) {
        customersRes.value.data.forEach((customer) => {
          const phoneText = customer.phone ? ` • ${customer.phone}` : ''
          const bookingsText = customer.totalBookings > 0 ? ` • ${customer.totalBookings} bookings` : ''

          results.push({
            id: customer.id,
            type: 'customer',
            title: customer.name,
            subtitle: `${customer.email}${phoneText}${bookingsText}`,
            date: customer.createdAt,
          })
        })
      }

      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (debouncedSearchQuery.length >= 2) {
      performSearch(debouncedSearchQuery)
    } else {
      setSearchResults([])
    }
  }, [debouncedSearchQuery, performSearch])

  // ── Click outside ──
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false)
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearchResults(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Keyboard shortcuts ──
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
        setShowSearchResults(true)
      }
      // ESC to close search results
      if (e.key === 'Escape') {
        setShowSearchResults(false)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // ── Actions ──
  const handleLogout = () => {
    removeToken()
    router.push('/login')
  }

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const token = localStorage.getItem('admin_token')
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const token = localStorage.getItem('admin_token')
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
        setUnreadCount(0)
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const handleNotifClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id, { stopPropagation: () => {}, preventDefault: () => {} } as React.MouseEvent)
    }
    setShowNotifications(false)
    if (['BOOKING_NEW', 'BOOKING_STATUS'].includes(notification.type) && notification.data?.bookingId) {
      router.push(`/admin/bookings?highlight=${notification.data.bookingId}`)
    } else {
      router.push('/admin/notifications')
    }
  }

  const handleSearchSelect = (result: SearchResult) => {
    // Save to recent searches
    saveRecentSearch({
      id: result.id,
      type: result.type,
      title: result.title,
      subtitle: result.subtitle,
    })

    setShowSearchResults(false)
    setSearchQuery('')

    if (result.type === 'booking') {
      router.push(`/admin/bookings?highlight=${result.id}`)
    } else {
      router.push(`/admin/customers?highlight=${result.id}`)
    }
  }

  const handleRecentSelect = (item: RecentSearch) => {
    setShowSearchResults(false)
    setSearchQuery('')

    if (item.type === 'booking') {
      router.push(`/admin/bookings?highlight=${item.id}`)
    } else {
      router.push(`/admin/customers?highlight=${item.id}`)
    }
  }

  const handleClearRecent = () => {
    clearRecentSearches()
    setRecentSearches([])
  }

  const handleAction = (path: string) => {
    setShowSearchResults(false)
    router.push(path)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/admin/bookings?search=${encodeURIComponent(searchQuery)}`)
      setShowSearchResults(false)
      setSearchQuery('')
    }
  }

  // ── Render ──
  // Prevent hydration issues by not rendering dynamic content until mounted
  if (!mounted) {
    return (
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-slate-700 px-4 md:px-5">
        <div className="flex items-center gap-3">
          <div className="md:hidden w-9 h-9 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
          <div className="hidden md:block h-9 w-60 lg:w-80 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
          <div className="w-px h-5 bg-gray-200 mx-1 hidden sm:block" />
          <div className="w-9 h-9 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
          <div className="h-9 w-20 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-slate-700 px-4 md:px-5">

      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="md:hidden w-9 h-9 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Search */}
        <div className="relative hidden md:block" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name, phone, address... (Ctrl+K)"
            className="h-9 w-60 lg:w-96 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl pl-10 pr-8 text-sm text-gray-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value)
              setShowSearchResults(true)
            }}
            onFocus={() => setShowSearchResults(true)}
            onKeyDown={handleSearchKeyDown}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSearchResults([])
                searchInputRef.current?.focus()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          {/* Search Results Panel */}
          <AnimatePresence>
            {showSearchResults && (
              <SearchResultsPanel
                results={searchResults}
                loading={searchLoading}
                query={debouncedSearchQuery}
                recentSearches={recentSearches}
                onClose={() => setShowSearchResults(false)}
                onSelect={handleSearchSelect}
                onRecentSelect={handleRecentSelect}
                onClearRecent={handleClearRecent}
                onAction={handleAction}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-9 h-9 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Live indicator */}
        {preferences.showLiveIndicator && (
          <div className="hidden sm:flex items-center gap-1.5 mr-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">Live</span>
          </div>
        )}

        <div className="w-px h-5 bg-gray-200 mx-1 hidden sm:block" />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifications(p => !p); setShowUserMenu(false) }}
            className={cn(
              'relative w-9 h-9 rounded-lg border flex items-center justify-center transition-all',
              showNotifications
                ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400'
                : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-700 dark:hover:text-slate-200'
            )}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center px-1 border-2 border-white dark:border-slate-900">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <NotificationPanel
                notifications={notifications}
                unreadCount={unreadCount}
                loading={loading}
                onMarkRead={handleMarkAsRead}
                onMarkAllRead={handleMarkAllAsRead}
                onNotifClick={handleNotifClick}
                onViewAll={() => { setShowNotifications(false); router.push('/admin/notifications') }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setShowUserMenu(p => !p); setShowNotifications(false) }}
            className={cn(
              'flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-xl border transition-all',
              showUserMenu
                ? 'bg-gray-50 dark:bg-slate-700 border-emerald-300 dark:border-emerald-700'
                : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-400 flex-shrink-0">
              {user?.name ? getInitials(user.name) : 'AU'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-[13px] font-semibold text-gray-900 dark:text-slate-100 leading-none">
                {user?.name || 'Admin User'}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 capitalize leading-none">
                {user?.role || 'Administrator'}
              </div>
            </div>
            <ChevronDown className={cn(
              'w-3.5 h-3.5 text-gray-400 dark:text-slate-500 transition-transform duration-150 hidden md:block',
              showUserMenu && 'rotate-180'
            )} />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <UserPanel user={user} onLogout={handleLogout} onClose={() => setShowUserMenu(false)} onNavigate={(path) => router.push(path)} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
