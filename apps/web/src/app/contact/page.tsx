'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import Button from '@/components/ui/Button';
import { SectionLoader } from '@/components/ui/Spinner';
import { Send, MapPin, Mail, Phone, Clock, MessageCircle } from 'lucide-react';

const contactInfo = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+62 812-3456-7890',
    href: 'https://wa.me/6281234567890',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@ningclean.id',
    href: 'mailto:hello@ningclean.id',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: MapPin,
    label: 'Alamat',
    value: 'Jl. Raya Surabaya No. 123, Jawa Timur',
    href: '#',
    color: 'from-purple-500 to-pink-500',
  },
];

const socialMedia = [
  { name: 'Instagram', href: 'https://instagram.com/ningclean', icon: 'IG' },
  { name: 'TikTok', href: 'https://tiktok.com/@ningclean', icon: 'TT' },
  { name: 'YouTube', href: '#', icon: 'YT' },
];

const operatingHours = [
  { day: 'Senin - Jumat', hours: '08.00 - 20.00' },
  { day: 'Sabtu', hours: '09.00 - 18.00' },
  { day: 'Minggu', hours: '09.00 - 16.00' },
  { day: 'Hari Libur', hours: '10.00 - 14.00' },
];

const services = [
  'Deep Cleaning',
  'Regular Cleaning',
  'Post Construction Cleaning',
  'Sofa Cleaning',
  'Office Cleaning',
  'Lainnya',
];

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen page-bg">
        <Navigation />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-lg mx-auto page-section-card rounded-3xl p-12"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-serif text-2xl page-text mb-3">Pesan Terkirim!</h2>
              <p className="text-[15px] page-text-muted mb-8">
                Terima kasih telah menghubungi kami. Tim kami akan segera merespons dalam 1x24 jam.
              </p>
              <Button
                variant="outline"
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service: '', message: '' }); }}
                className="btn-outline-dark"
              >
                Kirim Pesan Lain
              </Button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg">
      <Navigation />

      <main>
        {/* Hero */}
        <section className="relative py-32 overflow-hidden">
          <div className="pointer-events-none select-none">
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full hero-glow-1 blur-[110px]" />
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full hero-glow-2 blur-[100px]" />
          </div>
          <div className="relative container mx-auto px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full page-badge text-[12px] font-semibold tracking-widest uppercase mb-6">
                Hubungi Kami
              </div>
              <h1 className="font-serif text-4xl md:text-5xl page-text mb-6">
                Kami <em className="italic text-emerald-400">Siap Membantu</em>
              </h1>
              <p className="text-[15px] page-text-muted leading-relaxed">
                Punya pertanyaan atau ingin booking? Jangan ragu untuk menghubungi kami.
                Tim kami siap merespons dengan cepat dan ramah.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="relative py-12">
          <div className="relative container mx-auto px-6 max-w-5xl">
            <div className="grid md:grid-cols-3 gap-5">
              {contactInfo.map((info, idx) => (
                <motion.a
                  key={idx}
                  href={info.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="group page-section-card border rounded-2xl p-6 hover:border-emerald-500/25 transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${info.color} flex items-center justify-center mb-4`}>
                    <info.icon className="w-6 h-6 page-text" />
                  </div>
                  <h3 className="text-[12px] font-semibold page-text-muted uppercase tracking-wider mb-1">{info.label}</h3>
                  <p className="text-[15px] page-text group-hover:text-emerald-400 transition-colors">{info.value}</p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Form & Map */}
        <section className="relative py-16">
          <div className="pointer-events-none select-none">
            <div className="absolute top-1/2 left-0 w-[350px] h-[350px] rounded-full hero-glow-2 blur-[100px]" />
          </div>
          <div className="relative container mx-auto px-6 max-w-5xl">
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-3 page-section-card border rounded-3xl p-8"
              >
                <h2 className="font-serif text-2xl page-text mb-6">Kirim Pesan</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[13px] page-text-muted mb-2">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Masukkan nama"
                        className="w-full px-4 py-3 rounded-xl text-[14px] page-input border
                                   focus:outline-none focus:border-emerald-400
                                   transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] page-text-muted mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="email@contoh.com"
                        className="w-full px-4 py-3 rounded-xl text-[14px] page-input border
                                   focus:outline-none focus:border-emerald-400
                                   transition-colors duration-200"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[13px] page-text-muted mb-2">Nomor WhatsApp</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="08xxxxxxxxxx"
                        className="w-full px-4 py-3 rounded-xl text-[14px] page-input border
                                   focus:outline-none focus:border-emerald-400
                                   transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] page-text-muted mb-2">Layanan yang Diminati</label>
                      <select
                        required
                        value={form.service}
                        onChange={(e) => setForm({ ...form, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-[14px] page-input border
                                   focus:outline-none focus:border-emerald-400
                                   transition-colors duration-200"
                      >
                        <option value="">Pilih layanan</option>
                        {services.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] page-text-muted mb-2">Pesan</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Ceritakan kebutuhan cleaning Anda..."
                      className="w-full px-4 py-3 rounded-xl text-[14px] page-input border
                                 focus:outline-none focus:border-emerald-400
                                 transition-colors duration-200 resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    isLoading={loading}
                    className="w-full"
                    leftIcon={<Send className="w-4 h-4" />}
                  >
                    Kirim Pesan
                  </Button>
                </form>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 space-y-5"
              >
                {/* Map Placeholder */}
                <div className="page-section-card border rounded-3xl overflow-hidden">
                  <div className="bg-gradient-to-br from-emerald-500/10 to-blue-600/10 h-48 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                      <p className="text-[13px] page-text-muted">Surabaya, Gresik & Sidoarjo</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-[14px] page-text font-medium">Coverage Area</p>
                    <div className="flex gap-2 mt-2">
                      {['Surabaya', 'Gresik', 'Sidoarjo'].map((area) => (
                        <span key={area} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-[12px] page-text-muted">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="page-section-card border rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-[15px] font-semibold page-text">Jam Operasional</h3>
                  </div>
                  <div className="space-y-3">
                    {operatingHours.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[13px]">
                        <span className="page-text-muted">{item.day}</span>
                        <span className="page-text font-medium">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Media */}
                <div className="page-section-card border rounded-3xl p-6">
                  <h3 className="text-[15px] font-semibold page-text mb-4">Ikuti Kami</h3>
                  <div className="flex gap-3">
                    {socialMedia.map((s) => (
                      <a
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl page-section-card border flex items-center justify-center
                                   text-[12px] font-bold page-text-muted hover:text-emerald-400 hover:border-emerald-500/25
                                   transition-all duration-200"
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
