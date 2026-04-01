'use client';

import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';

interface AddressStepProps {
  address: string;
  city: string;
  notes: string;
  onAddressChange: (address: string) => void;
  onCityChange: (city: string) => void;
  onNotesChange: (notes: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function AddressStep({
  address,
  city,
  notes,
  onAddressChange,
  onCityChange,
  onNotesChange,
  onBack,
  onNext,
}: AddressStepProps) {
  const handleSubmit = () => {
    if (!address) {
      alert('Mohon isi alamat');
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
          <h2 className="text-2xl font-bold text-foreground mb-6">Alamat</h2>
          
          <div className="space-y-6">
            <Textarea
              label="Alamat Lengkap"
              placeholder="Contoh: Jl. Raya Surabaya No. 123, RT 01/RW 02, Kelurahan..."
              rows={4}
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
            />

            <Select
              label="Kota"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              options={[
                { value: 'Surabaya', label: 'Surabaya' },
                { value: 'Sidoarjo', label: 'Sidoarjo' },
                { value: 'Gresik', label: 'Gresik' },
              ]}
            />

            <Textarea
              label="Catatan (Opsional)"
              placeholder="Catatan khusus untuk tim cleaning..."
              rows={3}
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              hint="Contoh: Ada hewan peliharaan, akses khusus, dll"
            />
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
