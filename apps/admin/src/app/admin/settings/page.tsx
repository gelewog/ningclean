'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, Globe, Mail, Phone, MapPin, Clock, Share2, 
  FileText, Search, Save, RefreshCw, Bell, CheckCircle, ExternalLink,
  Instagram, Facebook, Twitter, Youtube, Linkedin, AlertCircle,
  Calendar, DollarSign, Globe2, MessageSquare, Menu, ArrowUpDown, Home, Image, Link2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getSiteSettings, updateSiteSettings, getNotificationSettings, updateNotificationSettings, getNavigationSettings, updateNavigationSettings, getHomepageSettings, updateHomepageSettings, getFooterSettings, updateFooterSettings, SiteSettings, NavigationSettings, NavLink, HomepageSettings, BeforeAfterSlide, FooterSettings, FooterColumn, SocialLink } from '@/lib/api'
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

// Toggle Switch Component - defined outside to prevent re-mounting
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
    </label>
  )
}

// Section Header Component - defined outside to prevent re-mounting
function SectionHeader({ icon: Icon, title, subtitle, badge, badgeColor = 'bg-emerald-100 text-emerald-700' }: { icon: any; title: string; subtitle: string; badge?: string; badgeColor?: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-100">
        <Icon className="h-5 w-5 text-gray-700" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {badge && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeColor || 'bg-emerald-100 text-emerald-700'}`}>
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  )
}

// Form Field Component - defined outside to prevent re-mounting
function FormField({ label, children, description }: { label: string; children: React.ReactNode; description?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {description && <p className="text-xs text-gray-400">{description}</p>}
    </div>
  )
}

export default function SettingsPage() {
  const [settings, setSettings] = React.useState<Partial<SiteSettings>>({})
  const [notificationSettings, setNotificationSettings] = React.useState<Record<string, any>>({
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
  })
  const [navSettings, setNavSettings] = React.useState<Partial<NavigationSettings>>({
    navLinks: [],
    showServicesDropdown: true,
    servicesDropdownLabel: 'Layanan',
    ctaButtonText: 'Booking',
    ctaButtonLink: '/booking',
    showCtaButton: true,
    mobileMenuType: 'slide',
    activeIndicatorStyle: 'dot',
  })
  const [homepageSettings, setHomepageSettings] = React.useState<Partial<HomepageSettings>>({
    heroHeadline: '',
    heroSubheadline: '',
    heroBadge: '',
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
  })
  const [footerSettings, setFooterSettings] = React.useState<Partial<FooterSettings>>({
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
  })
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('company')

  React.useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const siteData = await getSiteSettings()
      if (siteData) {
        setSettings(siteData)
      }
      
      const notifData = await getNotificationSettings()
      if (notifData) {
        setNotificationSettings(notifData)
      }
      
      const navData = await getNavigationSettings()
      if (navData) {
        setNavSettings(navData)
      }
      
      const homeData = await getHomepageSettings()
      if (homeData) {
        setHomepageSettings(homeData)
      }
      
      const footerData = await getFooterSettings()
      if (footerData) {
        setFooterSettings(footerData)
      }
    } catch (error) {
      toast.error('Gagal memuat settings')
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSiteSettings(settings)
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
      await updateNavigationSettings(navSettings)
      await updateHomepageSettings(homepageSettings)
      await updateFooterSettings(footerSettings)
      toast.success('Settings berhasil disimpan')
    } catch (error) {
      toast.error('Gagal menyimpan settings')
    }
    setSaving(false)
  }

  const updateField = (field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const updateNotifField = (field: string, value: any) => {
    setNotificationSettings((prev: Record<string, any>) => ({ ...prev, [field]: value }))
  }

  const tabs = [
    { id: 'company', label: 'Perusahaan', icon: Building2 },
    { id: 'contact', label: 'Kontak', icon: Phone },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'footer', label: 'Footer', icon: FileText },
    { id: 'hours', label: 'Jam Operasional', icon: Clock },
    { id: 'booking', label: 'Booking Rules', icon: Calendar },
    { id: 'navigation', label: 'Navigation', icon: Menu },
    { id: 'homepage', label: 'Homepage', icon: Home },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Kelola pengaturan website</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={loadSettings}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
            {saving ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Simpan Changes
          </Button>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 shrink-0">
          <Card className="overflow-hidden">
            <CardContent className="p-2">
              <nav className="space-y-1">
                {tabs.map(tab => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500" />
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Company Tab */}
              {activeTab === 'company' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={Building2} title="Informasi Perusahaan" subtitle="Identitas dan informasi dasar perusahaan" />
                      <div className="space-y-5">
                        <FormField label="Nama Perusahaan">
                          <Input value={settings.companyName || ''} onChange={e => updateField('companyName', e.target.value)} placeholder="NingClean" className="h-11" />
                        </FormField>
                        <FormField label="Tagline">
                          <Input value={settings.tagline || ''} onChange={e => updateField('tagline', e.target.value)} placeholder="Layanan Kebersihan Profesional" className="h-11" />
                        </FormField>
                        <FormField label="Deskripsi">
                          <Textarea value={settings.description || ''} onChange={e => updateField('description', e.target.value)} placeholder="Deskripsi singkat tentang perusahaan..." rows={4} />
                        </FormField>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={Globe2} title="Branding" subtitle="Logo dan identitas visual website" />
                      <div className="space-y-5">
                        <FormField label="Logo URL" description="Upload ke Supabase Storage dan paste URL">
                          <Input value={settings.logo || ''} onChange={e => updateField('logo', e.target.value)} placeholder="https://storage.supabase.co/..." className="h-11" />
                        </FormField>
                        <FormField label="Logo Dark Mode URL">
                          <Input value={settings.logoDark || ''} onChange={e => updateField('logoDark', e.target.value)} placeholder="https://storage.supabase.co/..." className="h-11" />
                        </FormField>
                        <FormField label="Favicon URL">
                          <Input value={settings.favicon || ''} onChange={e => updateField('favicon', e.target.value)} placeholder="https://storage.supabase.co/.../favicon.ico" className="h-11" />
                        </FormField>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={Mail} title="Informasi Kontak" subtitle="Cara pelanggan menghubungi perusahaan" />
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FormField label="Email">
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input type="email" value={settings.email || ''} onChange={e => updateField('email', e.target.value)} placeholder="hello@ningclean.com" className="h-11 pl-10" />
                            </div>
                          </FormField>
                          <FormField label="Telepon">
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input value={settings.phone || ''} onChange={e => updateField('phone', e.target.value)} placeholder="021-1234567" className="h-11 pl-10" />
                            </div>
                          </FormField>
                        </div>
                        <FormField label="WhatsApp" description="Format: kode negara + nomor (contoh: 6281234567890)">
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input value={settings.whatsapp || ''} onChange={e => updateField('whatsapp', e.target.value)} placeholder="6281234567890" className="h-11 pl-10" />
                          </div>
                        </FormField>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={MapPin} title="Alamat" subtitle="Lokasi fisik perusahaan" />
                      <div className="space-y-5">
                        <FormField label="Alamat Lengkap">
                          <Textarea value={settings.address || ''} onChange={e => updateField('address', e.target.value)} placeholder="Jl. Raya清洁 No. 123..." rows={3} />
                        </FormField>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          <FormField label="Kota">
                            <Input value={settings.city || ''} onChange={e => updateField('city', e.target.value)} placeholder="Jakarta Selatan" className="h-11" />
                          </FormField>
                          <FormField label="Provinsi">
                            <Input value={settings.province || ''} onChange={e => updateField('province', e.target.value)} placeholder="DKI Jakarta" className="h-11" />
                          </FormField>
                          <FormField label="Kode Pos">
                            <Input value={settings.postalCode || ''} onChange={e => updateField('postalCode', e.target.value)} placeholder="12345" className="h-11" />
                          </FormField>
                        </div>
                        <FormField label="Google Maps URL">
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input value={settings.googleMapsUrl || ''} onChange={e => updateField('googleMapsUrl', e.target.value)} placeholder="https://maps.google.com/..." className="h-11 pl-10" />
                          </div>
                        </FormField>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Social Tab */}
              {activeTab === 'social' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={Share2} title="Social Media" subtitle="Link ke akun media sosial perusahaan" />
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FormField label="Facebook">
                            <div className="relative">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600"><Facebook className="h-4 w-4" /></div>
                              <Input value={settings.facebook || ''} onChange={e => updateField('facebook', e.target.value)} placeholder="https://facebook.com/..." className="h-11 pl-10" />
                            </div>
                          </FormField>
                          <FormField label="Instagram">
                            <div className="relative">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-600"><Instagram className="h-4 w-4" /></div>
                              <Input value={settings.instagram || ''} onChange={e => updateField('instagram', e.target.value)} placeholder="https://instagram.com/..." className="h-11 pl-10" />
                            </div>
                          </FormField>
                          <FormField label="Twitter / X">
                            <div className="relative">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-800"><Twitter className="h-4 w-4" /></div>
                              <Input value={settings.twitter || ''} onChange={e => updateField('twitter', e.target.value)} placeholder="https://twitter.com/..." className="h-11 pl-10" />
                            </div>
                          </FormField>
                          <FormField label="YouTube">
                            <div className="relative">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-600"><Youtube className="h-4 w-4" /></div>
                              <Input value={settings.youtube || ''} onChange={e => updateField('youtube', e.target.value)} placeholder="https://youtube.com/..." className="h-11 pl-10" />
                            </div>
                          </FormField>
                          <FormField label="LinkedIn">
                            <div className="relative">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-700"><Linkedin className="h-4 w-4" /></div>
                              <Input value={settings.linkedin || ''} onChange={e => updateField('linkedin', e.target.value)} placeholder="https://linkedin.com/..." className="h-11 pl-10" />
                            </div>
                          </FormField>
                          <FormField label="TikTok">
                            <div className="relative">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-800"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.75a4.85 4.85 0 01-1-.06z"/></svg></div>
                              <Input value={settings.tiktok || ''} onChange={e => updateField('tiktok', e.target.value)} placeholder="https://tiktok.com/@..." className="h-11 pl-10" />
                            </div>
                          </FormField>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={Search} title="SEO Settings" subtitle="Optimasi untuk search engine" badge="Penting" badgeColor="bg-amber-100 text-amber-700" />
                      <div className="space-y-5">
                        <FormField label="Meta Title" description="Title yang muncul di search engine (max 60 karakter)">
                          <Input value={settings.metaTitle || ''} onChange={e => updateField('metaTitle', e.target.value)} placeholder="NingClean - Layanan Kebersihan Profesional" className="h-11" />
                        </FormField>
                        <FormField label="Meta Description" description="Description yang muncul di search engine (max 160 karakter)">
                          <Textarea value={settings.metaDescription || ''} onChange={e => updateField('metaDescription', e.target.value)} placeholder="Deskripsi website untuk search engine..." rows={3} />
                        </FormField>
                        <FormField label="Keywords" description="Pisahkan dengan koma">
                          <Input value={settings.keywords || ''} onChange={e => updateField('keywords', e.target.value)} placeholder="cleaning service, jasa bersih, cuci ac" className="h-11" />
                        </FormField>
                        <FormField label="OG Image URL" description="Image untuk social media sharing (disarankan 1200x630)">
                          <Input value={settings.ogImage || ''} onChange={e => updateField('ogImage', e.target.value)} placeholder="https://storage.supabase.co/.../og-image.png" className="h-11" />
                        </FormField>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Footer Tab */}
              {activeTab === 'footer' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={FileText} title="Footer" subtitle="Teks dan informasi di bagian bawah website" />
                      <div className="space-y-5">
                        <FormField label="Footer Text">
                          <Textarea value={settings.footerText || ''} onChange={e => updateField('footerText', e.target.value)} placeholder="Teks tambahan di footer..." rows={3} />
                        </FormField>
                        <FormField label="Copyright Text">
                          <Input value={settings.copyrightText || ''} onChange={e => updateField('copyrightText', e.target.value)} placeholder="© 2024 NingClean. All rights reserved." className="h-11" />
                        </FormField>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Hours Tab */}
              {activeTab === 'hours' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={Clock} title="Jam Operasional" subtitle="Waktu layanan perusahaan" />
                      <div className="mb-6 flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <Toggle checked={settings.is24Hours || false} onChange={(v) => updateField('is24Hours', v)} />
                        <span className="text-sm font-medium text-gray-700">Buka 24 Jam</span>
                      </div>
                      
                      {!settings.is24Hours && (
                        <div className="space-y-3">
                          {DAYS.map(day => (
                            <div key={day} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                              <span className="w-28 text-sm font-medium text-gray-700">{DAY_LABELS[day]}</span>
                              <div className="flex items-center gap-2">
                                <Input type="time" value={settings[`${day}Open` as keyof SiteSettings] as string || ''} onChange={e => updateField(`${day}Open` as keyof SiteSettings, e.target.value)} className="w-32 h-10" />
                                <span className="text-gray-400">-</span>
                                <Input type="time" value={settings[`${day}Close` as keyof SiteSettings] as string || ''} onChange={e => updateField(`${day}Close` as keyof SiteSettings, e.target.value)} className="w-32 h-10" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Booking Rules Tab */}
              {activeTab === 'booking' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={Calendar} title="Booking Rules" subtitle="Aturan dan batasan sistem booking" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Min. Hari Sebelumnya</span>
                          </div>
                          <Input type="number" min="1" value={settings.minAdvanceDays || 1} onChange={e => updateField('minAdvanceDays', parseInt(e.target.value))} className="h-11 text-center text-lg font-semibold" />
                          <p className="text-xs text-gray-400 mt-2">Minimal booking H-n</p>
                        </div>
                        <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Max. Hari Sebelumnya</span>
                          </div>
                          <Input type="number" min="1" value={settings.maxAdvanceDays || 30} onChange={e => updateField('maxAdvanceDays', parseInt(e.target.value))} className="h-11 text-center text-lg font-semibold" />
                          <p className="text-xs text-gray-400 mt-2">Maksimal booking H+n</p>
                        </div>
                        <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Jam Sebelum Batal</span>
                          </div>
                          <Input type="number" min="0" value={settings.cancellationHours || 24} onChange={e => updateField('cancellationHours', parseInt(e.target.value))} className="h-11 text-center text-lg font-semibold" />
                          <p className="text-xs text-gray-400 mt-2">Minimal jam sebelum bisa dibatalkan</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Navigation Tab */}
              {activeTab === 'navigation' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Nav Links */}
                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={Menu} title="Menu Links" subtitle="Kelola tautan di navbar" />
                      
                      <div className="space-y-3">
                        {(navSettings.navLinks || []).sort((a, b) => a.order - b.order).map((link, index) => (
                          <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 font-semibold text-sm">
                              {link.order}
                            </div>
                            <Input 
                              className="flex-1 h-11" 
                              value={link.label} 
                              onChange={(e) => {
                                const newLinks = [...(navSettings.navLinks || [])]
                                newLinks[index].label = e.target.value
                                setNavSettings({ ...navSettings, navLinks: newLinks })
                              }}
                              placeholder="Label" 
                            />
                            <Input 
                              className="flex-1 h-11" 
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
                          className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                          Tambah Link
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* CTA & Settings */}
                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={Calendar} title="CTA & Tampilan" subtitle="Pengaturan tombol dan indikator aktif" />
                      
                      <div className="space-y-5">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-700">Tampilkan Tombol CTA</p>
                            <p className="text-sm text-gray-500">Booking button di navbar</p>
                          </div>
                          <Toggle checked={navSettings.showCtaButton || false} onChange={(v) => setNavSettings({ ...navSettings, showCtaButton: v })} />
                        </div>
                        
                        {navSettings.showCtaButton && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormField label="CTA Button Text">
                              <Input value={navSettings.ctaButtonText || ''} onChange={(e) => setNavSettings({ ...navSettings, ctaButtonText: e.target.value })} className="h-11" />
                            </FormField>
                            <FormField label="CTA Button Link">
                              <Input value={navSettings.ctaButtonLink || ''} onChange={(e) => setNavSettings({ ...navSettings, ctaButtonLink: e.target.value })} className="h-11" />
                            </FormField>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-700">Services Dropdown</p>
                            <p className="text-sm text-gray-500">Tampilkan dropdown di menu Layanan</p>
                          </div>
                          <Toggle checked={navSettings.showServicesDropdown || false} onChange={(v) => setNavSettings({ ...navSettings, showServicesDropdown: v })} />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm font-medium text-gray-700 mb-3">Mobile Menu Style</p>
                            <div className="flex gap-2">
                              {['slide', 'full'].map(type => (
                                <button
                                  key={type}
                                  onClick={() => setNavSettings({ ...navSettings, mobileMenuType: type })}
                                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${navSettings.mobileMenuType === type ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}
                                >
                                  {type === 'slide' ? 'Slide' : 'Full'}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm font-medium text-gray-700 mb-3">Active Indicator</p>
                            <div className="flex gap-2">
                              {['dot', 'underline', 'background'].map(style => (
                                <button
                                  key={style}
                                  onClick={() => setNavSettings({ ...navSettings, activeIndicatorStyle: style })}
                                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${navSettings.activeIndicatorStyle === style ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}
                                >
                                  {style === 'dot' ? 'Dot' : style === 'underline' ? 'Under' : 'Bg'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Homepage Tab */}
              {activeTab === 'homepage' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Hero Section */}
                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={Home} title="Hero Section" subtitle="Kelola konten hero di homepage" />
                      <div className="space-y-5">
                        <FormField label="Badge Text" description="Text yang muncul di badge atas hero">
                          <Input value={homepageSettings.heroBadge || ''} onChange={(e) => setHomepageSettings({...homepageSettings, heroBadge: e.target.value})} className="h-11" placeholder="Dipercaya 1250+ Pelanggan" />
                        </FormField>
                        <FormField label="Headline">
                          <Input value={homepageSettings.heroHeadline || ''} onChange={(e) => setHomepageSettings({...homepageSettings, heroHeadline: e.target.value})} className="h-11" placeholder="Transformasi Rumah Anda" />
                        </FormField>
                        <FormField label="Subheadline">
                          <Textarea value={homepageSettings.heroSubheadline || ''} onChange={(e) => setHomepageSettings({...homepageSettings, heroSubheadline: e.target.value})} rows={3} placeholder="Layanan kebersihan profesional..." />
                        </FormField>
                        <FormField label="Hero Image URL">
                          <Input value={homepageSettings.heroImage || ''} onChange={(e) => setHomepageSettings({...homepageSettings, heroImage: e.target.value})} className="h-11" placeholder="https://..." />
                        </FormField>
                      </div>
                    </CardContent>
                  </Card>

                  {/* CTA Buttons */}
                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={Home} title="CTA Buttons" subtitle="Teks untuk tombol hero" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField label="Primary Button Text">
                          <Input value={homepageSettings.ctaPrimaryText || ''} onChange={(e) => setHomepageSettings({...homepageSettings, ctaPrimaryText: e.target.value})} className="h-11" placeholder="Booking Sekarang" />
                        </FormField>
                        <FormField label="Primary Button Link">
                          <Input value={homepageSettings.ctaPrimaryLink || ''} onChange={(e) => setHomepageSettings({...homepageSettings, ctaPrimaryLink: e.target.value})} className="h-11" placeholder="/booking" />
                        </FormField>
                        <FormField label="Secondary Button Text">
                          <Input value={homepageSettings.ctaSecondaryText || ''} onChange={(e) => setHomepageSettings({...homepageSettings, ctaSecondaryText: e.target.value})} className="h-11" placeholder="Lihat Layanan & Paket" />
                        </FormField>
                        <FormField label="Secondary Button Link">
                          <Input value={homepageSettings.ctaSecondaryLink || ''} onChange={(e) => setHomepageSettings({...homepageSettings, ctaSecondaryLink: e.target.value})} className="h-11" placeholder="/services" />
                        </FormField>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stats */}
                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={DollarSign} title="Hero Stats" subtitle="Angka statistik yang ditampilkan di hero" />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        <FormField label="Homes Cleaned">
                          <Input value={homepageSettings.statsHomesCleaned || ''} onChange={(e) => setHomepageSettings({...homepageSettings, statsHomesCleaned: e.target.value})} className="h-11" placeholder="1250+" />
                        </FormField>
                        <FormField label="Rating">
                          <Input value={homepageSettings.statsRating || ''} onChange={(e) => setHomepageSettings({...homepageSettings, statsRating: e.target.value})} className="h-11" placeholder="4.95" />
                        </FormField>
                        <FormField label="Satisfaction">
                          <Input value={homepageSettings.statsSatisfaction || ''} onChange={(e) => setHomepageSettings({...homepageSettings, statsSatisfaction: e.target.value})} className="h-11" placeholder="99%" />
                        </FormField>
                        <FormField label="Response Time">
                          <Input value={homepageSettings.statsResponseTime || ''} onChange={(e) => setHomepageSettings({...homepageSettings, statsResponseTime: e.target.value})} className="h-11" placeholder="< 30m" />
                        </FormField>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section Visibility */}
                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={Calendar} title="Section Visibility" subtitle="Pilih section yang ditampilkan di homepage" />
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
                          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                            <Toggle 
                              checked={(homepageSettings as any)[item.key] !== false} 
                              onChange={(v) => setHomepageSettings({...homepageSettings, [item.key]: v})} 
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Before/After Slides */}
                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={Image} title="Before/After Slides" subtitle="Gambar untuk slider perbandingan di hero" />
                      <div className="space-y-4">
                        {(homepageSettings.beforeAfterSlides || []).map((slide, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">Slide {index + 1}</span>
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
                            <Input 
                              value={slide.title} 
                              onChange={(e) => {
                                const newSlides = [...(homepageSettings.beforeAfterSlides || [])]
                                newSlides[index] = {...slide, title: e.target.value}
                                setHomepageSettings({...homepageSettings, beforeAfterSlides: newSlides})
                              }}
                              placeholder="Slide title"
                              className="h-10"
                            />
                            <Input 
                              value={slide.before} 
                              onChange={(e) => {
                                const newSlides = [...(homepageSettings.beforeAfterSlides || [])]
                                newSlides[index] = {...slide, before: e.target.value}
                                setHomepageSettings({...homepageSettings, beforeAfterSlides: newSlides})
                              }}
                              placeholder="Before image URL"
                              className="h-10"
                            />
                            <Input 
                              value={slide.after} 
                              onChange={(e) => {
                                const newSlides = [...(homepageSettings.beforeAfterSlides || [])]
                                newSlides[index] = {...slide, after: e.target.value}
                                setHomepageSettings({...homepageSettings, beforeAfterSlides: newSlides})
                              }}
                              placeholder="After image URL"
                              className="h-10"
                            />
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newSlide: BeforeAfterSlide = { before: '', after: '', title: 'New Slide' }
                            setHomepageSettings({...homepageSettings, beforeAfterSlides: [...(homepageSettings.beforeAfterSlides || []), newSlide]})
                          }}
                          className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                          Tambah Slide
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Footer Tab */}
              {activeTab === 'footer' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Contact Info */}
                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={Phone} title="Contact Info" subtitle="Kontak yang ditampilkan di footer" />
                      <div className="space-y-5">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-700">Tampilkan Contact</p>
                            <p className="text-sm text-gray-500">Email, telepon, WhatsApp, alamat</p>
                          </div>
                          <Toggle checked={footerSettings.showContact !== false} onChange={(v) => setFooterSettings({...footerSettings, showContact: v})} />
                        </div>
                        {footerSettings.showContact !== false && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormField label="Email">
                              <Input value={footerSettings.contactEmail || ''} onChange={(e) => setFooterSettings({...footerSettings, contactEmail: e.target.value})} className="h-11" placeholder="hello@ningclean.id" />
                            </FormField>
                            <FormField label="Telepon">
                              <Input value={footerSettings.contactPhone || ''} onChange={(e) => setFooterSettings({...footerSettings, contactPhone: e.target.value})} className="h-11" placeholder="+62 812-3456-7890" />
                            </FormField>
                            <FormField label="WhatsApp">
                              <Input value={footerSettings.contactWhatsapp || ''} onChange={(e) => setFooterSettings({...footerSettings, contactWhatsapp: e.target.value})} className="h-11" placeholder="6281234567890" />
                            </FormField>
                            <FormField label="Alamat">
                              <Input value={footerSettings.contactAddress || ''} onChange={(e) => setFooterSettings({...footerSettings, contactAddress: e.target.value})} className="h-11" placeholder="Surabaya · Gresik · Sidoarjo" />
                            </FormField>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Social Links */}
                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={Share2} title="Social Media Links" subtitle="Icon social media di footer" />
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-700">Tampilkan Social Icons</p>
                            <p className="text-sm text-gray-500">Instagram, WhatsApp, TikTok, YouTube</p>
                          </div>
                          <Toggle checked={footerSettings.showSocials !== false} onChange={(v) => setFooterSettings({...footerSettings, showSocials: v})} />
                        </div>
                        {(footerSettings.socialLinks || []).map((social, index) => (
                          <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <div className="w-24 text-sm font-medium text-gray-700">{social.name}</div>
                            <Input 
                              className="flex-1 h-10" 
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
                          className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                          Tambah Social Link
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Newsletter */}
                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={Mail} title="Newsletter Section" subtitle="Band newsletter di atas footer" />
                      <div className="space-y-5">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-700">Tampilkan Newsletter</p>
                            <p className="text-sm text-gray-500">Form subscribe di footer</p>
                          </div>
                          <Toggle checked={footerSettings.showNewsletter !== false} onChange={(v) => setFooterSettings({...footerSettings, showNewsletter: v})} />
                        </div>
                        {footerSettings.showNewsletter !== false && (
                          <div className="space-y-4">
                            <FormField label="Newsletter Title">
                              <Input value={footerSettings.newsletterTitle || ''} onChange={(e) => setFooterSettings({...footerSettings, newsletterTitle: e.target.value})} className="h-11" placeholder="Dapat tips bersih setiap minggu" />
                            </FormField>
                            <FormField label="Newsletter Subtitle">
                              <Input value={footerSettings.newsletterSubtitle || ''} onChange={(e) => setFooterSettings({...footerSettings, newsletterSubtitle: e.target.value})} className="h-11" placeholder="Promo eksklusif..." />
                            </FormField>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Footer Columns */}
                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={Link2} title="Footer Columns" subtitle="Link columns di footer" />
                      <div className="space-y-4">
                        {(footerSettings.footerColumns || []).map((column, colIndex) => (
                          <div key={colIndex} className="p-4 bg-gray-50 rounded-xl space-y-3">
                            <div className="flex items-center justify-between">
                              <Input 
                                value={column.title} 
                                onChange={(e) => {
                                  const newColumns = [...(footerSettings.footerColumns || [])]
                                  newColumns[colIndex] = {...column, title: e.target.value}
                                  setFooterSettings({...footerSettings, footerColumns: newColumns})
                                }}
                                className="w-48 h-10 font-medium"
                                placeholder="Column title"
                              />
                              <button 
                                onClick={() => {
                                  const newColumns = (footerSettings.footerColumns || []).filter((_, i) => i !== colIndex)
                                  setFooterSettings({...footerSettings, footerColumns: newColumns})
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                            <div className="space-y-2">
                              {(column.links || []).map((link, linkIndex) => (
                                <div key={linkIndex} className="flex items-center gap-2">
                                  <Input 
                                    value={link.label} 
                                    onChange={(e) => {
                                      const newColumns = [...(footerSettings.footerColumns || [])]
                                      const newLinks = [...column.links]
                                      newLinks[linkIndex] = {...link, label: e.target.value}
                                      newColumns[colIndex] = {...column, links: newLinks}
                                      setFooterSettings({...footerSettings, footerColumns: newColumns})
                                    }}
                                    className="flex-1 h-9 text-sm"
                                    placeholder="Link label"
                                  />
                                  <Input 
                                    value={link.href} 
                                    onChange={(e) => {
                                      const newColumns = [...(footerSettings.footerColumns || [])]
                                      const newLinks = [...column.links]
                                      newLinks[linkIndex] = {...link, href: e.target.value}
                                      newColumns[colIndex] = {...column, links: newLinks}
                                      setFooterSettings({...footerSettings, footerColumns: newColumns})
                                    }}
                                    className="flex-1 h-9 text-sm"
                                    placeholder="/path"
                                  />
                                  <button 
                                    onClick={() => {
                                      const newColumns = [...(footerSettings.footerColumns || [])]
                                      const newLinks = column.links.filter((_, i) => i !== linkIndex)
                                      newColumns[colIndex] = {...column, links: newLinks}
                                      setFooterSettings({...footerSettings, footerColumns: newColumns})
                                    }}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => {
                                  const newColumns = [...(footerSettings.footerColumns || [])]
                                  const newLinks = [...column.links, { label: 'New Link', href: '/new' }]
                                  newColumns[colIndex] = {...column, links: newLinks}
                                  setFooterSettings({...footerSettings, footerColumns: newColumns})
                                }}
                                className="w-full p-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-emerald-500 hover:text-emerald-600"
                              >
                                + Tambah Link
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newColumn: FooterColumn = { title: 'New Column', links: [] }
                            setFooterSettings({...footerSettings, footerColumns: [...(footerSettings.footerColumns || []), newColumn]})
                          }}
                          className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                          Tambah Column
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bottom Bar */}
                  <Card>
                    <CardContent className="p-6">
                      <SectionHeader icon={FileText} title="Bottom Bar" subtitle="Copyright dan status badge" />
                      <div className="space-y-5">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-700">Tampilkan Status Badge</p>
                            <p className="text-sm text-gray-500">Badge "Semua layanan aktif"</p>
                          </div>
                          <Toggle checked={footerSettings.showStatusBadge !== false} onChange={(v) => setFooterSettings({...footerSettings, showStatusBadge: v})} />
                        </div>
                        {footerSettings.showStatusBadge !== false && (
                          <FormField label="Status Badge Text">
                            <Input value={footerSettings.statusBadgeText || ''} onChange={(e) => setFooterSettings({...footerSettings, statusBadgeText: e.target.value})} className="h-11" placeholder="Semua layanan aktif" />
                          </FormField>
                        )}
                        <FormField label="Copyright Text">
                          <Input value={footerSettings.copyrightText || ''} onChange={(e) => setFooterSettings({...footerSettings, copyrightText: e.target.value})} className="h-11" placeholder="All rights reserved." />
                        </FormField>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* WhatsApp */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                            <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900">WhatsApp</h2>
                            <p className="text-sm text-gray-500">Notifikasi via WhatsApp</p>
                          </div>
                        </div>
                        <Toggle checked={notificationSettings.whatsappEnabled} onChange={(v) => updateNotifField('whatsappEnabled', v)} />
                      </div>
                      <div className="space-y-5">
                        <FormField label="Nomor WhatsApp" description="Format: kode negara + nomor">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">+</span>
                            <Input className="h-11 pl-8" value={notificationSettings.whatsappNumber || ''} onChange={e => updateNotifField('whatsappNumber', e.target.value)} placeholder="6281234567890" />
                          </div>
                        </FormField>
                        <FormField label="Template Pesan" description="Variabel: {orderNumber}, {customerName}, {serviceName}, {serviceDate}, {serviceTime}, {address}, {totalAmount}">
                          <Textarea value={notificationSettings.whatsappMessage || ''} onChange={e => updateNotifField('whatsappMessage', e.target.value)} rows={5} className="font-mono text-sm" />
                        </FormField>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Twilio */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <MessageSquare className="h-7 w-7 text-white" />
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900">Twilio API</h2>
                            <p className="text-sm text-gray-500">WhatsApp Business API</p>
                          </div>
                        </div>
                        {notificationSettings.hasTwilio && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Connected
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField label="Account SID">
                          <Input value={notificationSettings.twilioAccountSid || ''} onChange={e => updateNotifField('twilioAccountSid', e.target.value)} placeholder="ACxxxxxxxx..." className="h-11" />
                        </FormField>
                        <FormField label="Auth Token" description="Isi hanya jika ingin mengubah">
                          <Input type="password" value={notificationSettings.twilioAuthToken || ''} onChange={e => updateNotifField('twilioAuthToken', e.target.value)} placeholder="••••••••" className="h-11" />
                        </FormField>
                        <FormField label="WhatsApp From Number">
                          <Input value={notificationSettings.twilioFromNumber || ''} onChange={e => updateNotifField('twilioFromNumber', e.target.value)} placeholder="+14155238886" className="h-11" />
                        </FormField>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Email */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Mail className="h-7 w-7 text-white" />
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900">Email</h2>
                            <p className="text-sm text-gray-500">Notifikasi via Email</p>
                          </div>
                        </div>
                        <Toggle checked={notificationSettings.emailEnabled} onChange={(v) => updateNotifField('emailEnabled', v)} />
                      </div>
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FormField label="SMTP Host">
                            <Input value={notificationSettings.emailHost || ''} onChange={e => updateNotifField('emailHost', e.target.value)} placeholder="smtp.gmail.com" className="h-11" />
                          </FormField>
                          <FormField label="SMTP Port">
                            <Input type="number" value={notificationSettings.emailPort || 587} onChange={e => updateNotifField('emailPort', parseInt(e.target.value))} placeholder="587" className="h-11" />
                          </FormField>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FormField label="Email Username">
                            <Input value={notificationSettings.emailUser || ''} onChange={e => updateNotifField('emailUser', e.target.value)} placeholder="your@email.com" className="h-11" />
                          </FormField>
                          <FormField label="Email Password" description={notificationSettings.hasPassword ? "Isi baru jika ingin mengubah" : ""}>
                            <Input type="password" value={notificationSettings.emailPassword || ''} onChange={e => updateNotifField('emailPassword', e.target.value)} placeholder={notificationSettings.hasPassword ? "••••••••" : "App password"} className="h-11" />
                          </FormField>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FormField label="From Name">
                            <Input value={notificationSettings.emailFrom || ''} onChange={e => updateNotifField('emailFrom', e.target.value)} placeholder="NingClean <hello@ningclean.com>" className="h-11" />
                          </FormField>
                          <FormField label="Admin Email" description="Email untuk menerima notifikasi">
                            <Input type="email" value={notificationSettings.adminEmail || ''} onChange={e => updateNotifField('adminEmail', e.target.value)} placeholder="admin@ningclean.com" className="h-11" />
                          </FormField>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
