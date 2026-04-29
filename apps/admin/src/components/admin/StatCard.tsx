'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: LucideIcon
  iconBg?: string
  format?: 'number' | 'currency'
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconBg = 'bg-gradient-to-br from-blue-500 to-blue-600',
  format = 'number',
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0
  const displayValue = format === 'currency' && typeof value === 'number' ? formatCurrency(value) : value

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-100/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 p-6 shadow-sm dark:shadow-slate-900/50 backdrop-blur-sm hover:shadow-xl dark:hover:shadow-slate-900/70"
    >
      {/* Decorative background gradient */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-blue-100/40 to-purple-100/40 dark:from-blue-900/20 dark:to-purple-900/20 blur-2xl transition-transform duration-500 group-hover:scale-150" />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{displayValue}</p>
          </div>
          <div className={cn(
            'relative flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg',
            iconBg
          )}>
            <Icon className="h-6 w-6 text-white" />
            {/* Shine effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 via-white/10 to-transparent" />
          </div>
        </div>

        {change !== undefined && (
          <div className="mt-4 flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold',
              isPositive && 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
              isNegative && 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
              !isPositive && !isNegative && 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300'
            )}>
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : isNegative ? (
                <TrendingDown className="h-3 w-3" />
              ) : null}
              <span>{isPositive ? '+' : ''}{change}%</span>
            </div>
            {changeLabel && (
              <span className="text-xs text-gray-400">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
