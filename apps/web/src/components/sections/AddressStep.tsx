'use client';

import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Input from '@/components/ui/Input';

interface AddressStepProps {
  address: string;
  city: string;
  notes: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onAddressChange: (address: string) => void;
  onCityChange: (city: string) => void;
  onNotesChange: (notes: string) => void;
  onCustomerNameChange: (name: string) => void;
  onCustomerEmailChange: (email: string) => void;
  onCustomerPhoneChange: (phone: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function AddressStep({
  address,
  city,
  notes,
  customerName,
  customerEmail,
  customerPhone,
  onAddressChange,
  onCityChange,
  onNotesChange,
  onCustomerNameChange,
  onCustomerEmailChange,
  onCustomerPhoneChange,
  onBack,
  onNext,
}: AddressStepProps) {
  const handleSubmit = () => {
    if (!address) {
      alert('Mohon isi alamat');
      return;
    }
    if (!customerName) {
      alert('Mohon isi nama Anda');
      return;
    }
    if (!customerEmail) {
      alert('Mohon isi email Anda');
      return;
    }
    if (!customerPhone) {
      alert('Mohon isi nomor WhatsApp Anda');
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
          <h2 className="text-2xl font-bold text-foreground mb-6">Data Diri & Alamat</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nama Lengkap"
                placeholder="John Doe"
                value={customerName}
                onChange={(e) => onCustomerNameChange(e.target.value)}
              />
              <Input
                label="Nomor WhatsApp"
                placeholder="081234567890"
                value={customerPhone}
                onChange={(e) => onCustomerPhoneChange(e.target.value)}
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              value={customerEmail}
              onChange={(e) => onCustomerEmailChange(e.target.value)}
            />

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
