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
  iconColor?: string
  format?: 'number' | 'currency'
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'text-primary',
  format = 'number',
}: StatCardProps) {
  const isPositive = change && change > 0
  const displayValue = format === 'currency' && typeof value === 'number' ? formatCurrency(value) : value

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
      className="flex flex-col rounded-xl border bg-white p-6 transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{displayValue}</p>
        </div>
        <div className={cn('rounded-lg bg-gray-100 p-3', iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {change !== undefined && (
        <div className="mt-4 flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-error" />
          )}
          <span className={cn('text-sm font-medium', isPositive ? 'text-success' : 'text-error')}>
            {isPositive ? '+' : ''}{change}%
          </span>
          {changeLabel && <span className="text-sm text-gray-500">{changeLabel}</span>}
        </div>
      )}
    </motion.div>
  )
}
