'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Mail, Lock, Save, Phone, Camera, Shield, 
  Eye, EyeOff, CheckCircle2, AlertCircle, X, Upload,
  Settings, Bell, Key, UserCircle
} from 'lucide-react'
import { getUser, getToken, uploadFile } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Breadcrumb } from '@/components/admin/Breadcrumb'

type Tab = 'profile' | 'password' | 'preferences'

export default function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = React.useState<Tab>('profile')
  const [user, setUser] = React.useState<{ 
    id?: string; 
    name: string; 
    email: string; 
    role: string; 
    phone?: string; 
    avatar?: string 
  }>({
    name: '',
    email: '',
    role: '',
    phone: '',
    avatar: '',
  })
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [uploadingAvatar, setUploadingAvatar] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  // Form fields
  const [name, setName] = React.useState('Nama Lengkap')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [avatar, setAvatar] = React.useState('')

  // Password fields
  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [passwordChanged, setPasswordChanged] = React.useState(false)

  // Validation
  const [isValidEmail, setIsValidEmail] = React.useState(true)
  const [emailTouched, setEmailTouched] = React.useState(false)

  // Password strength
  const [passwordStrength, setPasswordStrength] = React.useState(0)

  React.useEffect(() => {
    setMounted(true)
    loadProfile()
  }, [])

  const validateEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (emailTouched) {
      setIsValidEmail(validateEmailFormat(value))
    }
  }

  const handleEmailBlur = () => {
    setEmailTouched(true)
    setIsValidEmail(validateEmailFormat(email))
  }

  const getPasswordStrength = (pwd: string): number => {
    let strength = 0
    if (pwd.length >= 6) strength++
    if (pwd.length >= 10) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++
    return Math.min(strength, 4)
  }

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value)
    setPasswordChanged(true)
    setPasswordStrength(getPasswordStrength(value))
  }

  const loadProfile = async () => {
    setLoading(true)
    try {
      const userData = getUser()
      if (userData) {
        setUser(userData)
        setName(userData.name || '')
        setEmail(userData.email || '')
        setPhone(userData.phone || '')
        setAvatar(userData.avatar || '')
      }

      const token = getToken()
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const baseUrl = apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`
      if (token) {
        const res = await fetch(`${baseUrl}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        if (res.ok) {
          const data = await res.json()
          const userObj = data.data || data
          setUser(userObj)
          setName(userObj.name || '')
          setEmail(userObj.email || '')
          setPhone(userObj.phone || '')
          setAvatar(userObj.avatar || '')
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
      toast.error('Gagal memuat profil')
    }
    setLoading(false)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB')
      return
    }

    setUploadingAvatar(true)
    try {
      const result = await uploadFile(file, 'avatars')
      if (result.success && result.data) {
        // Auto-save avatar to database
        const token = getToken()
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
        const baseUrl = apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`
        const saveRes = await fetch(`${baseUrl}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ avatar: result.data.url }),
        })
        if (saveRes.ok) {
          setAvatar(result.data.url)
          localStorage.setItem('admin_user', JSON.stringify({ ...user, name, email, phone, avatar: result.data.url }))
          toast.success('Avatar uploaded and saved successfully')
        } else {
          toast.error('Avatar uploaded but failed to save. Please click Simpan Changes.')
        }
      } else {
        toast.error(result.message || 'Failed to upload avatar')
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      toast.error('Failed to upload avatar')
    }
    setUploadingAvatar(false)
  }

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error('Nama tidak boleh kosong')
      return
    }

    if (!validateEmailFormat(email)) {
      toast.error('Format email tidak valid')
      return
    }

    setSaving(true)
    try {
      const token = getToken()
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const baseUrl = apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`
      const res = await fetch(`${baseUrl}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, avatar }),
      })

      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('admin_user', JSON.stringify({ ...user, name, email, phone, avatar }))
        toast.success('Profil berhasil diperbarui')
        loadProfile()
      } else {
        const error = await res.json()
        toast.error(error.message || 'Gagal memperbarui profil')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Gagal memperbarui profil')
    }
    setSaving(false)
  }

  const handleChangePassword = async () => {
    if (!currentPassword) {
      toast.error('Password saat ini harus diisi')
      return
    }
    if (!newPassword) {
      toast.error('Password baru harus diisi')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password baru minimal 6 karakter')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Password baru dan konfirmasi tidak cocok')
      return
    }

    setSaving(true)
    try {
      const token = getToken()
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const baseUrl = apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`
      const res = await fetch(`${baseUrl}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (res.ok) {
        toast.success('Password berhasil diubah')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setPasswordChanged(false)
        setPasswordStrength(0)
      } else {
        const error = await res.json()
        toast.error(error.message || 'Gagal mengubah password')
      }
    } catch (error) {
      console.error('Failed to change password:', error)
      toast.error('Gagal mengubah password')
    }
    setSaving(false)
  }

  const tabs = [
    { id: 'profile' as Tab, label: 'Profil', icon: UserCircle },
    { id: 'password' as Tab, label: 'Keamanan', icon: Shield },
  ]

  const passwordStrengthLabel = ['Sangat Lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat']
  const passwordStrengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500', 'bg-emerald-600']

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Profile Settings' }]} />

      <div className="px-4 md:px-6 py-6 space-y-6">
        {/* Page Header with Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Pengaturan Profil</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola informasi akun dan keamanan Anda</p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              {/* Profile Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm">
                {/* Avatar Section */}
                <div className="relative h-32 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600">
                  <div className="absolute -bottom-12 left-6">
                    <div className="relative group">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt="Avatar"
                          className="h-24 w-24 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-lg"
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-lg">
                          <span className="text-3xl font-bold text-slate-400 dark:text-slate-500">
                            {name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-2xl cursor-pointer transition-opacity">
                        <div className="flex flex-col items-center text-white">
                          {uploadingAvatar ? (
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          ) : (
                            <>
                              <Camera className="h-6 w-6 mb-1" />
                              <span className="text-xs font-medium">Upload</span>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          disabled={uploadingAvatar}
                        />
                      </label>
                    </div>
                  </div>
                  
                  {/* Role Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                      <Shield className="h-3.5 w-3.5" />
                      {user.role || 'Administrator'}
                    </span>
                  </div>
                </div>

                {/* Form */}
                <div className="p-6 pt-16 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Nama Lengkap"
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                        <input
                          type="email"
                          value={email}
                          onChange={e => handleEmailChange(e.target.value)}
                          onBlur={handleEmailBlur}
                          placeholder="email@contoh.com"
                          className={cn(
                            'w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all',
                            !isValidEmail && emailTouched
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                              : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20'
                          )}
                        />
                        {email && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {isValidEmail ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                      {!isValidEmail && emailTouched && (
                        <p className="text-xs text-red-500 mt-1.5">Format email tidak valid</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Nomor Telepon
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="081234567890"
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving || !isValidEmail}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                      {saving ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'password' && (
            <motion.div
              key="password"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              {/* Password Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Key className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Ubah Password</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Pastikan password Anda sulit ditebak</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Password Saat Ini
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        placeholder="Masukkan password saat ini"
                        className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Password Baru
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => handleNewPasswordChange(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {newPassword && (
                      <div className="mt-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={cn('h-full transition-all', passwordStrengthColor[passwordStrength])}
                              style={{ width: `${(passwordStrength / 4) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {passwordStrengthLabel[passwordStrength]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Gunakan kombinasi huruf besar, angka, dan simbol
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Konfirmasi Password Baru
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Ulangi password baru"
                        className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-500 mt-1.5">Password tidak cocok</p>
                    )}
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <button
                      onClick={handleChangePassword}
                      disabled={saving || !passwordChanged || (confirmPassword !== '' && newPassword !== confirmPassword)}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                      {saving ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                      Ubah Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Tips */}
              <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Tips Keamanan</h3>
                    <ul className="mt-2 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        Gunakan minimal 12 karakter
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        Kombinasikan huruf besar dan kecil
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        Tambahkan angka dan simbol
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        Jangan gunakan password yang sama di其他地方
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}