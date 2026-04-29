'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, MessageSquare, Edit, Save, RotateCcw, FileText, Send, X,
  Sparkles, CheckCircle, AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { getEmailTemplates, updateEmailTemplate, EmailTemplate } from '@/lib/api'
import { toast } from 'sonner'
import { Breadcrumb } from '@/components/admin/Breadcrumb'

const TEMPLATE_INFO: Record<string, { label: string; description: string; icon: React.ReactNode; color: string }> = {
  BOOKING_CONFIRMED: { 
    label: 'Booking Confirmed', 
    description: 'Email & SMS saat booking berhasil dikonfirmasi', 
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'emerald'
  },
  BOOKING_STATUS_UPDATED: { 
    label: 'Status Updated', 
    description: 'Notifikasi saat status booking berubah', 
    icon: <FileText className="w-5 h-5" />,
    color: 'blue'
  },
  BOOKING_REMINDER: { 
    label: 'Booking Reminder', 
    description: 'Pengingat H-1 sebelum layanan', 
    icon: <Sparkles className="w-5 h-5" />,
    color: 'amber'
  },
  BOOKING_CANCELLED: { 
    label: 'Booking Cancelled', 
    description: 'Konfirmasi pembatalan booking', 
    icon: <X className="w-5 h-5" />,
    color: 'red'
  },
  CUSTOMER_WELCOME: { 
    label: 'Welcome Email', 
    description: 'Email selamat datang untuk customer baru', 
    icon: <Mail className="w-5 h-5" />,
    color: 'purple'
  },
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = React.useState<EmailTemplate[]>([])
  const [loading, setLoading] = React.useState(true)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editData, setEditData] = React.useState<Record<string, { subject: string; body: string; smsBody: string }>>({})
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    fetchTemplates()
  }, [])

  async function fetchTemplates() {
    setLoading(true)
    try {
      const data = await getEmailTemplates()
      setTemplates(data)
    } catch (error) {
      toast.error('Gagal mengambil template')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(template: EmailTemplate) {
    setEditingId(template.id)
    setEditData({
      [template.id]: {
        subject: template.subject,
        body: template.body,
        smsBody: template.smsBody || '',
      },
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditData({})
  }

  async function saveEdit(template: EmailTemplate) {
    const data = editData[template.id]
    if (!data) return

    setSaving(true)
    try {
      await updateEmailTemplate(template.id, {
        subject: data.subject,
        body: data.body,
        smsBody: data.smsBody,
      })
      toast.success('Template berhasil disimpan')
      setEditingId(null)
      fetchTemplates()
    } catch (error) {
      toast.error('Gagal menyimpan template')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Email Templates' }]} />

      <div className="w-full px-3 sm:px-6 py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-start justify-between gap-4"
        >
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Email & SMS Templates</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1 truncate">Kelola template email dan SMS untuk notifikasi</p>
          </div>
          <div className="flex-shrink-0">
            <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Total: </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{templates.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Variables Info */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-300 text-sm">Variable Placeholders</p>
              <p className="text-amber-700 dark:text-amber-400 text-xs mt-1">
                Gunakan variable seperti {'{customerName}'}, {'{orderNumber}'}, {'{serviceName}'}, {'{serviceDate}'}, {'{serviceTime}'}, {'{address}'}, {'{totalAmount}'}, {'{status}'}, {'{referralCode}'} untuk data dinamis.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Templates List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 dark:border-slate-700 border-t-emerald-500" />
            </div>
          ) : (
            templates.map((template, index) => {
              const info = TEMPLATE_INFO[template.type] || { 
                label: template.type, 
                description: '', 
                icon: <Mail className="w-5 h-5" />,
                color: 'gray'
              }
              const isEditing = editingId === template.id
              const data = editData[template.id]

              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                >
                  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-${info.color}-50 dark:bg-${info.color}-900/30 flex items-center justify-center`}>
                            <span className={`text-${info.color}-600 dark:text-${info.color}-400`}>{info.icon}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{info.label}</h3>
                              {!template.isActive && (
                                <Badge variant="default">Disabled</Badge>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">{info.description}</p>
                          </div>
                        </div>
                        {!isEditing ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(template)}
                            className="gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={cancelEdit}
                              className="gap-2"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Batal
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => saveEdit(template)}
                              disabled={saving}
                              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                            >
                              <Save className="w-4 h-4" />
                              {saving ? 'Saving...' : 'Simpan'}
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      {isEditing && data ? (
                        <div className="space-y-4">
                          {/* Subject */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-200 flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Subject
                            </label>
                            <Input
                              value={data.subject}
                              onChange={(e) => setEditData({
                                ...editData,
                                [template.id]: { ...data, subject: e.target.value }
                              })}
                              placeholder="Email subject..."
                              className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                            />
                          </div>

                          {/* Email Body */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-200 flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Email Body
                            </label>
                            <textarea
                              value={data.body}
                              onChange={(e) => setEditData({
                                ...editData,
                                [template.id]: { ...data, body: e.target.value }
                              })}
                              rows={10}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
                              placeholder="Email body..."
                            />
                          </div>

                          {/* SMS Body */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-200 flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              SMS Body
                              <Badge variant="outline" className="text-xs">{data.smsBody?.length || 0}/160</Badge>
                            </label>
                            <textarea
                              value={data.smsBody}
                              onChange={(e) => setEditData({
                                ...editData,
                                [template.id]: { ...data, smsBody: e.target.value }
                              })}
                              rows={3}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
                              placeholder="SMS version (max 160 chars)..."
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Preview */}
                          <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                            <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                              <Mail className="w-3 h-3" /> Subject:
                            </p>
                            <p className="text-sm text-gray-900 dark:text-white">{template.subject}</p>
                          </div>
                          <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                            <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Email Body Preview:</p>
                            <p className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap line-clamp-4">
                              {template.body}
                            </p>
                          </div>
                          {template.smsBody && (
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
                                <Send className="w-3 h-3" /> SMS:
                              </p>
                              <p className="text-sm text-blue-700 dark:text-blue-300">{template.smsBody}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
