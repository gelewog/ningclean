'use client'

import { motion } from 'framer-motion'
import { User, Phone, Mail, MapPin, SquareStack, ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AddressStepProps {
  address: string
  city: string
  area: string
  notes: string
  customerName: string
  customerEmail: string
  customerPhone: string
  onAddressChange: (v: string) => void
  onCityChange: (v: string) => void
  onAreaChange: (v: string) => void
  onNotesChange: (v: string) => void
  onCustomerNameChange: (v: string) => void
  onCustomerEmailChange: (v: string) => void
  onCustomerPhoneChange: (v: string) => void
  onBack: () => void
  onNext: () => void
}

const CITY_OPTIONS = [
  { value: 'Surabaya', label: 'Surabaya' },
  { value: 'Sidoarjo', label: 'Sidoarjo' },
  { value: 'Gresik', label: 'Gresik' },
]

// ─── Field primitives ───────────────────────────────────────────────────────────

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label className="block text-[12px] font-semibold text-gray-600 dark:text-zinc-600 mb-1.5">
      {children}
      {required && <span className="text-red-500 dark:text-red-700 ml-1">*</span>}
    </label>
  )
}

function IconInput({
  icon: Icon,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ElementType
}) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500 pointer-events-none" />
      )}
      <input
        className={cn(
          'w-full h-[40px] bg-gray-50 dark:bg-[#0a0a0b] border border-gray-200 dark:border-white/[0.05] rounded-[9px] text-[14px] text-gray-800 dark:text-zinc-300 placeholder:text-gray-400 dark:placeholder:text-zinc-700 outline-none transition-all',
          'focus:border-blue-400 dark:focus:border-blue-500/40 focus:ring-1 focus:ring-blue-400/20 dark:focus:ring-blue-500/10',
          Icon ? 'pl-9 pr-3' : 'px-3',
          className
        )}
        {...props}
      />
    </div>
  )
}

function IconTextarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full bg-gray-50 dark:bg-[#0a0a0b] border border-gray-200 dark:border-white/[0.05] rounded-[9px] px-3 py-2.5 text-[14px] text-gray-800 dark:text-zinc-300 placeholder:text-gray-400 dark:placeholder:text-zinc-700 outline-none transition-all resize-none leading-relaxed',
        'focus:border-blue-400 dark:focus:border-blue-500/40 focus:ring-1 focus:ring-blue-400/20 dark:focus:ring-blue-500/10',
        className
      )}
      {...props}
    />
  )
}

function DarkSelect({
  options,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string; label: string }[]
}) {
  return (
    <select
      className={cn(
        'w-full h-[40px] bg-gray-50 dark:bg-[#0a0a0b] border border-gray-200 dark:border-white/[0.05] rounded-[9px] px-3 text-[14px] text-gray-600 dark:text-zinc-500 outline-none transition-all cursor-pointer appearance-none',
        'focus:border-blue-400 dark:focus:border-blue-500/40 focus:ring-1 focus:ring-blue-400/20 dark:focus:ring-blue-500/10',
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
        paddingRight: '28px',
      }}
      {...props}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

// ─── Section divider ────────────────────────────────────────────────────────────

function SectionDivider({
  icon: Icon,
  label,
}: {
  icon: React.ElementType
  label: string
}) {
  return (
    <div className="flex items-center gap-2 mb-3.5">
      <Icon className="w-3 h-3 text-gray-400 dark:text-zinc-700" />
      <span className="text-[10px] font-bold uppercase tracking-[1px] text-gray-500 dark:text-zinc-600 whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-gray-200 dark:bg-white/[0.04]" />
    </div>
  )
}

// ─── Progress bar ───────────────────────────────────────────────────────────────

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="h-[2px] bg-gray-200 dark:bg-white/[0.03] overflow-hidden">
      <motion.div
        className="h-full"
        style={{ background: 'linear-gradient(90deg,#3b82f6,#60a5fa)' }}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function AddressStep({
  address, city, area, notes,
  customerName, customerEmail, customerPhone,
  onAddressChange, onCityChange, onAreaChange, onNotesChange,
  onCustomerNameChange, onCustomerEmailChange, onCustomerPhoneChange,
  onBack, onNext,
}: AddressStepProps) {

  // Required field validation
  const requiredFields = [customerName, customerPhone, customerEmail, address, area]
  const filledCount = requiredFields.filter(v => v.trim().length > 0).length
  const progressPct = Math.round((filledCount / requiredFields.length) * 100)
  const canProceed = filledCount === requiredFields.length

  const handleNext = () => {
    if (canProceed) onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">

        {/* Progress bar */}
        <ProgressBar pct={progressPct} />

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-white/[0.04]">
          <h2 className="text-[18px] font-bold text-gray-900 dark:text-zinc-100 tracking-tight">Data Diri & Alamat</h2>
          <p className="text-[12px] text-gray-500 dark:text-zinc-500 mt-0.5">Lengkapi informasi untuk pemesanan</p>
        </div>

        <div className="p-5 space-y-6">

          {/* ── Informasi Diri ─────────────────────────────────── */}
          <div>
            <SectionDivider icon={User} label="Informasi Diri" />
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <FieldLabel required>Nama Lengkap</FieldLabel>
                  <IconInput
                    icon={User}
                    placeholder="John Doe"
                    value={customerName}
                    onChange={e => onCustomerNameChange(e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel required>Nomor WhatsApp</FieldLabel>
                  <IconInput
                    icon={Phone}
                    placeholder="081234567890"
                    value={customerPhone}
                    onChange={e => onCustomerPhoneChange(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <FieldLabel required>Email</FieldLabel>
                <IconInput
                  icon={Mail}
                  type="email"
                  placeholder="john@example.com"
                  value={customerEmail}
                  onChange={e => onCustomerEmailChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ── Lokasi ─────────────────────────────────────────── */}
          <div>
            <SectionDivider icon={MapPin} label="Lokasi" />
            <div className="space-y-3">
              <div>
                <FieldLabel required>Alamat Lengkap</FieldLabel>
                <IconTextarea
                  rows={3}
                  placeholder="Jl. Raya Surabaya No. 123, RT 01/RW 02, Kelurahan..."
                  value={address}
                  onChange={e => onAddressChange(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Kota</FieldLabel>
                  <DarkSelect
                    value={city}
                    onChange={e => onCityChange(e.target.value)}
                    options={[
                      { value: '', label: 'Pilih Kota' },
                      ...CITY_OPTIONS,
                    ]}
                  />
                </div>
                <div>
                  <FieldLabel required>Luas Area (m²)</FieldLabel>
                  <IconInput
                    icon={SquareStack}
                    type="number"
                    placeholder="50"
                    min={1}
                    value={area}
                    onChange={e => onAreaChange(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Catatan ────────────────────────────────────────── */}
          <div>
            <SectionDivider icon={FileText} label="Catatan Tambahan" />
            <IconTextarea
              rows={3}
              placeholder="Contoh: Ada anjing peliharaan, akses via pintu belakang, dll..."
              value={notes}
              onChange={e => onNotesChange(e.target.value)}
            />
            <p className="text-[11px] text-gray-500 dark:text-zinc-700 mt-1.5">
              Opsional — bantu tim kami bersiap dengan baik
            </p>
          </div>

          {/* ── Footer ─────────────────────────────────────────── */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-white/[0.04]">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-transparent text-[14px] font-semibold text-gray-600 dark:text-zinc-500 hover:bg-gray-100 dark:hover:bg-white/[0.04] hover:text-gray-800 dark:hover:text-zinc-300 hover:border-gray-300 dark:hover:border-white/[0.1] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali
            </button>

            <motion.button
              onClick={handleNext}
              disabled={!canProceed}
              animate={{ opacity: canProceed ? 1 : 0.35 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'flex items-center gap-1.5 px-5 py-2 rounded-xl border text-[14px] font-semibold transition-all',
                'bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/30 text-blue-600 dark:text-blue-300',
                canProceed
                  ? 'hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/50 cursor-pointer'
                  : 'cursor-not-allowed'
              )}
            >
              Lanjut
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

        </div>
      </div>
    </motion.div>
  )
}
