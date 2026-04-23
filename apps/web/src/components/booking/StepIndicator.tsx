'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Step {
  id: number
  label: string
  description?: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  className?: string
}

// ─── Connector ─────────────────────────────────────────────────────────────────

function Connector({ done }: { done: boolean }) {
  return (
    <div className="relative flex-1 min-w-[40px] max-w-[80px] h-px mt-[19px] bg-gray-200 dark:bg-white/[0.06] overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 bg-blue-500/60"
        initial={false}
        animate={{ width: done ? '100%' : '0%' }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  )
}

// ─── Step circle ────────────────────────────────────────────────────────────────

function StepCircle({
  isCompleted,
  isCurrent,
  stepId,
}: {
  isCompleted: boolean
  isCurrent: boolean
  stepId: number
}) {
  return (
    <motion.div
      initial={false}
      animate={{ scale: isCurrent ? 1.08 : 1 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'relative w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all duration-300',
        isCompleted && 'bg-blue-500/10 border border-blue-500/40',
        isCurrent && 'bg-blue-500/10 border border-blue-400/60 shadow-[0_0_0_4px_rgba(74,158,255,0.07)]',
        !isCompleted && !isCurrent && 'bg-gray-100 dark:bg-white/[0.03] border border-gray-300 dark:border-white/[0.06]'
      )}
    >
      {isCompleted ? (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Check className="w-4 h-4 text-blue-500 dark:text-blue-400" strokeWidth={2.5} />
        </motion.div>
      ) : (
        <span
          className={cn(
            'text-[14px] font-bold tabular-nums',
            isCurrent ? 'text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-zinc-400'
          )}
        >
          {stepId}
        </span>
      )}
    </motion.div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function StepIndicator({
  steps,
  currentStep,
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn('flex items-start justify-center', className)}>
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep
        const isCurrent = step.id === currentStep
        const isLast = index === steps.length - 1

        return (
          <div key={step.id} className="flex items-start">
            {/* Step */}
            <div className="flex flex-col items-center">
              <StepCircle
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                stepId={step.id}
              />

              {/* Label */}
              <div className="mt-3 text-center w-24">
                <motion.p
                  initial={false}
                  className={cn(
                    'text-[13px] font-semibold leading-tight transition-colors duration-200',
                    isCurrent
                      ? 'text-gray-900 dark:text-white'
                      : isCompleted
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  )}
                >
                  {step.label}
                </motion.p>
                {step.description && (
                  <p
                    className={cn(
                      'text-[11px] mt-1 leading-snug transition-colors duration-200',
                      isCurrent
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-gray-400 dark:text-gray-600'
                    )}
                  >
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connector */}
            {!isLast && <Connector done={isCompleted} />}
          </div>
        )
      })}
    </div>
  )
}
