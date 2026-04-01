'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Calendar, DollarSign, Users, Clock, Plus, ArrowRight, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/admin/StatCard'
import { DataTable } from '@/components/admin/DataTable'
import { getDashboardStats, getRecentBookings } from '@/lib/api'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = React.useState<any>(null)
  const [recentBookings, setRecentBookings] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, bookingsData] = await Promise.all([
          getDashboardStats(),
          getRecentBookings(5),
        ])
        setStats(statsData)
        setRecentBookings(bookingsData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const columns = [
    {
      key: 'customerName',
      label: 'Customer',
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.customerEmail}</p>
        </div>
      ),
    },
    {
      key: 'serviceName',
      label: 'Service',
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-gray-500">{formatCurrency(row.servicePrice)}</p>
        </div>
      ),
    },
    {
      key: 'scheduledDate',
      label: 'Schedule',
      render: (value: string, row: any) => (
        <div>
          <p className="text-sm">{formatDate(value)}</p>
          <p className="text-xs text-gray-500">{row.scheduledTime}</p>
        </div>
      ),
    },
    {
      key: 'area',
      label: 'Area',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variant = value === 'completed' ? 'success' : value === 'pending' ? 'warning' : value === 'cancelled' ? 'error' : 'info'
        return <Badge variant={variant}>{getStatusLabel(value)}</Badge>
      },
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here&apos;s what&apos;s happening with Ningclean.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/bookings">
              <Calendar className="mr-2 h-4 w-4" />
              View Bookings
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/bookings">
              <Plus className="mr-2 h-4 w-4" />
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
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={item}>
          <StatCard
            title="Total Bookings"
            value={stats?.totalBookings || 0}
            change={stats?.bookingsTrend}
            changeLabel="vs last month"
            icon={Calendar}
            iconColor="text-primary"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Total Revenue"
            value={stats?.totalRevenue || 0}
            change={stats?.revenueTrend}
            changeLabel="vs last month"
            icon={DollarSign}
            iconColor="text-success"
            format="currency"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Total Customers"
            value={stats?.totalCustomers || 0}
            icon={Users}
            iconColor="text-accent"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Pending Bookings"
            value={stats?.pendingBookings || 0}
            icon={Clock}
            iconColor="text-warning"
          />
        </motion.div>
      </motion.div>

      {/* Quick Actions & Recent Bookings */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/bookings">
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Bookings
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/services">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Update Services
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/blog">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Blog Post
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/5 p-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-warning" />
                <div>
                  <p className="text-sm font-medium">3 bookings need confirmation</p>
                  <p className="text-xs text-gray-500">Action required within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-error/20 bg-error/5 p-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-error" />
                <div>
                  <p className="text-sm font-medium">2 bookings cancelled today</p>
                  <p className="text-xs text-gray-500">Review cancellation reasons</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-center justify-center rounded-lg bg-gray-50">
                <p className="text-sm text-gray-500">Chart integration placeholder</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/bookings">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={recentBookings}
              loading={loading}
              onRowClick={(row) => console.log('Row clicked:', row)}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
