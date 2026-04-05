'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Edit, Save, RotateCcw, FileText, Send } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { getEmailTemplates, updateEmailTemplate, EmailTemplate } from '@/lib/api'
import { toast } from 'sonner'

const TEMPLATE_INFO: Record<string, { label: string; description: string; icon: string }> = {
  BOOKING_CONFIRMED: { label: 'Booking Confirmed', description: 'Email & SMS saat booking berhasil dikonfirmasi', icon: '📋' },
  BOOKING_STATUS_UPDATED: { label: 'Status Updated', description: 'Notifikasi saat status booking berubah', icon: '📢' },
  BOOKING_REMINDER: { label: 'Booking Reminder', description: 'Pengingat H-1 sebelum layanan', icon: '⏰' },
  BOOKING_CANCELLED: { label: 'Booking Cancelled', description: 'Konfirmasi pembatalan booking', icon: '❌' },
  CUSTOMER_WELCOME: { label: 'Welcome Email', description: 'Email selamat datang untuk customer baru', icon: '🎉' },
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
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email & SMS Templates</h1>
          <p className="text-gray-500">Kelola template email dan SMS untuk notifikasi</p>
        </div>
      </motion.div>

      {/* Variables Info */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800 text-sm">Variable Placeholders</p>
              <p className="text-amber-700 text-xs mt-1">
                Gunakan variable seperti {'{customerName}'}, {'{orderNumber}'}, {'{serviceName}'}, {'{serviceDate}'}, {'{serviceTime}'}, {'{address}'}, {'{totalAmount}'}, {'{status}'}, {'{referralCode}'} untuk data dinamis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500" />
          </div>
        ) : (
          templates.map((template) => {
            const info = TEMPLATE_INFO[template.type] || { label: template.type, description: '', icon: '📄' }
            const isEditing = editingId === template.id
            const data = editData[template.id]

            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{info.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{info.label}</h3>
                            {!template.isActive && (
                              <Badge variant="default">Disabled</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{info.description}</p>
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
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
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
                          />
                        </div>

                        {/* Email Body */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email Body
                          </label>
                          <Textarea
                            value={data.body}
                            onChange={(e) => setEditData({
                              ...editData,
                              [template.id]: { ...data, body: e.target.value }
                            })}
                            rows={10}
                            className="font-mono text-sm"
                            placeholder="Email body..."
                          />
                        </div>

                        {/* SMS Body */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            SMS Body
                            <Badge variant="default" className="text-xs">{data.smsBody?.length || 0}/160</Badge>
                          </label>
                          <Textarea
                            value={data.smsBody}
                            onChange={(e) => setEditData({
                              ...editData,
                              [template.id]: { ...data, smsBody: e.target.value }
                            })}
                            rows={3}
                            className="font-mono text-sm"
                            placeholder="SMS version (max 160 chars)..."
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Preview */}
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-xs font-medium text-gray-500 mb-1">Subject:</p>
                          <p className="text-sm text-gray-900">{template.subject}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-xs font-medium text-gray-500 mb-1">Email Body Preview:</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-4">
                            {template.body}
                          </p>
                        </div>
                        {template.smsBody && (
                          <div className="p-4 bg-blue-50 rounded-xl">
                            <p className="text-xs font-medium text-blue-500 mb-1 flex items-center gap-1">
                              <Send className="w-3 h-3" /> SMS:
                            </p>
                            <p className="text-sm text-blue-700">{template.smsBody}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}

