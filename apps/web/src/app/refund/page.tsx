'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { SectionLoader } from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { RefreshCw, Clock, CheckCircle, XCircle, MessageCircle, ChevronRight } from 'lucide-react';

const eligibilityItems = [
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: 'Layanan Tidak Sesuai',
    description: 'Hasil cleaning tidak sesuai dengan standar atau scope yang disepakati.',
    color: 'emerald',
  },
  {
    icon: <XCircle className="w-5 h-5" />,
    title: 'Tim Tidak Datang',
    description: 'Tim kami tidak arrive sesuai jadwal tanpa pemberitahuan sebelumnya.',
    color: 'rose',
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    title: 'Masalah Kualitas',
    description: 'Area yang dibersihkan masih kotor atau ada yang terlewatkan.',
    color: 'blue',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Booking Dibatalkan Kami',
    description: 'Booking dibatalkan oleh Ningclean karena alasan internal.',
    color: 'amber',
  },
];

const refundSteps = [
  {
    step: 1,
    title: 'Ajukan Komplain',
    description: 'Hubungi kami via WhatsApp dalam 24 jam setelah layanan, sertakan foto/video bukti.',
    icon: '📱',
  },
  {
    step: 2,
    title: 'Verifikasi & Review',
    description: 'Tim kami akan review dalam 1x24 jam dan konfirmasi kelayakan refund.',
    icon: '🔍',
  },
  {
    step: 3,
    title: 'Persetujuan Refund',
    description: 'Setelah disetujui, refund akan diproses dan kamu akan terima konfirmasi.',
    icon: '✅',
  },
  {
    step: 4,
    title: 'Dana Masuk',
    description: 'Refund masuk ke rekening/kartu kamu dalam 5-7 hari kerja.',
    icon: '💰',
  },
];

const notEligible = [
  'Kerusakan yang caused oleh faktor eksternal (bencana alam, dll)',
  'Komplain diajukan lebih dari 24 jam setelah layanan',
  'Kondisi rumah telah diubah setelah layanan selesai',
  'Permintaan refund tanpa alasan yang jelas',
  'Booking yang sudah digunakan jasa layanan secara penuh',
];

export default function RefundPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SectionLoader />;
  }

  return (
    <div className="min-h-screen page-bg">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full hero-glow-1 blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full hero-glow-2 blur-[100px]" />
        </div>

        <div className="relative container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full page-badge mb-6">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span className="text-[12px] font-semibold text-emerald-400 tracking-wider uppercase">
                Kebijakan Refund
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl page-text mb-4">
              Garansi Uang<br />
              <em className="italic text-emerald-400">Kembali 100%</em>
            </h1>
            <p className="text-[15px] page-text-muted max-w-xl mx-auto">
              Kami percaya diri dengan kualitas layanan kami. Namun jika kamu tidak puas, kami siap refund dengan cepat dan tanpa ribet.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="pb-16">
        <div className="relative container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-semibold page-text mb-2">Kapan Bisa Refund?</h2>
            <p className="text-[14px] page-text-muted">Refund berlaku untuk kondisi berikut:</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {eligibilityItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.08 }}
                className="page-section-card border rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    item.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' :
                    item.color === 'rose' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20' :
                    item.color === 'blue' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20' :
                    'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                  }`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold page-text mb-1.5">{item.title}</h3>
                    <p className="text-[13px] page-text-muted leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Process Timeline */}
      <section className="pb-16">
        <div className="relative container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold page-text mb-2">Proses Refund</h2>
            <p className="text-[14px] page-text-muted">4 langkah mudah untuk ajukan refund:</p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[27px] top-12 bottom-12 w-px page-border" />

            <div className="space-y-6">
              {refundSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="relative flex items-start gap-6"
                >
                  {/* Step number */}
                  <div className="relative z-10 w-14 h-14 rounded-2xl page-section-card  flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{step.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="page-section-card border rounded-2xl p-6 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase">
                        Langkah {step.step}
                      </span>
                    </div>
                    <h3 className="font-semibold page-text mb-1">{step.title}</h3>
                    <p className="text-[13px] page-text-muted leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Not Eligible */}
      <section className="pb-16">
        <div className="relative container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/15 rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-rose-400" />
              </div>
              <h2 className="text-xl font-semibold page-text">Tidak Berlaku Refund</h2>
            </div>
            <ul className="space-y-3">
              {notEligible.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[14px] page-text-muted">
                  <XCircle className="w-4 h-4 text-rose-400/60 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="relative container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-section-card border rounded-2xl p-8 text-center"
          >
            <h3 className="text-xl font-semibold page-text mb-3">
              Butuh Ajukan Refund?
            </h3>
            <p className="text-[14px] page-text-muted mb-6 max-w-md mx-auto">
              Hubungi tim kami via WhatsApp untuk proses refund yang cepat dan mudah. Kami typically respond dalam 1x24 jam.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://wa.me/6281234567890?text=Halo,%20saya%20ingin%20mengajukan%20refund" target="_blank" rel="noopener noreferrer">
                <Button variant="accent" size="lg" className="gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Ajukan via WhatsApp
                </Button>
              </a>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="page-border page-text-muted hover:page-section-card">
                  Hubungi Kami
                </Button>
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t page-border">
              <p className="text-[12px] page-text-muted">
                Atau email ke <span className="text-emerald-400/70">hello@ningclean.id</span> dengan subject "Pengajuan Refund"
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
