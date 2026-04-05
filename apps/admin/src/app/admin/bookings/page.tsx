'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { Search, Download, Plus, Eye, X, Check, Clock, MapPin, User, FileText, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Modal, BookingDetailSection, BookingDetailRow, BookingActionButton, WhatsAppButton, StatusBadge, BookingStepProgress } from '@/components/admin/Modal'
import { Pagination } from '@/components/admin/Pagination'
import { DataTable } from '@/components/admin/DataTable'
import { getBookings, getToken, updateBookingStatus } from '@/lib/api'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export const dynamic = 'force-dynamic'

function BookingsContent() {
  const searchParams = useSearchParams()
  const highlightId = searchParams.get('highlight')
  
  const [bookings, setBookings] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedBooking, setSelectedBooking] = React.useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [pagination, setPagination] = React.useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [highlightedRowId, setHighlightedRowId] = React.useState<string | null>(null)
  const [actionLoading, setActionLoading] = React.useState(false)
  
  // Bulk selection state
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [bulkStatusOpen, setBulkStatusOpen] = React.useState(false)
  const [bulkStatus, setBulkStatus] = React.useState('completed')
  
  // Internal notes modal state
  const [internalNotesOpen, setInternalNotesOpen] = React.useState(false)
  const [internalNotes, setInternalNotes] = React.useState('')
  const [currentBookingId, setCurrentBookingId] = React.useState<string>('')

  // Filters
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('')
  const [areaFilter, setAreaFilter] = React.useState('')

  // Fetch booking by ID for highlight
  const fetchBookingById = React.useCallback(async (id: string) => {
    const token = getToken()
    if (!token) return null
    
    try {
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (res.ok) {
        return await res.json()
      }
    } catch (error) {
      console.error('Failed to fetch booking:', error)
    }
    return null
  }, [])

  // Handle highlight param - fetch booking and open modal directly
  React.useEffect(() => {
    if (highlightId) {
      // First fetch bookings to populate table
      fetchBookings()
      
      // Then fetch the specific booking and open modal
      fetchBookingById(highlightId).then((booking) => {
        if (booking) {
          // Transform API response to match table format
          const firstItem = booking.items?.[0]
          const transformedBooking = {
            id: booking.id,
            customerId: booking.customerId,
            customerName: booking.customer?.name || booking.guestName || 'Unknown',
            customerEmail: booking.customer?.email || booking.guestEmail || '',
            customerPhone: booking.customer?.phone || booking.guestPhone || '',
            serviceId: firstItem?.service?.id || '',
            serviceName: firstItem?.service?.name || 'Unknown Service',
            servicePrice: firstItem ? Number(firstItem.price) : 0,
            totalAmount: Number(booking.totalAmount) || 0,
            area: booking.area || '',
            address: booking.address || '',
            scheduledDate: booking.serviceDate,
            scheduledTime: booking.serviceTime,
            status: booking.status?.toLowerCase() || 'pending',
            notes: booking.notes || '',
            createdAt: booking.createdAt,
            items: booking.items,
          }
          setSelectedBooking(transformedBooking)
          setIsDetailOpen(true)
          setHighlightedRowId(highlightId)
          // Clear highlight after 5 seconds
          setTimeout(() => setHighlightedRowId(null), 5000)
        }
      })
    } else {
      fetchBookings()
    }
  }, [highlightId]) // eslint-disable-line react-hooks/exhaustive-deps

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
    setActionLoading(true)
    try {
      await updateBookingStatus(bookingId, newStatus)
      toast.success('Status booking berhasil diupdate')
      fetchBookings()
      setIsDetailOpen(false)
    } catch (error) {
      toast.error('Gagal update status booking')
    } finally {
      setActionLoading(false)
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

  async function handleBulkStatusUpdate() {
    if (selectedIds.length === 0) {
      toast.error('Pilih booking yang akan diupdate')
      return
    }
    setActionLoading(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/admin/bookings/bulk-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedIds, status: bulkStatus }),
      })
      if (res.ok) {
        toast.success(`${selectedIds.length} booking berhasil diupdate ke ${bulkStatus}`)
        setSelectedIds([])
        setBulkStatusOpen(false)
        fetchBookings()
      } else {
        toast.error('Gagal bulk update')
      }
    } catch (error) {
      toast.error('Gagal bulk update')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleUpdateInternalNotes() {
    if (!currentBookingId) return
    setActionLoading(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/admin/bookings/${currentBookingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ internalNotes }),
      })
      if (res.ok) {
        toast.success('Internal notes berhasil disimpan')
        setInternalNotesOpen(false)
        fetchBookings()
      } else {
        toast.error('Gagal menyimpan notes')
      }
    } catch (error) {
      toast.error('Gagal menyimpan notes')
    } finally {
      setActionLoading(false)
    }
  }

  function openInternalNotes(bookingId: string, currentNotes: string) {
    setCurrentBookingId(bookingId)
    setInternalNotes(currentNotes || '')
    setInternalNotesOpen(true)
  }

  const columns = [
    {
      key: 'checkbox',
      label: (
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={selectedIds.length === bookings.length && bookings.length > 0}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds(bookings.map(b => b.id))
            } else {
              setSelectedIds([])
            }
          }}
        />
      ),
      render: (_: any, row: any) => (
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={selectedIds.includes(row.id)}
          onChange={(e) => {
            e.stopPropagation()
            if (e.target.checked) {
              setSelectedIds([...selectedIds, row.id])
            } else {
              setSelectedIds(selectedIds.filter(id => id !== row.id))
            }
          }}
        />
      ),
    },
    {
      key: 'id',
      label: 'Booking ID',
      render: (value: string, row: any) => (
        <span className={`font-mono text-xs ${highlightedRowId === value ? 'bg-emerald-100 text-emerald-700 px-2 py-1 rounded' : ''}`}>
          #{value.slice(0, 8)}
        </span>
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
        <StatusBadge status={value} />
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
        <div className="flex gap-2">
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </div>
      </motion.div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <span className="text-sm font-medium text-blue-700">
            {selectedIds.length} booking(s) selected
          </span>
          <Button size="sm" variant="outline" onClick={() => setBulkStatusOpen(true)}>
            Update Status
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
            Cancel
          </Button>
        </motion.div>
      )}

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
        title="Detail Booking"
        description={`Order #${selectedBooking?.id?.slice(0, 8) || ''}`}
        size="lg"
      >
        {selectedBooking && (
          <div className="p-6">
            {/* Step Progress */}
            <BookingStepProgress status={selectedBooking.status} />

            {/* Status & Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-6 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-4">
                <StatusBadge status={selectedBooking.status} />
                <span className="text-sm text-gray-500">
                  Dibuat: {formatDateTime(selectedBooking.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <WhatsAppButton phone={selectedBooking.customerPhone} />
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column - Customer & Schedule */}
              <div className="space-y-6">
                {/* Customer Information */}
                <BookingDetailSection title="Informasi Customer" icon={User}>
                  <div className="space-y-1">
                    <BookingDetailRow label="Nama" value={selectedBooking.customerName} />
                    <BookingDetailRow label="Email" value={selectedBooking.customerEmail || '-'} />
                    <BookingDetailRow label="Telepon" value={selectedBooking.customerPhone || '-'} />
                    {selectedBooking.notes && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Catatan</p>
                        <p className="text-sm text-gray-700">{selectedBooking.notes}</p>
                      </div>
                    )}
                  </div>
                </BookingDetailSection>

                {/* Schedule Information */}
                <BookingDetailSection title="Jadwal Layanan" icon={Calendar}>
                  <div className="space-y-1">
                    <BookingDetailRow label="Tanggal" value={formatDate(selectedBooking.scheduledDate)} highlight />
                    <BookingDetailRow label="Jam" value={selectedBooking.scheduledTime} highlight />
                  </div>
                </BookingDetailSection>
              </div>

              {/* Right Column - Service & Location */}
              <div className="space-y-6">
                {/* Service Details */}
                <BookingDetailSection title="Detail Layanan" icon={FileText}>
                  <div className="space-y-1">
                    <BookingDetailRow label="Layanan" value={selectedBooking.serviceName} />
                    <BookingDetailRow label="Harga" value={formatCurrency(selectedBooking.servicePrice)} />
                    <BookingDetailRow label="Total" value={formatCurrency(selectedBooking.totalAmount)} highlight />
                  </div>
                </BookingDetailSection>

                {/* Location Details */}
                <BookingDetailSection title="Lokasi" icon={MapPin}>
                  <div className="space-y-1">
                    <BookingDetailRow label="Area" value={selectedBooking.area} />
                    <div className="pt-2">
                      <p className="text-xs text-gray-500 mb-1">Alamat Lengkap</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">{selectedBooking.address}</p>
                    </div>
                  </div>
                </BookingDetailSection>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-3">
                {selectedBooking.status === 'pending' && (
                  <>
                    <BookingActionButton variant="success" onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')} icon={Check} loading={actionLoading}>
                      Konfirmasi Booking
                    </BookingActionButton>
                    <BookingActionButton variant="danger" onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')} loading={actionLoading}>
                      Batalkan
                    </BookingActionButton>
                  </>
                )}
                {selectedBooking.status === 'confirmed' && (
                  <BookingActionButton variant="primary" onClick={() => handleStatusUpdate(selectedBooking.id, 'in_progress')} icon={Clock} loading={actionLoading}>
                    Mulai Pengerjaan
                  </BookingActionButton>
                )}
                {selectedBooking.status === 'in_progress' && (
                  <BookingActionButton variant="success" onClick={() => handleStatusUpdate(selectedBooking.id, 'completed')} icon={Check} loading={actionLoading}>
                    Tandai Selesai
                  </BookingActionButton>
                )}
                {selectedBooking.status === 'completed' && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <Check className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">Booking ini sudah selesai</span>
                  </div>
                )}
                {selectedBooking.status === 'cancelled' && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
                    <X className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-red-700">Booking ini sudah dibatalkan</span>
                  </div>
                )}
                <div className="flex-1" />
                <BookingActionButton variant="outline" onClick={() => openInternalNotes(selectedBooking.id, selectedBooking.internalNotes)}>
                  Internal Notes
                </BookingActionButton>
                <BookingActionButton variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Tutup
                </BookingActionButton>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Bulk Status Update Modal */}
      <Modal isOpen={bulkStatusOpen} onClose={() => setBulkStatusOpen(false)} title="Bulk Update Status">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Update {selectedIds.length} booking(s) ke status:
          </p>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setBulkStatusOpen(false)}>Cancel</Button>
            <Button onClick={handleBulkStatusUpdate} loading={actionLoading}>
              Update {selectedIds.length} Booking
            </Button>
          </div>
        </div>
      </Modal>

      {/* Internal Notes Modal */}
      <Modal isOpen={internalNotesOpen} onClose={() => setInternalNotesOpen(false)} title="Internal Notes">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Catatan internal hanya видим bagi admin. Tidak akan ditampilkan ke customer.
          </p>
          <textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder="Tambahkan catatan internal di sini..."
            className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none"
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setInternalNotesOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateInternalNotes} loading={actionLoading}>
              Simpan Notes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default function BookingsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500" /></div>}>
      <BookingsContent />
    </Suspense>
  )
}
