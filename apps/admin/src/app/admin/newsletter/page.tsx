'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  Users,
  Send,
  RefreshCw,
  Search,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Calendar,
  TrendingUp,
  Loader2,
  ExternalLink,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/admin/Pagination'
import { DataTable } from '@/components/admin/DataTable'
import { Breadcrumb } from '@/components/admin/Breadcrumb'
import { getSubscribers, unsubscribeSubscriber, sendTestNewsletter, NewsletterSubscriber } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = React.useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = React.useState(true)
  const [sending, setSending] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [showActive, setShowActive] = React.useState(true)
  const [expandedTip, setExpandedTip] = React.useState<number | null>(null)

  const weeklyTips = [
    { title: '5 Tips Membersihkan Kamar Mandi', emoji: '🧹' },
    { title: 'Tips Membersihkan Dapur', emoji: '🍳' },
    { title: '5 Tips Membersihkan Ruang Tamu', emoji: '🛋️' },
    { title: 'Tips Merawat Kasur Agar Tetap Bersih', emoji: '🛏️' },
    { title: '5 Tips Membersihkan Kamar Mandi', emoji: '🧹' },
  ]

  React.useEffect(() => {
    fetchSubscribers()
  }, [])

  async function fetchSubscribers() {
    setLoading(true)
    try {
      const data = await getSubscribers()
      setSubscribers(data)
    } catch (error) {
      toast.error('Gagal mengambil data subscriber')
    } finally {
      setLoading(false)
    }
  }

  async function handleSendTest() {
    setSending(true)
    try {
      const result = await sendTestNewsletter()
      if (result.success) {
        toast.success('Newsletter berhasil dikirim ke semua subscriber!')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Gagal mengirim newsletter')
    } finally {
      setSending(false)
    }
  }

  async function handleUnsubscribe(email: string) {
    if (!confirm(`Hapus ${email} dari newsletter?`)) return
    try {
      await unsubscribeSubscriber(email)
      toast.success('Subscriber berhasil dihapus')
      fetchSubscribers()
    } catch (error) {
      toast.error('Gagal menghapus subscriber')
    }
  }

  const filteredSubscribers = React.useMemo(() => {
    return subscribers.filter(sub => {
      const matchesSearch = sub.email.toLowerCase().includes(search.toLowerCase())
      const matchesActive = showActive ? sub.isActive : !sub.isActive
      return matchesSearch && matchesActive
    })
  }, [subscribers, search, showActive])

  const activeCount = subscribers.filter(s => s.isActive).length
  const inactiveCount = subscribers.filter(s => !s.isActive).length

  const columns = [
    {
      key: 'email',
      label: 'Subscriber',
      render: (value: string, row: NewsletterSubscriber) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Subscribe: {formatDate(row.subscribedAt)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'error'} className="gap-1">
          {value ? (
            <>
              <CheckCircle className="w-3 h-3" />
              Active
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3" />
              Unsubscribed
            </>
          )}
        </Badge>
      ),
    },
    {
      key: 'subscribedAt',
      label: 'Tanggal Subscribe',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
          <Calendar className="w-4 h-4 text-gray-400" />
          {formatDate(value)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_: any, row: NewsletterSubscriber) =>
        row.isActive ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleUnsubscribe(row.email)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 gap-1"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        ) : null,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 text-gray-900 dark:text-white">
      <Breadcrumb items={[{ label: 'Newsletter' }]} />

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Newsletter</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Kelola subscriber dan kirim tips mingguan
            </p>
          </div>
          <Button
            onClick={handleSendTest}
            disabled={sending || activeCount === 0}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {sending ? 'Mengirim...' : 'Kirim Weekly Tips'}
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">Total Subscriber</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{subscribers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">Active</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">Unsubscribed</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{inactiveCount}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Weekly Tips Preview */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Weekly Tips Content</span>
              <Badge variant="info" className="ml-auto">Otomatis kirim setiap Minggu, 09:00</Badge>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {weeklyTips.map((tip, index) => (
              <div
                key={index}
                className="border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedTip(expandedTip === index ? null : index)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                >
                  <span className="text-lg">{tip.emoji}</span>
                  <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">{tip.title}</span>
                  {expandedTip === index ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                {expandedTip === index && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-3">
                      <p className="text-xs text-gray-500 dark:text-slate-400 italic">
                        Content preview available after sending...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Subscriber List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari email subscriber..."
                className="pl-10 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={showActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowActive(true)}
                className={showActive ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Active ({activeCount})
              </Button>
              <Button
                variant={!showActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowActive(false)}
                className={!showActive ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Unsubscribed ({inactiveCount})
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
            <DataTable
              columns={columns}
              data={filteredSubscribers}
              loading={loading}
              emptyState={
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-slate-400">Belum ada subscriber</p>
                </div>
              }
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
