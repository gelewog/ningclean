'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Search, FileText, User, Clock, Activity } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { getToken } from '@/lib/api'
import { formatDateTime } from '@/lib/utils'

interface AuditLog {
  id: string
  action: string
  entity_type: string
  entity_id: string
  user_email: string | null
  changes: any
  created_at: string
}

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'bg-green-100 text-green-800',
  UPDATE: 'bg-blue-100 text-blue-800',
  DELETE: 'bg-red-100 text-red-800',
  LOGIN: 'bg-purple-100 text-purple-800',
}

export default function AuditLogPage() {
  const [logs, setLogs] = React.useState<AuditLog[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    setLoading(true)
    try {
      const token = getToken()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/admin/audit-logs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setLogs(data)
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.entity_type.toLowerCase().includes(search.toLowerCase()) ||
    (log.user_email?.toLowerCase().includes(search.toLowerCase()) ?? false)
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
      {/* Topbar */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-700 px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
          <span>NingClean Admin</span>
          <span>/</span>
          <span className="text-gray-700 dark:text-slate-200">Audit Trail</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-gray-500 dark:text-slate-400">Live</span>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Audit Trail</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Track all admin activities and changes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white border border-gray-100 dark:border-slate-700 rounded-2xl p-5 overflow-hidden shadow-sm dark:shadow-slate-900/50"
          >
            <div className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-blue-600 to-blue-400`} />
            <p className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">Total Logs</p>
            <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{logs.length}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="relative bg-white border border-gray-100 dark:border-slate-700 rounded-2xl p-5 overflow-hidden shadow-sm dark:shadow-slate-900/50"
          >
            <div className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-green-600 to-green-400`} />
            <p className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">Creates</p>
            <p className="text-3xl font-bold tracking-tight text-green-600">
              {logs.filter(l => l.action === 'CREATE').length}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative bg-white border border-gray-100 dark:border-slate-700 rounded-2xl p-5 overflow-hidden shadow-sm dark:shadow-slate-900/50"
          >
            <div className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-blue-600 to-blue-400`} />
            <p className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">Updates</p>
            <p className="text-3xl font-bold tracking-tight text-blue-600">
              {logs.filter(l => l.action === 'UPDATE').length}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative bg-white border border-gray-100 dark:border-slate-700 rounded-2xl p-5 overflow-hidden shadow-sm dark:shadow-slate-900/50"
          >
            <div className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-purple-600 to-purple-400`} />
            <p className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">Today</p>
            <p className="text-3xl font-bold tracking-tight text-purple-600">
              {logs.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length}
            </p>
          </motion.div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by action, entity, or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white"
          />
        </motion.div>

        {/* Log List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="bg-white border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm dark:shadow-slate-900/50">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                No audit logs found
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-700">
                {filteredLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <Badge className={ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-800'}>
                          {log.action}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {log.action} on <span className="text-blue-600">{log.entity_type}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                          Entity ID: <code className="bg-gray-100 dark:bg-slate-800 px-1 rounded">{log.entity_id.slice(0, 8)}...</code>
                        </p>
                        {log.changes && (
                          <p className="text-xs text-gray-400 mt-1 font-mono">
                            {JSON.stringify(log.changes).slice(0, 100)}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs text-gray-500 dark:text-slate-400">{log.user_email || 'System'}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDateTime(log.created_at)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
