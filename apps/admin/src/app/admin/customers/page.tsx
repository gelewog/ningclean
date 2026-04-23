'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Mail, Phone, MapPin, Calendar, DollarSign, Eye, Star, Edit, Save, X, Plus, Trash2,
  User, Clock, Package, FileText, MoreHorizontal, ChevronRight, Building2, Hash, UserCheck, Users, ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/admin/Pagination'
import { DataTable } from '@/components/admin/DataTable'
import { getCustomers, getCustomerBookings, updateCustomer } from '@/lib/api'
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils'
import { toast } from 'sonner'
import { Breadcrumb } from '@/components/admin/Breadcrumb'

interface CustomerAddress {
  label: string
  address: string
  city: string
  phone: string
}

// Modern Modal Component for Customer Detail
function CustomerDetailModal({
  isOpen,
  onClose,
  customer,
  bookings,
  isEditing,
  setIsEditing,
  editNotes,
  setEditNotes,
  editAddresses,
  setEditAddresses,
  saving,
  onSave,
  onUpdateCustomer
}: {
  isOpen: boolean
  onClose: () => void
  customer: any
  bookings: any[]
  isEditing: boolean
  setIsEditing: (v: boolean) => void
  editNotes: string
  setEditNotes: (v: string) => void
  editAddresses: CustomerAddress[]
  setEditAddresses: (v: CustomerAddress[]) => void
  saving: boolean
  onSave: () => void
  onUpdateCustomer: (c: any) => void
}) {
  const router = useRouter()
  const modalRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

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

  if (!isOpen || !customer) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="pointer-events-auto w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-900/20 dark:to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Customer Details</h2>
                <p className="text-xs text-gray-500 dark:text-slate-400">View and manage customer information</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={onSave}
                  disabled={saving}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-lg"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Customer Profile Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <span className="text-3xl font-bold text-white">
                      {customer.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{customer.name}</h3>
                      {customer.isVip && (
                        <Badge variant="warning" className="gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          VIP
                        </Badge>
                      )}
                      <Badge variant={customer.userId ? 'info' : 'outline'} className="gap-1">
                        {customer.userId ? (
                          <>
                            <UserCheck className="w-3 h-3" />
                            Registered
                          </>
                        ) : (
                          <>
                            <Users className="w-3 h-3" />
                            Guest
                          </>
                        )}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      Customer since {formatDate(customer.createdAt)}
                    </p>
                    
                    {/* Quick Stats */}
                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-slate-400">Bookings</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{customer.totalBookings || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-slate-400">Total Spent</p>
                          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(customer.totalSpent || 0)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* VIP Toggle - Edit Mode */}
              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50"
                >
                  <input
                    type="checkbox"
                    id="isVip"
                    checked={customer.isVip || false}
                    onChange={(e) => onUpdateCustomer({ ...customer, isVip: e.target.checked })}
                    className="w-5 h-5 rounded border-amber-300 text-amber-500 focus:ring-amber-500"
                  />
                  <label htmlFor="isVip" className="flex items-center gap-2 font-medium text-amber-800 dark:text-amber-300">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    VIP Customer
                  </label>
                  <span className="text-sm text-amber-600 dark:text-amber-400">— Priority customer with special treatment</span>
                </motion.div>
              )}

              {/* Contact Information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Email</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{customer.email}</p>
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
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{customer.phone || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Internal Notes</span>
                  </div>
                </div>
                <div className="p-4">
                  {isEditing ? (
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Add internal notes about this customer..."
                      className="w-full h-24 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 text-sm text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      {customer.notes || 'No notes added yet.'}
                    </p>
                  )}
                </div>
              </div>

              {/* Addresses Section */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Saved Addresses</span>
                  </div>
                  {isEditing && (
                    <Button variant="ghost" size="sm" onClick={addAddress} className="gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                      <Plus className="w-4 h-4" />
                      Add Address
                    </Button>
                  )}
                </div>
                <div className="p-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      {editAddresses.map((addr, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-600 space-y-3"
                        >
                          <div className="flex justify-between items-center gap-2">
                            <Input
                              placeholder="Label (e.g., Home, Office)"
                              value={addr.label}
                              onChange={(e) => updateAddress(index, 'label', e.target.value)}
                              className="text-sm flex-1"
                            />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeAddress(index)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Input
                            placeholder="Full address"
                            value={addr.address}
                            onChange={(e) => updateAddress(index, 'address', e.target.value)}
                            className="text-sm"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              placeholder="City"
                              value={addr.city}
                              onChange={(e) => updateAddress(index, 'city', e.target.value)}
                              className="text-sm"
                            />
                            <Input
                              placeholder="Contact phone"
                              value={addr.phone}
                              onChange={(e) => updateAddress(index, 'phone', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        </motion.div>
                      ))}
                      {editAddresses.length === 0 && (
                        <div className="text-center py-8">
                          <MapPin className="w-10 h-10 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
                          <p className="text-sm text-gray-500 dark:text-slate-400">No addresses saved yet.</p>
                          <Button variant="outline" size="sm" onClick={addAddress} className="mt-3">
                            <Plus className="w-4 h-4 mr-1" />
                            Add First Address
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(customer.addresses || []).length > 0 ? (
                        customer.addresses.map((addr: CustomerAddress, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{addr.label || `Address ${index + 1}`}</span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">{addr.address}</p>
                              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">{addr.city} {addr.phone && `• ${addr.phone}`}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <MapPin className="w-10 h-10 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
                          <p className="text-sm text-gray-500 dark:text-slate-400">No addresses saved yet.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Order History */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Order History</span>
                    <Badge variant="info" className="ml-auto">{bookings.length} orders</Badge>
                  </div>
                </div>
                <div className="p-4">
                  {bookings.length > 0 ? (
                    <div className="space-y-3">
                      {bookings.map((booking) => (
                        <div
                          key={booking.id}
                          onClick={() => router.push(`/admin/bookings?highlight=${booking.id}`)}
                          className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                            <Hash className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-mono text-gray-500 dark:text-slate-400">#{booking.id.slice(0, 8)}</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{booking.serviceName}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">{formatDate(booking.scheduledDate)} • {booking.scheduledTime}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <Badge
                                variant={booking.status === 'completed' ? 'success' : booking.status === 'pending' ? 'warning' : booking.status === 'cancelled' ? 'error' : 'info'}
                                className="text-xs"
                              >
                                {getStatusLabel(booking.status)}
                              </Badge>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{formatCurrency(booking.totalAmount)}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-10 h-10 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 dark:text-slate-400">No orders found for this customer.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
            {isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default function CustomersPage() {
  const router = useRouter()
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
    // Validate customer has required fields
    if (!customer || !customer.id) {
      toast.error('Invalid customer data')
      return
    }

    let addresses = customer.addresses || []
    if (typeof addresses === 'string') {
      try {
        addresses = JSON.parse(addresses)
      } catch {
        addresses = []
      }
    }
    if (!Array.isArray(addresses)) {
      addresses = []
    }

    setSelectedCustomer({ ...customer, addresses })
    setIsEditing(false)
    setEditNotes(customer.notes || '')
    setEditAddresses(addresses)

    // Reset bookings before fetching
    setCustomerBookings([])

    try {
      const bookings = await getCustomerBookings(customer.id)
      // Ensure we always set an array
      setCustomerBookings(Array.isArray(bookings) ? bookings : [])
    } catch (error) {
      console.error('Failed to fetch customer bookings:', error)
      toast.error('Failed to load order history')
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-500/20">
            {value?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
              {row.isVip && (
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-sm">
          <div className="w-6 h-6 rounded bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
            <Phone className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-gray-700 dark:text-slate-300">{value || '—'}</span>
        </div>
      ),
    },
    {
      key: 'totalBookings',
      label: 'Bookings',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{value}</span>
        </div>
      ),
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      render: (value: number) => (
        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
          <Clock className="h-3.5 w-3.5" />
          {formatDate(value)}
        </div>
      ),
    },
    {
      key: 'source',
      label: 'Source',
      render: (_: any, row: any) => {
        const isRegistered = !!row.userId
        return (
          <Badge variant={isRegistered ? 'info' : 'outline'} className="gap-1">
            {isRegistered ? (
              <>
                <UserCheck className="w-3 h-3" />
                Registered
              </>
            ) : (
              <>
                <Users className="w-3 h-3" />
                Guest
              </>
            )}
          </Badge>
        )
      },
    },
    {
      key: 'actions',
      label: '',
      render: (_: any, row: any) => (
        <Button variant="ghost" size="sm" onClick={() => openCustomerDetail(row)} className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Customers' }]} />

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Customers</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage and view customer information</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <span className="text-sm text-gray-500 dark:text-slate-400">Total: </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{pagination.total}</span>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
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
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
            <DataTable
              columns={columns}
              data={customers}
              loading={loading}
              onRowClick={openCustomerDetail}
            />
            <div className="border-t border-gray-100 dark:border-slate-700">
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
      <CustomerDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setIsEditing(false)
        }}
        customer={selectedCustomer}
        bookings={customerBookings}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editNotes={editNotes}
        setEditNotes={setEditNotes}
        editAddresses={editAddresses}
        setEditAddresses={setEditAddresses}
        saving={saving}
        onSave={handleSaveCustomer}
        onUpdateCustomer={setSelectedCustomer}
      />
    </div>
  )
}
