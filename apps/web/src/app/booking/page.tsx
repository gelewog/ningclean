'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { StepIndicator } from '@/components/booking';
import Button from '@/components/ui/Button';
import { SectionLoader } from '@/components/ui/Spinner';
import { servicesApi, bookingsApi, isAuthenticated } from '@/lib/api';
import { Service } from '@/types/api';
import BookingHeaderSection from '@/components/sections/BookingHeaderSection';
import ServiceSelectionStep from '@/components/sections/ServiceSelectionStep';
import ScheduleStep from '@/components/sections/ScheduleStep';
import AddressStep from '@/components/sections/AddressStep';
import ConfirmationStep from '@/components/sections/ConfirmationStep';

const steps = [
  { id: 1, label: 'Pilih Layanan', description: 'Service' },
  { id: 2, label: 'Jadwal', description: 'Date & Time' },
  { id: 3, label: 'Alamat', description: 'Address' },
  { id: 4, label: 'Konfirmasi', description: 'Review' },
];

export default function BookingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    scheduledDate: '',
    scheduledTime: '',
    address: '',
    city: 'Surabaya',
    notes: '',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login?redirect=/booking');
      return;
    }

    const fetchServices = async () => {
      try {
        const data = await servicesApi.getAll();
        setServices(data.data || []);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [router]);

  const handleSubmit = async () => {
    if (!selectedService) return;

    setSubmitting(true);
    try {
      await bookingsApi.create({
        serviceId: selectedService.id,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        address: `${formData.address}, ${formData.city}`,
        notes: formData.notes,
      });

      alert('Booking berhasil! Kami akan menghubungi Anda untuk konfirmasi.');
      router.push('/dashboard');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <SectionLoader />;
  }

  return (
    <div className="min-h-screen page-bg">
      <Navigation />

      <main>
        <BookingHeaderSection />

        {/* Step Indicator */}
        <section className="py-6 page-bg border-b page-border sticky top-16 z-30">
          <div className="container mx-auto px-6 max-w-5xl">
            <StepIndicator steps={steps} currentStep={currentStep} />
          </div>
        </section>

        {/* Form Content */}
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-5xl">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <ServiceSelectionStep
                  key="step1"
                  services={services}
                  selected={selectedService}
                  onSelect={(service) => {
                    setSelectedService(service);
                    setCurrentStep(2);
                  }}
                />
              )}

              {currentStep === 2 && (
                <ScheduleStep
                  key="step2"
                  selectedService={selectedService}
                  scheduledDate={formData.scheduledDate}
                  scheduledTime={formData.scheduledTime}
                  onDateChange={(date) => setFormData({ ...formData, scheduledDate: date })}
                  onTimeChange={(time) => setFormData({ ...formData, scheduledTime: time })}
                  onBack={() => setCurrentStep(1)}
                  onNext={() => setCurrentStep(3)}
                />
              )}

              {currentStep === 3 && (
                <AddressStep
                  key="step3"
                  address={formData.address}
                  city={formData.city}
                  notes={formData.notes}
                  onAddressChange={(address) => setFormData({ ...formData, address })}
                  onCityChange={(city) => setFormData({ ...formData, city })}
                  onNotesChange={(notes) => setFormData({ ...formData, notes })}
                  onBack={() => setCurrentStep(2)}
                  onNext={() => setCurrentStep(4)}
                />
              )}

              {currentStep === 4 && (
                <ConfirmationStep
                  key="step4"
                  selectedService={selectedService}
                  scheduledDate={formData.scheduledDate}
                  scheduledTime={formData.scheduledTime}
                  address={formData.address}
                  city={formData.city}
                  notes={formData.notes}
                  isSubmitting={submitting}
                  onBack={() => setCurrentStep(3)}
                  onSubmit={handleSubmit}
                />
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
