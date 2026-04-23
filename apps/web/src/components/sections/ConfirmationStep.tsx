'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  User, Calendar, Package, MapPin, FileText,
  ChevronLeft, Check, Loader2, Info, ShieldCheck,
} from 'lucide-react'
import { Service } from '@/types/api'
import { cn, formatPrice, formatDate } from '@/lib/utils'
import Link from 'next/link'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ConfirmationStepProps {
  selectedService: Service | null
  scheduledDate: string
  scheduledTime: string
  address: string
  city: string
  area: string
  notes: string
  customerName: string
  customerEmail: string
  customerPhone: string
  isSubmitting: boolean
  onBack: () => void
  onSubmit: () => void
}

// ─── Review block ───────────────────────────────────────────────────────────────

function ReviewBlock({
  icon: Icon,
  label,
  full,
  children,
}: {
  icon: React.ElementType
  label: string
  full?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'bg-gray-100 dark:bg-[#0a0a0b] border border-gray-200 dark:border-white/[0.04] rounded-xl p-3.5',
        full && 'col-span-2'
      )}
    >
      <div className="flex items-center gap-1.5 mb-2.5">
        <Icon className="w-3 h-3 text-gray-400 dark:text-zinc-700" />
        <span className="text-[10px] font-bold uppercase tracking-[0.8px] text-gray-500 dark:text-zinc-600">
          {label}
        </span>
      </div>
      {children}
    </div>
  )
}

function BlockPrimary({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <p className={cn('text-[14px] font-bold leading-snug', highlight ? 'text-blue-600 dark:text-blue-300' : 'text-gray-800 dark:text-zinc-300')}>
      {children}
    </p>
  )
}

function BlockSecondary({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] text-gray-500 dark:text-zinc-600 mt-1 leading-relaxed">{children}</p>
}

// ─── Feature tags ────────────────────────────────────────────────────────────────

function FeatureTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2.5">
      {tags.map(tag => (
        <span
          key={tag}
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-200 dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.05] text-gray-600 dark:text-zinc-600"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

// ─── T&C checkbox ───────────────────────────────────────────────────────────────

function TncCheckbox({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className="flex items-start gap-2.5 px-3.5 py-3 bg-gray-100 dark:bg-[#0a0a0b] border border-gray-200 dark:border-white/[0.04] rounded-xl cursor-pointer hover:border-gray-300 dark:hover:border-white/[0.08] transition-all"
    >
      <div
        className={cn(
          'w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-150',
          checked
            ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-500/40'
            : 'bg-transparent border-gray-300 dark:border-white/[0.2]'
        )}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="text-[12px] text-gray-600 dark:text-zinc-600 leading-relaxed select-none">
        Saya menyetujui{' '}
        <Link
          href="/terms"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          onClick={e => e.stopPropagation()}
        >
          Syarat & Ketentuan
        </Link>{' '}
        dan{' '}
        <Link
          href="/privacy"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          onClick={e => e.stopPropagation()}
        >
          Kebijakan Privasi
        </Link>{' '}
        NingClean
      </p>
    </div>
  )
}

// ─── Estimate end time ──────────────────────────────────────────────────────────

function estimateEnd(startTime: string, durationHours = 6): string {
  const [h, m] = startTime.split(':').map(Number)
  const endH = (h + durationHours) % 24
  return `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function ConfirmationStep({
  selectedService,
  scheduledDate,
  scheduledTime,
  address,
  city,
  area,
  notes,
  customerName,
  customerEmail,
  customerPhone,
  isSubmitting,
  onBack,
  onSubmit,
}: ConfirmationStepProps) {
  const [agreed, setAgreed] = useState(false)

  const features: string[] = (selectedService as any)?.features ?? []
  const duration: string = (selectedService as any)?.duration ?? ''
  const durationHours: number = (selectedService as any)?.durationHours ?? 6
  
  // Guest email/phone/name validation - BLOCK if empty or invalid
  const missingFields: string[] = []
  
  // Validate customerName
  if (!customerName || customerName.trim().length === 0) {
    missingFields.push('Nama Lengkap')
  }
  
  // Validate customerEmail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!customerEmail || customerEmail.trim().length === 0) {
    missingFields.push('Email')
  } else if (!emailRegex.test(customerEmail)) {
    missingFields.push('Email (format tidak valid)')
  }
  
  // Validate customerPhone
  if (!customerPhone || customerPhone.trim().length === 0) {
    missingFields.push('Nomor WhatsApp')
  }
  
  // Validate address
  if (!address || address.trim().length === 0) {
    missingFields.push('Alamat Lengkap')
  }
  
  // Validate area
  if (!area || area.trim().length === 0) {
    missingFields.push('Luas Area')
  }
  
  const allRequiredFieldsFilled = missingFields.length === 0
  const canSubmit = agreed && allRequiredFieldsFilled && !isSubmitting

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-white/[0.04]">
          <h2 className="text-[18px] font-bold text-gray-900 dark:text-zinc-100 tracking-tight">Review & Konfirmasi</h2>
          <p className="text-[12px] text-gray-500 dark:text-zinc-600 mt-0.5">Pastikan semua informasi sudah benar sebelum memesan</p>
        </div>

        <div className="p-5 space-y-3">

          {/* Summary grid */}
          <div className="grid grid-cols-2 gap-2.5">

            <ReviewBlock icon={User} label="Data Diri">
              <BlockPrimary>{customerName}</BlockPrimary>
              <BlockSecondary>
                {customerEmail}
                <br />
                WA: {customerPhone}
              </BlockSecondary>
            </ReviewBlock>

            <ReviewBlock icon={Calendar} label="Jadwal">
              <BlockPrimary highlight>{formatDate(scheduledDate)}</BlockPrimary>
              <BlockSecondary>
                Pukul {scheduledTime} WIB
                {scheduledTime && (
                  <>
                    <br />
                    Est. selesai {estimateEnd(scheduledTime, durationHours)} WIB
                  </>
                )}
              </BlockSecondary>
            </ReviewBlock>

            <ReviewBlock icon={Package} label="Layanan" full>
              <BlockPrimary>{selectedService?.name ?? '-'}</BlockPrimary>
              {(selectedService as any)?.category && (
                <BlockSecondary>{(selectedService as any).category}</BlockSecondary>
              )}
              {features.length > 0 && <FeatureTags tags={features} />}
              {duration && (
                <FeatureTags tags={[duration]} />
              )}
            </ReviewBlock>

            <ReviewBlock icon={MapPin} label="Lokasi" full>
              <BlockPrimary>{address}</BlockPrimary>
              <BlockSecondary>
                {[city, area ? `${area} m²` : ''].filter(Boolean).join(' · ')}
              </BlockSecondary>
            </ReviewBlock>

            {notes && (
              <ReviewBlock icon={FileText} label="Catatan" full>
                <p className="text-[12px] text-gray-600 dark:text-zinc-600 leading-relaxed italic">"{notes}"</p>
              </ReviewBlock>
            )}

          </div>

          {/* Total box */}
          <div className="bg-blue-50 dark:bg-blue-500/[0.05] border border-blue-200 dark:border-blue-500/20 rounded-xl px-4 py-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-blue-700/70 dark:text-blue-400/70">Total Pembayaran</span>
              <span className="text-[24px] font-extrabold text-blue-600 dark:text-blue-300 tracking-tight">
                {selectedService ? formatPrice(selectedService.price) : '—'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <Info className="w-3.5 h-3.5 text-blue-500/40 flex-shrink-0" />
              <p className="text-[11px] text-blue-600/60 dark:text-blue-500/40">
                Pembayaran dilakukan setelah layanan selesai
              </p>
            </div>
          </div>

          {/* Error Message for missing fields */}
          {!allRequiredFieldsFilled && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4">
              <p className="text-[12px] font-medium text-red-700 dark:text-red-400 mb-1">
                Silakan lengkapi data berikut:
              </p>
              <ul className="text-[12px] text-red-600 dark:text-red-400 list-disc list-inside">
                {missingFields.map((field, i) => (
                  <li key={i}>{field}</li>
                ))}
              </ul>
            </div>
          )}

          {/* T&C */}
          <TncCheckbox checked={agreed} onChange={setAgreed} />

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-white/[0.04]">
            <button
              onClick={onBack}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-transparent text-[14px] font-semibold text-gray-600 dark:text-zinc-600 hover:bg-gray-100 dark:hover:bg-white/[0.04] hover:text-gray-800 dark:hover:text-zinc-300 hover:border-gray-300 dark:hover:border-white/[0.1] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali
            </button>

            <motion.button
              onClick={canSubmit ? onSubmit : undefined}
              animate={{ opacity: canSubmit ? 1 : 0.35 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl border text-[14px] font-bold transition-all',
                'bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/30 text-blue-600 dark:text-blue-300',
                canSubmit
                  ? 'hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/50 cursor-pointer'
                  : 'cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Konfirmasi Booking
                </>
              )}
            </motion.button>
          </div>

        </div>
      </div>
    </motion.div>
  )
}
