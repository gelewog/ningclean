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
      label: 'Email',
      render: (value: string, row: NewsletterSubscriber) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 dark:text-white truncate">{value}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Berlangganan: {formatDate(row.subscribedAt)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'error'} className="gap-1 whitespace-nowrap">
          {value ? (
            <>
              <CheckCircle className="w-3 h-3" />
              Aktif
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3" />
              Berhenti
            </>
          )}
        </Badge>
      ),
    },
    {
      key: 'subscribedAt',
      label: 'Tanggal',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 whitespace-nowrap">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {formatDate(value)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_: any, row: NewsletterSubscriber) =>
        row.isActive ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleUnsubscribe(row.email)
            }}
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
          className="flex flex-wrap items-start justify-between gap-3 sm:gap-4"
        >
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Newsletter</h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
              Kelola subscriber dan kirim tips mingguan
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSendTest}
              disabled={sending || activeCount === 0}
              className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700"
              title="Kirim Weekly Tips"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-2 sm:gap-4"
        >
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 truncate">Total</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{subscribers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 truncate">Aktif</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">{activeCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-4 h-4 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 truncate">Berhenti</p>
                <p className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400">{inactiveCount}</p>
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
          <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Konten Tips Mingguan</span>
              </div>
              <Badge variant="info" className="sm:ml-auto text-xs whitespace-nowrap">Otomatis kirim setiap Minggu, 09:00</Badge>
            </div>
          </div>
          <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
            {weeklyTips.map((tip, index) => (
              <div
                key={index}
                className="border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedTip(expandedTip === index ? null : index)}
                  className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                >
                  <span className="text-lg flex-shrink-0">{tip.emoji}</span>
                  <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white truncate pr-2">{tip.title}</span>
                  {expandedTip === index ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedTip === index && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
                    <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-3">
                      <p className="text-xs text-gray-500 dark:text-slate-400 italic">
                        Pratinjau konten akan tersedia setelah dikirim...
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
          <div className="flex flex-col gap-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500 z-10 pointer-events-none" />
              <Input
                placeholder="Cari email subscriber..."
                className="pl-10 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 w-full relative z-1"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={showActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowActive(true)}
                className={`flex-1 ${showActive ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
              >
                <CheckCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                <span>Aktif ({activeCount})</span>
              </Button>
              <Button
                variant={!showActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowActive(false)}
                className={`flex-1 ${!showActive ? 'bg-red-600 hover:bg-red-700' : ''}`}
              >
                <XCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                <span>Berhenti ({inactiveCount})</span>
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="sm:bg-white sm:dark:bg-slate-900 sm:shadow-sm sm:border sm:border-gray-200 dark:sm:border-slate-700 sm:rounded-2xl overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredSubscribers}
              loading={loading}
              renderCard={(row: NewsletterSubscriber) => (
                <div className="space-y-3">
                  {/* Header dengan email dan status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                        <Mail className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{row.email}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">
                          Berlangganan: {formatDate(row.subscribedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {row.isActive ? (
                        <>
                          <Badge variant="success" className="gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Aktif
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUnsubscribe(row.email)
                            }}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 h-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Badge variant="error" className="gap-1">
                          <XCircle className="w-3 h-3" />
                          Berhenti
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
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
