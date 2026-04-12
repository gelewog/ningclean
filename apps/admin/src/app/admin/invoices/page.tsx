'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { FileText, Search, Calendar, Download, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/admin/Modal'
import { Pagination } from '@/components/admin/Pagination'
import { getBookings, getBookingInvoice, InvoiceData } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Dikonfirmasi',
  IN_PROGRESS: 'Sedang Dikerjakan',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
}

export default function InvoicesPage() {
  const [bookings, setBookings] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [pagination, setPagination] = React.useState({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [statusFilter, setStatusFilter] = React.useState('')
  const [selectedBooking, setSelectedBooking] = React.useState<any>(null)
  const [invoiceData, setInvoiceData] = React.useState<InvoiceData | null>(null)
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [loadingInvoice, setLoadingInvoice] = React.useState(false)

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

  const filteredBookings = bookings.filter(booking =>
    booking.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    booking.guestName?.toLowerCase().includes(search.toLowerCase()) ||
    booking.address?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Topbar */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>NingClean Admin</span>
          <span>/</span>
          <span className="text-gray-700">Invoices</span>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Invoice</h1>
            <p className="text-sm text-gray-500 mt-0.5">Generate dan preview invoice untuk bookings</p>
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari order number, nama, alamat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
          >
            <option value="">Semua Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Dikonfirmasi</option>
            <option value="IN_PROGRESS">Sedang Dikerjakan</option>
            <option value="COMPLETED">Selesai</option>
            <option value="CANCELLED">Dibatalkan</option>
          </select>
        </motion.div>

        {/* Bookings List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada bookings</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{booking.orderNumber}</h3>
                        <Badge className={STATUS_COLORS[booking.status]}>
                          {STATUS_LABELS[booking.status]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{booking.guestName || 'Guest'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(booking.serviceDate)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        Rp {Number(booking.totalAmount).toLocaleString('id-ID')}
                      </p>
                    </div>
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
                  </div>
                ))}
              </div>
            )}
            {pagination.totalPages > 1 && (
              <div className="border-t border-gray-100">
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
            <div className="bg-white p-8 rounded-xl border" id="invoice-print">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{invoiceData.template.headerText}</h1>
                  <p className="text-gray-500 mt-1">#{invoiceData.invoice.number}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-emerald-600">{invoiceData.template.companyName}</h2>
                  <p className="text-sm text-gray-500">{invoiceData.template.companyAddress}</p>
                  <p className="text-sm text-gray-500">{invoiceData.template.companyPhone}</p>
                  <p className="text-sm text-gray-500">{invoiceData.template.companyEmail}</p>
                </div>
              </div>

              {/* Invoice Info */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tanggal Invoice</p>
                  <p className="font-medium">{invoiceData.invoice.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bill To</p>
                  <p className="font-medium">{invoiceData.invoice.customerName}</p>
                  <p className="text-sm text-gray-500">{invoiceData.invoice.customerEmail}</p>
                  <p className="text-sm text-gray-500">{invoiceData.invoice.customerPhone}</p>
                </div>
              </div>

              {/* Service Details */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Service Date</p>
                <p className="font-medium">{invoiceData.booking.serviceDateFormatted}</p>
                <p className="text-sm text-gray-500">Address: {invoiceData.booking.address}</p>
              </div>

              {/* Items Table */}
              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 text-sm font-semibold text-gray-600">Description</th>
                    <th className="text-center py-3 text-sm font-semibold text-gray-600">Qty</th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-600">Price</th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right">Rp {item.price.toLocaleString('id-ID')}</td>
                      <td className="py-3 text-right">Rp {item.total.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary */}
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">Rp {invoiceData.summary.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  {invoiceData.summary.taxRate > 0 && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">Tax ({invoiceData.summary.taxRate}%)</span>
                      <span className="font-medium">Rp {invoiceData.summary.taxAmount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 border-t-2 border-gray-200 mt-2">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold text-emerald-600">Rp {invoiceData.summary.total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoiceData.template.notes && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Notes:</p>
                  <p className="text-sm">{invoiceData.template.notes}</p>
                </div>
              )}

              {/* Footer */}
              {invoiceData.template.footerText && (
                <div className="mt-8 text-center text-sm text-gray-400">
                  {invoiceData.template.footerText}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
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