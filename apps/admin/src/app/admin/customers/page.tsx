'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Search, Mail, Phone, MapPin, Calendar, DollarSign, Eye, Star, Edit, Save, X, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/admin/Modal'
import { Pagination } from '@/components/admin/Pagination'
import { DataTable } from '@/components/admin/DataTable'
import { getCustomers, getCustomerBookings, updateCustomer } from '@/lib/api'
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils'
import { toast } from 'sonner'

interface CustomerAddress {
  label: string
  address: string
  city: string
  phone: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedCustomer, setSelectedCustomer] = React.useState<any>(null)
  const [customerBookings, setCustomerBookings] = React.useState<any[]>([])
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [pagination, setPagination] = React.useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [search, setSearch] = React.useState('')
  const [isEditing, setIsEditing] = React.useState(false)
  const [editNotes, setEditNotes] = React.useState('')
  const [editAddresses, setEditAddresses] = React.useState<CustomerAddress[]>([])
  const [saving, setSaving] = React.useState(false)

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
    setIsEditing(false)
    setEditNotes(customer.notes || '')
    setEditAddresses(customer.addresses || [])
    try {
      const bookings = await getCustomerBookings(customer.id)
      setCustomerBookings(bookings)
    } catch (error) {
      setCustomerBookings([])
    }
    setIsDetailOpen(true)
  }

  async function handleSaveCustomer() {
    setSaving(true)
    try {
      await updateCustomer(selectedCustomer.id, {
        notes: editNotes,
        addresses: editAddresses,
      })
      toast.success('Customer updated successfully')
      setIsEditing(false)
      fetchCustomers()
    } catch (error) {
      toast.error('Failed to update customer')
    } finally {
      setSaving(false)
    }
  }

  function addAddress() {
    setEditAddresses([...editAddresses, { label: '', address: '', city: '', phone: '' }])
  }

  function removeAddress(index: number) {
    setEditAddresses(editAddresses.filter((_, i) => i !== index))
  }

  function updateAddress(index: number, field: keyof CustomerAddress, value: string) {
    const updated = [...editAddresses]
    updated[index][field] = value
    setEditAddresses(updated)
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
            {value?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900">{value}</p>
            {row.isVip && (
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            )}
          </div>
          <div>
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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Topbar */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>NingClean Admin</span>
          <span>/</span>
          <span className="text-gray-700">Customers</span>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customers</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage and view customer information</p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <DataTable
              columns={columns}
              data={customers}
              loading={loading}
              onRowClick={openCustomerDetail}
            />
            <div className="border-t border-gray-100">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
              />
            </div>
          </div>
        </motion.div>
      </div>

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
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  {selectedCustomer.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                    {selectedCustomer.isVip && (
                      <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Customer since {formatDate(selectedCustomer.createdAt)}</p>
                </div>
              </div>
              <Button
                variant={isEditing ? "outline" : "default"}
                size="sm"
                onClick={() => isEditing ? handleSaveCustomer() : setIsEditing(true)}
                disabled={saving}
                className={isEditing ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save'}
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
            </div>

            {/* VIP Toggle */}
            {isEditing && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <input
                  type="checkbox"
                  id="isVip"
                  checked={selectedCustomer.isVip || false}
                  onChange={(e) => setSelectedCustomer({ ...selectedCustomer, isVip: e.target.checked })}
                  className="h-5 w-5 rounded border-amber-300"
                />
                <label htmlFor="isVip" className="flex items-center gap-2 font-medium text-amber-800">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  VIP Customer
                </label>
                <span className="text-sm text-amber-600">- Priority customer with special treatment</span>
              </div>
            )}

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
                    <p className="text-sm font-medium">{selectedCustomer.phone || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-500">Internal Notes</h3>
              {isEditing ? (
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add internal notes about this customer..."
                  className="w-full h-24 px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none"
                />
              ) : (
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">
                    {selectedCustomer.notes || 'No notes yet'}
                  </p>
                </div>
              )}
            </div>

            {/* Addresses Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500">Addresses</h3>
                {isEditing && (
                  <Button variant="outline" size="sm" onClick={addAddress}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>
              {isEditing ? (
                <div className="space-y-3">
                  {editAddresses.map((addr, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <Input
                          placeholder="Label (e.g., Home, Office)"
                          value={addr.label}
                          onChange={(e) => updateAddress(index, 'label', e.target.value)}
                          className="text-sm"
                        />
                        <Button variant="ghost" size="sm" onClick={() => removeAddress(index)} className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Address"
                        value={addr.address}
                        onChange={(e) => updateAddress(index, 'address', e.target.value)}
                        className="text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="City"
                          value={addr.city}
                          onChange={(e) => updateAddress(index, 'city', e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          placeholder="Phone"
                          value={addr.phone}
                          onChange={(e) => updateAddress(index, 'phone', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {(selectedCustomer.addresses || []).length > 0 ? (
                    selectedCustomer.addresses.map((addr: CustomerAddress, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">{addr.label || `Address ${index + 1}`}</p>
                          <p className="text-sm text-gray-600">{addr.address}</p>
                          <p className="text-sm text-gray-500">{addr.city} {addr.phone && `• ${addr.phone}`}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg bg-gray-50 p-4 text-center">
                      <p className="text-sm text-gray-500">No addresses saved</p>
                    </div>
                  )}
                </div>
              )}
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
                    <p className="text-2xl font-bold text-gray-900">{selectedCustomer.totalBookings || 0}</p>
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
                    <p className="text-2xl font-bold text-success">{formatCurrency(selectedCustomer.totalSpent || 0)}</p>
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
            <div className="flex justify-end gap-3 border-t pt-4">
              {isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
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