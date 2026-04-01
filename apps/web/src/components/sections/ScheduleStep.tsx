'use client';

import { motion } from 'framer-motion';
import { Service } from '@/types/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatPrice } from '@/lib/utils';

interface ScheduleStepProps {
  selectedService: Service | null;
  scheduledDate: string;
  scheduledTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00',
];

export default function ScheduleStep({
  selectedService,
  scheduledDate,
  scheduledTime,
  onDateChange,
  onTimeChange,
  onBack,
  onNext,
}: ScheduleStepProps) {
  const handleSubmit = () => {
    if (!scheduledDate || !scheduledTime) {
      alert('Mohon isi tanggal dan waktu');
      return;
    }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Pilih Jadwal</h2>
          
          {selectedService && (
            <div className="bg-primary-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-primary-600 font-medium">Layanan Dipilih</p>
              <p className="font-semibold text-foreground">{selectedService.name}</p>
              <p className="text-sm text-gray-500">{formatPrice(selectedService.price)}</p>
            </div>
          )}

          <div className="space-y-6">
            <Input
              label="Tanggal"
              type="date"
              value={scheduledDate}
              onChange={(e) => onDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Waktu</label>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => onTimeChange(time)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      scheduledTime === time
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={onBack}>
              Kembali
            </Button>
            <Button onClick={handleSubmit}>
              Lanjut
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
