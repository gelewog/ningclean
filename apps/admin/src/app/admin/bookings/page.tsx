'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Download, Plus, Eye, X, Check, Clock,
  MapPin, User, FileText, Calendar, MessageCircle,
  Phone, ChevronLeft, ChevronRight, TrendingUp,
  MoreHorizontal, Loader2, Mail
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/admin/Pagination'
import { DataTable } from '@/components/admin/DataTable'
import {
  Modal, WhatsAppButton, StatusBadge, BookingStepProgress
} from '@/components/admin/Modal'
import {
  getBookings, getToken, updateBookingStatus
} from '@/lib/api'
import { Breadcrumb } from '@/components/admin/Breadcrumb'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import { toast } from 'sonner'

// ─── Constants ────────────────────────────────────────────────────────────────

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
  { value: 'Surabaya Selatan', label: 'Surabaya Selatan' },
  { value: 'Surabaya Utara', label: 'Surabaya Utara' },
  { value: 'Surabaya Timur', label: 'Surabaya Timur' },
  { value: 'Surabaya Barat', label: 'Surabaya Barat' },
  { value: 'Sidoarjo', label: 'Sidoarjo' },
  { value: 'Gresik', label: 'Gresik' },
]

const STATUS_STYLES: Record<string, { dot: string; pill: string; label: string }> = {
  pending:     { dot: 'bg-amber-500',   pill: 'bg-amber-500/10 text-amber-400 border-amber-500/20',   label: 'Pending' },
  confirmed:   { dot: 'bg-blue-400',    pill: 'bg-blue-500/10 text-blue-400 border-blue-500/20',       label: 'Confirmed' },
  in_progress: { dot: 'bg-violet-400',  pill: 'bg-violet-500/10 text-violet-400 border-violet-500/20', label: 'In Progress' },
  completed:   { dot: 'bg-emerald-400', pill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Completed' },
  cancelled:   { dot: 'bg-red-500',     pill: 'bg-red-500/10 text-red-400 border-red-500/20',          label: 'Cancelled' },
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export const dynamic = 'force-dynamic'

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

function StatCard({
  label, value, sub, accent
}: { label: string; value: string | number; sub: string; accent: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 overflow-hidden shadow-sm dark:shadow-slate-900/50"
    >
      <div className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl ${accent}`} />
      <p className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">{label}</p>
      <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-400 mt-1.5">{sub}</p>
    </motion.div>
  )
}

function DarkInput({
  className = '', icon, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }) {
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none">
          {icon}
        </span>
      )}
      <input
        className={`w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all py-2.5 ${icon ? 'pl-9 pr-4' : 'px-4'}`}
        {...props}
      />
    </div>
  )
}

function DarkSelect({
  options, className = '', ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  return (
    <select
      className={`bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-700 dark:text-slate-200 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all py-2.5 px-3 cursor-pointer ${className}`}
      {...props}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

// ─── Main Content ──────────────────────────────────────────────────────────────

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

  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [bulkStatusOpen, setBulkStatusOpen] = React.useState(false)
  const [bulkStatus, setBulkStatus] = React.useState('completed')

  const [internalNotesOpen, setInternalNotesOpen] = React.useState(false)
  const [internalNotes, setInternalNotes] = React.useState('')
  const [currentBookingId, setCurrentBookingId] = React.useState('')

  const [newBookingOpen, setNewBookingOpen] = React.useState(false)
  const [newBookingData, setNewBookingData] = React.useState({
    customerName: '', customerPhone: '', customerEmail: '',
    serviceId: '', serviceName: '', area: '',
    address: '', serviceDate: '', serviceTime: '', notes: '',
  })
  const [services, setServices] = React.useState<any[]>([])
  const [createLoading, setCreateLoading] = React.useState(false)

  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('')
  const [areaFilter, setAreaFilter] = React.useState('')

  // ── fetch helpers ──────────────────────────────────────────────────────────

  const fetchBookingById = React.useCallback(async (id: string) => {
    const token = getToken()
    if (!token) return null
    try {
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      if (res.ok) return res.json()
    } catch (e) { console.error(e) }
    return null
  }, [])

  React.useEffect(() => {
    if (highlightId) {
      fetchBookings()
      fetchBookingById(highlightId).then(booking => {
        if (!booking) return
        const firstItem = booking.items?.[0]
        const transformed = {
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
        setSelectedBooking(transformed)
        setIsDetailOpen(true)
        setHighlightedRowId(highlightId)
        setTimeout(() => setHighlightedRowId(null), 5000)
      })
    } else {
      fetchBookings()
    }
  }, [highlightId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchBookings() {
    setLoading(true)
    try {
      const res = await getBookings({
        page: pagination.page, limit: pagination.limit,
        status: statusFilter || undefined,
        area: areaFilter || undefined,
        search: search || undefined,
      })
      setBookings(res.data)
      setPagination(p => ({ ...p, total: res.total, totalPages: res.totalPages }))
    } catch { toast.error('Failed to fetch bookings') }
    finally { setLoading(false) }
  }

  async function fetchServices() {
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/services`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setServices(await res.json())
    } catch (e) { console.error(e) }
  }

  React.useEffect(() => { fetchBookings() }, [pagination.page, statusFilter, areaFilter]) // eslint-disable-line

  // ── actions ────────────────────────────────────────────────────────────────

  async function handleCreateBooking() {
    const { customerName, serviceId, area, address, serviceDate, serviceTime } = newBookingData
    if (!customerName || !serviceId || !area || !address || !serviceDate || !serviceTime) {
      toast.error('Mohon lengkapi semua field yang wajib diisi')
      return
    }
    setCreateLoading(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: newBookingData.customerName,
          customerPhone: newBookingData.customerPhone,
          customerEmail: newBookingData.customerEmail,
          serviceDate: newBookingData.serviceDate,
          serviceTime: newBookingData.serviceTime,
          address: newBookingData.address,
          area: newBookingData.area,
          notes: newBookingData.notes,
          items: [
            {
              serviceId: newBookingData.serviceId,
              quantity: 1,
            },
          ],
        }),
      })
      if (res.ok) {
        toast.success('Booking berhasil dibuat')
        setNewBookingOpen(false)
        setNewBookingData({
          customerName: '', customerPhone: '', customerEmail: '',
          serviceId: '', serviceName: '', area: '',
          address: '', serviceDate: '', serviceTime: '', notes: '',
        })
        fetchBookings()
      } else { toast.error('Gagal membuat booking') }
    } catch { toast.error('Gagal membuat booking') }
    finally { setCreateLoading(false) }
  }

  async function handleStatusUpdate(bookingId: string, newStatus: string) {
    setActionLoading(true)
    try {
      await updateBookingStatus(bookingId, newStatus)
      toast.success('Status booking berhasil diupdate')
      fetchBookings()
      setIsDetailOpen(false)
    } catch { toast.error('Gagal update status booking') }
    finally { setActionLoading(false) }
  }

  function handleExport() {
    const csv = [
      ['ID', 'Customer', 'Service', 'Area', 'Date', 'Time', 'Status', 'Price'].join(','),
      ...bookings.map(b =>
        [b.id, b.customerName, b.serviceName, b.area, b.scheduledDate, b.scheduledTime, b.status, b.servicePrice].join(',')
      ),
    ].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: `bookings-${new Date().toISOString().split('T')[0]}.csv` })
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Bookings exported')
  }

  async function handleBulkStatusUpdate() {
    if (!selectedIds.length) { toast.error('Pilih booking yang akan diupdate'); return }
    setActionLoading(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/admin/bookings/bulk-status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, status: bulkStatus }),
      })
      if (res.ok) {
        toast.success(`${selectedIds.length} booking berhasil diupdate ke ${bulkStatus}`)
        setSelectedIds([])
        setBulkStatusOpen(false)
        fetchBookings()
      } else { toast.error('Gagal bulk update') }
    } catch { toast.error('Gagal bulk update') }
    finally { setActionLoading(false) }
  }

  async function handleUpdateInternalNotes() {
    if (!currentBookingId) return
    setActionLoading(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/admin/bookings/${currentBookingId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ internalNotes }),
      })
      if (res.ok) {
        toast.success('Internal notes berhasil disimpan')
        setInternalNotesOpen(false)
        fetchBookings()
      } else { toast.error('Gagal menyimpan notes') }
    } catch { toast.error('Gagal menyimpan notes') }
    finally { setActionLoading(false) }
  }

  // ── table columns ──────────────────────────────────────────────────────────

  const allSelected = selectedIds.length === bookings.length && bookings.length > 0

  const columns = [
    {
      key: 'checkbox',
      label: (
        <input
          type="checkbox"
          className="w-3.5 h-3.5 rounded border-gray-300 bg-transparent accent-blue-500 cursor-pointer"
          checked={allSelected}
          onChange={e => setSelectedIds(e.target.checked ? bookings.map(b => b.id) : [])}
        />
      ),
      render: (_: any, row: any) => (
        <input
          type="checkbox"
          className="w-3.5 h-3.5 rounded border-gray-300 bg-transparent accent-blue-500 cursor-pointer"
          checked={selectedIds.includes(row.id)}
          onChange={e => {
            e.stopPropagation()
            setSelectedIds(prev =>
              e.target.checked ? [...prev, row.id] : prev.filter(id => id !== row.id)
            )
          }}
        />
      ),
    },
    {
      key: 'id',
      label: 'Booking ID',
      render: (value: string) => (
        <span className={`font-mono text-[11px] px-2 py-1 rounded-md border ${highlightedRowId === value ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700'}`}>
          #{value.slice(0, 8)}
        </span>
      ),
    },
    {
      key: 'customerName',
      label: 'Customer',
      render: (value: string, row: any) => (
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
          <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">{row.customerEmail}</p>
        </div>
      ),
    },
    {
      key: 'serviceName',
      label: 'Service',
      render: (value: string, row: any) => (
        <div>
          <p className="text-sm text-gray-700 dark:text-slate-200">{value}</p>
          <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">{formatCurrency(row.servicePrice)}</p>
        </div>
      ),
    },
    {
      key: 'area',
      label: 'Area',
      render: (value: string) => <span className="text-xs text-gray-500 dark:text-slate-400">{value}</span>,
    },
    {
      key: 'scheduledDate',
      label: 'Schedule',
      render: (value: string, row: any) => (
        <div>
          <p className="text-sm text-gray-700 dark:text-slate-200">{formatDate(value)}</p>
          <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">{row.scheduledTime}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => <StatusPill status={value} />,
    },
    {
      key: 'actions',
      label: '',
      render: (_: any, row: any) => (
        <button
          onClick={() => { setSelectedBooking(row); setIsDetailOpen(true) }}
          className="w-7 h-7 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ]

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Bookings' }]} />

      <div className="w-full px-4 md:px-6 py-6 space-y-6">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Bookings</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Manage all cleaning service bookings &amp; orders</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button
              onClick={() => { fetchServices(); setNewBookingOpen(true) }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500 text-white border border-emerald-600 hover:bg-emerald-600 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              New Booking
            </button>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Total Bookings" value={pagination.total || 0} sub="All time" accent="bg-gradient-to-r from-blue-600 to-blue-400" />
          <StatCard label="Completed" value={bookings.filter(b => b.status === 'completed').length} sub="This page" accent="bg-gradient-to-r from-emerald-600 to-emerald-400" />
          <StatCard label="Pending" value={bookings.filter(b => b.status === 'pending').length} sub="Needs action" accent="bg-gradient-to-r from-amber-600 to-amber-400" />
          <StatCard label="Cancelled" value={bookings.filter(b => b.status === 'cancelled').length} sub="This page" accent="bg-gradient-to-r from-red-700 to-red-500" />
        </div>

        {/* Bulk Bar */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <span className="text-sm font-medium text-blue-700">
                  {selectedIds.length} booking(s) dipilih
                </span>
                <button
                  onClick={() => setBulkStatusOpen(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500 text-white border border-blue-600 hover:bg-blue-600 transition-all"
                >
                  Update Status
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <DarkInput
            icon={<Search className="w-3.5 h-3.5" />}
            placeholder="Search customer, service, ID..."
            className="flex-1"
            value={search}
            onChange={e => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
          />
          <DarkSelect
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
            className="sm:w-40"
          />
          <DarkSelect
            options={AREA_OPTIONS}
            value={areaFilter}
            onChange={e => { setAreaFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
            className="sm:w-44"
          />
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm dark:shadow-slate-900/50">
            <DataTable
              columns={columns}
              data={bookings}
              loading={loading}
              onRowClick={row => { setSelectedBooking(row); setIsDetailOpen(true) }}
            />
            <div className="border-t border-gray-100">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={page => setPagination(p => ({ ...p, page }))}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Detail Modal ──────────────────────────────────────────────────────── */}
      {isDetailOpen && selectedBooking && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsDetailOpen(false)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="pointer-events-auto w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/20 dark:to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Booking Details</h2>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Order #{selectedBooking.id?.slice(0, 8) ?? ''}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-600 dark:hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Step Progress */}
                <BookingStepProgress status={selectedBooking.status} />

                {/* Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl">
                  <div className="flex items-center gap-3">
                    <StatusPill status={selectedBooking.status} />
                    <span className="text-xs text-gray-500 dark:text-slate-400">
                      {formatDateTime(selectedBooking.createdAt)}
                    </span>
                  </div>
                  <WhatsAppButton phone={selectedBooking.customerPhone} />
                </div>

                {/* Customer Profile Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <span className="text-2xl font-bold text-white">
                        {selectedBooking.customerName?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedBooking.customerName}</h3>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                        Booked on {formatDateTime(selectedBooking.createdAt)}
                      </p>

                      {/* Quick Stats */}
                      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4">
                        {/* Service Info */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400" suppressHydrationWarning>
                              {selectedBooking.servicePrice >= 1000000 ? '1M+' : selectedBooking.servicePrice >= 1000 ? `${Math.round(selectedBooking.servicePrice / 1000)}K` : selectedBooking.servicePrice}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400">Service</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[140px]">{selectedBooking.serviceName}</p>
                          </div>
                        </div>

                        {/* Schedule Info */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400">Schedule</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white" suppressHydrationWarning>{formatDate(selectedBooking.scheduledDate)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Email</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{selectedBooking.customerEmail || '—'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Phone</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedBooking.customerPhone || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service & Schedule Info */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Service Details</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500 dark:text-slate-400">Service</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedBooking.serviceName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500 dark:text-slate-400">Price</span>
                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(selectedBooking.servicePrice)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-slate-700">
                        <span className="text-xs text-gray-500 dark:text-slate-400">Total</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(selectedBooking.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Schedule</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500 dark:text-slate-400">Date</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(selectedBooking.scheduledDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500 dark:text-slate-400">Time</span>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{selectedBooking.scheduledTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Location</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="info" className="text-xs">{selectedBooking.area}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                      {selectedBooking.address}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {selectedBooking.notes && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Customer Notes</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                        {selectedBooking.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                  {selectedBooking.status === 'pending' && (
                    <>
                      <ActionBtn variant="success" onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')} loading={actionLoading}>
                        <Check className="w-3.5 h-3.5" /> Konfirmasi
                      </ActionBtn>
                      <ActionBtn variant="danger" onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')} loading={actionLoading}>
                        Batalkan
                      </ActionBtn>
                    </>
                  )}
                  {selectedBooking.status === 'confirmed' && (
                    <ActionBtn variant="primary" onClick={() => handleStatusUpdate(selectedBooking.id, 'in_progress')} loading={actionLoading}>
                      <Clock className="w-3.5 h-3.5" /> Mulai Pengerjaan
                    </ActionBtn>
                  )}
                  {selectedBooking.status === 'in_progress' && (
                    <ActionBtn variant="success" onClick={() => handleStatusUpdate(selectedBooking.id, 'completed')} loading={actionLoading}>
                      <Check className="w-3.5 h-3.5" /> Tandai Selesai
                    </ActionBtn>
                  )}
                  {selectedBooking.status === 'completed' && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Booking sudah selesai</span>
                    </div>
                  )}
                  {selectedBooking.status === 'cancelled' && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                      <X className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                      <span className="text-xs font-medium text-red-700 dark:text-red-400">Booking sudah dibatalkan</span>
                    </div>
                  )}
                  <div className="flex-1" />
                  <ActionBtn variant="outline" onClick={() => {
                    setCurrentBookingId(selectedBooking.id)
                    setInternalNotes(selectedBooking.internalNotes || '')
                    setInternalNotesOpen(true)
                  }}>
                    Notes
                  </ActionBtn>
                  <ActionBtn variant="outline" onClick={() => setIsDetailOpen(false)}>
                    Close
                  </ActionBtn>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}

      {/* ── Bulk Status Modal ──────────────────────────────────────────────── */}
      <DarkModal
        isOpen={bulkStatusOpen}
        onClose={() => setBulkStatusOpen(false)}
        title="Bulk Update Status"
        subtitle={`Update ${selectedIds.length} booking(s)`}
        accent="blue"
      >
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">Update {selectedIds.length} booking(s) ke status:</p>
        <select
          value={bulkStatus}
          onChange={e => setBulkStatus(e.target.value)}
          className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-slate-200 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500"
        >
          {STATUS_OPTIONS.filter(o => o.value).map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div className="flex justify-end gap-2 pt-5 mt-5 border-t border-gray-100 dark:border-slate-700">
          <ActionBtn variant="outline" onClick={() => setBulkStatusOpen(false)}>Batal</ActionBtn>
          <ActionBtn variant="primary" onClick={handleBulkStatusUpdate} loading={actionLoading}>
            Update {selectedIds.length} Booking
          </ActionBtn>
        </div>
      </DarkModal>

      {/* ── Internal Notes Modal ───────────────────────────────────────────── */}
      <DarkModal
        isOpen={internalNotesOpen}
        onClose={() => setInternalNotesOpen(false)}
        title="Internal Notes"
        subtitle="Catatan hanya visible untuk admin"
        accent="amber"
      >
        <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">Tidak akan ditampilkan ke customer.</p>
        <textarea
          value={internalNotes}
          onChange={e => setInternalNotes(e.target.value)}
          placeholder="Tambahkan catatan internal..."
          rows={5}
          className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 resize-none focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 dark:focus:ring-1 dark:focus:ring-amber-400/30"
        />
        <div className="flex justify-end gap-2 pt-4">
          <ActionBtn variant="outline" onClick={() => setInternalNotesOpen(false)}>Batal</ActionBtn>
          <ActionBtn variant="amber" onClick={handleUpdateInternalNotes} loading={actionLoading}>
            Simpan Notes
          </ActionBtn>
        </div>
      </DarkModal>

      {/* ── New Booking Modal ──────────────────────────────────────────────── */}
      <DarkModal
        isOpen={newBookingOpen}
        onClose={() => setNewBookingOpen(false)}
        title="New Booking"
        subtitle="Buat booking layanan baru"
        accent="emerald"
        wide
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Nama Customer *">
            <DarkInput value={newBookingData.customerName} onChange={e => setNewBookingData(p => ({ ...p, customerName: e.target.value }))} placeholder="Nama lengkap" />
          </FormField>
          <FormField label="Telepon *">
            <DarkInput value={newBookingData.customerPhone} onChange={e => setNewBookingData(p => ({ ...p, customerPhone: e.target.value }))} placeholder="08xxxxxxxxxx" />
          </FormField>
          <FormField label="Email">
            <DarkInput type="email" value={newBookingData.customerEmail} onChange={e => setNewBookingData(p => ({ ...p, customerEmail: e.target.value }))} placeholder="email@example.com" />
          </FormField>
          <FormField label="Layanan *">
            <select
              value={newBookingData.serviceId}
              onChange={e => {
                const svc = services.find(s => s.id === e.target.value)
                setNewBookingData(p => ({ ...p, serviceId: e.target.value, serviceName: svc?.name ?? '' }))
              }}
              className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 dark:focus:border-emerald-500 dark:focus:ring-1 dark:focus:ring-emerald-400/30"
            >
              <option value="">Pilih Layanan</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} – {formatCurrency(s.price)}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Area *">
            <DarkSelect
              options={AREA_OPTIONS}
              value={newBookingData.area}
              onChange={e => setNewBookingData(p => ({ ...p, area: e.target.value }))}
              className="w-full"
            />
          </FormField>
          <FormField label="Tanggal *">
            <DarkInput type="date" value={newBookingData.serviceDate} onChange={e => setNewBookingData(p => ({ ...p, serviceDate: e.target.value }))} />
          </FormField>
          <FormField label="Jam *">
            <DarkInput type="time" value={newBookingData.serviceTime} onChange={e => setNewBookingData(p => ({ ...p, serviceTime: e.target.value }))} />
          </FormField>
        </div>
        <FormField label="Alamat Lengkap *" className="mt-3">
          <textarea
            value={newBookingData.address}
            onChange={e => setNewBookingData(p => ({ ...p, address: e.target.value }))}
            placeholder="Jl. Contoh No. 1, Kel. Nama, Kec. Nama"
            rows={3}
            className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 resize-none focus:outline-none focus:border-emerald-400 dark:focus:border-emerald-500 dark:focus:ring-1 dark:focus:ring-emerald-400/30"
          />
        </FormField>
        <FormField label="Catatan" className="mt-3">
          <textarea
            value={newBookingData.notes}
            onChange={e => setNewBookingData(p => ({ ...p, notes: e.target.value }))}
            placeholder="Catatan tambahan..."
            rows={2}
            className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 resize-none focus:outline-none focus:border-emerald-400 dark:focus:border-emerald-500 dark:focus:ring-1 dark:focus:ring-emerald-400/30"
          />
        </FormField>
        <div className="flex justify-end gap-2 pt-4 mt-2 border-t border-gray-100 dark:border-slate-700">
          <ActionBtn variant="outline" onClick={() => setNewBookingOpen(false)}>Batal</ActionBtn>
          <ActionBtn variant="emerald" onClick={handleCreateBooking} loading={createLoading}>
            Buat Booking
          </ActionBtn>
        </div>
      </DarkModal>
    </div>
  )
}

// ─── Primitive helpers ─────────────────────────────────────────────────────────

function DetailCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-4">
      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">
        {icon} {title}
      </div>
      {children}
    </div>
  )
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[11px] text-gray-500 dark:text-slate-400">{label}</span>
      <span className={`text-xs font-medium ${highlight ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-slate-200'}`}>{value}</span>
    </div>
  )
}

const ACTION_STYLES: Record<string, string> = {
  success: 'bg-emerald-500 text-white border border-emerald-600 hover:bg-emerald-600 dark:bg-emerald-600 dark:border-emerald-700 dark:hover:bg-emerald-500',
  danger:  'bg-red-500 text-white border border-red-600 hover:bg-red-600 dark:bg-red-600 dark:border-red-700 dark:hover:bg-red-500',
  primary: 'bg-blue-500 text-white border border-blue-600 hover:bg-blue-600 dark:bg-blue-600 dark:border-blue-700 dark:hover:bg-blue-500',
  amber:   'bg-amber-500 text-white border border-amber-600 hover:bg-amber-600 dark:bg-amber-600 dark:border-amber-700 dark:hover:bg-amber-500',
  emerald: 'bg-emerald-500 text-white border border-emerald-600 hover:bg-emerald-600 dark:bg-emerald-600 dark:border-emerald-700 dark:hover:bg-emerald-500',
  outline: 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700',
}

function ActionBtn({
  variant = 'outline', children, onClick, loading, className = ''
}: {
  variant?: string; children: React.ReactNode; onClick?: () => void; loading?: boolean; className?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all disabled:opacity-50 ${ACTION_STYLES[variant] ?? ACTION_STYLES.outline} ${className}`}
    >
      {loading && <Loader2 className="w-3 h-3 animate-spin" />}
      {children}
    </button>
  )
}

function FormField({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const ACCENT_BORDER: Record<string, string> = {
  blue: 'from-blue-600 to-blue-400',
  amber: 'from-amber-600 to-amber-400',
  emerald: 'from-emerald-600 to-emerald-400',
}

function DarkModal({
  isOpen, onClose, title, subtitle, accent = 'blue', wide = false, children
}: {
  isOpen: boolean; onClose: () => void; title: string; subtitle?: string;
  accent?: string; wide?: boolean; children: React.ReactNode
}) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        onClick={e => e.stopPropagation()}
        className={`relative bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xl ${wide ? 'w-full max-w-2xl' : 'w-full max-w-md'}`}
      >
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${ACCENT_BORDER[accent] ?? ACCENT_BORDER.blue}`} />
        <div className="flex items-start justify-between p-5 pb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">{title}</h2>
            {subtitle && <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        <div className="px-5 pb-5">{children}</div>
      </motion.div>
    </div>
  )
}

// ─── Export ────────────────────────────────────────────────────────────────────

export default function BookingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-emerald-500 animate-spin" />
          <p className="text-xs text-gray-500">Loading bookings...</p>
        </div>
      </div>
    }>
      <BookingsContent />
    </Suspense>
  )
}