'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, Check } from 'lucide-react'

const ACCENT_BORDER: Record<string, string> = {
  blue: 'from-blue-600 to-blue-400',
  amber: 'from-amber-600 to-amber-400',
  emerald: 'from-emerald-600 to-emerald-400',
  red: 'from-red-600 to-red-400',
  purple: 'from-purple-600 to-purple-400',
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Modal({ isOpen, onClose, title, description, children, size = 'md', titleIcon: TitleIcon, accentColor = 'emerald', footer }: ModalProps & { titleIcon?: React.ReactNode; accentColor?: string; footer?: React.ReactNode }) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]',
  }

  const iconBgColors: Record<string, string> = {
    emerald: 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800',
    blue: 'bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800',
    amber: 'bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800',
    red: 'bg-red-100 dark:bg-red-900/40 border-red-200 dark:border-red-800',
    purple: 'bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800',
  }

  const iconTextColors: Record<string, string> = {
    emerald: 'text-emerald-600 dark:text-emerald-400',
    blue: 'text-blue-600 dark:text-blue-400',
    amber: 'text-amber-600 dark:text-amber-400',
    red: 'text-red-600 dark:text-red-400',
    purple: 'text-purple-600 dark:text-purple-400',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`pointer-events-auto w-full ${sizes[size]} max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col`}
            >
              {/* Header */}
              <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-${accentColor}-50/50 to-transparent dark:from-${accentColor}-900/20 dark:to-transparent`}>
                <div className="flex items-center gap-3">
                  {TitleIcon && (
                    <div className={`w-10 h-10 rounded-xl ${iconBgColors[accentColor] || iconBgColors.emerald} flex items-center justify-center border`}>
                      <span className={iconTextColors[accentColor] || iconTextColors.emerald}>{TitleIcon}</span>
                    </div>
                  )}
                  <div>
                    {title && (
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
                    )}
                    {description && (
                      <p className="text-xs text-gray-500 dark:text-slate-400">{description}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-600 dark:hover:text-slate-200 hover:border-gray-300 dark:hover:border-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content Area - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// Step Progress Indicator Component
export function BookingStepProgress({ status }: { status: string }) {
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const steps = [
    { key: 'pending', label: 'Pending', icon: Clock },
    { key: 'confirmed', label: 'Dikonfirmasi', icon: Check },
    { key: 'in_progress', label: 'Pengerjaan', icon: Calendar },
    { key: 'completed', label: 'Selesai', icon: Check },
  ]

  const statusOrder = ['pending', 'confirmed', 'in_progress', 'completed']
  const currentIndex = statusOrder.indexOf(status)
  const isCancelled = status === 'cancelled'

  // Prevent hydration mismatch by rendering placeholder until mounted
  if (!mounted) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white border-gray-200" />
                <p className="mt-2 text-xs font-medium text-gray-400">{step.label}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 mb-6">
                  <div className="h-1 rounded-full bg-gray-200" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  if (isCancelled) {
    return (
      <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
            <X className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="font-semibold text-red-700 dark:text-red-400">Booking Dibatalkan</p>
            <p className="text-sm text-red-500 dark:text-red-500">Booking ini telah dibatalkan</p>
          </div>
        </div>
      </div>
    )
  }

  const getStepStyles = (isActive: boolean, isCompleted: boolean) => {
    if (isCompleted) {
      return 'bg-emerald-500 border-emerald-500 text-white dark:bg-emerald-600 dark:border-emerald-500'
    }
    if (isActive) {
      return 'bg-blue-500 border-blue-500 text-white dark:bg-blue-600 dark:border-blue-500'
    }
    return 'bg-white border-gray-200 text-gray-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-500'
  }

  const getLabelStyles = (isActive: boolean, isCompleted: boolean) => {
    if (isActive) return 'text-blue-600 dark:text-blue-400'
    if (isCompleted) return 'text-emerald-600 dark:text-emerald-400'
    return 'text-gray-400 dark:text-slate-500'
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
                  flex h-10 w-10 items-center justify-center rounded-full border-2
                  transition-all duration-300 ${getStepStyles(isActive, isCompleted)}
                `}>
                  {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                </div>
                <p className={`
                  mt-2 text-xs font-medium transition-colors
                  ${getLabelStyles(isActive, isCompleted)}
                `}>
                  {step.label}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 mb-6">
                  <div className={`
                    h-1 rounded-full transition-all duration-500
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
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600">
            <Icon className="h-4 w-4 text-gray-600 dark:text-slate-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}

export function BookingDetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2 ${highlight ? 'bg-emerald-50 dark:bg-emerald-900/20 -mx-2 px-2 rounded-lg' : ''}`}>
      <span className="text-sm text-gray-500 dark:text-slate-400">{label}</span>
      <span className={`text-sm font-medium ${highlight ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>{value}</span>
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
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200',
  }

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
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
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-green-700"
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
    pending: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', label: 'Pending' },
    confirmed: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'Dikonfirmasi' },
    in_progress: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', label: 'Pengerjaan' },
    completed: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', label: 'Selesai' },
    cancelled: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Dibatalkan' },
  }
  
  const config = statusConfig[status] || statusConfig.pending
  
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.text.replace('text-', 'bg-')}`} />
      {config.label}
    </span>
  )
}

// ─── DarkModal Component (Light Theme) ───────────────────────────────────────────

interface DarkModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  accent?: 'blue' | 'amber' | 'emerald' | 'red' | 'purple'
  wide?: boolean
  children: React.ReactNode
}

export function DarkModal({
  isOpen, onClose, title, subtitle, accent = 'blue', wide = false, children
}: DarkModalProps) {
  if (!isOpen) return null
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className={`relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xl ${wide ? 'w-full max-w-2xl' : 'w-full max-w-md'}`}
        >
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${ACCENT_BORDER[accent] ?? ACCENT_BORDER.blue}`} />
          <div className="flex items-start justify-between p-5 pb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">{title}</h2>
              {subtitle && <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="px-5 pb-5">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// ─── ActionBtn Component ───────────────────────────────────────────────────────

const ACTION_STYLES: Record<string, string> = {
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  danger:  'bg-red-600 text-white hover:bg-red-700',
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  amber:   'bg-amber-600 text-white hover:bg-amber-700',
  emerald: 'bg-emerald-600 text-white hover:bg-emerald-700',
  outline: 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700',
}

interface ActionBtnProps {
  variant?: 'success' | 'danger' | 'primary' | 'amber' | 'emerald' | 'outline'
  children: React.ReactNode
  onClick?: () => void
  loading?: boolean
  className?: string
}

export function ActionBtn({
  variant = 'outline', children, onClick, loading, className = ''
}: ActionBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${ACTION_STYLES[variant] ?? ACTION_STYLES.outline} ${className}`}
    >
      {loading && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {children}
    </button>
  )
}

// ─── Form Components ───────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string
  children: React.ReactNode
  className?: string
}

export function FormField({ label, children, className = '' }: FormFieldProps) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

interface DarkInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function DarkInput({ className = '', ...props }: DarkInputProps) {
  return (
    <input
      className={`w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all ${className}`}
      {...props}
    />
  )
}

interface DarkSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
}

export function DarkSelect({ options, className = '', ...props }: DarkSelectProps) {
  return (
    <select
      className={`w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all cursor-pointer appearance-none ${className}`}
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
      {...props}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}
