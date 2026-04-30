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

import { Breadcrumb } from '@/components/admin/Breadcrumb'

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
      console.error('Gagal memuat data dashboard:', statsError)
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
      label: 'Layanan',
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{formatCurrency(row.servicePrice)}</p>
        </div>
      ),
    },
    {
      key: 'scheduledDate',
      label: 'Jadwal',
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
        <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-slate-700 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-slate-200">
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
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Dashboard' }]} />

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-start justify-between gap-4"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 flex-shrink-0">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">Dashboard</h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 truncate">Selamat datang kembali! Berikut ringkasan aktivitas NingClean.</p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3">
            <Button variant="outline" className="rounded-xl gap-2 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700" asChild>
              <Link href="/admin/bookings">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Lihat Booking</span>
                <span className="sm:hidden">Booking</span>
              </Link>
            </Button>
            <Button className="rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/admin/bookings">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Booking Baru</span>
                <span className="sm:hidden">Baru</span>
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
              title="Total Booking"
              value={stats?.totalBookings || 0}
              change={stats?.bookingsTrend}
              changeLabel="vs bulan lalu"
              icon={Calendar}
              iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
            />
          </motion.div>
          <motion.div variants={item}>
            <StatCard
              title="Total Pendapatan"
              value={stats?.totalRevenue || 0}
              change={stats?.revenueTrend}
              changeLabel="vs bulan lalu"
              icon={DollarSign}
              iconBg="bg-gradient-to-br from-emerald-500 to-emerald-600"
              format="currency"
            />
          </motion.div>
          <motion.div variants={item}>
            <StatCard
              title="Total Customer"
              value={stats?.totalCustomers || 0}
              icon={Users}
              iconBg="bg-gradient-to-br from-purple-500 to-purple-600"
            />
          </motion.div>
          <motion.div variants={item}>
            <StatCard
              title="Booking Pending"
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
            className="rounded-2xl border border-gray-100 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-slate-900/50 backdrop-blur-sm"
          >
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">Aksi Cepat</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-between rounded-xl border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-slate-800 hover:border-blue-200 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400" asChild>
                <Link href="/admin/bookings">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Kelola Booking
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between rounded-xl border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white hover:bg-purple-50 dark:hover:bg-slate-800 hover:border-purple-200 dark:hover:border-purple-600 hover:text-purple-600 dark:hover:text-purple-400" asChild>
                <Link href="/admin/services">
                  <span className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Update Layanan
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between rounded-xl border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white hover:bg-emerald-50 dark:hover:bg-slate-800 hover:border-emerald-200 dark:hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400" asChild>
                <Link href="/admin/blog">
                  <span className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Buat Post Blog
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
            className="rounded-2xl border border-gray-100 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-slate-900/50 backdrop-blur-sm"
          >
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">Peringatan</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-amber-100 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/20 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">3 booking perlu konfirmasi</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Tindakan diperlukan dalam 24 jam</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/20 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">2 booking dibatalkan hari ini</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Tinjau alasan pembatalan</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Revenue Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border border-gray-100 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-slate-900/50 backdrop-blur-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">Ikhtisar Pendapatan</h3>
              <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
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
              <span>Sen</span>
              <span>Sel</span>
              <span>Rab</span>
              <span>Kam</span>
              <span>Jum</span>
              <span>Sab</span>
              <span>Min</span>
            </div>
          </motion.div>
        </div>

        {/* Recent Bookings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border border-gray-100 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-900/50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 px-6 py-5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Booking Terbaru</h3>
            <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl" asChild>
              <Link href="/admin/bookings" className="flex items-center gap-1">
                Lihat Semua
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="p-6">
            <DataTable
              columns={columns}
              data={recentBookings}
              loading={loading}
              onRowClick={(row) => console.log('Baris diklik:', row)}
              renderCard={(row) => (
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-3 cursor-pointer active:scale-[0.99] border border-gray-100 dark:border-slate-700/50">
                  <div className="space-y-2">
                    {/* Header - Customer Name & Status */}
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700/50 pb-1.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{row.customerName}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{row.customerEmail}</p>
                      </div>
                      <Badge variant={
                        row.status === 'completed' ? 'success' :
                        row.status === 'pending' ? 'warning' :
                        row.status === 'cancelled' ? 'error' :
                        row.status === 'in_progress' ? 'info' : 'default'
                      }>
                        {getStatusLabel(row.status)}
                      </Badge>
                    </div>

                    {/* Service & Price */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-gray-50 dark:border-slate-800 gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide">Layanan</p>
                        <p className="text-xs font-medium text-gray-700 dark:text-slate-200 truncate">{row.serviceName}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide">Harga</p>
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(row.servicePrice)}</p>
                      </div>
                    </div>

                    {/* Schedule & Area */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-50 dark:border-slate-800">
                      <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-slate-400 truncate">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{formatDate(row.scheduledDate)} {row.scheduledTime}</span>
                      </span>
                      <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-slate-700 px-2 py-0.5 text-[10px] font-medium text-gray-700 dark:text-slate-200 flex-shrink-0">
                        {row.area}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              skeletonCard={(i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-slate-700/50"
                >
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700/50 pb-1.5">
                      <div className="space-y-1">
                        <div className="skeleton h-4 w-28 rounded dark:bg-slate-700" />
                        <div className="skeleton h-3 w-32 rounded dark:bg-slate-700" />
                      </div>
                      <div className="skeleton h-5 w-14 rounded-full dark:bg-slate-700" />
                    </div>

                    {/* Service & Price */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="space-y-1">
                        <div className="skeleton h-3 w-12 rounded dark:bg-slate-700" />
                        <div className="skeleton h-4 w-24 rounded dark:bg-slate-700" />
                      </div>
                      <div className="space-y-1 text-right">
                        <div className="skeleton h-3 w-10 rounded dark:bg-slate-700" />
                        <div className="skeleton h-4 w-16 rounded dark:bg-slate-700" />
                      </div>
                    </div>

                    {/* Schedule & Area */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-50 dark:border-slate-800">
                      <div className="skeleton h-3 w-24 rounded dark:bg-slate-700" />
                      <div className="skeleton h-4 w-10 rounded-full dark:bg-slate-700" />
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
