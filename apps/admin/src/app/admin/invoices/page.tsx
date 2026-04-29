'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { FileText, Search, Calendar, Download, Eye, Plus, CheckCircle, DollarSign, RotateCcw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/admin/Modal'
import { Pagination } from '@/components/admin/Pagination'
import { getBookingInvoice, InvoiceData, createInvoice, updateInvoiceStatus } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { DataTable } from '@/components/admin/DataTable'
import { Breadcrumb } from '@/components/admin/Breadcrumb'
import { toast } from 'sonner'
import { useBookings } from '@/lib/use-queries'
import { useQueryClient } from '@tanstack/react-query'

// Booking Status (lowercase keys to match API)
const BOOKING_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
  confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
  in_progress: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400',
  completed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
  cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
  unknown: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',
}

const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Dikonfirmasi',
  in_progress: 'Sedang Dikerjakan',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
  unknown: 'Unknown',
}

// Invoice Status
const INVOICE_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
  issued: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
  paid: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
  cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800',
  none: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
}

const INVOICE_STATUS_LABELS: Record<string, string> = {
  draft: 'Draf',
  issued: 'Terbit',
  paid: 'Lunas',
  cancelled: 'Dibatalkan',
  none: 'Belum Dibuat',
}

export default function InvoicesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [limit] = React.useState(20)
  const [statusFilter, setStatusFilter] = React.useState('')
  const [invoiceStatusFilter, setInvoiceStatusFilter] = React.useState('')
  const [selectedBooking, setSelectedBooking] = React.useState<any>(null)
  const [invoiceData, setInvoiceData] = React.useState<InvoiceData | null>(null)
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [loadingInvoice, setLoadingInvoice] = React.useState(false)
  const [generatingInvoice, setGeneratingInvoice] = React.useState<string | null>(null)

  // Use TanStack Query for bookings
  const { data: bookingsData, isLoading: loading, error } = useBookings({
    page,
    limit,
    status: statusFilter || undefined,
  })

  const bookings = bookingsData?.data || []
  const totalPages = bookingsData?.totalPages || 0
  const total = bookingsData?.total || 0

  // Handle error
  React.useEffect(() => {
    if (error) {
      toast.error('Gagal memuat bookings')
    }
  }, [error])

  // Helper to get invoice status from booking
  const getInvoiceStatus = (booking: any): string => {
    if (!booking.invoice) return 'none'
    return booking.invoice.status?.toLowerCase() || 'draft'
  }

  // Generate invoice for booking
  async function handleGenerateInvoice(booking: any) {
    setGeneratingInvoice(booking.id)
    try {
      const invoice = await createInvoice(booking.id, {
        templateId: undefined,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
      })
      
      toast.success('Invoice berhasil dibuat')
      // Invalidate bookings cache
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    } catch (error) {
      toast.error('Gagal membuat invoice')
    } finally {
      setGeneratingInvoice(null)
    }
  }

  // Update invoice status
  async function handleUpdateInvoiceStatus(bookingId: string, newStatus: string) {
    try {
      await updateInvoiceStatus(bookingId, newStatus)
      toast.success(`Status invoice diupdate ke ${newStatus}`)
      // Invalidate bookings cache
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    } catch (error) {
      toast.error('Gagal update status')
    }
  }

  async function handlePreview(booking: any) {
    setLoadingInvoice(true)
    setSelectedBooking(booking)
    try {
      const data = await getBookingInvoice(booking.id)
      if (data) {
        setInvoiceData(data)
        setPreviewOpen(true)
      } else {
        toast.error('Gagal mengambil data invoice')
      }
    } catch (error) {
      toast.error('Gagal mengambil data invoice')
    } finally {
      setLoadingInvoice(false)
    }
  }

  function handlePrint() {
    window.print()
  }

  // Filter bookings by search and invoice status
  const filteredBookings = React.useMemo(() => {
    let filtered = bookings.filter(booking =>
      booking.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      booking.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      booking.address?.toLowerCase().includes(search.toLowerCase())
    )
    
    // Apply invoice status filter
    if (invoiceStatusFilter) {
      filtered = filtered.filter(booking => {
        const invStatus = getInvoiceStatus(booking)
        return invStatus === invoiceStatusFilter
      })
    }
    
    return filtered
  }, [bookings, search, invoiceStatusFilter])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Invoices' }]} />

      <div className="w-full px-3 sm:px-6 py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Invoice</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-0.5">Buat dan lihat invoice untuk pesanan</p>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-3 sm:p-4"
        >
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500 z-10 pointer-events-none" />
              <Input
                placeholder="Cari order number, nama, alamat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 relative z-1"
              />
            </div>
            <div className="flex gap-2 flex-1 sm:flex-none">
              <select
                className="h-10 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm text-gray-700 dark:text-slate-200 flex-1 sm:flex-none"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              >
                <option value="">Semua Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Dikonfirmasi</option>
                <option value="IN_PROGRESS">Sedang Dikerjakan</option>
                <option value="COMPLETED">Selesai</option>
                <option value="CANCELLED">Dibatalkan</option>
              </select>
              
              <select
                className="h-10 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm text-gray-700 dark:text-slate-200 flex-1 sm:flex-none"
                value={invoiceStatusFilter}
                onChange={(e) => { setInvoiceStatusFilter(e.target.value); setPage(1); }}
              >
                <option value="">Semua Invoice</option>
                <option value="DRAFT">Draf</option>
                <option value="ISSUED">Terbit</option>
                <option value="PAID">Lunas</option>
                <option value="CANCELLED">Dibatalkan</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Bookings List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="sm:bg-white sm:dark:bg-slate-900 sm:shadow-sm sm:border sm:border-gray-200 dark:sm:border-slate-700 sm:rounded-2xl overflow-hidden">
            <DataTable
              columns={[
                { key: 'orderNumber', label: 'Order' },
                { key: 'customerName', label: 'Pelanggan' },
                { key: 'totalAmount', label: 'Total' },
                { key: 'status', label: 'Status' },
              ]}
              data={filteredBookings}
              loading={loading}
              renderCard={(row: any) => {
                const invStatus = getInvoiceStatus(row)
                const hasInvoice = invStatus !== 'none'
                return (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 p-4 active:scale-[0.99]">
                    {/* Header - Order & Invoice Status */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{row.orderNumber}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">{row.customerName || 'Guest'}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${INVOICE_STATUS_COLORS[invStatus]}`}>
                        {INVOICE_STATUS_LABELS[invStatus]}
                      </span>
                    </div>

                    {/* Booking Status & Date */}
                    <div className="py-3 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-gray-50 dark:bg-slate-800 p-2.5">
                        <p className="text-xs text-gray-400 dark:text-slate-500 mb-0.5">Status Booking</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full inline-block ${BOOKING_STATUS_COLORS[(row.status || 'unknown').toLowerCase()]}`}>
                          {BOOKING_STATUS_LABELS[(row.status || 'unknown').toLowerCase()]}
                        </span>
                      </div>
                      <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-2.5">
                        <p className="text-xs text-gray-400 dark:text-slate-500 mb-0.5">Jadwal</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-blue-500" />
                          {row.scheduledDate ? formatDate(row.scheduledDate) : '-'}
                        </p>
                      </div>
                    </div>

                    {/* Total & Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700/50">
                      <div>
                        <p className="text-xs text-gray-400 dark:text-slate-500">Total</p>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          Rp {Number(row.totalAmount || 0).toLocaleString('id-ID')}
                        </p>
                      </div>
                      {hasInvoice ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreview(row)}
                          disabled={loadingInvoice}
                          className="gap-1.5"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">Preview</span>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleGenerateInvoice(row)}
                          disabled={generatingInvoice === row.id}
                          className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                        >
                          {generatingInvoice === row.id ? (
                            <span className="animate-spin">⏳</span>
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                          Buat
                        </Button>
                      )}
                    </div>
                  </div>
                )
              }}
              skeletonCard={(i: number) => (
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 animate-pulse shadow-sm">
                  {/* Header Skeleton */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-slate-700 flex-shrink-0" />
                      <div className="space-y-2">
                        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-slate-700" />
                        <div className="h-3 w-16 rounded bg-gray-100 dark:bg-slate-700" />
                      </div>
                    </div>
                    <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-slate-700" />
                  </div>
                  {/* Stats Skeleton */}
                  <div className="py-3 grid grid-cols-2 gap-3">
                    <div className="h-14 rounded-xl bg-gray-200 dark:bg-slate-700" />
                    <div className="h-14 rounded-xl bg-blue-100 dark:bg-slate-700" />
                  </div>
                  {/* Footer Skeleton */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                    <div className="space-y-1">
                      <div className="h-3 w-10 rounded bg-gray-100 dark:bg-slate-700" />
                      <div className="h-5 w-24 rounded bg-emerald-100 dark:bg-slate-700" />
                    </div>
                    <div className="h-8 w-20 rounded-lg bg-gray-200 dark:bg-slate-700" />
                  </div>
                </div>
              )}
              emptyState={
                <div className="text-center py-20">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-slate-400">Tidak ada pesanan</p>
                </div>
              }
            />
            {totalPages > 1 && (
              <div className="border-t border-gray-100 dark:border-slate-700">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Invoice Preview Modal */}
      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Invoice Preview"
        size="xl"
      >
        {invoiceData && (
          <div className="space-y-6">
            {/* Invoice Content - Printable */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-gray-200 dark:border-slate-700 relative overflow-hidden" id="invoice-print">
              {/* Watermark based on invoice status (Bahasa Indonesia) */}
              {selectedBooking?.invoice?.status && (
                <div 
                  className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 ${
                    selectedBooking.invoice.status === 'PAID' ? 'text-emerald-400/20' :
                    selectedBooking.invoice.status === 'CANCELLED' ? 'text-red-400/20' :
                    selectedBooking.invoice.status === 'DRAFT' ? 'text-gray-400/15' :
                    'text-blue-400/20'
                  }`}
                  style={{ transform: 'rotate(-45deg)' }}
                >
                  <span className="text-8xl font-black tracking-widest uppercase">
                    {selectedBooking.invoice.status === 'PAID' ? 'LUNAS' :
                     selectedBooking.invoice.status === 'CANCELLED' ? 'DIBATALKAN' :
                     selectedBooking.invoice.status === 'DRAFT' ? 'DRAF' :
                     selectedBooking.invoice.status === 'ISSUED' ? 'TERBIT' :
                     selectedBooking.invoice.status}
                  </span>
                </div>
              )}
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{invoiceData.template.headerText}</h1>
                  <p className="text-gray-500 dark:text-slate-400 mt-1">#{invoiceData.invoice.number}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{invoiceData.template.companyName}</h2>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">{invoiceData.template.companyAddress}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">{invoiceData.template.companyPhone}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">{invoiceData.template.companyEmail}</p>
                </div>
              </div>

              {/* Invoice Info */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mb-1">Tanggal Invoice</p>
                  <p className="font-medium">{invoiceData.invoice.date}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mb-1">Pelanggan</p>
                  <p className="font-medium">{invoiceData.invoice.customerName}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">{invoiceData.invoice.customerEmail}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">{invoiceData.invoice.customerPhone}</p>
                </div>
              </div>

              {/* Service Details */}
              <div className="mb-4">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mb-1">Tanggal Layanan</p>
                <p className="font-medium">{invoiceData.booking.serviceDateFormatted}</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Alamat: {invoiceData.booking.address}</p>
              </div>

              {/* Items Table */}
              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-slate-700">
                    <th className="text-left py-3 text-sm font-semibold text-gray-600 dark:text-slate-300">Deskripsi</th>
                    <th className="text-center py-3 text-sm font-semibold text-gray-600 dark:text-slate-300">Jumlah</th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-600 dark:text-slate-300">Harga</th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-600 dark:text-slate-300">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-slate-700">
                      <td className="py-3">
                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">{item.description}</p>
                      </td>
                      <td className="py-3 text-center text-gray-900 dark:text-white">{item.quantity}</td>
                      <td className="py-3 text-right text-gray-900 dark:text-white">Rp {item.price.toLocaleString('id-ID')}</td>
                      <td className="py-3 text-right text-gray-900 dark:text-white">Rp {item.total.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary */}
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500 dark:text-slate-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">Rp {invoiceData.summary.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  {invoiceData.summary.taxRate > 0 && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500 dark:text-slate-400">Tax ({invoiceData.summary.taxRate}%)</span>
                      <span className="font-medium text-gray-900 dark:text-white">Rp {invoiceData.summary.taxAmount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 border-t-2 border-gray-200 dark:border-slate-700 mt-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Rp {invoiceData.summary.total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoiceData.template.notes && (
                <div className="mt-8 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Catatan:</p>
                  <p className="text-sm text-gray-900 dark:text-white">{invoiceData.template.notes}</p>
                </div>
              )}

              {/* Footer */}
              {invoiceData.template.footerText && (
                <div className="mt-8 text-center text-sm text-gray-500 dark:text-slate-400">
                  {invoiceData.template.footerText}
                </div>
              )}
            </div>

            {/* Invoice Status Actions */}
            {selectedBooking?.invoice && (
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100 dark:border-slate-700">
                <span className="text-sm text-gray-500 dark:text-slate-400 mr-2">Status Invoice:</span>
                {selectedBooking.invoice.status !== 'ISSUED' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleUpdateInvoiceStatus(selectedBooking.id, 'ISSUED')}
                    className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Tandai Terbitkan
                  </Button>
                )}
                {selectedBooking.invoice.status !== 'PAID' && (
                  <Button 
                    size="sm"
                    onClick={() => handleUpdateInvoiceStatus(selectedBooking.id, 'PAID')}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <DollarSign className="h-4 w-4" />
                    Tandai Lunas
                  </Button>
                )}
                {selectedBooking.invoice.status !== 'CANCELLED' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleUpdateInvoiceStatus(selectedBooking.id, 'CANCELLED')}
                    className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Batalkan
                  </Button>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                Tutup
              </Button>
              <Button onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                <Download className="h-4 w-4" />
                Cetak / Unduh
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
