'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Calendar, DollarSign, Users, Clock, Plus, ArrowRight, AlertCircle, TrendingUp, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/admin/StatCard'
import { DataTable } from '@/components/admin/DataTable'
import { useDashboardStats, useRecentBookings } from '@/lib/use-queries'
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils'
import Link from 'next/link'

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div className="w-full px-4 md:px-6 py-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="h-96 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
    </div>
  )
}

export default function DashboardPage() {
  // Use TanStack Query hooks for data fetching with caching
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats()
  const { data: recentBookings = [], isLoading: bookingsLoading } = useRecentBookings(5)
  
  const loading = statsLoading || bookingsLoading

  React.useEffect(() => {
    if (statsError) {
      console.error('Failed to fetch dashboard data:', statsError)
    }
  }, [statsError])

  const columns = [
    {
      key: 'customerName',
      label: 'Customer',
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-xs font-semibold text-white">
            {value.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">{row.customerEmail}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'serviceName',
      label: 'Service',
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-blue-600 font-medium">{formatCurrency(row.servicePrice)}</p>
        </div>
      ),
    },
    {
      key: 'scheduledDate',
      label: 'Schedule',
      render: (value: string, row: any) => (
        <div>
          <p className="text-sm text-gray-900 dark:text-white">{formatDate(value)}</p>
          <p className="text-xs text-gray-500 dark:text-slate-400">{row.scheduledTime}</p>
        </div>
      ),
    },
    {
      key: 'area',
      label: 'Area',
      render: (value: string) => (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-slate-200">
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
          completed: 'success',
          pending: 'warning',
          cancelled: 'error',
          in_progress: 'info',
          confirmed: 'info',
        }
        return <Badge variant={variants[value] || 'default'}>{getStatusLabel(value)}</Badge>
      },
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
      {/* Topbar */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-700 px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
          <span>NingClean Admin</span>
          <span>/</span>
          <span className="text-gray-700 dark:text-slate-200">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-gray-500 dark:text-slate-400">Live</span>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-slate-400">Welcome back! Here&apos;s what&apos;s happening with Ningclean.</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl gap-2" asChild>
              <Link href="/admin/bookings">
                <Calendar className="h-4 w-4" />
                View Bookings
              </Link>
            </Button>
            <Button className="rounded-xl gap-2 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700" asChild>
              <Link href="/admin/bookings">
                <Plus className="h-4 w-4" />
                New Booking
              </Link>
            </Button>
          </div>
        </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={item}>
          <StatCard
            title="Total Bookings"
            value={stats?.totalBookings || 0}
            change={stats?.bookingsTrend}
            changeLabel="vs last month"
            icon={Calendar}
            iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Total Revenue"
            value={stats?.totalRevenue || 0}
            change={stats?.revenueTrend}
            changeLabel="vs last month"
            icon={DollarSign}
            iconBg="bg-gradient-to-br from-emerald-500 to-emerald-600"
            format="currency"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Total Customers"
            value={stats?.totalCustomers || 0}
            icon={Users}
            iconBg="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Pending Bookings"
            value={stats?.pendingBookings || 0}
            icon={Clock}
            iconBg="bg-gradient-to-br from-amber-500 to-amber-600"
          />
        </motion.div>
      </motion.div>

      {/* Quick Actions & Alerts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-gray-100 dark:border-slate-700/50 bg-white/80 p-6 shadow-sm dark:shadow-slate-900/50 backdrop-blur-sm"
        >
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-between rounded-xl border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600" asChild>
              <Link href="/admin/bookings">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Manage Bookings
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between rounded-xl border-gray-200 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600" asChild>
              <Link href="/admin/services">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Update Services
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between rounded-xl border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600" asChild>
              <Link href="/admin/blog">
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Blog Post
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-gray-100 dark:border-slate-700/50 bg-white/80 p-6 shadow-sm dark:shadow-slate-900/50 backdrop-blur-sm"
        >
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/50 dark:bg-amber-900/20 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                <AlertCircle className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">3 bookings need confirmation</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Action required within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/50 dark:bg-red-900/20 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">2 bookings cancelled today</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Review cancellation reasons</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Revenue Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-gray-100 dark:border-slate-700/50 bg-white/80 p-6 shadow-sm dark:shadow-slate-900/50 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">Revenue Overview</h3>
            <div className="flex items-center gap-1 text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              +12.5%
            </div>
          </div>
          <div className="flex h-36 items-end justify-between gap-2">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400"
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-gray-400 dark:text-slate-500">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </motion.div>
      </div>

      {/* Recent Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl border border-gray-100 dark:border-slate-700/50 bg-white/80 shadow-sm dark:shadow-slate-900/50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 px-6 py-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h3>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl" asChild>
            <Link href="/admin/bookings" className="flex items-center gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="p-6">
          <DataTable
            columns={columns}
            data={recentBookings}
            loading={loading}
            onRowClick={(row) => console.log('Row clicked:', row)}
          />
        </div>
      </motion.div>
      </div>
    </div>
  )
}
