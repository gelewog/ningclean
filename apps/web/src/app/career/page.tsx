'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { SectionLoader } from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { Briefcase, MapPin, ChevronDown, ChevronUp, Send, CheckCircle, Heart, Zap, Users, TrendingUp } from 'lucide-react';

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
    description: 'BPJS Kesehatan & Ketenagakerjaan, THR, bonus performance, dan手下工具 lengkap.',
  },
];

const positions = [
  {
    id: 'cs',
    title: 'Customer Service',
    badge: 'Buka',
    location: 'Surabaya',
    salary: 'Rp 4.500.000 - Rp 6.000.000',
    type: 'Full-time',
    description: 'Jadi garda terdepan komunikasi dengan pelanggan. Kamu yang handle WhatsApp, telepon, dan email inquiries, serta membantu proses booking.',
    requirements: [
      'Minimal SMA/SMK, preferably D3/S1',
      'Berpengalaman di CS atau hospitality min 1 tahun',
      'Komunikasi lisan dan tulisan yang baik',
      'Friendly, patient, dan ramah',
      'Able to handle complaint dengan cool',
    ],
  },
  {
    id: 'teknisi',
    title: 'Cleaning Technician',
    badge: 'Buka',
    location: 'Surabaya, Sidoarjo, Gresik',
    salary: 'Rp 5.000.000 - Rp 7.500.000',
    type: 'Full-time',
    description: 'Tim heroes yang directly bertanggung jawab hasil cleaning. Kamu bakal cleaning berbagai tipe properti dengan equipment modern.',
    requirements: [
      'Pria, minimal SMA/SMK',
      'Punya SIM C (motor)',
      'Tidak ada pengalaman needed - kita train',
      'Bertanggung jawab dan teliti',
      'Able to lift up to 15kg',
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing Staff',
    badge: 'Buka',
    location: 'Surabaya',
    salary: 'Rp 5.000.000 - Rp 8.000.000',
    type: 'Full-time',
    description: 'Bantu grow bisnis through digital marketing, partnerships, dan promo campaigns. Kreativitas kamu yang bikin brand ningclean makin dikenal.',
    requirements: [
      'Minimal D3/S1 from any major',
      'Punya experience di social media management',
      'Understand dasar-dasar SEO dan content marketing',
      'Kreatif dan punya sense for design',
      'Portfolio atau contoh hasil kerja menjadi nilai plus',
    ],
  },
  {
    id: 'admin',
    title: 'Admin & Operations',
    badge: 'Segera',
    location: 'Surabaya',
    salary: 'Rp 4.000.000 - Rp 5.500.000',
    type: 'Full-time',
    description: 'Jukung operational tim dari belakang layar. Scheduling, logistics, dan coordination biar semua booking jalan lancar.',
    requirements: [
      'Minimal SMA/SMK, D3 lebih baik',
      'Jago manage spreadsheet dan data',
      'Teliti dan organized',
      'Able to multi-task dalam high-pressure environment',
      'Berpengalaman di admin/operations jadi nilai plus',
    ],
  },
];

export default function CareerPage() {
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', position: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitStatus('success');
  };

  if (loading) return <SectionLoader />;

  return (
    <div className="min-h-screen page-bg">
      <Navigation />

      {/* Hero */}
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
                💼 {positions.length} Posisi Terbuka
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

          <div className="space-y-4">
            {positions.map((pos, idx) => (
              <motion.div
                key={pos.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="page-section-card border rounded-2xl overflow-hidden"
              >
                {/* Header */}
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
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          pos.badge === 'Buka'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {pos.badge}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[12px] page-text-muted">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {pos.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Rp</span>
                          {pos.salary}
                        </span>
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

                {/* Expanded content */}
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

                            <h4 className="text-[13px] font-semibold page-text-muted uppercase tracking-wider mb-3">Requirements</h4>
                            <ul className="space-y-2">
                              {pos.requirements.map((req, rIdx) => (
                                <li key={rIdx} className="flex items-start gap-2.5 text-[13px] page-text-muted">
                                  <CheckCircle className="w-4 h-4 text-emerald-400/60 flex-shrink-0 mt-0.5" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="page-section-card rounded-xl p-5">
                            <h4 className="text-[13px] font-semibold page-text-muted uppercase tracking-wider mb-4">
                              Apply untuk posisi ini
                            </h4>
                            <form onSubmit={(e) => { e.preventDefault(); setSubmitStatus('success'); }} className="space-y-3">
                              <input
                                type="text"
                                placeholder="Nama lengkap"
                                className="w-full px-4 py-2.5 rounded-xl page-input border focus:outline-none focus:border-emerald-400 transition-colors"
                              />
                              <input
                                type="tel"
                                placeholder="Nomor WhatsApp"
                                className="w-full px-4 py-2.5 rounded-xl page-input border focus:outline-none focus:border-emerald-400 transition-colors"
                              />
                              <input
                                type="email"
                                placeholder="Email"
                                className="w-full px-4 py-2.5 rounded-xl page-input border focus:outline-none focus:border-emerald-400 transition-colors"
                              />
                              <textarea
                                placeholder="Ceritakan tentang diri kamu (pengalaman, kenapa tertarik, dll)"
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-xl page-section-card border page-text text-[13px] placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors resize-none"
                              />
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
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
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
