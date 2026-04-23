'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { Service } from '@/types/api'
import { cn, formatPrice } from '@/lib/utils'

// ─── Constants ─────────────────────────────────────────────────────────────────

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00',
]

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ScheduleStepProps {
  selectedService: Service | null
  scheduledDate: string
  scheduledTime: string
  /** Optional: array of time strings that are already booked/unavailable */
  unavailableSlots?: string[]
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
  onBack: () => void
  onNext: () => void
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function estimateEndTime(startTime: string, durationHours = 3): string {
  const [h, min] = startTime.split(':').map(Number)
  const endH = (h + durationHours) % 24
  return `${String(endH).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

const today = new Date().toISOString().split('T')[0]

// ─── Service chip ───────────────────────────────────────────────────────────────

function ServiceChip({ service }: { service: Service }) {
  const duration = (service as any).duration as string | undefined
  const emoji = (service as any).iconEmoji as string | undefined

  return (
    <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-500/[0.05] border border-blue-200 dark:border-blue-500/20 rounded-xl p-3.5 mb-5">
      <div className="w-9 h-9 rounded-[9px] bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/15 flex items-center justify-center flex-shrink-0 text-lg leading-none">
        {emoji ?? '✨'}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-bold text-blue-700 dark:text-blue-100 truncate">{service.name}</p>
        <p className="text-[11px] text-blue-600/70 dark:text-blue-400/60 mt-0.5">
          {formatPrice(service.price)}{duration ? ` · ${duration}` : ''}
        </p>
      </div>
    </div>
  )
}

// ─── Time slot grid ─────────────────────────────────────────────────────────────

function TimeSlotGrid({
  slots,
  selected,
  unavailable,
  onSelect,
}: {
  slots: string[]
  selected: string
  unavailable: string[]
  onSelect: (t: string) => void
}) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-1.5">
      {slots.map(time => {
        const isSelected = selected === time
        const isUnavailable = unavailable.includes(time)
        return (
          <button
            key={time}
            type="button"
            disabled={isUnavailable}
            onClick={() => onSelect(time)}
            className={cn(
              'py-2 px-1 rounded-lg text-[12px] font-semibold border transition-all duration-150 text-center',
              isSelected && 'bg-blue-50 dark:bg-blue-500/10 border-blue-400 dark:border-blue-500/40 text-blue-600 dark:text-blue-300 shadow-[0_0_0_1px_rgba(74,158,255,0.2)]',
              !isSelected && !isUnavailable && 'bg-gray-100 dark:bg-[#0a0a0b] border-gray-200 dark:border-white/[0.05] text-gray-600 dark:text-zinc-500 hover:bg-gray-200 dark:hover:bg-white/[0.04] hover:border-gray-300 dark:hover:border-white/[0.1] hover:text-gray-800 dark:hover:text-zinc-300',
              isUnavailable && 'bg-gray-100/50 dark:bg-transparent border-gray-200 dark:border-white/[0.03] text-gray-300 dark:text-zinc-700 cursor-not-allowed line-through'
            )}
          >
            {time}
          </button>
        )
      })}
    </div>
  )
}

// ─── Summary box ────────────────────────────────────────────────────────────────

function SummaryBox({
  date,
  time,
  durationHours,
}: {
  date: string
  time: string
  durationHours?: number
}) {
  const hasDate = !!date
  const hasTime = !!time

  return (
    <div className="bg-gray-100 dark:bg-[#0a0a0b] border border-gray-200 dark:border-white/[0.04] rounded-xl p-3.5 space-y-2">
      <SummaryRow
        label="Tanggal"
        value={hasDate ? formatDisplayDate(date) : undefined}
      />
      <SummaryRow
        label="Waktu mulai"
        value={hasTime ? `${time} WIB` : undefined}
      />
      <SummaryRow
        label="Estimasi selesai"
        value={hasTime ? `${estimateEndTime(time, durationHours ?? 3)} WIB` : undefined}
      />
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-gray-500 dark:text-zinc-600">{label}</span>
      <span className={cn(
        'text-[12px] font-semibold transition-colors',
        value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-zinc-500'
      )}>
        {value ?? 'Belum dipilih'}
      </span>
    </div>
  )
}

// ─── Field label ────────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.8px] text-gray-500 dark:text-zinc-500 mb-2.5">
      {children}
    </p>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function ScheduleStep({
  selectedService,
  scheduledDate,
  scheduledTime,
  unavailableSlots = [],
  onDateChange,
  onTimeChange,
  onBack,
  onNext,
}: ScheduleStepProps) {
  const canProceed = !!scheduledDate && !!scheduledTime
  const durationHours = (selectedService as any)?.durationHours as number | undefined

  const handleNext = () => {
    if (!canProceed) return
    onNext()
  }

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
          <h2 className="text-[18px] font-bold text-gray-900 dark:text-zinc-100 tracking-tight">Pilih Jadwal</h2>
          <p className="text-[12px] text-gray-500 dark:text-zinc-500 mt-0.5">Tentukan tanggal & waktu layanan</p>
        </div>

        <div className="p-5 space-y-5">

          {/* Selected service chip */}
          {selectedService && <ServiceChip service={selectedService} />}

          {/* Date */}
          <div>
            <FieldLabel>Tanggal Layanan</FieldLabel>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500 pointer-events-none" />
              <input
                type="date"
                value={scheduledDate}
                min={today}
                onChange={e => onDateChange(e.target.value)}
                className="w-full h-10 bg-gray-100 dark:bg-[#0a0a0b] border border-gray-200 dark:border-white/[0.05] rounded-xl pl-9 pr-3 text-[14px] text-gray-800 dark:text-zinc-300 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500/40 focus:ring-1 focus:ring-blue-400/20 dark:focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          {/* Time */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <FieldLabel>Waktu Mulai</FieldLabel>
              {unavailableSlots.length > 0 && (
                <span className="text-[10px] text-gray-400 dark:text-zinc-600">
                  <span className="line-through">——</span> tidak tersedia
                </span>
              )}
            </div>
            <TimeSlotGrid
              slots={TIME_SLOTS}
              selected={scheduledTime}
              unavailable={unavailableSlots}
              onSelect={onTimeChange}
            />
          </div>

          {/* Summary */}
          <SummaryBox
            date={scheduledDate}
            time={scheduledTime}
            durationHours={durationHours}
          />

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
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
                canProceed && 'hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/50 cursor-pointer',
                !canProceed && 'cursor-not-allowed'
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
