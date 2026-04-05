'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, Menu, LogOut, User, Check, CheckCheck, X, Calendar, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getUser, removeToken } from '@/lib/api'
import { useRouter } from 'next/navigation'

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

export function Header({ onMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [user, setUser] = React.useState<{ name: string; email: string; role: string } | null>(null)
  const [showUserMenu, setShowUserMenu] = React.useState(false)
  const [showNotifications, setShowNotifications] = React.useState(false)
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const notificationRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fetch user data
  React.useEffect(() => {
    const userData = getUser()
    setUser(userData)
  }, [])

  // Fetch notifications
  const fetchNotifications = React.useCallback(async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/notifications?limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.data || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }, [])

  React.useEffect(() => {
    fetchNotifications()
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Close notification dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
    setLoading(false)
  }

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const token = localStorage.getItem('admin_token')
    if (!token) return

    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
    setLoading(false)
  }

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id, { stopPropagation: () => {}, preventDefault: () => {} } as React.MouseEvent)
    }
    
    setShowNotifications(false)
    
    // Navigate based on notification type and data
    if (notification.type === 'BOOKING_NEW' && notification.data?.bookingId) {
      router.push(`/admin/bookings?highlight=${notification.data.bookingId}`)
    } else if (notification.type === 'BOOKING_STATUS' && notification.data?.bookingId) {
      router.push(`/admin/bookings?highlight=${notification.data.bookingId}`)
    } else {
      router.push('/admin/notifications')
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Baru saja'
    if (diffMins < 60) return `${diffMins}m lalu`
    if (diffHours < 24) return `${diffHours}j lalu`
    if (diffDays < 7) return `${diffDays}h lalu`
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BOOKING_NEW':
        return <Calendar className="h-4 w-4 text-emerald-500" />
      case 'BOOKING_STATUS':
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      default:
        return <Bell className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-100/50 bg-white/80 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 md:hidden rounded-xl hover:bg-gray-100" 
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </Button>

        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search bookings, customers..."
            className="h-11 w-64 rounded-xl border border-gray-200 bg-gray-50/50 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:w-80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl transition-all hover:bg-gray-100"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-500 px-1.5 text-[10px] font-bold text-white shadow-lg shadow-red-500/30">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </motion.button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={(e) => {
                    e.preventDefault()
                    setShowNotifications(false)
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-96 rounded-2xl bg-white shadow-2xl shadow-slate-900/15 border border-gray-100/80 overflow-hidden"
                  onClick={(e) => e.preventDefault()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-900">Notifikasi</h3>
                      {unreadCount > 0 && (
                        <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-emerald-100 px-1.5 text-[10px] font-semibold text-emerald-700">
                          {unreadCount} baru
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        disabled={loading}
                        className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[28rem] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 px-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                          <Bell className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="mt-3 text-sm font-medium text-gray-900">Tidak ada notifikasi</p>
                        <p className="mt-1 text-xs text-gray-500">Notifikasi baru akan muncul di sini</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`group relative flex gap-3.5 px-5 py-4 transition-colors cursor-pointer hover:bg-gray-50/80 ${
                              !notification.isRead ? 'bg-emerald-50/40' : ''
                            }`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            {/* Icon */}
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                              !notification.isRead ? 'bg-emerald-100' : 'bg-gray-100'
                            }`}>
                              {getNotificationIcon(notification.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                                  {notification.title}
                                </p>
                                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                  {formatTimeAgo(notification.createdAt)}
                                </span>
                              </div>
                              <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                                {notification.message}
                              </p>
                              
                              {/* Action - stop propagation to prevent navigation when clicking this */}
                              {!notification.isRead && (
                                <button
                                  onClick={(e) => handleMarkAsRead(notification.id, e)}
                                  disabled={loading}
                                  className="mt-2 flex items-center gap-1 text-[11px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                                >
                                  <Check className="h-3 w-3" />
                                  Tandai dibaca
                                </button>
                              )}
                            </div>

                            {/* Unread indicator */}
                            {!notification.isRead && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="border-t border-gray-100 px-5 py-3">
                      <button
                        onClick={() => {
                          setShowNotifications(false)
                          router.push('/admin/notifications')
                        }}
                        className="w-full text-center text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Lihat semua notifikasi
                      </button>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 rounded-xl p-1.5 pr-3 transition-all hover:bg-gray-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/20">
              {user?.name ? getInitials(user.name) : 'AU'}
            </div>
            <div className="hidden flex-col items-start md:flex">
              <span className="text-sm font-semibold text-gray-900">{user?.name || 'Admin User'}</span>
              <span className="text-xs text-gray-500 capitalize">{user?.role || 'Administrator'}</span>
            </div>
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowUserMenu(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl bg-white shadow-xl shadow-slate-900/10 border border-gray-100 overflow-hidden"
              >
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@ningclean.com'}</p>
                </div>
                <div className="p-2">
                  <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                    <User className="h-4 w-4" />
                    Profile Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
