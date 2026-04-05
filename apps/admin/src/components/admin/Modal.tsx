'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, MapPin, Phone, Mail, User, CreditCard, FileText, MessageCircle, Check, Circle } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Modal({ isOpen, onClose, title, description, children, size = 'md' }: ModalProps) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Sophisticated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-slate-900/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`relative ${sizes[size]} w-full`}
            >
              {/* Main Container */}
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/30 border border-gray-200/50">
                
                {/* Premium Header Bar */}
                <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 sm:px-8">
                  {/* Decorative elements */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10" />
                  <div className="absolute -top-1/2 -right-1/4 h-32 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
                  <div className="absolute -bottom-1/4 -left-1/4 h-24 w-48 rounded-full bg-blue-500/20 blur-2xl" />
                  
                  {/* Header Content */}
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <Calendar className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div>
                        {title && (
                          <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
                        )}
                        {description && (
                          <p className="mt-0.5 text-sm text-slate-300">{description}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Premium Close Button */}
                    <button
                      onClick={onClose}
                      className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-200 hover:bg-white/20 hover:shadow-lg active:scale-95"
                    >
                      <X className="h-5 w-5 text-slate-300 transition-transform group-hover:rotate-90" />
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="relative overflow-y-auto bg-gray-50/50" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
                  {children}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// Step Progress Indicator Component
export function BookingStepProgress({ status }: { status: string }) {
  const steps = [
    { key: 'pending', label: 'Pending', icon: Clock },
    { key: 'confirmed', label: 'Dikonfirmasi', icon: Check },
    { key: 'in_progress', label: 'Pengerjaan', icon: Calendar },
    { key: 'completed', label: 'Selesai', icon: Check },
  ]

  const statusOrder = ['pending', 'confirmed', 'in_progress', 'completed']
  const currentIndex = statusOrder.indexOf(status)
  const isCancelled = status === 'cancelled'

  if (isCancelled) {
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <X className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="font-semibold text-red-700">Booking Dibatalkan</p>
            <p className="text-sm text-red-500">Booking ini telah dibatalkan</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentIndex
          const isCompleted = index < currentIndex
          const Icon = step.icon

          return (
            <React.Fragment key={step.key}>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div className={`
                  flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                    : isActive 
                      ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30' 
                      : 'bg-gray-100 border-gray-200 text-gray-400'
                  }
                `}>
                  {isCompleted ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <p className={`
                  mt-2 text-xs font-medium transition-colors
                  ${isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-gray-400'}
                `}>
                  {step.label}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 mb-6">
                  <div className={`
                    h-1.5 rounded-full transition-all duration-500
                    ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200'}
                  `} />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

// Helper components for Booking Detail
export function BookingDetailSection({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900/10">
            <Icon className="h-4 w-4 text-gray-700" />
          </div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  )
}

export function BookingDetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2.5 ${highlight ? 'bg-emerald-50 -mx-4 px-4 rounded-lg' : ''}`}>
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-medium ${highlight ? 'text-emerald-700' : 'text-gray-900'}`}>{value}</span>
    </div>
  )
}

export function BookingActionButton({ variant, children, onClick, icon: Icon, loading, disabled }: { 
  variant: 'primary' | 'success' | 'warning' | 'danger' | 'secondary' | 'outline'
  children: React.ReactNode
  onClick: () => void
  icon?: any
  loading?: boolean
  disabled?: boolean
}) {
  const variants = {
    primary: 'bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-900/25',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25',
    secondary: 'bg-slate-600 hover:bg-slate-700 text-white',
    outline: 'border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700',
  }

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${variants[variant]}`}
    >
      {loading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : (
        <>
          {Icon && <Icon className="h-4 w-4" />}
          {children}
        </>
      )}
    </button>
  )
}

export function WhatsAppButton({ phone, message }: { phone: string; message?: string }) {
  if (!phone) return null
  
  const formattedPhone = phone.replace(/\D/g, '')
  const waLink = message 
    ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${formattedPhone}`

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-600/25 transition-all duration-200 hover:bg-green-700 active:scale-95"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      Chat WhatsApp
    </a>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
    confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Dikonfirmasi' },
    in_progress: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Pengerjaan' },
    completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Selesai' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Dibatalkan' },
  }
  
  const config = statusConfig[status] || statusConfig.pending
  
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.text.replace('text-', 'bg-')}`} />
      {config.label}
    </span>
  )
}
