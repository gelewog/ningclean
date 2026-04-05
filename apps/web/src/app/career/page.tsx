'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { SectionLoader } from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { Briefcase, MapPin, ChevronDown, ChevronUp, Send, CheckCircle, Heart, Zap, Users, TrendingUp } from 'lucide-react';
import { getJobListings } from '@/lib/api';

const benefits = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Lingkungan Kerja Nyaman',
    description: 'Tim yang solid, kerjaan fleksibel, dan budaya perusahaan yang positif.',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Jenjang Karir Jelas',
    description: 'Promotion path transparan. Technician → Supervisor → Area Manager dalam 18 bulan.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Training & Sertifikasi',
    description: 'Free training cleaning profesional + sertifikasi resmi dari industri.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Benefit Lengkap',
    description: 'BPJS Kesehatan & Ketenagakerjaan, THR, bonus performance, dan alat kerja lengkap.',
  },
];

export default function CareerPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobListings();
        setJobs(data || []);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitStatus('success');
  };

  if (loading) return <SectionLoader />;

  const activeJobs = jobs.filter(job => job.isActive);

  return (
    <div className="min-h-screen page-bg">
      <Navigation />

      {/* hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[450px] h-[450px] rounded-full hero-glow-1 blur-[130px]" />
          <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] rounded-full hero-glow-2 blur-[110px]" />
        </div>

        <div className="relative container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full page-badge mb-6">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span className="text-[12px] font-semibold text-emerald-400 tracking-wider uppercase">
                Karir di Ningclean
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl page-text mb-5">
              Bergabung dengan<br />
              <em className="italic text-emerald-400">Tim Ningclean</em>
            </h1>
            <p className="text-[15px] page-text-muted leading-relaxed mb-8">
              Kami lagi grow pesat dan mencari orang-orang passionate untuk join tim. Kalau kamu suka cleaning, customer service, atau marketing — kita mungkin adalah tempat yang tepat.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-[13px] page-text-muted">
              <span className="px-3 py-1.5 rounded-full page-section-card border">
                💼 {activeJobs.length} Posisi Terbuka
              </span>
              <span className="px-3 py-1.5 rounded-full page-section-card border">
                📍 Surabaya & Sekitarnya
              </span>
              <span className="px-3 py-1.5 rounded-full page-section-card border">
                ⚡ Apply dalam 5 menit
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Join */}
      <section className="pb-16">
        <div className="relative container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-semibold page-text mb-2">Kenapa Join Ningclean?</h2>
            <p className="text-[14px] page-text-muted">Benefit yang kamu dapat sebagai bagian dari tim.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((b, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="page-section-card border rounded-2xl p-6 text-center hover:page-section-card transition-colors"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl page-icon-bg border flex items-center justify-center text-emerald-400">
                  {b.icon}
                </div>
                <h3 className="font-semibold page-text mb-2">{b.title}</h3>
                <p className="text-[13px] page-text-muted leading-relaxed">{b.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="pb-16">
        <div className="relative container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-semibold page-text mb-2">Lowongan Tersedia</h2>
            <p className="text-[14px] page-text-muted">Pilih posisi yang sesuai dengan passion dan skill kamu.</p>
          </motion.div>

          {activeJobs.length > 0 ? (
            <div className="space-y-4">
              {activeJobs.map((pos, idx) => (
                <motion.div
                  key={pos.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="page-section-card border rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(expandedId === pos.id ? null : pos.id)}
                    className="w-full p-6 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl page-icon-bg border flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold page-text">{pos.title}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Buka
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[12px] page-text-muted">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {pos.location}
                          </span>
                          {pos.salaryRange && (
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Rp</span>
                              {pos.salaryRange}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full page-section-card page-text-muted">
                            {pos.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="page-text-muted text-[12px] hidden sm:block">
                        {expandedId === pos.id ? 'Tutup' : 'Lihat Detail'}
                      </span>
                      {expandedId === pos.id ? (
                        <ChevronUp className="w-5 h-5 page-text-muted" />
                      ) : (
                        <ChevronDown className="w-5 h-5 page-text-muted" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedId === pos.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 border-t page-border pt-5">
                          <div className="grid md:grid-cols-2 gap-8">
                            <div>
                              <h4 className="text-[13px] font-semibold page-text-muted uppercase tracking-wider mb-3">Deskripsi</h4>
                              <p className="text-[14px] page-text-muted leading-relaxed mb-5">{pos.description}</p>

                              {pos.requirements && pos.requirements.length > 0 && (
                                <>
                                  <h4 className="text-[13px] font-semibold page-text-muted uppercase tracking-wider mb-3">Requirements</h4>
                                  <ul className="space-y-2">
                                    {pos.requirements.map((req: string, rIdx: number) => (
                                      <li key={rIdx} className="flex items-start gap-2.5 text-[13px] page-text-muted">
                                        <CheckCircle className="w-4 h-4 text-emerald-400/60 flex-shrink-0 mt-0.5" />
                                        {req}
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              )}
                            </div>

                            <div className="page-section-card rounded-xl p-5">
                              <h4 className="text-[13px] font-semibold page-text-muted uppercase tracking-wider mb-4">
                                Apply untuk posisi ini
                              </h4>
                              <form onSubmit={handleSubmit} className="space-y-3">
                                <input type="text" placeholder="Nama lengkap" className="w-full px-4 py-2.5 rounded-xl page-input border focus:outline-none focus:border-emerald-400 transition-colors" />
                                <input type="tel" placeholder="Nomor WhatsApp" className="w-full px-4 py-2.5 rounded-xl page-input border focus:outline-none focus:border-emerald-400 transition-colors" />
                                <input type="email" placeholder="Email" className="w-full px-4 py-2.5 rounded-xl page-input border focus:outline-none focus:border-emerald-400 transition-colors" />
                                <textarea placeholder="Ceritakan tentang diri kamu" rows={3} className="w-full px-4 py-2.5 rounded-xl page-section-card border page-text text-[13px] placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors resize-none" />
                                <Button type="submit" variant="accent" className="w-full gap-2" isLoading={submitStatus === 'loading'}>
                                  <Send className="w-4 h-4" />
                                  Kirim Lamaran
                                </Button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 page-section-card border rounded-2xl">
              <p className="page-text-muted">Saat ini belum ada lowongan terbuka. Silakan hubungi kami untuk informasi lebih lanjut.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="relative container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-section-card border rounded-2xl p-8 md:p-12 text-center"
          >
            <h3 className="text-2xl font-semibold page-text mb-3">
              Tidak menemukan posisi yang cocok?
            </h3>
            <p className="text-[14px] page-text-muted mb-6 max-w-md mx-auto">
              Kirimkan CV kamu dan kita akan hubungi jika ada posisi yang sesuai dengan profile kamu.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:hrd@ningclean.id?subject=Application%20-%20General">
                <Button variant="accent" size="lg" className="gap-2">
                  <Send className="w-4 h-4" />
                  Kirim CV via Email
                </Button>
              </a>
              <a href="https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20bergabung%20dengan%20Ningclean" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="page-border page-text-muted hover:page-section-card gap-2">
                  Chat HRD
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
