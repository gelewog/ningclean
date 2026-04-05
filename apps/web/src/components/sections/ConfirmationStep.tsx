'use client';

import { motion } from 'framer-motion';
import { Service } from '@/types/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatPrice, formatDate } from '@/lib/utils';

interface ConfirmationStepProps {
  selectedService: Service | null;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  city: string;
  notes: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export default function ConfirmationStep({
  selectedService,
  scheduledDate,
  scheduledTime,
  address,
  city,
  notes,
  customerName,
  customerEmail,
  customerPhone,
  isSubmitting,
  onBack,
  onSubmit,
}: ConfirmationStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Review & Konfirmasi</h2>
          
          {/* Booking Summary */}
          <div className="space-y-4">
            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Data Diri</p>
              <p className="font-semibold text-foreground">{customerName}</p>
              <p className="text-sm text-gray-500">{customerEmail}</p>
              <p className="text-sm text-gray-500">WA: {customerPhone}</p>
            </div>

            {/* Service */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Layanan</p>
              <p className="font-semibold text-foreground">{selectedService?.name}</p>
              <p className="text-sm text-gray-500">{selectedService?.category}</p>
            </div>

            {/* Schedule */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Jadwal</p>
              <p className="font-semibold text-foreground">{formatDate(scheduledDate)}</p>
              <p className="text-sm text-gray-500">Pukul {scheduledTime}</p>
            </div>

            {/* Address */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Alamat</p>
              <p className="font-semibold text-foreground">{address}</p>
              <p className="text-sm text-gray-500">{city}</p>
            </div>

            {/* Notes */}
            {notes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Catatan</p>
                <p className="text-sm text-foreground">{notes}</p>
              </div>
            )}

            {/* Total */}
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Total Pembayaran</span>
                <span className="text-2xl font-bold text-primary">
                  {selectedService ? formatPrice(selectedService.price) : '-'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Pembayaran dilakukan setelah layanan selesai</p>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={onBack}>
              Kembali
            </Button>
            <Button onClick={onSubmit} isLoading={isSubmitting}>
              Konfirmasi Booking
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
