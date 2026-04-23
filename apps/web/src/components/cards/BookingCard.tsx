'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Booking } from '@/types/api';
import { formatDate, formatPrice, getStatusColor, getStatusLabel } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';

interface BookingCardProps {
  booking: Booking;
  index?: number;
  showActions?: boolean;
}

export default function BookingCard({ booking, index = 0, showActions = true }: BookingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">ID Booking</p>
            <p className="font-mono font-semibold text-foreground">{booking.id.slice(0, 8)}</p>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {getStatusLabel(booking.status)}
          </Badge>
        </div>

        {/* Service Info */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate">
              {booking.service?.name || 'Layanan'}
            </h4>
            <p className="text-sm text-gray-500">
              {booking.service?.category || 'Cleaning'}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Tanggal</p>
            <p className="text-sm font-medium text-foreground">
              {formatDate(booking.scheduledDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Waktu</p>
            <p className="text-sm font-medium text-foreground">{booking.scheduledTime}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-400 mb-1">Alamat</p>
            <p className="text-sm font-medium text-foreground truncate">
              {booking.address}
            </p>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-xl font-bold text-primary">
            {formatPrice(booking.totalPrice)}
          </span>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="mt-4 flex gap-2">
            <Link
              href={`/booking/${booking.id}`}
              className="flex-1 px-4 py-2 bg-primary text-white text-center text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Detail
            </Link>
            {booking.status === 'PENDING' && (
              <button className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Batalkan
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}