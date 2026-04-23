'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { FileText, Search, Calendar, Download, Eye, Plus, CheckCircle, Clock, DollarSign, RotateCcw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/admin/Modal'
import { Pagination } from '@/components/admin/Pagination'
import { getBookings, getBookingInvoice, InvoiceData, createInvoice, updateInvoiceStatus } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { Breadcrumb } from '@/components/admin/Breadcrumb'
import { toast } from 'sonner'

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
  const [bookings, setBookings] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [pagination, setPagination] = React.useState({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [statusFilter, setStatusFilter] = React.useState('')
  const [invoiceStatusFilter, setInvoiceStatusFilter] = React.useState('')
  const [selectedBooking, setSelectedBooking] = React.useState<any>(null)
  const [invoiceData, setInvoiceData] = React.useState<InvoiceData | null>(null)
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [loadingInvoice, setLoadingInvoice] = React.useState(false)
  const [generatingInvoice, setGeneratingInvoice] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetchBookings()
  }, [pagination.page, statusFilter])

  async function fetchBookings() {
    setLoading(true)
    try {
      const response = await getBookings({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter || undefined,
      })
      // Use actual booking data from API (may include invoice if API returns it)
      setBookings(response.data)
      setPagination((prev) => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages,
      }))
    } catch (error) {
      toast.error('Gagal memuat bookings')
    } finally {
      setLoading(false)
    }
  }

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
      // Update local state
      setBookings(prev => prev.map(b => 
        b.id === booking.id ? { ...b, invoice } : b
      ))
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
      fetchBookings()
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
      booking.guestName?.toLowerCase().includes(search.toLowerCase()) ||
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Invoices' }]} />

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Invoice</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Generate dan preview invoice untuk bookings</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
            <Input
              placeholder="Cari order number, nama, alamat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            className="h-10 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
          >
            <option value="">Semua Status Booking</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Dikonfirmasi</option>
            <option value="IN_PROGRESS">Sedang Dikerjakan</option>
            <option value="COMPLETED">Selesai</option>
            <option value="CANCELLED">Dibatalkan</option>
          </select>
          <select
            className="h-10 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm"
            value={invoiceStatusFilter}
            onChange={(e) => { setInvoiceStatusFilter(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
          >
            <option value="">Semua Status Invoice</option>
            <option value="none">Belum Dibuat</option>
            <option value="draft">Draf</option>
            <option value="issued">Terbit</option>
            <option value="paid">Lunas</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </motion.div>

        {/* Bookings List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm dark:shadow-slate-900/50">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 dark:border-slate-700 border-t-emerald-500" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-slate-400">Tidak ada bookings</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-700">
                {filteredBookings.map((booking) => {
                  const invStatus = getInvoiceStatus(booking)
                  const hasInvoice = invStatus !== 'none'
                  
                  return (
                    <div
                      key={booking.id}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">{booking.orderNumber}</h3>
                          <Badge className={BOOKING_STATUS_COLORS[(booking.status || 'unknown').toLowerCase()]}>
                            {BOOKING_STATUS_LABELS[(booking.status || 'unknown').toLowerCase()]}
                          </Badge>
                          {/* Invoice Status Badge */}
                          <Badge className={INVOICE_STATUS_COLORS[invStatus]}>
                            {INVOICE_STATUS_LABELS[invStatus]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-slate-400">
                          <span>{booking.guestName || 'Guest'}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {booking.serviceDate ? formatDate(booking.serviceDate) : '-'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          Rp {Number(booking.totalAmount || 0).toLocaleString('id-ID')}
                        </p>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {hasInvoice ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(booking)}
                            disabled={loadingInvoice}
                            className="gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            Preview
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleGenerateInvoice(booking)}
                            disabled={generatingInvoice === booking.id}
                            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                          >
                            {generatingInvoice === booking.id ? (
                              <span className="animate-spin">⏳</span>
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                            Buat Invoice
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            {pagination.totalPages > 1 && (
              <div className="border-t border-gray-100 dark:border-slate-700">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
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
                  <p className="text-sm text-gray-500 dark:text-slate-400">{invoiceData.template.companyAddress}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{invoiceData.template.companyPhone}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{invoiceData.template.companyEmail}</p>
                </div>
              </div>

              {/* Invoice Info */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Tanggal Invoice</p>
                  <p className="font-medium">{invoiceData.invoice.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Bill To</p>
                  <p className="font-medium">{invoiceData.invoice.customerName}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{invoiceData.invoice.customerEmail}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{invoiceData.invoice.customerPhone}</p>
                </div>
              </div>

              {/* Service Details */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Service Date</p>
                <p className="font-medium">{invoiceData.booking.serviceDateFormatted}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">Address: {invoiceData.booking.address}</p>
              </div>

              {/* Items Table */}
              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-slate-700">
                    <th className="text-left py-3 text-sm font-semibold text-gray-600 dark:text-slate-300">Description</th>
                    <th className="text-center py-3 text-sm font-semibold text-gray-600 dark:text-slate-300">Qty</th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-600 dark:text-slate-300">Price</th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-600 dark:text-slate-300">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-slate-700">
                      <td className="py-3">
                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{item.description}</p>
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
                  <p className="text-sm text-gray-500 dark:text-slate-400">Notes:</p>
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
                Print / Download
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}