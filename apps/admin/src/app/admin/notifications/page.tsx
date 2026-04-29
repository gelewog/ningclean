'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Bell, Calendar, AlertCircle, Check, CheckCheck, Trash2, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getToken } from '@/lib/api'
import { Breadcrumb } from '@/components/admin/Breadcrumb'

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

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [loading, setLoading] = React.useState(true)
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all')
  const [actionLoading, setActionLoading] = React.useState<string | null>(null)

  const fetchNotifications = React.useCallback(async (pageNum = 1, filterType = filter) => {
    const token = getToken()
    if (!token) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '20',
      })
      if (filterType === 'unread') {
        params.set('unreadOnly', 'true')
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/notifications?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.data || [])
        setTotalPages(data.totalPages || 1)
        setPage(pageNum)
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
    setLoading(false)
  }, [filter])

  React.useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleMarkAsRead = async (id: string) => {
    const token = getToken()
    if (!token) return

    setActionLoading(id)
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
    setActionLoading(null)
  }

  const handleMarkAsUnread = async (id: string) => {
    const token = getToken()
    if (!token) return

    setActionLoading(id)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/notifications/${id}/unread`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: false } : n))
        setUnreadCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Failed to mark as unread:', error)
    }
    setActionLoading(null)
  }

  const handleMarkAllAsRead = async () => {
    const token = getToken()
    if (!token) return

    setActionLoading('all')
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
    setActionLoading(null)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BOOKING_NEW':
        return <Calendar className="h-5 w-5 text-emerald-500" />
      case 'BOOKING_STATUS':
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'BOOKING_NEW':
        return 'Booking Baru'
      case 'BOOKING_STATUS':
        return 'Status Booking'
      default:
        return 'Sistem'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Notifications' }]} />

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-start justify-between gap-4"
        >
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Notifikasi</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1 truncate">
              {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            {/* Filter Toggle - Icon Only */}
            <div className="flex items-center rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 p-0.5">
              <button
                onClick={() => { setFilter('all'); fetchNotifications(1, 'all') }}
                className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
                  filter === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
                title="Semua"
              >
                <Filter className="h-4 w-4" />
              </button>
              <button
                onClick={() => { setFilter('unread'); fetchNotifications(1, 'unread') }}
                className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors relative ${
                  filter === 'unread'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
                title="Belum Dibaca"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mark all as read - Icon Only */}
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleMarkAllAsRead}
                disabled={actionLoading === 'all'}
                className="h-8 w-8"
                title="Tandai Semua Dibaca"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
            )}
          </div>
        </motion.div>

        {/* Notifications List */}
        <div className="sm:bg-white sm:dark:bg-slate-900 sm:shadow-sm sm:border sm:border-gray-200 dark:sm:border-slate-700 sm:rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800">
                <Bell className="h-8 w-8 text-gray-400 dark:text-slate-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Tidak ada notifikasi</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                {filter === 'unread'
                  ? 'Semua notifikasi sudah dibaca'
                  : 'Notifikasi baru akan muncul di sini'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex gap-4 p-5 transition-colors hover:bg-gray-50/50 dark:hover:bg-slate-800 ${
                    !notification.isRead ? 'bg-emerald-50/30 dark:bg-emerald-900/20' : ''
                  }`}
                >
                  {/* Icon */}
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    !notification.isRead 
                      ? 'bg-emerald-100 dark:bg-emerald-900/40' 
                      : 'bg-gray-100 dark:bg-slate-800'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {!notification.isRead && (
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          )}
                          <h3 className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-slate-200'}`}>
                            {notification.title}
                          </h3>
                          <span className="text-[10px] font-medium text-gray-500 dark:text-slate-400 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700">
                            {getTypeLabel(notification.type)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500 dark:text-slate-400">
                            {formatDate(notification.createdAt)}
                          </span>
                          {notification.data?.bookingId && (
                            <span className="text-xs text-gray-500 dark:text-slate-400">
                              ID: {notification.data.bookingId.slice(0, 8)}...
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {notification.isRead ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsUnread(notification.id)}
                            disabled={actionLoading === notification.id}
                            className="gap-1 text-xs text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
                          >
                            <Check className="h-3 w-3" />
                            Tandai Belum Dibaca
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={actionLoading === notification.id}
                            className="gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                          >
                            <Check className="h-3 w-3" />
                            Tandai Dibaca
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNotifications(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-500 dark:text-slate-400">
              Halaman {page} dari {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNotifications(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}