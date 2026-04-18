'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  Search, User, Clock, Activity, Shield, 
  Plus, Edit, Trash2, LogIn, Filter
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getToken } from '@/lib/api'
import { formatDateTime } from '@/lib/utils'

interface AuditLog {
  id: string
  action: string
  entityType: string
  entityId: string
  userEmail: string | null
  changes: any
  createdAt: string
}

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  UPDATE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  DELETE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  LOGIN: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  CREATE: <Plus className="w-4 h-4" />,
  UPDATE: <Edit className="w-4 h-4" />,
  DELETE: <Trash2 className="w-4 h-4" />,
  LOGIN: <LogIn className="w-4 h-4" />,
}

export default function AuditLogPage() {
  const [logs, setLogs] = React.useState<AuditLog[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [filter, setFilter] = React.useState<string>('ALL')
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
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

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entityType.toLowerCase().includes(search.toLowerCase()) ||
      (log.userEmail?.toLowerCase().includes(search.toLowerCase()) ?? false)

    const matchesFilter = filter === 'ALL' || log.action === filter

    return matchesSearch && matchesFilter
  })

  // Calculate stats
  const totalLogs = logs.length
  const createCount = logs.filter(l => l.action === 'CREATE').length
  const updateCount = logs.filter(l => l.action === 'UPDATE').length
  const deleteCount = logs.filter(l => l.action === 'DELETE').length
  const todayCount = mounted ? logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length : 0

  // Loading skeleton
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 text-gray-900 dark:text-white">
        <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-700 px-4 md:px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-slate-400">Admin / Audit Logs</div>
        </div>
        <div className="w-full px-4 md:px-6 py-6">
          <div className="h-8 w-32 bg-gray-200 dark:bg-slate-700 rounded mb-4" />
          <div className="h-4 w-48 bg-gray-200 dark:bg-slate-700 rounded mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-20 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700" />
            ))}
          </div>
          <div className="h-96 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 text-gray-900 dark:text-white">
      {/* Topbar */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-700 px-4 md:px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
          <span>Admin</span>
          <span className="text-gray-400 dark:text-slate-500">/</span>
          <span className="text-gray-900 dark:text-white font-medium">Audit Logs</span>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Audit Trail</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Track all admin activities and changes</p>
          </div>
          <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <span className="text-sm text-gray-500 dark:text-slate-400">Total: </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{totalLogs}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard icon={<Activity className="w-5 h-5 text-gray-600 dark:text-slate-400" />} label="Total Logs" value={totalLogs} color="gray" />
          <StatCard icon={<Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />} label="Creates" value={createCount} color="emerald" />
          <StatCard icon={<Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />} label="Updates" value={updateCount} color="blue" />
          <StatCard icon={<Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />} label="Deletes" value={deleteCount} color="red" />
          <StatCard icon={<Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />} label="Today" value={todayCount} color="purple" />
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <FilterButton active={filter === 'ALL'} onClick={() => setFilter('ALL')} label="All" />
            <FilterButton active={filter === 'CREATE'} onClick={() => setFilter('CREATE')} label="Create" color="emerald" />
            <FilterButton active={filter === 'UPDATE'} onClick={() => setFilter('UPDATE')} label="Update" color="blue" />
            <FilterButton active={filter === 'DELETE'} onClick={() => setFilter('DELETE')} label="Delete" color="red" />
            <FilterButton active={filter === 'LOGIN'} onClick={() => setFilter('LOGIN')} label="Login" color="purple" />
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by action, entity, or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
            />
          </div>
        </div>

        {/* Log List */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 rounded-full border-4 border-gray-200 dark:border-slate-700 border-t-emerald-500" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-gray-100 dark:bg-slate-800 p-4">
                <Shield className="h-8 w-8 text-gray-400 dark:text-slate-500" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {search || filter !== 'ALL' ? 'No audit logs found' : 'No audit logs yet'}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                {search || filter !== 'ALL' ? 'Try different search or filter' : 'Activity logs will appear here'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {filteredLogs.map((log) => {
                const actionClass = ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-400'
                const actionIcon = ACTION_ICONS[log.action] || <Activity className="w-4 h-4" />
                
                return (
                  <div
                    key={log.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${actionClass} flex items-center justify-center`}>
                        {actionIcon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {log.action} <span className="text-gray-400">on</span> {log.entityType}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {log.entityId.slice(0, 8)}...
                          </Badge>
                        </div>
                        {log.changes && (
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 font-mono bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded inline-block">
                            {JSON.stringify(log.changes).slice(0, 80)}
                            {JSON.stringify(log.changes).length > 80 && '...'}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
                          <User className="w-3 h-3" />
                          {log.userEmail || 'System'}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500 mt-1">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(log.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colorClasses: Record<string, string> = {
    gray: 'bg-gray-100 dark:bg-slate-800',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/30',
    blue: 'bg-blue-50 dark:bg-blue-900/30',
    red: 'bg-red-50 dark:bg-red-900/30',
    purple: 'bg-purple-50 dark:bg-purple-900/30',
  }
  
  const textColors: Record<string, string> = {
    gray: 'text-gray-900 dark:text-white',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    blue: 'text-blue-600 dark:text-blue-400',
    red: 'text-red-600 dark:text-red-400',
    purple: 'text-purple-600 dark:text-purple-400',
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">{label}</p>
          <p className={`text-2xl font-bold ${textColors[color]}`}>{value}</p>
        </div>
      </div>
    </motion.div>
  )
}

function FilterButton({ active, onClick, label, color = 'gray' }: { 
  active: boolean; 
  onClick: () => void; 
  label: string; 
  color?: string;
}) {
  const colorStyles: Record<string, { active: string; inactive: string }> = {
    gray: { active: 'bg-gray-900 text-white dark:bg-slate-700', inactive: 'border-gray-200 dark:border-slate-700' },
    emerald: { active: 'bg-emerald-600 text-white', inactive: 'border-gray-200 dark:border-slate-700' },
    blue: { active: 'bg-blue-600 text-white', inactive: 'border-gray-200 dark:border-slate-700' },
    red: { active: 'bg-red-600 text-white', inactive: 'border-gray-200 dark:border-slate-700' },
  }
  
  const style = colorStyles[color] || colorStyles.gray
  
  return (
    <Button
      variant={active ? 'default' : 'outline'}
      size="sm"
      onClick={onClick}
      className={active ? style.active : style.inactive}
    >
      <Filter className="w-4 h-4 mr-2" />
      {label}
    </Button>
  )
}
