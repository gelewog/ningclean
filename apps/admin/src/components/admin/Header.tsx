'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, Search, Menu, LogOut, User, Check, CheckCheck,
  Calendar, AlertCircle, Settings, ChevronDown, Sun, Moon,
} from 'lucide-react'
import { getUser, removeToken } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { useAdminPreferences } from '@/lib/useAdminPreferences'

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

// ─── Helpers ───────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

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
      className="absolute right-0 top-full mt-2 w-[360px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden z-50 shadow-xl shadow-gray-200/50 dark:shadow-slate-900/50"
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

  const notifRef = React.useRef<HTMLDivElement>(null)
  const userRef = React.useRef<HTMLDivElement>(null)

  // ── Init ──
  React.useEffect(() => {
    setMounted(true)
    setUser(getUser())
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

  // ── Click outside ──
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
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
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="search"
            placeholder="Search bookings, customers..."
            className="h-9 w-60 lg:w-80 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl pl-10 pr-3 text-sm text-gray-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
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
