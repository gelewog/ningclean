'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, Globe, Mail, Phone, MapPin, Clock, Share2,
  FileText, Search, Save, RefreshCw, Bell, CheckCircle, ExternalLink,
  Instagram, Facebook, Twitter, Youtube, Linkedin, AlertCircle,
  Calendar, DollarSign, Globe2, MessageSquare, Menu, ArrowUpDown, Home, Image, Link2,
  Settings, Shield, Palette, Layout, Smartphone, CheckSquare, Hash, Users,
  User, Moon, Sun, Monitor
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getSiteSettings, updateSiteSettings, getNotificationSettings, updateNotificationSettings, getNavigationSettings, updateNavigationSettings, getHomepageSettings, updateHomepageSettings, getFooterSettings, updateFooterSettings, SiteSettings, NavigationSettings, NavLink, HomepageSettings, BeforeAfterSlide, FooterSettings, FooterColumn, SocialLink } from '@/lib/api'
import { useAdminPreferences } from '@/lib/useAdminPreferences'
import { Breadcrumb } from '@/components/admin/Breadcrumb'
import { toast } from 'sonner'

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Senin',
  tuesday: 'Selasa',
  wednesday: 'Rabu',
  thursday: 'Kamis',
  friday: 'Jumat',
  saturday: 'Sabtu',
  sunday: 'Minggu',
}

// ─── Components ───────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, accent, icon: Icon
}: { label: string; value: string | number; sub: string; accent: string; icon?: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 overflow-hidden shadow-sm dark:shadow-slate-900/50"
    >
      <div className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl ${accent}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">{label}</p>
          <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1.5">{sub}</p>
        </div>
        {Icon && (
          <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center">
            <Icon className="h-5 w-5 text-gray-400 dark:text-slate-500" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
    </label>
  )
}

function DarkInput({
  className = '', icon, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }) {
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none">
          {icon}
        </span>
      )}
      <input
        className={`w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 dark:focus:ring-1 dark:focus:ring-emerald-400/30 transition-all py-2.5 ${icon ? 'pl-10 pr-4' : 'px-4'}`}
        {...props}
      />
    </div>
  )
}

function DarkSelect({
  options, className = '', ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  return (
    <select
      className={`bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 dark:focus:ring-1 dark:focus:ring-emerald-400/30 transition-all py-2.5 px-3 cursor-pointer appearance-none ${className}`}
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
      {...props}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

function FormField({ label, children, description, className = '' }: { label: string; children: React.ReactNode; description?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1.5">{label}</label>
      {children}
      {description && <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1.5">{description}</p>}
    </div>
  )
}

function SectionCard({ title, subtitle, children, accent = 'from-gray-600 to-gray-400', icon: Icon }: { title: string; subtitle?: string; children: React.ReactNode; accent?: string; icon?: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm dark:shadow-slate-900/50"
    >
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${accent}`} />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          {Icon && (
            <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center">
              <Icon className="h-5 w-5 text-gray-600 dark:text-slate-300" />
            </div>
          )}
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500 dark:text-slate-400">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  )
}

function SettingRow({ label, description, children, className }: { label: string; description?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-between py-4 border-b border-gray-50 dark:border-slate-800 last:border-0 ${className || ''}`}>
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-slate-200">{label}</p>
        {description && <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

// Default values for settings
const defaultSiteSettings: Partial<SiteSettings> = {
  companyName: '',
  tagline: '',
  description: '',
  logo: '',
  logoDark: '',
  favicon: '',
  email: '',
  phone: '',
  whatsapp: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  googleMapsUrl: '',
  facebook: '',
  instagram: '',
  twitter: '',
  youtube: '',
  linkedin: '',
  tiktok: '',
  metaTitle: '',
  metaDescription: '',
  keywords: '',
  ogImage: '',
  footerText: '',
  copyrightText: '',
  is24Hours: false,
  minAdvanceDays: 1,
  maxAdvanceDays: 30,
  cancellationHours: 24,
  mondayOpen: '09:00',
  mondayClose: '17:00',
  tuesdayOpen: '09:00',
  tuesdayClose: '17:00',
  wednesdayOpen: '09:00',
  wednesdayClose: '17:00',
  thursdayOpen: '09:00',
  thursdayClose: '17:00',
  fridayOpen: '09:00',
  fridayClose: '17:00',
  saturdayOpen: '09:00',
  saturdayClose: '17:00',
  sundayOpen: '09:00',
  sundayClose: '17:00',
}

const defaultNotificationSettings: Record<string, any> = {
  whatsappNumber: '',
  whatsappMessage: '',
  whatsappEnabled: false,
  emailEnabled: false,
  emailHost: 'smtp.gmail.com',
  emailPort: 587,
  emailUser: '',
  emailFrom: '',
  adminEmail: '',
  hasPassword: false,
  twilioAccountSid: '',
  twilioAuthToken: '',
  twilioFromNumber: '',
  hasTwilio: false,
}

const defaultNavSettings: Partial<NavigationSettings> = {
  navLinks: [],
  showServicesDropdown: true,
  servicesDropdownLabel: 'Layanan',
  ctaButtonText: 'Booking',
  ctaButtonLink: '/booking',
  showCtaButton: true,
  mobileMenuType: 'slide',
  activeIndicatorStyle: 'dot',
}

const defaultHomepageSettings: Partial<HomepageSettings> = {
  heroHeadline: '',
  heroSubheadline: '',
  heroBadge: '',
  heroImage: '',
  ctaPrimaryText: '',
  ctaPrimaryLink: '',
  ctaSecondaryText: '',
  ctaSecondaryLink: '',
  statsHomesCleaned: '',
  statsRating: '',
  statsSatisfaction: '',
  statsResponseTime: '',
  showFeaturesSection: true,
  showServicesSection: true,
  showTestimonialsSection: true,
  showAreasSection: true,
  showBlogSection: true,
  showImageShowcase: true,
  showCTASection: true,
  featuredServiceIds: [],
  beforeAfterSlides: [],
}

const defaultFooterSettings: Partial<FooterSettings> = {
  footerColumns: [],
  showContact: true,
  contactEmail: '',
  contactPhone: '',
  contactWhatsapp: '',
  contactAddress: '',
  showSocials: true,
  socialLinks: [],
  showNewsletter: true,
  newsletterTitle: '',
  newsletterSubtitle: '',
  showStatusBadge: true,
  statusBadgeText: '',
  copyrightText: '',
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { preferences, updatePreference } = useAdminPreferences()
  const [settings, setSettings] = React.useState<Partial<SiteSettings>>(defaultSiteSettings)
  const [notificationSettings, setNotificationSettings] = React.useState<Record<string, any>>(defaultNotificationSettings)
  const [navSettings, setNavSettings] = React.useState<Partial<NavigationSettings>>(defaultNavSettings)
  const [homepageSettings, setHomepageSettings] = React.useState<Partial<HomepageSettings>>(defaultHomepageSettings)
  const [footerSettings, setFooterSettings] = React.useState<Partial<FooterSettings>>(defaultFooterSettings)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState('company')

  React.useEffect(() => {
    loadSettings()
  }, [])

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const [siteData, notifData, navData, homeData, footerData] = await Promise.all([
        getSiteSettings().catch(err => {
          console.error('Failed to load site settings:', err)
          return null
        }),
        getNotificationSettings().catch(err => {
          console.error('Failed to load notification settings:', err)
          return null
        }),
        getNavigationSettings().catch(err => {
          console.error('Failed to load nav settings:', err)
          return null
        }),
        getHomepageSettings().catch(err => {
          console.error('Failed to load homepage settings:', err)
          return null
        }),
        getFooterSettings().catch(err => {
          console.error('Failed to load footer settings:', err)
          return null
        }),
      ])

      // Merge with defaults - ensure all fields have values
      // Use empty object as fallback if data is null
      setSettings(prev => ({ ...defaultSiteSettings, ...prev, ...(siteData || {}) }))
      setNotificationSettings(prev => ({ ...defaultNotificationSettings, ...prev, ...(notifData || {}) }))
      setNavSettings(prev => ({ ...defaultNavSettings, ...prev, ...(navData || {}) }))
      setHomepageSettings(prev => ({ ...defaultHomepageSettings, ...prev, ...(homeData || {}) }))
      setFooterSettings(prev => ({ ...defaultFooterSettings, ...prev, ...(footerData || {}) }))

      // Check if any request failed
      const errors = []
      if (!siteData) errors.push('Site Settings')
      if (!notifData) errors.push('Notification Settings')
      if (!navData) errors.push('Navigation Settings')
      if (!homeData) errors.push('Homepage Settings')
      if (!footerData) errors.push('Footer Settings')
      
      if (errors.length > 0) {
        setLoadError(`Gagal memuat: ${errors.join(', ')}. Cek console untuk detail.`)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
      setLoadError('Gagal memuat settings. Silakan refresh halaman.')
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const errors: string[] = []
    
    try {
      await updateSiteSettings(settings)
    } catch (error: any) {
      console.error('Failed to save site settings:', error)
      errors.push('Site Settings')
    }

    try {
      await updateNotificationSettings({
        whatsappNumber: notificationSettings.whatsappNumber,
        whatsappMessage: notificationSettings.whatsappMessage,
        whatsappEnabled: notificationSettings.whatsappEnabled,
        emailEnabled: notificationSettings.emailEnabled,
        emailHost: notificationSettings.emailHost,
        emailPort: notificationSettings.emailPort,
        emailUser: notificationSettings.emailUser,
        emailFrom: notificationSettings.emailFrom,
        adminEmail: notificationSettings.adminEmail,
        twilioAccountSid: notificationSettings.twilioAccountSid,
        twilioAuthToken: notificationSettings.twilioAuthToken,
        twilioFromNumber: notificationSettings.twilioFromNumber,
      })
    } catch (error: any) {
      console.error('Failed to save notification settings:', error)
      errors.push('Notification Settings')
    }

    try {
      await updateNavigationSettings(navSettings)
    } catch (error: any) {
      console.error('Failed to save nav settings:', error)
      errors.push('Navigation Settings')
    }

    try {
      await updateHomepageSettings(homepageSettings)
    } catch (error: any) {
      console.error('Failed to save homepage settings:', error)
      errors.push('Homepage Settings')
    }

    try {
      await updateFooterSettings(footerSettings)
    } catch (error: any) {
      console.error('Failed to save footer settings:', error)
      errors.push('Footer Settings')
    }

    if (errors.length === 0) {
      toast.success('Settings berhasil disimpan')
    } else {
      toast.error(`Gagal menyimpan: ${errors.join(', ')}`)
    }
    
    setSaving(false)
  }

  const updateField = (field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const updateNotifField = (field: string, value: any) => {
    setNotificationSettings((prev: Record<string, any>) => ({ ...prev, [field]: value }))
  }

  // Calculate stats
  const filledCompanyFields = ['companyName', 'tagline', 'description', 'logo'].filter(f => settings[f as keyof SiteSettings]).length
  const filledContactFields = ['email', 'phone', 'whatsapp', 'address'].filter(f => settings[f as keyof SiteSettings]).length
  const filledSocialFields = ['facebook', 'instagram', 'twitter'].filter(f => settings[f as keyof SiteSettings]).length
  // Only 2 channels: WhatsApp (via Twilio) and Email
  const enabledNotifs = [
    notificationSettings.whatsappEnabled,
    notificationSettings.emailEnabled,
  ].filter(Boolean).length

  const tabs = [
    { id: 'company', label: 'Perusahaan', icon: Building2 },
    { id: 'contact', label: 'Kontak', icon: Phone },
    { id: 'social', label: 'Social', icon: Share2 },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'footer', label: 'Footer', icon: FileText },
    { id: 'hours', label: 'Jam Operasional', icon: Clock },
    { id: 'booking', label: 'Booking Rules', icon: Calendar },
    { id: 'navigation', label: 'Navigation', icon: Menu },
    { id: 'homepage', label: 'Homepage', icon: Home },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'personal', label: 'Personal', icon: User },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
      {/* Topbar */}
      <Breadcrumb items={[{ label: 'Settings' }]} />

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Kelola pengaturan website dan konfigurasi sistem</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadSettings}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="w-3.5 h-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Simpan Changes
            </button>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Company Info"
            value={`${filledCompanyFields}/4`}
            sub="Fields filled"
            accent="bg-gradient-to-r from-blue-600 to-blue-400"
            icon={Building2}
          />
          <StatCard
            label="Contact"
            value={`${filledContactFields}/4`}
            sub="Fields filled"
            accent="bg-gradient-to-r from-emerald-600 to-emerald-400"
            icon={Phone}
          />
          <StatCard
            label="Social Media"
            value={`${filledSocialFields}/3`}
            sub="Connected"
            accent="bg-gradient-to-r from-purple-600 to-purple-400"
            icon={Share2}
          />
          <StatCard
            label="Notifications"
            value={`${enabledNotifs}/2`}
            sub="Channels active"
            accent="bg-gradient-to-r from-amber-600 to-amber-400"
            icon={Bell}
          />
        </div>

        {/* Tabs Filter - Horizontal Scrollable on Mobile/Tablet */}  
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="overflow-x-auto -mx-4 px-4 pb-3 custom-scrollbar">
            <div className="flex gap-2 min-w-max px-1">
              {tabs.map(tab => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-600 dark:bg-emerald-500 border-emerald-600 dark:border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {loadError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">Error saat memuat settings</p>
                <p className="text-xs text-red-600 dark:text-red-300 mt-1">{loadError}</p>
              </div>
              <button
                onClick={loadSettings}
                className="px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-800/50 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}
        {loading ? (
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm dark:shadow-slate-900/50">
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500" />
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* Company Tab */}
            {activeTab === 'company' && (
              <motion.div
                key="company"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <SectionCard
                  title="Informasi Perusahaan"
                  subtitle="Identitas dan informasi dasar perusahaan"
                  accent="from-blue-600 to-blue-400"
                  icon={Building2}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField label="Nama Perusahaan">
                      <DarkInput
                        value={settings.companyName || ''}
                        onChange={e => updateField('companyName', e.target.value)}
                        placeholder="NingClean"
                      />
                    </FormField>
                    <FormField label="Tagline">
                      <DarkInput
                        value={settings.tagline || ''}
                        onChange={e => updateField('tagline', e.target.value)}
                        placeholder="Layanan Kebersihan Profesional"
                      />
                    </FormField>
                  </div>
                  <FormField label="Deskripsi" className="mt-5">
                    <Textarea
                      value={settings.description || ''}
                      onChange={e => updateField('description', e.target.value)}
                      placeholder="Deskripsi singkat tentang perusahaan..."
                      rows={4}
                      className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 dark:focus:ring-1 dark:focus:ring-emerald-400/30 transition-all resize-none"
                    />
                  </FormField>
                </SectionCard>

                <SectionCard
                  title="Branding"
                  subtitle="Logo dan identitas visual website"
                  accent="from-purple-600 to-purple-400"
                  icon={Palette}
                >
                  <div className="space-y-5">
                    <FormField label="Logo URL" description="Upload ke Supabase Storage dan paste URL">
                      <DarkInput
                        value={settings.logo || ''}
                        onChange={e => updateField('logo', e.target.value)}
                        placeholder="https://storage.supabase.co/..."
                      />
                    </FormField>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField label="Logo Dark Mode URL">
                        <DarkInput
                          value={settings.logoDark || ''}
                          onChange={e => updateField('logoDark', e.target.value)}
                          placeholder="https://storage.supabase.co/..."
                        />
                      </FormField>
                      <FormField label="Favicon URL">
                        <DarkInput
                          value={settings.favicon || ''}
                          onChange={e => updateField('favicon', e.target.value)}
                          placeholder="https://.../favicon.ico"
                        />
                      </FormField>
                    </div>
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <SectionCard
                  title="Informasi Kontak"
                  subtitle="Cara pelanggan menghubungi perusahaan"
                  accent="from-emerald-600 to-emerald-400"
                  icon={Mail}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField label="Email">
                      <DarkInput
                        type="email"
                        icon={<Mail className="w-4 h-4" />}
                        value={settings.email || ''}
                        onChange={e => updateField('email', e.target.value)}
                        placeholder="hello@ningclean.com"
                      />
                    </FormField>
                    <FormField label="Telepon">
                      <DarkInput
                        icon={<Phone className="w-4 h-4" />}
                        value={settings.phone || ''}
                        onChange={e => updateField('phone', e.target.value)}
                        placeholder="021-1234567"
                      />
                    </FormField>
                  </div>
                  <FormField label="WhatsApp" description="Format: kode negara + nomor (contoh: 6281234567890)" className="mt-5">
                    <DarkInput
                      icon={<Phone className="w-4 h-4" />}
                      value={settings.whatsapp || ''}
                      onChange={e => updateField('whatsapp', e.target.value)}
                      placeholder="6281234567890"
                    />
                  </FormField>
                </SectionCard>

                <SectionCard
                  title="Alamat"
                  subtitle="Lokasi fisik perusahaan"
                  accent="from-amber-600 to-amber-400"
                  icon={MapPin}
                >
                  <FormField label="Alamat Lengkap">
                    <Textarea
                      value={settings.address || ''}
                      onChange={e => updateField('address', e.target.value)}
                      placeholder="Jl. Raya Cleaning No. 123..."
                      rows={3}
                      className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 dark:focus:ring-1 dark:focus:ring-emerald-400/30 transition-all resize-none"
                    />
                  </FormField>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                    <FormField label="Kota">
                      <DarkInput
                        value={settings.city || ''}
                        onChange={e => updateField('city', e.target.value)}
                        placeholder="Jakarta Selatan"
                      />
                    </FormField>
                    <FormField label="Provinsi">
                      <DarkInput
                        value={settings.province || ''}
                        onChange={e => updateField('province', e.target.value)}
                        placeholder="DKI Jakarta"
                      />
                    </FormField>
                    <FormField label="Kode Pos">
                      <DarkInput
                        value={settings.postalCode || ''}
                        onChange={e => updateField('postalCode', e.target.value)}
                        placeholder="12345"
                      />
                    </FormField>
                  </div>
                  <FormField label="Google Maps URL" className="mt-5">
                    <DarkInput
                      icon={<MapPin className="w-4 h-4" />}
                      value={settings.googleMapsUrl || ''}
                      onChange={e => updateField('googleMapsUrl', e.target.value)}
                      placeholder="https://maps.google.com/..."
                    />
                  </FormField>
                </SectionCard>
              </motion.div>
            )}

            {/* Social Tab */}
            {activeTab === 'social' && (
              <motion.div
                key="social"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <SectionCard
                  title="Social Media"
                  subtitle="Link ke akun media sosial perusahaan"
                  accent="from-pink-600 to-pink-400"
                  icon={Share2}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField label="Facebook">
                      <DarkInput
                        icon={<Facebook className="w-4 h-4 text-blue-600" />}
                        value={settings.facebook || ''}
                        onChange={e => updateField('facebook', e.target.value)}
                        placeholder="https://facebook.com/..."
                      />
                    </FormField>
                    <FormField label="Instagram">
                      <DarkInput
                        icon={<Instagram className="w-4 h-4 text-pink-600" />}
                        value={settings.instagram || ''}
                        onChange={e => updateField('instagram', e.target.value)}
                        placeholder="https://instagram.com/..."
                      />
                    </FormField>
                    <FormField label="Twitter / X">
                      <DarkInput
                        icon={<Twitter className="w-4 h-4 text-gray-800" />}
                        value={settings.twitter || ''}
                        onChange={e => updateField('twitter', e.target.value)}
                        placeholder="https://twitter.com/..."
                      />
                    </FormField>
                    <FormField label="YouTube">
                      <DarkInput
                        icon={<Youtube className="w-4 h-4 text-red-600" />}
                        value={settings.youtube || ''}
                        onChange={e => updateField('youtube', e.target.value)}
                        placeholder="https://youtube.com/..."
                      />
                    </FormField>
                    <FormField label="LinkedIn">
                      <DarkInput
                        icon={<Linkedin className="w-4 h-4 text-blue-700" />}
                        value={settings.linkedin || ''}
                        onChange={e => updateField('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/..."
                      />
                    </FormField>
                    <FormField label="TikTok">
                      <DarkInput
                        icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.75a4.85 4.85 0 01-1-.06z"/></svg>}
                        value={settings.tiktok || ''}
                        onChange={e => updateField('tiktok', e.target.value)}
                        placeholder="https://tiktok.com/@..."
                      />
                    </FormField>
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <motion.div
                key="seo"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <SectionCard
                  title="SEO Settings"
                  subtitle="Optimasi untuk search engine"
                  accent="from-indigo-600 to-indigo-400"
                  icon={Search}
                >
                  <div className="space-y-5">
                    <FormField label="Meta Title" description="Title yang muncul di search engine (max 60 karakter)">
                      <DarkInput
                        value={settings.metaTitle || ''}
                        onChange={e => updateField('metaTitle', e.target.value)}
                        placeholder="NingClean - Layanan Kebersihan Profesional"
                      />
                    </FormField>
                    <FormField label="Meta Description" description="Description yang muncul di search engine (max 160 karakter)">
                      <Textarea
                        value={settings.metaDescription || ''}
                        onChange={e => updateField('metaDescription', e.target.value)}
                        placeholder="Deskripsi website untuk search engine..."
                        rows={3}
                        className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 dark:focus:ring-1 dark:focus:ring-emerald-400/30 transition-all resize-none"
                      />
                    </FormField>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField label="Keywords" description="Pisahkan dengan koma">
                        <DarkInput
                          value={settings.keywords || ''}
                          onChange={e => updateField('keywords', e.target.value)}
                          placeholder="cleaning service, jasa bersih, cuci ac"
                        />
                      </FormField>
                      <FormField label="OG Image URL" description="Image untuk social media sharing (1200x630)">
                        <DarkInput
                          value={settings.ogImage || ''}
                          onChange={e => updateField('ogImage', e.target.value)}
                          placeholder="https://.../og-image.png"
                        />
                      </FormField>
                    </div>
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {/* Footer Tab */}
            {activeTab === 'footer' && (
              <motion.div
                key="footer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <SectionCard
                  title="Footer Text"
                  subtitle="Teks dan informasi di bagian bawah website"
                  accent="from-gray-600 to-gray-400"
                  icon={FileText}
                >
                  <div className="space-y-5">
                    <FormField label="Footer Text">
                      <Textarea
                        value={settings.footerText || ''}
                        onChange={e => updateField('footerText', e.target.value)}
                        placeholder="Teks tambahan di footer..."
                        rows={3}
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 dark:focus:ring-1 dark:focus:ring-emerald-400/30 transition-all resize-none"
                      />
                    </FormField>
                    <FormField label="Copyright Text">
                      <DarkInput
                        value={settings.copyrightText || ''}
                        onChange={e => updateField('copyrightText', e.target.value)}
                        placeholder="© 2024 NingClean. All rights reserved."
                      />
                    </FormField>
                  </div>
                </SectionCard>

                <SectionCard
                  title="Contact Info"
                  subtitle="Kontak yang ditampilkan di footer"
                  accent="from-blue-600 to-blue-400"
                  icon={Phone}
                >
                  <SettingRow
                    label="Tampilkan Contact"
                    description="Email, telepon, WhatsApp, alamat"
                  >
                    <Toggle
                      checked={footerSettings.showContact !== false}
                      onChange={(v) => setFooterSettings({...footerSettings, showContact: v})}
                    />
                  </SettingRow>
                  {footerSettings.showContact !== false && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-50">
                      <FormField label="Email">
                        <DarkInput
                          value={footerSettings.contactEmail || ''}
                          onChange={(e) => setFooterSettings({...footerSettings, contactEmail: e.target.value})}
                          placeholder="hello@ningclean.id"
                        />
                      </FormField>
                      <FormField label="Telepon">
                        <DarkInput
                          value={footerSettings.contactPhone || ''}
                          onChange={(e) => setFooterSettings({...footerSettings, contactPhone: e.target.value})}
                          placeholder="+62 812-3456-7890"
                        />
                      </FormField>
                      <FormField label="WhatsApp">
                        <DarkInput
                          value={footerSettings.contactWhatsapp || ''}
                          onChange={(e) => setFooterSettings({...footerSettings, contactWhatsapp: e.target.value})}
                          placeholder="6281234567890"
                        />
                      </FormField>
                      <FormField label="Alamat">
                        <DarkInput
                          value={footerSettings.contactAddress || ''}
                          onChange={(e) => setFooterSettings({...footerSettings, contactAddress: e.target.value})}
                          placeholder="Surabaya · Gresik · Sidoarjo"
                        />
                      </FormField>
                    </div>
                  )}
                </SectionCard>

                <SectionCard
                  title="Social Links"
                  subtitle="Icon social media di footer"
                  accent="from-pink-600 to-pink-400"
                  icon={Share2}
                >
                  <SettingRow
                    label="Tampilkan Social Icons"
                    description="Instagram, WhatsApp, TikTok, YouTube"
                  >
                    <Toggle
                      checked={footerSettings.showSocials !== false}
                      onChange={(v) => setFooterSettings({...footerSettings, showSocials: v})}
                    />
                  </SettingRow>
                  {footerSettings.showSocials !== false && (
                    <div className="space-y-3 pt-4 border-t border-gray-50">
                      {(footerSettings.socialLinks || []).map((social, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-24 text-sm font-medium text-gray-700 dark:text-slate-200">{social.name}</div>
                          <DarkInput
                            className="flex-1"
                            value={social.href}
                            onChange={(e) => {
                              const newSocials = [...(footerSettings.socialLinks || [])]
                              newSocials[index] = {...social, href: e.target.value}
                              setFooterSettings({...footerSettings, socialLinks: newSocials})
                            }}
                            placeholder="https://..."
                          />
                          <button
                            onClick={() => {
                              const newSocials = (footerSettings.socialLinks || []).filter((_, i) => i !== index)
                              setFooterSettings({...footerSettings, socialLinks: newSocials})
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newSocial: SocialLink = { name: 'New', href: '#', icon: 'link' }
                          setFooterSettings({...footerSettings, socialLinks: [...(footerSettings.socialLinks || []), newSocial]})
                        }}
                        className="w-full p-3 border border-dashed border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-sm text-gray-500 dark:text-slate-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        Tambah Social Link
                      </button>
                    </div>
                  )}
                </SectionCard>
              </motion.div>
            )}

            {/* Hours Tab */}
            {activeTab === 'hours' && (
              <motion.div
                key="hours"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <SectionCard
                  title="Jam Operasional"
                  subtitle="Waktu layanan perusahaan"
                  accent="from-amber-600 to-amber-400"
                  icon={Clock}
                >
                  <SettingRow
                    label="Buka 24 Jam"
                    description="Aktifkan untuk layanan 24 jam"
                  >
                    <Toggle
                      checked={settings.is24Hours || false}
                      onChange={(v) => updateField('is24Hours', v)}
                    />
                  </SettingRow>

                  {!settings.is24Hours && (
                    <div className="space-y-2 mt-4 pt-4 border-t border-gray-50 dark:border-slate-800">
                      {DAYS.map(day => (
                        <div key={day} className="flex items-center gap-4 py-3 border-b border-gray-50 dark:border-slate-800 last:border-0">
                          <span className="w-28 text-sm font-medium text-gray-700 dark:text-slate-200">{DAY_LABELS[day]}</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              value={settings[`${day}Open` as keyof SiteSettings] as string || ''}
                              onChange={e => updateField(`${day}Open` as keyof SiteSettings, e.target.value)}
                              className="w-32 h-10 px-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 dark:focus:ring-1 dark:focus:ring-emerald-400/30"
                            />
                            <span className="text-gray-400 dark:text-slate-500">-</span>
                            <input
                              type="time"
                              value={settings[`${day}Close` as keyof SiteSettings] as string || ''}
                              onChange={e => updateField(`${day}Close` as keyof SiteSettings, e.target.value)}
                              className="w-32 h-10 px-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 dark:focus:ring-1 dark:focus:ring-emerald-400/30"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>
              </motion.div>
            )}

            {/* Booking Rules Tab */}
            {activeTab === 'booking' && (
              <motion.div
                key="booking"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <SectionCard
                  title="Booking Rules"
                  subtitle="Aturan dan batasan sistem booking"
                  accent="from-red-600 to-red-400"
                  icon={Calendar}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-5 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-slate-200">Min. Hari</span>
                      </div>
                      <DarkInput
                        type="number"
                        min="1"
                        value={settings.minAdvanceDays || 1}
                        onChange={e => updateField('minAdvanceDays', parseInt(e.target.value))}
                        className="text-center text-lg font-semibold"
                      />
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">Minimal booking H-n</p>
                    </div>
                    <div className="p-5 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-slate-200">Max. Hari</span>
                      </div>
                      <DarkInput
                        type="number"
                        min="1"
                        value={settings.maxAdvanceDays || 30}
                        onChange={e => updateField('maxAdvanceDays', parseInt(e.target.value))}
                        className="text-center text-lg font-semibold"
                      />
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">Maksimal booking H+n</p>
                    </div>
                    <div className="p-5 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-slate-200">Batal (jam)</span>
                      </div>
                      <DarkInput
                        type="number"
                        min="0"
                        value={settings.cancellationHours || 24}
                        onChange={e => updateField('cancellationHours', parseInt(e.target.value))}
                        className="text-center text-lg font-semibold"
                      />
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">Minimal jam sebelum batal</p>
                    </div>
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {/* Navigation Tab */}
            {activeTab === 'navigation' && (
              <motion.div
                key="navigation"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <SectionCard
                  title="Menu Links"
                  subtitle="Kelola tautan di navbar"
                  accent="from-violet-600 to-violet-400"
                  icon={Menu}
                >
                  <div className="space-y-3">
                    {(navSettings.navLinks || []).sort((a, b) => a.order - b.order).map((link, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 font-semibold text-sm">
                          {link.order}
                        </div>
                        <DarkInput
                          className="flex-1"
                          value={link.label}
                          onChange={(e) => {
                            const newLinks = [...(navSettings.navLinks || [])]
                            newLinks[index].label = e.target.value
                            setNavSettings({ ...navSettings, navLinks: newLinks })
                          }}
                          placeholder="Label"
                        />
                        <DarkInput
                          className="flex-1"
                          value={link.href}
                          onChange={(e) => {
                            const newLinks = [...(navSettings.navLinks || [])]
                            newLinks[index].href = e.target.value
                            setNavSettings({ ...navSettings, navLinks: newLinks })
                          }}
                          placeholder="/path"
                        />
                        <Toggle
                          checked={link.isActive}
                          onChange={(v) => {
                            const newLinks = [...(navSettings.navLinks || [])]
                            newLinks[index].isActive = v
                            setNavSettings({ ...navSettings, navLinks: newLinks })
                          }}
                        />
                        <button
                          onClick={() => {
                            const newLinks = (navSettings.navLinks || []).filter((_, i) => i !== index)
                            setNavSettings({ ...navSettings, navLinks: newLinks })
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newLink: NavLink = {
                          label: 'New Link',
                          href: '/new',
                          order: (navSettings.navLinks?.length || 0) + 1,
                          isActive: true,
                          isDropdown: false,
                        }
                        setNavSettings({ ...navSettings, navLinks: [...(navSettings.navLinks || []), newLink] })
                      }}
                      className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 dark:text-slate-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      Tambah Link
                    </button>
                  </div>
                </SectionCard>

                <SectionCard
                  title="CTA & Tampilan"
                  subtitle="Pengaturan tombol dan indikator aktif"
                  accent="from-cyan-600 to-cyan-400"
                  icon={Layout}
                >
                  <SettingRow
                    label="Tampilkan Tombol CTA"
                    description="Booking button di navbar"
                  >
                    <Toggle
                      checked={navSettings.showCtaButton || false}
                      onChange={(v) => setNavSettings({ ...navSettings, showCtaButton: v })}
                    />
                  </SettingRow>

                  {navSettings.showCtaButton && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-50">
                      <FormField label="CTA Button Text">
                        <DarkInput
                          value={navSettings.ctaButtonText || ''}
                          onChange={(e) => setNavSettings({ ...navSettings, ctaButtonText: e.target.value })}
                        />
                      </FormField>
                      <FormField label="CTA Button Link">
                        <DarkInput
                          value={navSettings.ctaButtonLink || ''}
                          onChange={(e) => setNavSettings({ ...navSettings, ctaButtonLink: e.target.value })}
                        />
                      </FormField>
                    </div>
                  )}

                  <SettingRow
                    label="Services Dropdown"
                    description="Tampilkan dropdown di menu Layanan"
                    className="mt-4 pt-4 border-t border-gray-50"
                  >
                    <Toggle
                      checked={navSettings.showServicesDropdown || false}
                      onChange={(v) => setNavSettings({ ...navSettings, showServicesDropdown: v })}
                    />
                  </SettingRow>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 pt-4 border-t border-gray-50">
                    <FormField label="Mobile Menu Style">
                      <DarkSelect
                        options={[
                          { value: 'slide', label: 'Slide' },
                          { value: 'full', label: 'Full Screen' },
                        ]}
                        value={navSettings.mobileMenuType || 'slide'}
                        onChange={(e) => setNavSettings({ ...navSettings, mobileMenuType: e.target.value })}
                        className="w-full"
                      />
                    </FormField>
                    <FormField label="Active Indicator">
                      <DarkSelect
                        options={[
                          { value: 'dot', label: 'Dot' },
                          { value: 'underline', label: 'Underline' },
                          { value: 'background', label: 'Background' },
                        ]}
                        value={navSettings.activeIndicatorStyle || 'dot'}
                        onChange={(e) => setNavSettings({ ...navSettings, activeIndicatorStyle: e.target.value })}
                        className="w-full"
                      />
                    </FormField>
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {/* Homepage Tab */}
            {activeTab === 'homepage' && (
              <motion.div
                key="homepage"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <SectionCard
                  title="Hero Section"
                  subtitle="Kelola konten hero di homepage"
                  accent="from-blue-600 to-blue-400"
                  icon={Home}
                >
                  <div className="space-y-5">
                    <FormField label="Badge Text" description="Text yang muncul di badge atas hero">
                      <DarkInput
                        value={homepageSettings.heroBadge || ''}
                        onChange={(e) => setHomepageSettings({...homepageSettings, heroBadge: e.target.value})}
                        placeholder="Dipercaya 1250+ Pelanggan"
                      />
                    </FormField>
                    <FormField label="Headline">
                      <DarkInput
                        value={homepageSettings.heroHeadline || ''}
                        onChange={(e) => setHomepageSettings({...homepageSettings, heroHeadline: e.target.value})}
                        placeholder="Transformasi Rumah Anda"
                      />
                    </FormField>
                    <FormField label="Subheadline">
                      <Textarea
                        value={homepageSettings.heroSubheadline || ''}
                        onChange={(e) => setHomepageSettings({...homepageSettings, heroSubheadline: e.target.value})}
                        rows={3}
                        placeholder="Layanan kebersihan profesional..."
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 dark:focus:ring-1 dark:focus:ring-emerald-400/30 transition-all resize-none"
                      />
                    </FormField>
                    <FormField label="Hero Image URL">
                      <DarkInput
                        value={homepageSettings.heroImage || ''}
                        onChange={(e) => setHomepageSettings({...homepageSettings, heroImage: e.target.value})}
                        placeholder="https://..."
                      />
                    </FormField>
                  </div>
                </SectionCard>

                <SectionCard
                  title="CTA Buttons"
                  subtitle="Teks untuk tombol hero"
                  accent="from-emerald-600 to-emerald-400"
                  icon={Layout}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField label="Primary Button Text">
                      <DarkInput
                        value={homepageSettings.ctaPrimaryText || ''}
                        onChange={(e) => setHomepageSettings({...homepageSettings, ctaPrimaryText: e.target.value})}
                        placeholder="Booking Sekarang"
                      />
                    </FormField>
                    <FormField label="Primary Button Link">
                      <DarkInput
                        value={homepageSettings.ctaPrimaryLink || ''}
                        onChange={(e) => setHomepageSettings({...homepageSettings, ctaPrimaryLink: e.target.value})}
                        placeholder="/booking"
                      />
                    </FormField>
                    <FormField label="Secondary Button Text">
                      <DarkInput
                        value={homepageSettings.ctaSecondaryText || ''}
                        onChange={(e) => setHomepageSettings({...homepageSettings, ctaSecondaryText: e.target.value})}
                        placeholder="Lihat Layanan & Paket"
                      />
                    </FormField>
                    <FormField label="Secondary Button Link">
                      <DarkInput
                        value={homepageSettings.ctaSecondaryLink || ''}
                        onChange={(e) => setHomepageSettings({...homepageSettings, ctaSecondaryLink: e.target.value})}
                        placeholder="/services"
                      />
                    </FormField>
                  </div>
                </SectionCard>

                <SectionCard
                  title="Hero Stats"
                  subtitle="Angka statistik yang ditampilkan di hero"
                  accent="from-amber-600 to-amber-400"
                  icon={Hash}
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <FormField label="Homes Cleaned">
                      <DarkInput
                        value={homepageSettings.statsHomesCleaned || ''}
                        onChange={(e) => setHomepageSettings({...homepageSettings, statsHomesCleaned: e.target.value})}
                        placeholder="1250+"
                      />
                    </FormField>
                    <FormField label="Rating">
                      <DarkInput
                        value={homepageSettings.statsRating || ''}
                        onChange={(e) => setHomepageSettings({...homepageSettings, statsRating: e.target.value})}
                        placeholder="4.95"
                      />
                    </FormField>
                    <FormField label="Satisfaction">
                      <DarkInput
                        value={homepageSettings.statsSatisfaction || ''}
                        onChange={(e) => setHomepageSettings({...homepageSettings, statsSatisfaction: e.target.value})}
                        placeholder="99%"
                      />
                    </FormField>
                    <FormField label="Response Time">
                      <DarkInput
                        value={homepageSettings.statsResponseTime || ''}
                        onChange={(e) => setHomepageSettings({...homepageSettings, statsResponseTime: e.target.value})}
                        placeholder="< 30m"
                      />
                    </FormField>
                  </div>
                </SectionCard>

                <SectionCard
                  title="Section Visibility"
                  subtitle="Pilih section yang ditampilkan di homepage"
                  accent="from-gray-600 to-gray-400"
                  icon={Layout}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'showFeaturesSection', label: 'Features Section' },
                      { key: 'showServicesSection', label: 'Services Section' },
                      { key: 'showImageShowcase', label: 'Image Showcase' },
                      { key: 'showCTASection', label: 'CTA Section' },
                      { key: 'showTestimonialsSection', label: 'Testimonials Section' },
                      { key: 'showAreasSection', label: 'Areas Section' },
                      { key: 'showBlogSection', label: 'Blog Section' },
                    ].map(item => (
                      <SettingRow key={item.key} label={item.label}>
                        <Toggle
                          checked={(homepageSettings as any)[item.key] !== false}
                          onChange={(v) => setHomepageSettings({...homepageSettings, [item.key]: v})}
                        />
                      </SettingRow>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="Before/After Slides"
                  subtitle="Gambar untuk slider perbandingan di hero"
                  accent="from-pink-600 to-pink-400"
                  icon={Image}
                >
                  <div className="space-y-4">
                    {(homepageSettings.beforeAfterSlides || []).map((slide, index) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-slate-200">Slide {index + 1}</span>
                          <button
                            onClick={() => {
                              const newSlides = [...(homepageSettings.beforeAfterSlides || [])]
                              newSlides.splice(index, 1)
                              setHomepageSettings({...homepageSettings, beforeAfterSlides: newSlides})
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                        <DarkInput
                          value={slide.title}
                          onChange={(e) => {
                            const newSlides = [...(homepageSettings.beforeAfterSlides || [])]
                            newSlides[index] = {...slide, title: e.target.value}
                            setHomepageSettings({...homepageSettings, beforeAfterSlides: newSlides})
                          }}
                          placeholder="Slide title"
                        />
                        <DarkInput
                          value={slide.before}
                          onChange={(e) => {
                            const newSlides = [...(homepageSettings.beforeAfterSlides || [])]
                            newSlides[index] = {...slide, before: e.target.value}
                            setHomepageSettings({...homepageSettings, beforeAfterSlides: newSlides})
                          }}
                          placeholder="Before image URL"
                        />
                        <DarkInput
                          value={slide.after}
                          onChange={(e) => {
                            const newSlides = [...(homepageSettings.beforeAfterSlides || [])]
                            newSlides[index] = {...slide, after: e.target.value}
                            setHomepageSettings({...homepageSettings, beforeAfterSlides: newSlides})
                          }}
                          placeholder="After image URL"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newSlide: BeforeAfterSlide = { before: '', after: '', title: 'New Slide' }
                        setHomepageSettings({...homepageSettings, beforeAfterSlides: [...(homepageSettings.beforeAfterSlides || []), newSlide]})
                      }}
                      className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 dark:text-slate-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      Tambah Slide
                    </button>
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* WhatsApp */}
                <SectionCard
                  title="WhatsApp"
                  subtitle="Notifikasi via WhatsApp"
                  accent="from-green-600 to-green-400"
                  icon={MessageSquare}
                >
                  <SettingRow
                    label="Enable WhatsApp"
                    description="Kirim notifikasi via WhatsApp"
                  >
                    <Toggle
                      checked={notificationSettings.whatsappEnabled}
                      onChange={(v) => updateNotifField('whatsappEnabled', v)}
                    />
                  </SettingRow>

                  {notificationSettings.whatsappEnabled && (
                    <div className="space-y-5 mt-4 pt-4 border-t border-gray-50">
                      <FormField label="Nomor WhatsApp" description="Format: kode negara + nomor">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-sm">+</span>
                          <DarkInput
                            className="pl-8"
                            value={notificationSettings.whatsappNumber || ''}
                            onChange={e => updateNotifField('whatsappNumber', e.target.value)}
                            placeholder="6281234567890"
                          />
                        </div>
                      </FormField>
                      <FormField label="Template Pesan" description="Variabel: {orderNumber}, {customerName}, {serviceName}, dll">
                        <Textarea
                          value={notificationSettings.whatsappMessage || ''}
                          onChange={e => updateNotifField('whatsappMessage', e.target.value)}
                          rows={5}
                          className="w-full font-mono text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 dark:focus:ring-1 dark:focus:ring-emerald-400/30 resize-none"
                        />
                      </FormField>
                    </div>
                  )}
                </SectionCard>

                {/* Twilio */}
                <SectionCard
                  title="Twilio API"
                  subtitle="WhatsApp Business API"
                  accent="from-purple-600 to-purple-400"
                  icon={Smartphone}
                >
                  {notificationSettings.hasTwilio && (
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Connected
                      </span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField label="Account SID">
                      <DarkInput
                        value={notificationSettings.twilioAccountSid || ''}
                        onChange={e => updateNotifField('twilioAccountSid', e.target.value)}
                        placeholder="ACxxxxxxxx..."
                      />
                    </FormField>
                    <FormField label="Auth Token" description="Isi hanya jika ingin mengubah">
                      <DarkInput
                        type="password"
                        value={notificationSettings.twilioAuthToken || ''}
                        onChange={e => updateNotifField('twilioAuthToken', e.target.value)}
                        placeholder="••••••••"
                      />
                    </FormField>
                    <FormField label="WhatsApp From Number">
                      <DarkInput
                        value={notificationSettings.twilioFromNumber || ''}
                        onChange={e => updateNotifField('twilioFromNumber', e.target.value)}
                        placeholder="+14155238886"
                      />
                    </FormField>
                  </div>
                </SectionCard>

                {/* Email */}
                <SectionCard
                  title="Email"
                  subtitle="Notifikasi via Email"
                  accent="from-blue-600 to-blue-400"
                  icon={Mail}
                >
                  <SettingRow
                    label="Enable Email"
                    description="Kirim notifikasi via Email"
                  >
                    <Toggle
                      checked={notificationSettings.emailEnabled}
                      onChange={(v) => updateNotifField('emailEnabled', v)}
                    />
                  </SettingRow>

                  {notificationSettings.emailEnabled && (
                    <div className="space-y-5 mt-4 pt-4 border-t border-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField label="SMTP Host">
                          <DarkInput
                            value={notificationSettings.emailHost || ''}
                            onChange={e => updateNotifField('emailHost', e.target.value)}
                            placeholder="smtp.gmail.com"
                          />
                        </FormField>
                        <FormField label="SMTP Port">
                          <DarkInput
                            type="number"
                            value={notificationSettings.emailPort || 587}
                            onChange={e => updateNotifField('emailPort', parseInt(e.target.value))}
                            placeholder="587"
                          />
                        </FormField>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField label="Email Username">
                          <DarkInput
                            value={notificationSettings.emailUser || ''}
                            onChange={e => updateNotifField('emailUser', e.target.value)}
                            placeholder="your@email.com"
                          />
                        </FormField>
                        <FormField label="Email Password" description={notificationSettings.hasPassword ? "Isi baru jika ingin mengubah" : ""}>
                          <DarkInput
                            type="password"
                            value={notificationSettings.emailPassword || ''}
                            onChange={e => updateNotifField('emailPassword', e.target.value)}
                            placeholder={notificationSettings.hasPassword ? "••••••••" : "App password"}
                          />
                        </FormField>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField label="From Name">
                          <DarkInput
                            value={notificationSettings.emailFrom || ''}
                            onChange={e => updateNotifField('emailFrom', e.target.value)}
                            placeholder="NingClean <hello@ningclean.com>"
                          />
                        </FormField>
                        <FormField label="Admin Email" description="Email untuk menerima notifikasi">
                          <DarkInput
                            type="email"
                            value={notificationSettings.adminEmail || ''}
                            onChange={e => updateNotifField('adminEmail', e.target.value)}
                            placeholder="admin@ningclean.com"
                          />
                        </FormField>
                      </div>
                    </div>
                  )}
                </SectionCard>
              </motion.div>
            )}

            {/* Personal Tab */}
            {activeTab === 'personal' && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <SectionCard
                  title="Tampilan"
                  subtitle="Pengaturan tema dan tampilan dashboard"
                  accent="from-purple-600 to-purple-400"
                  icon={Palette}
                >
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-3">
                        Tema
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setTheme('light')}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                            theme === 'light'
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                              : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <Sun className="h-6 w-6 text-amber-500" />
                          <span className="text-xs font-medium text-gray-700 dark:text-slate-200">Light</span>
                        </button>
                        <button
                          onClick={() => setTheme('dark')}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                            theme === 'dark'
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                              : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <Moon className="h-6 w-6 text-purple-500" />
                          <span className="text-xs font-medium text-gray-700 dark:text-slate-200">Dark</span>
                        </button>
                        <button
                          onClick={() => setTheme('system')}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                            theme === 'system'
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                              : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <Monitor className="h-6 w-6 text-blue-500" />
                          <span className="text-xs font-medium text-gray-700 dark:text-slate-200">System</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard
                  title="Preferensi Dashboard"
                  subtitle="Pengaturan tampilan dan perilaku dashboard"
                  accent="from-blue-600 to-blue-400"
                  icon={Layout}
                >
                  <div className="space-y-0">
                    <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-slate-800">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-slate-200">Compact View</p>
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Tampilkan lebih banyak data per halaman</p>
                      </div>
                      <Toggle
                        checked={preferences.compactView}
                        onChange={(v) => updatePreference('compactView', v)}
                      />
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-slate-800">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-slate-200">Show Live Indicator</p>
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Tampilkan indikator live di header</p>
                      </div>
                      <Toggle
                        checked={preferences.showLiveIndicator}
                        onChange={(v) => updatePreference('showLiveIndicator', v)}
                      />
                    </div>

                    <div className="flex items-center justify-between py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-slate-200">Auto Refresh</p>
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Refresh data secara otomatis</p>
                      </div>
                      <Toggle
                        checked={preferences.autoRefresh}
                        onChange={(v) => updatePreference('autoRefresh', v)}
                      />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard
                  title="Info"
                  subtitle="Tentang preferensi Anda"
                  accent="from-gray-600 to-gray-400"
                  icon={User}
                >
                  <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-slate-200">Preferensi Tersimpan</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Preferensi Anda disimpan di browser ini saja dan tidak dibagikan ke admin lain.
                      </p>
                    </div>
                  </div>
                </SectionCard>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
