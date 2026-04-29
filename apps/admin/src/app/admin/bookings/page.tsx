'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Download, Plus, Eye, X, Check, Clock,
  MapPin, User, FileText, Calendar, MessageCircle,
  Phone, ChevronLeft, ChevronRight, TrendingUp,
  MoreHorizontal, Loader2, Mail, Save, Filter,
  ClipboardList, Clock3, Ban, Sparkles
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
import { useBookings } from '@/lib/use-queries'
import { Breadcrumb } from '@/components/admin/Breadcrumb'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import { toast } from 'sonner'

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Dikonfirmasi' },
  { value: 'in_progress', label: 'Pengerjaan' },
      { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Dibatalkan' },
]

const AREA_OPTIONS = [
  { value: '', label: 'Semua Area' },
  { value: 'Surabaya', label: 'Surabaya' },
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
          <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{sub}</p>
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

  // ── TanStack Query for bookings list ───────────────────────────────────────
  
  const { data: bookingsData, isLoading: isBookingsLoading } = useBookings({
    page: pagination.page,
    limit: pagination.limit,
    status: statusFilter || undefined,
    area: areaFilter || undefined,
    search: search || undefined,
  })

  // Sync bookings data from TanStack Query
  React.useEffect(() => {
    if (bookingsData) {
      setBookings(bookingsData.data)
      setPagination(prev => ({ 
        ...prev, 
        total: bookingsData.total, 
        totalPages: bookingsData.totalPages 
      }))
      setLoading(false)
    }
  }, [bookingsData])

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
    }
  }, [highlightId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchServices() {
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/services`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setServices(await res.json())
    } catch (e) { console.error(e) }
  }

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
        // Trigger refetch via TanStack Query
        setLoading(true)
      } else { toast.error('Gagal membuat booking') }
    } catch { toast.error('Gagal membuat booking') }
    finally { setCreateLoading(false) }
  }

  async function handleStatusUpdate(bookingId: string, newStatus: string) {
    setActionLoading(true)
    try {
      await updateBookingStatus(bookingId, newStatus)
      toast.success('Status booking berhasil diupdate')
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
      label: 'ID Booking',
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
      label: 'Layanan',
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
      label: 'Jadwal',
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
        onClick={(e) => { e.stopPropagation(); setSelectedBooking(row); setIsDetailOpen(true) }}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
      >
        <Eye className="w-3.5 h-3.5" />
      </button>
    ),
  },
]

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Bookings' }]} />

      <div className="w-full px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-start justify-between gap-4"
        >
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">Bookings</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-0.5 truncate">Kelola semua booking dan pesanan layanan cleaning</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => { fetchServices(); setNewBookingOpen(true) }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-emerald-500 text-white border border-emerald-600 hover:bg-emerald-600 transition-all whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Baru</span>
            </button>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <StatCard 
            label="Total Booking" 
            value={pagination.total || 0} 
            sub="Semua waktu" 
            accent="bg-gradient-to-r from-blue-600 to-blue-400" 
            icon={<ClipboardList className="w-4 h-4 text-blue-500" />}
          />
          <StatCard 
            label="Selesai" 
            value={bookings.filter(b => b.status === 'completed').length} 
            sub="Halaman ini" 
            accent="bg-gradient-to-r from-emerald-600 to-emerald-400" 
            icon={<Check className="w-4 h-4 text-emerald-500" />}
          />
          <StatCard 
            label="Pending" 
            value={bookings.filter(b => b.status === 'pending').length} 
            sub="Perlu tindakan" 
            accent="bg-gradient-to-r from-amber-600 to-amber-400" 
            icon={<Clock3 className="w-4 h-4 text-amber-500" />}
          />
          <StatCard 
            label="Dibatalkan" 
            value={bookings.filter(b => b.status === 'cancelled').length} 
            sub="Halaman ini" 
            accent="bg-gradient-to-r from-red-700 to-red-500" 
            icon={<Ban className="w-4 h-4 text-red-500" />}
          />
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
                  {selectedIds.length} booking dipilih
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
                  Clear
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari booking..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && setLoading(true)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all"
              />
            </div>
            <div className="flex gap-2 md:flex-none">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="flex-1 md:flex-none bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-700 dark:text-slate-200 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all py-2.5 px-3 cursor-pointer"
              >
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <select
                value={areaFilter}
                onChange={e => setAreaFilter(e.target.value)}
                className="flex-1 md:flex-none bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-700 dark:text-slate-200 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all py-2.5 px-3 cursor-pointer"
              >
                {AREA_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="sm:bg-white sm:dark:bg-slate-900 sm:shadow-sm sm:border sm:border-gray-200 dark:sm:border-slate-700 sm:rounded-2xl overflow-hidden">
          <DataTable
            columns={columns}
            data={bookings}
            loading={loading || isBookingsLoading}
            onRowClick={(row) => { setSelectedBooking(row); setIsDetailOpen(true) }}
          renderCard={(row) => (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-3 cursor-pointer active:scale-[0.99] border border-gray-100 dark:border-slate-700/50">
              <div className="space-y-2">
                {/* Header - ID & Status */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700/50 pb-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 bg-transparent accent-blue-500 cursor-pointer"
                      checked={selectedIds.includes(row.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        setSelectedIds(prev =>
                          e.target.checked ? [...prev, row.id] : prev.filter(id => id !== row.id)
                        )
                      }}
                    />
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700 truncate max-w-[80px]">
                      #{row.id.slice(0, 8)}
                    </span>
                  </div>
                  <StatusPill status={row.status} />
                </div>

                {/* Customer & Service */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{row.customerName}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{row.customerEmail}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedBooking(row); setIsDetailOpen(true) }}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-700/50 transition-all flex-shrink-0"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-gray-50 dark:border-slate-700/50 gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide">Layanan</p>
                      <p className="text-xs font-medium text-gray-700 dark:text-slate-200 truncate">{row.serviceName}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide">Harga</p>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(row.servicePrice)}</p>
                    </div>
                  </div>
                </div>

                {/* Schedule & Area */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-50 dark:border-slate-700/50">
                  <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-slate-400 truncate">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{formatDate(row.scheduledDate)} {row.scheduledTime}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-slate-400 flex-shrink-0">
                    <MapPin className="w-3 h-3" />
                    {row.area}
                  </span>
                </div>
              </div>
            </div>
          )}
          skeletonCard={(i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl p-3 animate-pulse shadow-sm"
            >
              <div className="space-y-2">
                {/* Header - Checkbox + ID + Status */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700/50 pb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="skeleton h-4 w-4 rounded flex-shrink-0 dark:bg-slate-700" />
                    <div className="skeleton h-4 w-16 rounded dark:bg-slate-700" />
                  </div>
                  <div className="skeleton h-5 w-14 rounded-full dark:bg-slate-700" />
                </div>

                {/* Customer Name + View Button */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0 space-y-1 pt-0.5">
                    <div className="skeleton h-4 w-28 rounded dark:bg-slate-700" />
                    <div className="skeleton h-3 w-full max-w-[180px] rounded dark:bg-slate-700" />
                  </div>
                  <div className="skeleton h-8 w-8 rounded-lg flex-shrink-0 dark:bg-slate-700" />
                </div>

                {/* Service + Price */}
                <div className="flex items-center justify-between pt-1.5 border-t border-gray-50 dark:border-slate-700/50 gap-2">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="skeleton h-2.5 w-10 rounded dark:bg-slate-700" />
                    <div className="skeleton h-3.5 w-24 rounded dark:bg-slate-700" />
                  </div>
                  <div className="text-right space-y-1">
                    <div className="skeleton h-2.5 w-8 rounded dark:bg-slate-700 ml-auto" />
                    <div className="skeleton h-3.5 w-16 rounded dark:bg-slate-700" />
                  </div>
                </div>

                {/* Schedule + Area */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-50 dark:border-slate-700/50">
                  <div className="skeleton h-3 w-28 rounded dark:bg-slate-700" />
                  <div className="skeleton h-3 w-16 rounded dark:bg-slate-700" />
                </div>
              </div>
            </div>
          )}
          emptyState={
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400 dark:text-slate-500" />
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-400">Tidak ada booking ditemukan</p>
            </div>
          }
        />
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="sm:border-t sm:border-gray-200 dark:sm:border-slate-700 sm:pt-4">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={page => setPagination(p => ({ ...p, page }))}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
            />
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Booking Details"
        size="xl"
        footer={selectedBooking && (
          <div className="flex flex-row justify-between items-center w-full">
            <button
              onClick={() => { setCurrentBookingId(selectedBooking.id); setInternalNotes(selectedBooking.internalNotes || ''); setInternalNotesOpen(true) }}
              className="px-3 sm:px-4 py-2 sm:py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span className="sm:hidden">Notes</span>
              <span className="hidden sm:inline">Internal Notes</span>
            </button>
            <div className="flex flex-row items-center gap-2 sm:gap-3">
              {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                <button
                  onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
                  disabled={actionLoading}
                  className="px-3 sm:px-4 py-2 sm:py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
              {selectedBooking.status === 'pending' && (
                <button
                  onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')}
                  disabled={actionLoading}
                  className="px-3 sm:px-4 py-2 sm:py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span className="sm:hidden">Confirm</span>
                  <span className="hidden sm:inline">Konfirmasi</span>
                </button>
              )}
              {selectedBooking.status === 'confirmed' && (
                <button
                  onClick={() => handleStatusUpdate(selectedBooking.id, 'in_progress')}
                  disabled={actionLoading}
                  className="px-3 sm:px-4 py-2 sm:py-2 rounded-lg text-sm font-medium bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Clock className="w-4 h-4" />
                  <span className="sm:hidden">Proses</span>
                  <span className="hidden sm:inline">Pengerjaan</span>
                </button>
              )}
              {selectedBooking.status === 'in_progress' && (
                <button
                  onClick={() => handleStatusUpdate(selectedBooking.id, 'completed')}
                  disabled={actionLoading}
                  className="px-3 sm:px-4 py-2 sm:py-2 rounded-lg text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span className="sm:hidden">Complete</span>
                  <span className="hidden sm:inline">Selesai</span>
                </button>
              )}
            </div>
          </div>
        )}
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Status Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-gray-500 dark:text-slate-400">#{selectedBooking.id?.slice(0, 8)}</span>
                <StatusPill status={selectedBooking.status} />
              </div>
            </div>

            {/* Booking Step Progress */}
            <BookingStepProgress status={selectedBooking.status} />

            {/* Customer Info */}
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4" />
                Informasi Customer
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Nama</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedBooking.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Telepon</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    {selectedBooking.customerPhone}
                    {selectedBooking.customerPhone && (
                      <a
                        href={`https://wa.me/${selectedBooking.customerPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-500 hover:text-emerald-600"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Email</p>
                  <p className="text-sm text-gray-700 dark:text-slate-300">{selectedBooking.customerEmail || '—'}</p>
                </div>
              </div>
            </div>

            {/* Service Info */}
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Detail Layanan
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Layanan</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedBooking.serviceName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Harga</p>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(selectedBooking.servicePrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Area</p>
                  <p className="text-sm text-gray-700 dark:text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedBooking.area}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Jadwal</p>
                  <p className="text-sm text-gray-700 dark:text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(selectedBooking.scheduledDate)} jam {selectedBooking.scheduledTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Alamat
              </h3>
              <p className="text-sm text-gray-700 dark:text-slate-300">{selectedBooking.address}</p>
            </div>

            {/* Notes */}
            {selectedBooking.notes && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-2">Catatan</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">{selectedBooking.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* New Booking Modal */}
      <Modal
        isOpen={newBookingOpen}
        onClose={() => setNewBookingOpen(false)}
        title="Buat Booking Baru"
        size="xl"
        footer={
          <div className="flex flex-row justify-end gap-2 sm:gap-3 w-full">
            <button
              onClick={() => setNewBookingOpen(false)}
              className="px-4 sm:px-5 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-slate-700 sm:border-0"
            >
              Batal
            </button>
            <button
              onClick={handleCreateBooking}
              disabled={createLoading}
              className="px-4 sm:px-5 py-2 rounded-xl text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {createLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Buat Booking
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Section: Customer Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-sm">Informasi Customer</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 pl-0 sm:pl-10">
              <DarkInput
                placeholder="Nama Customer *"
                icon={<User className="w-4 h-4" />}
                value={newBookingData.customerName}
                onChange={e => setNewBookingData(d => ({ ...d, customerName: e.target.value }))}
              />
              <DarkInput
                placeholder="Nomor Telepon *"
                icon={<Phone className="w-4 h-4" />}
                value={newBookingData.customerPhone}
                onChange={e => setNewBookingData(d => ({ ...d, customerPhone: e.target.value }))}
              />
              <DarkInput
                placeholder="Email"
                icon={<Mail className="w-4 h-4" />}
                value={newBookingData.customerEmail}
                onChange={e => setNewBookingData(d => ({ ...d, customerEmail: e.target.value }))}
              />
            </div>
          </div>

          {/* Section: Service Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-sm">Detail Layanan</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 pl-0 sm:pl-10">
              <DarkSelect
                options={[{ value: '', label: 'Pilih Layanan *' }, ...services.map((s: any) => ({ value: s.id, label: s.name }))]}
                value={newBookingData.serviceId}
                onChange={e => {
                  const service = services.find((s: any) => s.id === e.target.value)
                  setNewBookingData(d => ({ ...d, serviceId: e.target.value, serviceName: service?.name || '' }))
                }}
              />
              <DarkSelect
                options={AREA_OPTIONS}
                value={newBookingData.area}
                onChange={e => setNewBookingData(d => ({ ...d, area: e.target.value }))}
              />
            </div>
          </div>

          {/* Section: Schedule & Location */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-semibold text-sm">Jadwal & Lokasi</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 pl-0 sm:pl-10">
              <DarkInput
                type="date"
                placeholder="Tanggal Service *"
                icon={<Calendar className="w-4 h-4" />}
                value={newBookingData.serviceDate}
                onChange={e => setNewBookingData(d => ({ ...d, serviceDate: e.target.value }))}
              />
              <DarkInput
                type="time"
                placeholder="Waktu Service *"
                icon={<Clock className="w-4 h-4" />}
                value={newBookingData.serviceTime}
                onChange={e => setNewBookingData(d => ({ ...d, serviceTime: e.target.value }))}
              />
              <div className="sm:col-span-2">
                <DarkInput
                  placeholder="Alamat Lengkap *"
                  icon={<MapPin className="w-4 h-4" />}
                  value={newBookingData.address}
                  onChange={e => setNewBookingData(d => ({ ...d, address: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Section: Notes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-sm">Catatan Tambahan</h3>
              <span className="text-xs text-gray-400 dark:text-slate-500">(Opsional)</span>
            </div>
            <div className="pl-0 sm:pl-10">
              <textarea
                placeholder="Tambahkan catatan khusus untuk booking ini..."
                className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all py-3 px-4 min-h-[100px] resize-none"
                value={newBookingData.notes}
                onChange={e => setNewBookingData(d => ({ ...d, notes: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Bulk Status Modal */}
      <Modal
        isOpen={bulkStatusOpen}
        onClose={() => setBulkStatusOpen(false)}
        title="Update Status Booking Terpilih"
        footer={
          <div className="flex flex-row justify-center sm:justify-end gap-2 sm:gap-3 w-full">
            <button
              onClick={() => setBulkStatusOpen(false)}
              className="px-3 sm:px-4 py-2 sm:py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-slate-700 sm:border-0"
            >
              Batal
            </button>
            <button
              onClick={handleBulkStatusUpdate}
              disabled={actionLoading}
              className="px-3 sm:px-4 py-2 sm:py-2 rounded-xl text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Update
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Update status untuk {selectedIds.length} booking yang dipilih
          </p>
          <DarkSelect
            options={STATUS_OPTIONS.filter(o => o.value !== '')}
            value={bulkStatus}
            onChange={e => setBulkStatus(e.target.value)}
          />
        </div>
      </Modal>

      {/* Internal Notes Modal */}
      <Modal
        isOpen={internalNotesOpen}
        onClose={() => setInternalNotesOpen(false)}
        title="Catatan Internal"
        footer={
          <div className="flex flex-row justify-end gap-2 sm:gap-3 w-full">
            <button
              onClick={() => setInternalNotesOpen(false)}
              className="px-4 sm:px-5 py-2 sm:py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-slate-700 sm:border-0"
            >
              Tutup
            </button>
            <button
              onClick={handleUpdateInternalNotes}
              disabled={actionLoading}
              className="px-4 sm:px-5 py-2 sm:py-2 rounded-xl text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 flex items-center gap-1.5"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Tambahkan catatan internal untuk booking ini (tidak terlihat oleh customer)
          </p>
          <textarea
            className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all py-2.5 px-4 min-h-[120px] resize-none"
            value={internalNotes}
            onChange={e => setInternalNotes(e.target.value)}
            placeholder="Masukkan catatan internal..."
          />
        </div>
      </Modal>
    </div>
  )
}

// ─── Page Export ───────────────────────────────────────────────────────────────

export default function BookingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>}>
      <BookingsContent />
    </Suspense>
  )
}