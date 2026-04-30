'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  Search, User, Clock, Activity, Shield, History,
  Plus, Edit, Trash2, LogIn, Filter, ChevronRight
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/admin/DataTable'
import { getToken } from '@/lib/api'
import { formatDateTime, cn } from '@/lib/utils'
import { Breadcrumb } from '@/components/admin/Breadcrumb'

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

// Modern Mobile Card Component
function AuditLogMobileCard({ log }: { log: AuditLog }) {
  const actionClass = ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-400'
  const actionIcon = ACTION_ICONS[log.action] || <Activity className="w-4 h-4" />

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
      {/* Header with Action and Icon */}
      <div className="p-4 flex items-start gap-3 border-b border-gray-100 dark:border-slate-700/50">
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${actionClass} flex items-center justify-center`}>
          {actionIcon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs font-medium">
              {log.action}
            </Badge>
            <span className="text-xs text-gray-400 dark:text-slate-500">pada</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
              {log.entityType}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 font-mono">
            ID: {log.entityId.slice(0, 8)}...
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Changes Preview */}
        {log.changes && (
          <div className="mb-3">
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-1">Perubahan:</p>
            <div className="text-xs text-gray-600 dark:text-slate-400 font-mono bg-gray-50 dark:bg-slate-800/50 px-3 py-2 rounded-lg border border-gray-100 dark:border-slate-700/50 break-all">
              {JSON.stringify(log.changes).slice(0, 60)}
              {JSON.stringify(log.changes).length > 60 && '...'}
            </div>
          </div>
        )}

        {/* User and Time */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400">
            <User className="h-3.5 w-3.5" />
            <span className="truncate max-w-[120px]">{log.userEmail || 'System'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
            <Clock className="h-3.5 w-3.5" />
            {formatDateTime(log.createdAt)}
          </div>
        </div>
      </div>
    </div>
  )
}

// Mobile Skeleton Card
function AuditLogMobileSkeleton({ index }: { index: number }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-600 overflow-hidden animate-pulse">
      <div className="p-4 flex items-start gap-3 border-b border-gray-100 dark:border-slate-700/50">
        <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-slate-700 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 bg-gray-200 dark:bg-slate-700 rounded-full" />
            <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="h-3 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="h-8 w-full bg-gray-200 dark:bg-slate-700 rounded" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center gap-1">
            <div className="h-3.5 w-3.5 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="h-3 w-20 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3.5 w-3.5 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="h-3 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
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

  const columns = [
    {
      key: 'action',
      label: 'Aksi',
      render: (value: string) => {
        const actionClass = ACTION_COLORS[value] || 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-400'
        const actionIcon = ACTION_ICONS[value] || <Activity className="w-4 h-4" />
        return (
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg ${actionClass} flex items-center justify-center`}>
              {actionIcon}
            </div>
            <span className="font-medium text-gray-900 dark:text-white">{value}</span>
          </div>
        )
      },
    },
    {
      key: 'entityType',
      label: 'Entitas',
      render: (value: string, row: AuditLog) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white capitalize">{value}</p>
          <p className="text-xs text-gray-500 dark:text-slate-400 font-mono">ID: {row.entityId.slice(0, 8)}...</p>
        </div>
      ),
    },
    {
      key: 'changes',
      label: 'Perubahan',
      render: (value: any) => {
        if (!value) return <span className="text-gray-400 dark:text-slate-500">-</span>
        const str = JSON.stringify(value).slice(0, 40)
        return (
          <div className="text-xs text-gray-600 dark:text-slate-400 font-mono bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded truncate max-w-[200px]">
            {str}{JSON.stringify(value).length > 40 && '...'}
          </div>
        )
      },
    },
    {
      key: 'userEmail',
      label: 'Pengguna',
      render: (value: string | null) => (
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-slate-400">
          <User className="w-3.5 h-3.5" />
          {value || 'System'}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Waktu',
      render: (value: string) => (
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          {formatDateTime(value)}
        </div>
      ),
    },
  ]

  // Loading skeleton for initial page load
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white">
        <Breadcrumb items={[{ label: 'Log Audit' }]} />
        <div className="w-full px-4 md:px-6 py-6">
          <div className="h-8 w-32 bg-gray-200 dark:bg-slate-700 rounded mb-4" />
          <div className="h-4 w-48 bg-gray-200 dark:bg-slate-700 rounded mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-20 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-600" />
            ))}
          </div>
          <div className="h-96 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-600" />
        </div>
      </div>
    )
  }

  // Custom renderCard untuk mobile
  const renderCard = (row: AuditLog) => (
    <AuditLogMobileCard log={row} />
  )

  // Custom skeletonCard untuk mobile
  const skeletonCard = (i: number) => (
    <AuditLogMobileSkeleton key={i} index={i} />
  )

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Log Audit' }]} />

      <div className="w-full px-3 sm:px-6 py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-start justify-between gap-4"
        >
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Log Audit</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1 truncate">Lacak semua aktivitas admin dan perubahan data</p>
          </div>
          <div className="flex-shrink-0 px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-600">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Total: </span>
            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{totalLogs}</span>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4"
        >
          <StatCard 
            icon={<History className="w-5 h-5 text-gray-600 dark:text-slate-400" />} 
            label="Total Log" 
            value={totalLogs} 
            color="gray" 
          />
          <StatCard 
            icon={<Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />} 
            label="Tambah" 
            value={createCount} 
            color="emerald" 
          />
          <StatCard 
            icon={<Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />} 
            label="Ubah" 
            value={updateCount} 
            color="blue" 
          />
          <StatCard 
            icon={<Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />} 
            label="Hapus" 
            value={deleteCount} 
            color="red" 
          />
          <StatCard 
            icon={<Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />} 
            label="Hari Ini" 
            value={todayCount} 
            color="purple" 
          />
        </motion.div>

        {/* Filters & Search */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-3 sm:p-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <FilterButton active={filter === 'ALL'} onClick={() => setFilter('ALL')} label="Semua" />
              <FilterButton active={filter === 'CREATE'} onClick={() => setFilter('CREATE')} label="Tambah" color="emerald" />
              <FilterButton active={filter === 'UPDATE'} onClick={() => setFilter('UPDATE')} label="Ubah" color="blue" />
              <FilterButton active={filter === 'DELETE'} onClick={() => setFilter('DELETE')} label="Hapus" color="red" />
              <FilterButton active={filter === 'LOGIN'} onClick={() => setFilter('LOGIN')} label="Login" color="purple" />
            </div>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500 z-10 pointer-events-none" />
                <Input
                placeholder="Cari aksi, entitas, pengguna..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-sm relative z-1"
              />
            </div>
          </div>
        </motion.div>

        {/* Log List */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="sm:bg-white sm:dark:bg-slate-900 sm:shadow-sm sm:border sm:border-gray-200 dark:sm:border-slate-700 sm:rounded-2xl overflow-hidden"
        >
          <DataTable
            columns={columns}
            data={filteredLogs}
            loading={loading}
            renderCard={renderCard}
            skeletonCard={skeletonCard}
            emptyState={
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-gray-100 dark:bg-slate-800 p-4">
                  <Shield className="h-8 w-8 text-gray-400 dark:text-slate-500" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {search || filter !== 'ALL' ? 'Tidak ada log audit ditemukan' : 'Belum ada log audit'}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  {search || filter !== 'ALL' ? 'Coba kata kunci atau filter lain' : 'Log aktivitas akan muncul di sini'}
                </p>
              </div>
            }
          />
        </motion.div>
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
      className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-2xl p-4 sm:p-5 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{label}</p>
          <p className={`text-xl sm:text-2xl font-bold ${textColors[color]}`}>{value}</p>
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
    gray: { active: 'bg-gray-900 text-white dark:bg-slate-700', inactive: 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400' },
    emerald: { active: 'bg-emerald-600 text-white', inactive: 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400' },
    blue: { active: 'bg-blue-600 text-white', inactive: 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400' },
    red: { active: 'bg-red-600 text-white', inactive: 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400' },
    purple: { active: 'bg-purple-600 text-white', inactive: 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400' },
  }
  
  const style = colorStyles[color] || colorStyles.gray
  
  return (
    <Button
      variant={active ? 'default' : 'outline'}
      size="sm"
      onClick={onClick}
      className={active ? style.active : style.inactive}
    >
      <Filter className="w-3.5 h-3.5 mr-1.5" />
      {label}
    </Button>
  )
}
