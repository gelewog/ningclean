'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts'
import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Award,
  BarChart3,
  PieChartIcon,
  Activity,
} from 'lucide-react'
import { getToken } from '@/lib/api'
import { Breadcrumb } from '@/components/admin/Breadcrumb'

interface AnalyticsData {
  monthlyRevenue: Array<{ month: string; revenue: number; bookings: number }>
  dailyBookings: Array<{ date: string; bookings: number; revenue: number }>
  servicePopularity: Array<{ serviceId: string; serviceName: string; count: number }>
  statusBreakdown: Array<{ status: string; count: number }>
  customerGrowth: Array<{ month: string; newCustomers: number }>
  topCustomers: Array<{ customerId: string; name: string; email: string; totalSpent: number }>
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  CONFIRMED: '#3b82f6',
  IN_PROGRESS: '#8b5cf6',
  COMPLETED: '#10b981',
  CANCELLED: '#ef4444',
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Dikonfirmasi',
  IN_PROGRESS: 'Diproses',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, accent, icon
}: { label: string; value: string | number; sub: string; accent: string; icon?: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl p-3 sm:p-5 overflow-hidden shadow-sm dark:shadow-slate-900/50"
    >
      <div className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl ${accent}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-1 sm:mb-2">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{value}</p>
          <p className="text-[10px] sm:text-xs text-gray-400 dark:text-slate-500 mt-1">{sub}</p>
        </div>
        {icon && (
          <div className={`p-2 rounded-xl ${accent.replace('bg-gradient-to-r', 'bg-opacity-20 bg-gray-200').replace(/from-\w+-\d+ to-\w+-\d+/g, '')}`}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function ChartCard({ 
  title, 
  icon: Icon, 
  children,
  className = ''
}: { 
  title: string; 
  icon?: React.ElementType; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm dark:shadow-slate-900/50 ${className}`}
    >
      <div className="px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-gray-500 dark:text-slate-400" />}
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </motion.div>
  )
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = React.useState<AnalyticsData | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    setLoading(true)
    try {
      const token = getToken()
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      // Ensure /api prefix is present
      const baseUrl = apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`
      const res = await fetch(`${baseUrl}/admin/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate totals (with defensive checks)
  const monthlyData = analytics?.monthlyRevenue || []
  const totalRevenue = monthlyData.reduce((sum, m) => sum + (m?.revenue || 0), 0)
  const totalBookings = monthlyData.reduce((sum, m) => sum + (m?.bookings || 0), 0)
  const avgMonthlyRevenue = monthlyData.length ? totalRevenue / monthlyData.length : 0

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `Rp ${(value / 1000).toFixed(0)}K`
    }
    return `Rp ${value.toFixed(0)}`
  }

  // Format month for display
  const formatMonth = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })
  }

  // Custom tooltip styles
  const tooltipStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  }

  const tooltipStyleDark = {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    border: '1px solid #334155',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    color: '#f8fafc',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-800 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-gray-500 dark:text-slate-400">Memuat analytics...</span>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-slate-400">Gagal memuat data analytics</p>
          <button 
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Analytics' }]} />

      <div className="w-full px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-start justify-between gap-4"
        >
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">Analytics Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-0.5 truncate">Insight performa bisnis dan tren</p>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <StatCard 
            label="Total Pendapatan" 
            value={formatCurrency(totalRevenue)} 
            sub="12 bulan terakhir" 
            accent="bg-gradient-to-r from-emerald-600 to-emerald-400" 
            icon={<DollarSign className="w-4 h-4 text-emerald-500" />}
          />
          <StatCard 
            label="Total Booking" 
            value={totalBookings} 
            sub="12 bulan terakhir" 
            accent="bg-gradient-to-r from-blue-600 to-blue-400" 
            icon={<Calendar className="w-4 h-4 text-blue-500" />}
          />
          <StatCard 
            label="Rata-rata Bulanan" 
            value={formatCurrency(avgMonthlyRevenue)} 
            sub="Pendapatan per bulan" 
            accent="bg-gradient-to-r from-violet-600 to-violet-400" 
            icon={<TrendingUp className="w-4 h-4 text-violet-500" />}
          />
          <StatCard 
            label="Layanan Aktif" 
            value={analytics.servicePopularity.length} 
            sub="Layanan populer" 
            accent="bg-gradient-to-r from-amber-600 to-amber-400" 
            icon={<Award className="w-4 h-4 text-amber-500" />}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Monthly Revenue Chart */}
          <ChartCard title="Pendapatan Bulanan" icon={BarChart3}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.monthlyRevenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={formatMonth}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    stroke="#e5e7eb"
                  />
                  <YAxis
                    tickFormatter={(v) => formatCurrency(v)}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    stroke="#e5e7eb"
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'Pendapatan']}
                    labelFormatter={(label) => formatMonth(label as string)}
                    contentStyle={tooltipStyle}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Daily Bookings Chart */}
          <ChartCard title="Booking Harian (30 Hari Terakhir)" icon={Activity}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.dailyBookings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    stroke="#e5e7eb"
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} stroke="#e5e7eb" />
                  <Tooltip
                    formatter={(value: number) => [value, 'Booking']}
                    labelFormatter={(label) => formatDate(label as string)}
                    contentStyle={tooltipStyle}
                  />
                  <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Booking Status Pie Chart */}
          <ChartCard title="Status Booking" icon={PieChartIcon}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.statusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="status"
                  >
                    {analytics.statusBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.status] || '#6b7280'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      value,
                      STATUS_LABELS[name] || name,
                    ]}
                    contentStyle={tooltipStyle}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {analytics.statusBreakdown.map((item) => (
                <div key={item.status} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[item.status] || '#6b7280' }}
                  />
                  <span className="text-xs text-gray-600 dark:text-slate-400">
                    {STATUS_LABELS[item.status] || item.status}: {item.count}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Service Popularity */}
          <ChartCard title="Layanan Populer" icon={Award} className="lg:col-span-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.servicePopularity} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} stroke="#e5e7eb" />
                  <YAxis
                    type="category"
                    dataKey="serviceName"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    stroke="#e5e7eb"
                    width={120}
                  />
                  <Tooltip
                    formatter={(value: number) => [value, 'Booking']}
                    contentStyle={tooltipStyle}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Charts Row 3 - Customer Growth */}
        <div className="grid grid-cols-1 gap-4">
          <ChartCard title="Pertumbuhan Customer" icon={Users}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.customerGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={formatMonth}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    stroke="#e5e7eb"
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} stroke="#e5e7eb" />
                  <Tooltip
                    formatter={(value: number) => [value, 'Customer Baru']}
                    labelFormatter={(label) => formatMonth(label as string)}
                    contentStyle={tooltipStyle}
                  />
                  <Line
                    type="monotone"
                    dataKey="newCustomers"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Top Customers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm dark:shadow-slate-900/50"
        >
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-500 dark:text-slate-400" />
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Top Customer (Berdasarkan Pengeluaran)</h3>
          </div>
          <div className="p-4 sm:p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-slate-400">Rank</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-slate-400">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-slate-400">Email</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-slate-400">Total Pengeluaran</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400 dark:text-slate-500">
                      Belum ada data customer
                    </td>
                  </tr>
                ) : (
                  analytics.topCustomers.map((customer, index) => (
                    <tr key={customer.customerId} className="border-b border-gray-100 dark:border-slate-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                      <td className="py-3 px-4">
                        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                          index === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          index === 1 ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                          index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                          'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                            {customer.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{customer.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500 dark:text-slate-400 text-xs sm:text-sm">{customer.email}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(customer.totalSpent)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
