'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { StepIndicator } from '@/components/booking';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { SectionLoader } from '@/components/ui/Spinner';
import { servicesApi, bookingsApi } from '@/lib/api';
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

function SuccessOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="dark:bg-slate-900 bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 dark:bg-emerald-500/20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 dark:text-emerald-400 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-2">Booking Berhasil!</h2>
        <p className="dark:text-white/60 text-gray-600 mb-6">
          Terima kasih telah melakukan booking. Tim kami akan segera menghubungi Anda melalui WhatsApp untuk konfirmasi lebih lanjut.
        </p>
        <Button onClick={onClose} className="w-full">
          Kembali ke Beranda
        </Button>
      </motion.div>
    </motion.div>
  );
}

function ErrorMessage({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed top-24 left-1/2 -translate-x-1/2 z-50 dark:bg-red-900/30 dark:border-red-500/30 dark:text-red-400 bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3"
    >
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 dark:text-red-400 hover:dark:text-red-300 text-red-400 hover:text-red-600">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
}

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form data
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    scheduledDate: '',
    scheduledTime: '',
    address: '',
    city: 'Surabaya',
    area: '',
    notes: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesApi.getAll();
        const servicesData = Array.isArray(response) ? response : (response.data || []);
        const activeServices = servicesData.filter((s: any) => s.isActive);
        setServices(activeServices);
        
        // Check if service ID is passed in URL
        const serviceId = searchParams.get('service');
        if (serviceId) {
          const preSelected = activeServices.find((s: any) => s.id === serviceId);
          if (preSelected) {
            setSelectedService(preSelected);
            setCurrentStep(2); // Skip to schedule step
          }
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!selectedService) return;

    setSubmitting(true);
    setErrorMessage(null);
    try {
      await bookingsApi.create({
        serviceDate: formData.scheduledDate,
        serviceTime: formData.scheduledTime,
        address: `${formData.address}, ${formData.city}`,
        area: '50 m²',
        notes: formData.notes,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        items: [
          {
            serviceId: selectedService.id,
            quantity: 1,
          },
        ],
      });

      setShowSuccess(true);
    } catch (error: any) {
      console.error('Booking failed:', error);
      const errorMsg = error?.message || 'Terjadi kesalahan. Silakan coba lagi.';
      setErrorMessage(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push('/');
  };

  if (loading) {
    return <SectionLoader />;
  }

  return (
    <div className="min-h-screen page-bg">
      <Navigation />

      {/* Error Message */}
      <AnimatePresence>
        {errorMessage && (
          <ErrorMessage message={errorMessage} onClose={() => setErrorMessage(null)} />
        )}
      </AnimatePresence>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && <SuccessOverlay onClose={handleSuccessClose} />}
      </AnimatePresence>

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
                  area={formData.area}
                  notes={formData.notes}
                  customerName={formData.customerName}
                  customerEmail={formData.customerEmail}
                  customerPhone={formData.customerPhone}
                  onAddressChange={(address) => setFormData({ ...formData, address })}
                  onCityChange={(city) => setFormData({ ...formData, city })}
                  onAreaChange={(area) => setFormData({ ...formData, area })}
                  onNotesChange={(notes) => setFormData({ ...formData, notes })}
                  onCustomerNameChange={(name) => setFormData({ ...formData, customerName: name })}
                  onCustomerEmailChange={(email) => setFormData({ ...formData, customerEmail: email })}
                  onCustomerPhoneChange={(phone) => setFormData({ ...formData, customerPhone: phone })}
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
                  area={formData.area}
                  notes={formData.notes}
                  customerName={formData.customerName}
                  customerEmail={formData.customerEmail}
                  customerPhone={formData.customerPhone}
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
