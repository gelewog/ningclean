'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Search, Mail, Shield, Calendar, Edit3, Save, X, Key, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/admin/Modal'
import { DataTable } from '@/components/admin/DataTable'
import { formatDate } from '@/lib/utils'
import { getToken } from '@/lib/api'
import { Breadcrumb } from '@/components/admin/Breadcrumb'

interface User {
  id: string
  email: string
  name: string
  phone: string | null
  role: string
  avatar: string | null
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [editForm, setEditForm] = React.useState({ name: '', email: '', phone: '' })
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    try {
      const token = getToken()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  function openEdit(user: User) {
    setSelectedUser(user)
    setEditForm({ name: user.name, email: user.email, phone: user.phone || '' })
    setIsEditOpen(true)
  }

  async function saveUser() {
    if (!selectedUser) return
    setSaving(true)
    try {
      const token = getToken()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      })
      if (res.ok) {
        await fetchUsers()
        setIsEditOpen(false)
      }
    } catch (error) {
      console.error('Failed to save user:', error)
    } finally {
      setSaving(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (value: string, row: User) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white">
            {value?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value: string) => value || '-',
    },
    {
      key: 'role',
      label: 'Role',
      render: (value: string) => {
        const roleStyles: Record<string, string> = {
          ADMIN: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800',
          STAFF: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800',
          CUSTOMER: 'bg-gray-100 dark:bg-slate-800 text-gray-800',
        }
        const roleLabels: Record<string, string> = {
          ADMIN: 'Admin',
          STAFF: 'Staff',
          CUSTOMER: 'Customer',
        }
        return (
          <Badge className={roleStyles[value] || 'bg-gray-100 dark:bg-slate-800 text-gray-800'}>
            {roleLabels[value] || value}
          </Badge>
        )
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value: string) => (
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(value)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: User) => (
        <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
          <Edit3 className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Users' }]} />

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Users</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Manage admin and staff accounts</p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 overflow-hidden shadow-sm dark:shadow-slate-900/50">
            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-blue-600 to-blue-400" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{users.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="relative bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 overflow-hidden shadow-sm dark:shadow-slate-900/50">
            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-purple-600 to-purple-400" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">Admins</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{users.filter(u => u.role === 'ADMIN').length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
          <div className="relative bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 overflow-hidden shadow-sm dark:shadow-slate-900/50">
            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-gray-600 to-gray-400" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">Staff</p>
                <p className="text-3xl font-bold text-gray-600 dark:text-slate-300">{users.filter(u => u.role === 'STAFF').length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                <Mail className="h-6 w-6 text-gray-600 dark:text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
           <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm dark:shadow-slate-900/50">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
              </div>
            ) : (
              <DataTable columns={columns} data={filteredUsers} />
            )}
          </div>
        </motion.div>
      </div>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit User"
        size="md"
        titleIcon={<Edit3 className="w-5 h-5" />}
        accentColor="blue"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 p-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-2xl font-bold text-white">
                    {editForm.name?.charAt(0).toUpperCase() || selectedUser.name?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">User Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1">Full Name</label>
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
                        <Input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="pl-10 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
                        <Input
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="pl-10 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Role */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4">
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">Current Role</label>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  selectedUser.role === 'ADMIN' 
                    ? 'bg-purple-100 dark:bg-purple-900/30' 
                    : selectedUser.role === 'STAFF'
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : 'bg-gray-100 dark:bg-slate-800'
                }`}>
                  <Shield className={`h-5 w-5 ${
                    selectedUser.role === 'ADMIN'
                      ? 'text-purple-600 dark:text-purple-400'
                      : selectedUser.role === 'STAFF'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-slate-400'
                  }`} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedUser.role}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {selectedUser.role === 'ADMIN' ? 'Full access to all features' : selectedUser.role === 'STAFF' ? 'Limited administrative access' : 'Customer account'}
                  </p>
                </div>
              </div>
            </div>

            {/* Member Since */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4">
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">Member Since</label>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatDate(selectedUser.createdAt)}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Account created</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveUser} disabled={saving} className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}