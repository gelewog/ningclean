'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, CheckCircle, Plus, X } from 'lucide-react'

// Types untuk Notification Config
interface WhatsAppConfig {
  enabled: boolean
  number: string
  template: string
}

interface EmailSmtpConfig {
  host: string
  port: number
  user: string
  secure: boolean
}

interface EmailFromConfig {
  name: string
  address: string
}

interface EmailConfig {
  enabled: boolean
  smtp: EmailSmtpConfig
  from: EmailFromConfig
  adminRecipients: string[]
}

interface TwilioConfig {
  enabled: boolean
  accountSid: string
  fromNumber: string
}

interface NotificationConfig {
  whatsapp: WhatsAppConfig
  email: EmailConfig
  twilio: TwilioConfig
}

interface Secrets {
  emailPassword?: string
  twilioAuthToken?: string
}

interface NotificationSettingsData {
  config: NotificationConfig
  secrets: Secrets
  hasEmailPassword: boolean
  hasTwilioAuthToken: boolean
}

// Props
interface NotificationSettingsPanelProps {
  settings: NotificationSettingsData
  onChange: (settings: NotificationSettingsData) => void
}

// Toggle Component - memoized
const Toggle = React.memo(function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={e => onChange(e.target.checked)} 
        className="sr-only peer" 
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
    </label>
  )
})

// Form Field - memoized
const FormField = React.memo(function FormField({ label, children, description }: { 
  label: string; 
  children: React.ReactNode; 
  description?: string 
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {description && <p className="text-xs text-gray-400">{description}</p>}
    </div>
  )
})

// WhatsApp Icon - memoized
const WhatsAppIcon = React.memo(function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
})

export default function NotificationSettingsPanel({ settings, onChange }: NotificationSettingsPanelProps) {
  const updateConfig = React.useCallback((path: string, value: any) => {
    const keys = path.split('.')
    const newConfig = { ...settings.config }
    let current: any = newConfig
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] }
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    onChange({ ...settings, config: newConfig })
  }, [settings, onChange])

  const updateSecrets = React.useCallback((key: keyof Secrets, value: string) => {
    onChange({
      ...settings,
      secrets: { ...settings.secrets, [key]: value }
    })
  }, [settings, onChange])

  const addAdminRecipient = () => {
    const newRecipients = [...settings.config.email.adminRecipients, '']
    updateConfig('email.adminRecipients', newRecipients)
  }

  const removeAdminRecipient = (index: number) => {
    const newRecipients = settings.config.email.adminRecipients.filter((_, i) => i !== index)
    updateConfig('email.adminRecipients', newRecipients)
  }

  const updateAdminRecipient = (index: number, value: string) => {
    const newRecipients = [...settings.config.email.adminRecipients]
    newRecipients[index] = value
    updateConfig('email.adminRecipients', newRecipients)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                <WhatsAppIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">WhatsApp Notifications</h2>
                <p className="text-sm text-gray-500">Notifikasi booking via Twilio WhatsApp API</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {settings.hasTwilioAuthToken && settings.config.twilio.enabled && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Connected
                </span>
              )}
              <Toggle 
                checked={settings.config.twilio.enabled} 
                onChange={(v) => updateConfig('twilio.enabled', v)} 
              />
            </div>
          </div>

          {settings.config.twilio.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-5"
            >
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">Menggunakan Twilio WhatsApp API</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Pesan dikirim dari nomor Twilio Sandbox (+1 415 523 8886). 
                      Pastikan nomor tujuan sudah join sandbox dengan mengirim pesan ke nomor tersebut.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Nomor WhatsApp Tujuan (Admin)" description="Nomor admin yang menerima notifikasi booking">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">+</span>
                    <Input 
                      className="h-11 pl-8" 
                      value={settings.config.whatsapp.number} 
                      onChange={e => updateConfig('whatsapp.number', e.target.value)} 
                      placeholder="6281234567890" 
                    />
                  </div>
                </FormField>
                
                <FormField label="Nomor Pengirim (Twilio)" description="Nomor WhatsApp Twilio Sandbox">
                  <Input 
                    value={settings.config.twilio.fromNumber} 
                    onChange={e => updateConfig('twilio.fromNumber', e.target.value)} 
                    placeholder="+14155238886" 
                    className="h-11" 
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Twilio Account SID">
                  <Input 
                    value={settings.config.twilio.accountSid} 
                    onChange={e => updateConfig('twilio.accountSid', e.target.value)} 
                    placeholder="ACxxxxxxxx..." 
                    className="h-11" 
                  />
                </FormField>
                
                <FormField label="Twilio Auth Token" description={settings.hasTwilioAuthToken ? "Isi untuk mengubah" : ""}>
                  <Input 
                    type="password" 
                    value={settings.secrets.twilioAuthToken || ''} 
                    onChange={e => updateSecrets('twilioAuthToken', e.target.value)} 
                    placeholder={settings.hasTwilioAuthToken ? "••••••••" : "Token dari Twilio Console"} 
                    className="h-11" 
                  />
                </FormField>
              </div>
              
              <FormField label="Template Pesan WhatsApp" description="Variabel: {orderNumber}, {customerName}, {serviceName}, dll">
                <Textarea 
                  value={settings.config.whatsapp.template} 
                  onChange={e => updateConfig('whatsapp.template', e.target.value)} 
                  rows={8} 
                  className="font-mono text-sm" 
                />
              </FormField>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Mail className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Email SMTP</h2>
                <p className="text-sm text-gray-500">Notifikasi via Email</p>
              </div>
            </div>
            <Toggle 
              checked={settings.config.email.enabled} 
              onChange={(v) => updateConfig('email.enabled', v)} 
            />
          </div>
          
          {settings.config.email.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="SMTP Host">
                  <Input 
                    value={settings.config.email.smtp.host} 
                    onChange={e => updateConfig('email.smtp.host', e.target.value)} 
                    placeholder="smtp.gmail.com" 
                    className="h-11" 
                  />
                </FormField>
                <FormField label="SMTP Port">
                  <Input 
                    type="number" 
                    value={settings.config.email.smtp.port} 
                    onChange={e => updateConfig('email.smtp.port', parseInt(e.target.value) || 587)} 
                    placeholder="587" 
                    className="h-11" 
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Username (Email)">
                  <Input 
                    value={settings.config.email.smtp.user} 
                    onChange={e => updateConfig('email.smtp.user', e.target.value)} 
                    placeholder="your@email.com" 
                    className="h-11" 
                  />
                </FormField>
                <FormField label="Password / App Password" description={settings.hasEmailPassword ? "Isi untuk mengubah" : ""}>
                  <Input 
                    type="password" 
                    value={settings.secrets.emailPassword || ''} 
                    onChange={e => updateSecrets('emailPassword', e.target.value)} 
                    placeholder={settings.hasEmailPassword ? "••••••••" : "App password"} 
                    className="h-11" 
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="From Name">
                  <Input 
                    value={settings.config.email.from.name} 
                    onChange={e => updateConfig('email.from.name', e.target.value)} 
                    placeholder="NingClean" 
                    className="h-11" 
                  />
                </FormField>
                <FormField label="From Address">
                  <Input 
                    value={settings.config.email.from.address} 
                    onChange={e => updateConfig('email.from.address', e.target.value)} 
                    placeholder="notif@ningclean.com" 
                    className="h-11" 
                  />
                </FormField>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Admin Recipients</label>
                  <button
                    onClick={addAdminRecipient}
                    className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Tambah
                  </button>
                </div>
                <div className="space-y-2">
                  {settings.config.email.adminRecipients.map((email, index) => (
                    <div key={index} className="flex gap-2">
                      <Input 
                        value={email} 
                        onChange={e => updateAdminRecipient(index, e.target.value)} 
                        placeholder="admin@ningclean.com" 
                        className="h-10 flex-1" 
                      />
                      <button
                        onClick={() => removeAdminRecipient(index)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg border border-gray-200 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  {settings.config.email.adminRecipients.length === 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      <p className="text-sm text-gray-400 text-center">Belum ada recipient. Klik "+ Tambah" untuk menambahkan.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
