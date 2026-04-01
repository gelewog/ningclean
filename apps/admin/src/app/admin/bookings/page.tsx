'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Download, Plus, Eye, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/admin/Modal'
import { Pagination } from '@/components/admin/Pagination'
import { DataTable } from '@/components/admin/DataTable'
import { getBookings, updateBookingStatus } from '@/lib/api'
import { formatCurrency, formatDate, formatDateTime, getStatusLabel } from '@/lib/utils'
import { toast } from 'sonner'

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const AREA_OPTIONS = [
  { value: '', label: 'All Areas' },
  { value: 'Jakarta Selatan', label: 'Jakarta Selatan' },
  { value: 'Jakarta Pusat', label: 'Jakarta Pusat' },
  { value: 'Jakarta Barat', label: 'Jakarta Barat' },
  { value: 'Jakarta Utara', label: 'Jakarta Utara' },
  { value: 'Tangerang', label: 'Tangerang' },
  { value: 'Bogor', label: 'Bogor' },
  { value: 'Depok', label: 'Depok' },
  { value: 'Bekasi', label: 'Bekasi' },
]

export default function BookingsPage() {
  const [bookings, setBookings] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedBooking, setSelectedBooking] = React.useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [pagination, setPagination] = React.useState({ page: 1, limit: 10, total: 0, totalPages: 0 })

  // Filters
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('')
  const [areaFilter, setAreaFilter] = React.useState('')

  React.useEffect(() => {
    fetchBookings()
  }, [pagination.page, statusFilter, areaFilter, search])

  async function fetchBookings() {
    setLoading(true)
    try {
      const response = await getBookings({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter || undefined,
        area: areaFilter || undefined,
        search: search || undefined,
      })
      setBookings(response.data)
      setPagination((prev) => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages,
      }))
    } catch (error) {
      toast.error('Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusUpdate(bookingId: string, newStatus: string) {
    try {
      await updateBookingStatus(bookingId, newStatus)
      toast.success('Booking status updated')
      fetchBookings()
      setIsDetailOpen(false)
    } catch (error) {
      toast.error('Failed to update booking status')
    }
  }

  function handleExport() {
    const csvContent = [
      ['ID', 'Customer', 'Service', 'Area', 'Date', 'Time', 'Status', 'Price'].join(','),
      ...bookings.map((b) =>
        [b.id, b.customerName, b.serviceName, b.area, b.scheduledDate, b.scheduledTime, b.status, b.servicePrice].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Bookings exported successfully')
  }

  function handleSearch(value: string) {
    setSearch(value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  function getStatusVariant(status: string) {
    switch (status) {
      case 'completed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'cancelled':
        return 'error'
      case 'in_progress':
        return 'info'
      case 'confirmed':
        return 'info'
      default:
        return 'default'
    }
  }

  const columns = [
    {
      key: 'id',
      label: 'Booking ID',
      render: (value: string) => (
        <span className="font-mono text-xs">#{value.slice(0, 8)}</span>
      ),
    },
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
      key: 'area',
      label: 'Area',
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
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={getStatusVariant(value)}>{getStatusLabel(value)}</Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <Button variant="ghost" size="sm" onClick={() => { setSelectedBooking(row); setIsDetailOpen(true); }}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500">Manage all cleaning service bookings</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-4 md:flex-row"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by customer, service..."
            className="pl-10"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPagination((prev) => ({ ...prev, page: 1 })); }}
          className="md:w-40"
        />
        <Select
          options={AREA_OPTIONS}
          value={areaFilter}
          onChange={(e) => { setAreaFilter(e.target.value); setPagination((prev) => ({ ...prev, page: 1 })); }}
          className="md:w-44"
        />
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </motion.div>

      {/* Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={bookings}
              loading={loading}
              onRowClick={(row) => { setSelectedBooking(row); setIsDetailOpen(true); }}
            />
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Booking Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Booking Details"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <p className="text-sm text-gray-500">Booking ID</p>
                <p className="font-mono font-medium">#{selectedBooking.id.slice(0, 8)}</p>
              </div>
              <Badge variant={getStatusVariant(selectedBooking.status)}>
                {getStatusLabel(selectedBooking.status)}
              </Badge>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-500">Customer Information</h3>
              <div className="grid gap-2 rounded-lg bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium">{selectedBooking.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="text-sm">{selectedBooking.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="text-sm">{selectedBooking.customerPhone}</span>
                </div>
              </div>
            </div>

            {/* Service Info */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-500">Service Details</h3>
              <div className="grid gap-2 rounded-lg bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Service</span>
                  <span className="font-medium">{selectedBooking.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price</span>
                  <span className="font-medium text-primary">{formatCurrency(selectedBooking.servicePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Area</span>
                  <span>{selectedBooking.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Address</span>
                  <span className="text-right text-sm">{selectedBooking.address}</span>
                </div>
              </div>
            </div>

            {/* Schedule Info */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-500">Schedule</h3>
              <div className="grid gap-2 rounded-lg bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{formatDate(selectedBooking.scheduledDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span>{selectedBooking.scheduledTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="text-sm">{formatDateTime(selectedBooking.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedBooking.notes && (
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-500">Notes</h3>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm">{selectedBooking.notes}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 border-t pt-4">
              {selectedBooking.status === 'pending' && (
                <>
                  <Button
                    variant="success"
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')}
                  >
                    Confirm Booking
                  </Button>
                  <Button
                    variant="error"
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
                  >
                    Cancel
                  </Button>
                </>
              )}
              {selectedBooking.status === 'confirmed' && (
                <Button
                  variant="secondary"
                  onClick={() => handleStatusUpdate(selectedBooking.id, 'in_progress')}
                >
                  Start Progress
                </Button>
              )}
              {selectedBooking.status === 'in_progress' && (
                <Button
                  variant="success"
                  onClick={() => handleStatusUpdate(selectedBooking.id, 'completed')}
                >
                  Mark Complete
                </Button>
              )}
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
