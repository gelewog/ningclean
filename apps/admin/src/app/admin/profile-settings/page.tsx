'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Save, RefreshCw, AlertCircle, CheckCircle, Phone, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getUser, getToken, uploadFile } from '@/lib/api'
import { toast } from 'sonner'

export default function ProfileSettingsPage() {
  const [user, setUser] = React.useState<{ id?: string; name: string; email: string; role: string; phone?: string; avatar?: string }>({
    name: '',
    email: '',
    role: '',
    phone: '',
    avatar: '',
  })
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [uploadingAvatar, setUploadingAvatar] = React.useState(false)

  // Form fields
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [avatar, setAvatar] = React.useState('')
  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  // Password change state
  const [passwordChanged, setPasswordChanged] = React.useState(false)

  // Email validation
  const [isValidEmail, setIsValidEmail] = React.useState(true)

  React.useEffect(() => {
    loadProfile()
  }, [])

  const validateEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (value) {
      setIsValidEmail(validateEmailFormat(value))
    } else {
      setIsValidEmail(true)
    }
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

      // Try to fetch full profile from API
      const token = getToken()
      if (token) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/me`, {
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
    }
    setLoading(false)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB')
      return
    }

    setUploadingAvatar(true)
    try {
      const result = await uploadFile(file, 'avatars')
      if (result.success && result.data) {
        setAvatar(result.data.url)
        toast.success('Avatar uploaded successfully')
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, avatar }),
      })

      if (res.ok) {
        const data = await res.json()
        // Update local storage
        localStorage.setItem('admin_user', JSON.stringify({ ...user, name, email, phone, avatar }))
        toast.success('Profil berhasil diperbarui')
        // Reload to get fresh data
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      if (res.ok) {
        toast.success('Password berhasil diubah')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setPasswordChanged(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
        <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-700 px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
            <span>NingClean Admin</span>
            <span>/</span>
            <span className="text-gray-700 dark:text-slate-200">Profile Settings</span>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
      {/* Topbar */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-700 px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
          <span>NingClean Admin</span>
          <span>/</span>
          <span className="text-gray-700 dark:text-slate-200">Profile Settings</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-gray-500 dark:text-slate-400">Live</span>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Profile Settings</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Kelola informasi akun dan password Anda</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm dark:shadow-slate-900/50"
          >
            <div className="p-6 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">Informasi Profil</h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Nama, email, dan foto profil Anda</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {/* Avatar Section */}
              <div className="flex flex-col items-center pb-4">
                <div className="relative">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="h-24 w-24 rounded-full object-cover border-4 border-gray-100 dark:border-slate-700"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center border-4 border-gray-100 dark:border-slate-700">
                      <User className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center cursor-pointer hover:bg-emerald-600 transition-all shadow-lg">
                    {uploadingAvatar ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploadingAvatar}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">Klik ikon kamera untuk upload foto</p>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 pl-10 pr-4 py-2.5 transition-all"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => handleEmailChange(e.target.value)}
                    placeholder="Masukkan email"
                    className={`w-full bg-white dark:bg-slate-800 border rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 pl-10 pr-4 py-2.5 transition-all ${
                      !isValidEmail
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20'
                    }`}
                  />
                </div>
                {!isValidEmail && (
                  <p className="text-xs text-red-500 mt-1">Format email tidak valid</p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1.5">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 pl-10 pr-4 py-2.5 transition-all"
                  />
                </div>
              </div>

              {/* Role Display */}
              <div className="pt-2">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-slate-200">Role</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 capitalize">{user.role || 'Administrator'}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saving || !isValidEmail}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Simpan Perubahan
              </button>
            </div>
          </motion.div>

          {/* Change Password */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm dark:shadow-slate-900/50"
          >
            <div className="p-6 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">Ubah Password</h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Perbarui password akun Anda</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1.5">
                  Password Saat Ini
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan password saat ini"
                    className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 pl-10 pr-4 py-2.5 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1.5">
                  Password Baru
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setPasswordChanged(true) }}
                    placeholder="Minimal 6 karakter"
                    className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 pl-10 pr-4 py-2.5 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1.5">
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                    className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 pl-10 pr-4 py-2.5 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={saving || !passwordChanged}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                Ubah Password
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}