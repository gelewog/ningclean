'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Search, Mail, Phone, MapPin, Calendar, DollarSign, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/admin/Modal'
import { Pagination } from '@/components/admin/Pagination'
import { DataTable } from '@/components/admin/DataTable'
import { getCustomers, getCustomerBookings } from '@/lib/api'
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils'
import { toast } from 'sonner'

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedCustomer, setSelectedCustomer] = React.useState<any>(null)
  const [customerBookings, setCustomerBookings] = React.useState<any[]>([])
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [pagination, setPagination] = React.useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    fetchCustomers()
  }, [pagination.page, search])

  async function fetchCustomers() {
    setLoading(true)
    try {
      const response = await getCustomers({
        page: pagination.page,
        limit: pagination.limit,
        search: search || undefined,
      })
      setCustomers(response.data)
      setPagination((prev) => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages,
      }))
    } catch (error) {
      toast.error('Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }

  async function openCustomerDetail(customer: any) {
    setSelectedCustomer(customer)
    try {
      const bookings = await getCustomerBookings(customer.id)
      setCustomerBookings(bookings)
    } catch (error) {
      setCustomerBookings([])
    }
    setIsDetailOpen(true)
  }

  function handleSearch(value: string) {
    setSearch(value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
            {value.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value: string) => (
        <div className="flex items-center gap-1 text-sm">
          <Phone className="h-3.5 w-3.5 text-gray-400" />
          {value}
        </div>
      ),
    },
    {
      key: 'totalBookings',
      label: 'Bookings',
      render: (value: number) => (
        <Badge variant="info">{value} bookings</Badge>
      ),
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      render: (value: number) => (
        <span className="font-medium text-success">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Customer Since',
      render: (value: string) => (
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(value)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <Button variant="ghost" size="sm" onClick={() => openCustomerDetail(row)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  const bookingColumns = [
    {
      key: 'id',
      label: 'ID',
      render: (value: string) => <span className="font-mono text-xs">#{value.slice(0, 8)}</span>,
    },
    {
      key: 'serviceName',
      label: 'Service',
    },
    {
      key: 'scheduledDate',
      label: 'Date',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variant = value === 'completed' ? 'success' : value === 'pending' ? 'warning' : value === 'cancelled' ? 'error' : 'info'
        return <Badge variant={variant}>{getStatusLabel(value)}</Badge>
      },
    },
    {
      key: 'servicePrice',
      label: 'Price',
      render: (value: number) => (
        <span className="font-medium">{formatCurrency(value)}</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500">Manage and view customer information</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-4 md:flex-row"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Customers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={customers}
              loading={loading}
              onRowClick={openCustomerDetail}
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

      {/* Customer Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Customer Details"
        size="xl"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Customer Info Header */}
            <div className="flex items-center gap-4 border-b pb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                {selectedCustomer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                <p className="text-sm text-gray-500">Customer since {formatDate(selectedCustomer.createdAt)}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-500">Contact Information</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium">{selectedCustomer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium">{selectedCustomer.phone}</p>
                  </div>
                </div>
                {selectedCustomer.address && (
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 sm:col-span-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm font-medium">{selectedCustomer.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-primary/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedCustomer.totalBookings}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-success/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-success/10 p-3">
                    <DollarSign className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-2xl font-bold text-success">{formatCurrency(selectedCustomer.totalSpent)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order History */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-500">Order History</h3>
              {customerBookings.length > 0 ? (
                <div className="rounded-lg border">
                  <DataTable columns={bookingColumns} data={customerBookings} />
                </div>
              ) : (
                <div className="rounded-lg border bg-gray-50 p-8 text-center">
                  <p className="text-sm text-gray-500">No bookings found</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end border-t pt-4">
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
