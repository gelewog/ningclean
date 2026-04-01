'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import Button from '@/components/ui/Button';
import { ArrowRight, Check, Clock, Sparkles, Home, Building, Star, Shield, Zap, Heart, X, ChevronDown, ChevronUp, Users } from 'lucide-react';
import Link from 'next/link';

const pricingPlans = [
  {
    id: 'basic',
    name: '1 Jam',
    price: 70000,
    originalPrice: 85000,
    duration: 60,
    description: 'Pembersihan cepat untuk area fokus',
    popular: false,
    icon: Clock,
    color: 'blue',
    features: [
      '1 teknisi profesional',
      'Pembersihan 1 area fokus',
      'Vacuum & pel lantai',
      'Membersihkan debu permukaan',
      'Pengelapan furniture',
      'Durasi: 1 jam',
    ],
    notIncluded: [
      'Pembersihan cabinet/dapur',
      'Deep cleaning furniture',
      'Sterilisasi tambahan',
    ],
  },
  {
    id: 'standard',
    name: '2 Jam',
    price: 120000,
    originalPrice: 150000,
    duration: 120,
    description: 'Pembersihan komprehensif untuk rumah kecil',
    popular: true,
    icon: Home,
    color: 'emerald',
    features: [
      '1-2 teknisi profesional',
      'Pembersihan hingga 2-3 area',
      'Vacuum & pel seluruh lantai',
      'Pembersihan kamar mandi',
      'Pembersihan dapur ringan',
      'Membersihkan jendela kecil',
      'Durasi: 2 jam',
    ],
    notIncluded: [
      'Deep cleaning furniture',
      'Sterilisasi UV',
      'Pembersihan exterior',
    ],
  },
  {
    id: 'premium',
    name: '3 Jam',
    price: 180000,
    originalPrice: 220000,
    duration: 180,
    description: 'Deep cleaning lengkap untuk seluruh rumah',
    popular: false,
    icon: Sparkles,
    color: 'accent',
    features: [
      '2 teknisi profesional',
      'Pembersihan seluruh rumah',
      'Deep vacuum karpet & sofa',
      'Pembersihan kamar mandi full',
      'Sterilisasi permukaan',
      'Pembersihan jendela besar',
      'Membersihkan cabinet luar',
      'Durasi: 3 jam',
    ],
    notIncluded: [],
  },
];

const addOns = [
  {
    id: 'extra-tech',
    name: 'Teknisi Tambahan',
    price: 50000,
    unit: 'per teknisi',
    description: 'Tambah teknisi untuk pekerjaan lebih cepat',
    icon: Users,
  },
  {
    id: 'deep-sofa',
    name: 'Deep Sofa Cleaning',
    price: 75000,
    unit: 'per sofa',
    description: 'Steam cleaning & shampooing sofa',
    icon: Sparkles,
  },
  {
    id: 'sterilize',
    name: 'Sterilisasi UV',
    price: 40000,
    unit: 'per ruangan',
    description: 'Anti bakteri dengan sinar UV-C',
    icon: Shield,
  },
  {
    id: 'window',
    name: 'Pembersihan Jendela',
    price: 35000,
    unit: 'per jendela',
    description: 'Kaca, kusen, dan frame',
    icon: Building,
  },
  {
    id: 'cabinet',
    name: 'Deep Cabinet',
    price: 60000,
    unit: 'per cabinet',
    description: 'Membersihkan dalam & luar cabinet',
    icon: Home,
  },
  {
    id: 'fridge',
    name: 'Deep Kulkas',
    price: 45000,
    unit: 'per unit',
    description: 'Pembersihan & sterilisasi kulkas',
    icon: Zap,
  },
];

const comparisonData = {
  headers: ['Fitur', '1 Jam', '2 Jam', '3 Jam'],
  rows: [
    { feature: 'Jumlah teknisi', values: ['1 orang', '1-2 orang', '2 orang'] },
    { feature: 'Area yang dibersihkan', values: ['1 area', '2-3 area', 'Seluruh rumah'] },
    { feature: 'Vacuum & pel lantai', values: [true, true, true] },
    { feature: 'Pembersihan kamar mandi', values: [false, true, true] },
    { feature: 'Pembersihan dapur', values: ['Ringan', 'Sedang', 'Full'] },
    { feature: 'Deep vacuum furniture', values: [false, false, true] },
    { feature: 'Sterilisasi UV', values: [false, false, true] },
    { feature: 'Pembersihan jendela', values: ['Kecil', 'Sedang', 'Besar'] },
    { feature: 'Durasi maksimal', values: ['60 menit', '120 menit', '180 menit'] },
  ],
};

const faqs = [
  {
    question: 'Bagaimana cara menghitung durasi pembersihan?',
    answer: 'Durasi dihitung dari waktu teknisi tiba di lokasi Anda. Untuk rumah ukuran sedang (60-100m²), paket 2 jam biasanya sudah cukup untuk pembersihan standar. Rumah besar (>100m²) disarankan paket 3 jam atau lebih.',
  },
  {
    question: 'Apakah harga sudah termasuk biaya transport?',
    answer: 'Ya, untuk area Surabaya, Gresik, dan Sidoarjo harga sudah termasuk biaya transport. Untuk area luar kota akan ada tambahan biaya transportasi yang akan diinformasikan saat booking.',
  },
  {
    question: 'Bagaimana jika pekerjaan melebihi waktu yang dipilih?',
    answer: 'Jika membutuhkan waktu lebih, Anda bisa menambah durasi dengan tarif Rp 35.000 per 30 menit atau menambahkan teknisi tambahan dengan biaya Rp 50.000 per teknisi.',
  },
  {
    question: 'Apakah bisa booking untuk jadwal reguler?',
    answer: 'Tentu! Kami menyediakan paket langganan mingguan dan bulanan dengan harga khusus. Hubungi kami untuk informasi paket reguler.',
  },
  {
    question: 'Bagaimana sistem pembayaran?',
    answer: 'Pembayaran bisa dilakukan setelah pekerjaan selesai via cash, transfer bank, atau e-wallet. Untuk booking pertama, kami memerlukan deposit 50%.',
  },
  {
    question: 'Apa yang harus disiapkan sebelum teknisi datang?',
    answer: 'Siapkan akses ke rumah/panggil, beritahu area yang perlu difokuskan, kosongkan area yang akan dibersihkan dari barang berharga, dan sediakan air jika memungkinkan.',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('standard');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPricePerHour = (price: number, hours: number) => {
    return formatPrice(Math.round(price / hours));
  };

  return (
    <div className="min-h-screen page-bg">
      <Navigation />

      <main>
        {/* Hero Section */}
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
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full page-badge text-[12px] font-semibold tracking-widest uppercase mb-6">
                <Star className="w-3.5 h-3.5" />
                Harga Transparan
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-normal page-text mb-6">
                Harga Terjangkau,{' '}
                <em className="italic text-emerald-400">Kualitas Premium</em>
              </h1>
              <p className="text-[15px] page-text-muted leading-relaxed max-w-2xl mx-auto">
                Pilihan harga fleksibel sesuai kebutuhan Anda. Mulai dari Rp 70.000 untuk pembersihan 1 jam. 
                Tanpa biaya tersembunyi, harga sudah termasuk teknisi profesional dan peralatan lengkap.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-24 -mt-8">
          <div className="container mx-auto px-6 max-w-6xl">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid md:grid-cols-3 gap-6"
            >
              {pricingPlans.map((plan) => {
                const Icon = plan.icon;
                const isSelected = selectedPlan === plan.id;
                
                return (
                  <motion.div key={plan.id} variants={item}>
                    <div
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative h-full rounded-3xl p-6 cursor-pointer transition-all duration-500 ${
                        isSelected
                          ? 'bg-gradient-to-br from-emerald-500/10 to-blue-600/10 border-2 border-emerald-500/50'
                          : 'page-card hover:border-emerald-500/20'
                      }`}
                    >
                      {/* Popular Badge */}
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <div className="px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-xs font-bold">
                            ⭐ PALING POPULER
                          </div>
                        </div>
                      )}

                      {/* Save Badge */}
                      {plan.originalPrice && (
                        <div className="absolute top-4 right-4">
                          <span className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold">
                            HEMAT {formatPrice(plan.originalPrice - plan.price)}
                          </span>
                        </div>
                      )}

                      {/* Header */}
                      <div className="text-center mb-6">
                        <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                          plan.color === 'emerald' ? 'bg-emerald-500/20' :
                          plan.color === 'accent' ? 'bg-accent/20' :
                          'bg-blue-500/20'
                        }`}>
                          <Icon className={`w-7 h-7 ${
                            plan.color === 'emerald' ? 'text-emerald-400' :
                            plan.color === 'accent' ? 'text-accent' :
                            'text-blue-400'
                          }`} />
                        </div>
                        
                        <h3 className="text-xl font-bold page-text mb-1">{plan.name}</h3>
                        <p className="text-[13px] page-text-muted">{plan.description}</p>
                      </div>

                      {/* Price */}
                      <div className="text-center mb-6 pb-6 border-b page-border">
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-[28px] font-bold page-text">
                            {formatPrice(plan.price)}
                          </span>
                          <span className="page-text-muted text-sm">/ {plan.duration / 60} jam</span>
                        </div>
                        <p className="text-xs page-text-muted mt-1">
                          {getPricePerHour(plan.price, plan.duration / 60)} / jam
                        </p>
                        {plan.originalPrice && (
                          <p className="text-xs page-text-muted line-through mt-1">
                            {formatPrice(plan.originalPrice)}
                          </p>
                        )}
                      </div>

                      {/* Features */}
                      <div className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-emerald-400" />
                            </div>
                            <span className="text-[13px] page-text-muted">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Not Included */}
                      {plan.notIncluded.length > 0 && (
                        <div className="space-y-2 mb-6 pt-4 border-t page-border">
                          {plan.notIncluded.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-white/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <X className="w-3 h-3 text-white/25 dark:text-white/25" />
                              </div>
                              <span className="text-[12px] page-text-muted">{item}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CTA Button */}
                      <Link href="/booking" className="block">
                        <Button
                          variant={plan.popular ? 'primary' : 'outline'}
                          className={`w-full ${plan.popular ? '' : 'btn-outline-dark'}`}
                        >
                          Pilih Paket Ini
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Price Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mt-8"
            >
              <p className="text-[13px] page-text-muted">
                * Harga dapat berubah sewaktu-waktu. Harga terbaru akan diinformasikan saat booking.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Add-ons Section */}
        <section className="py-24 section-alt">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-normal page-text mb-4">
                Tambah Layanan <em className="italic text-emerald-400">Tambahan</em>
              </h2>
              <p className="text-[15px] page-text-muted max-w-md mx-auto">
                Sempurnakan pembersihan Anda dengan layanan ekstra yang bisa ditambahkan ke paket manapun
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {addOns.map((addon) => {
                const Icon = addon.icon;
                return (
                  <motion.div
                    key={addon.id}
                    variants={item}
                    className="page-card rounded-2xl p-5 hover:border-emerald-500/20 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold page-text">{formatPrice(addon.price)}</span>
                        <p className="text-[10px] page-text-muted">{addon.unit}</p>
                      </div>
                    </div>
                    <h4 className="text-sm font-semibold page-text mb-1">{addon.name}</h4>
                    <p className="text-[12px] page-text-muted">{addon.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-normal page-text mb-4">
                Bandingkan <em className="italic text-emerald-400">Paket</em>
              </h2>
              <p className="text-[15px] page-text-muted max-w-md mx-auto">
                Pilih paket yang paling sesuai dengan kebutuhan pembersihan Anda
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="overflow-x-auto"
            >
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b page-border">
                    <th className="text-left py-4 px-4 text-[12px] font-semibold page-text-muted uppercase tracking-wider">
                      Fitur
                    </th>
                    {comparisonData.headers.slice(1).map((header, idx) => (
                      <th key={idx} className="text-center py-4 px-4 text-[12px] font-semibold page-text-muted uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.rows.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className={`border-b page-border ${rowIdx % 2 === 0 ? 'page-section-card' : ''}`}
                    >
                      <td className="py-4 px-4 text-[13px] page-text-muted">{row.feature}</td>
                      {row.values.map((val, valIdx) => (
                        <td key={valIdx} className="py-4 px-4 text-center">
                          {typeof val === 'boolean' ? (
                            val ? (
                              <div className="w-6 h-6 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 mx-auto rounded-full bg-gray-200 dark:bg-white/5 flex items-center justify-center">
                                <X className="w-3.5 h-3.5 dark:text-white/25 text-gray-400" />
                              </div>
                            )
                          ) : (
                            <span className="text-[13px] page-text-muted">{val}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 section-alt">
          <div className="container mx-auto px-6 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-normal page-text mb-4">
                Pertanyaan <em className="italic text-emerald-400">Umum</em>
              </h2>
              <p className="text-[15px] page-text-muted">
                Temukan jawaban untuk pertanyaan yang sering ditanyakan tentang harga kami
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              {faqs.map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="page-card rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-[14px] font-medium page-text pr-4">{faq.question}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 page-text-muted flex-shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-0">
                          <p className="text-[13px] page-text-muted leading-relaxed border-t page-border pt-4">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="pointer-events-none select-none">
            <div className="absolute top-0 left-1/4 w-[380px] h-[380px] rounded-full hero-glow-1 blur-[110px]" />
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full hero-glow-2 blur-[100px]" />
          </div>

          <div className="relative container mx-auto px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center page-card rounded-3xl p-12"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="font-serif text-3xl md:text-4xl font-normal page-text mb-4">
                Siap untuk Rumah <em className="italic text-emerald-400">Bersih?</em>
              </h2>
              <p className="text-[15px] page-text-muted max-w-md mx-auto mb-8">
                Booking sekarang dan dapatkan teknisi profesional yang akan membuat rumah Anda bersinar
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/booking">
                  <Button
                    variant="primary"
                    size="lg"
                    className="group"
                    rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  >
                    Booking Sekarang
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="btn-outline-dark"
                  >
                    Hubungi Kami
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center gap-6 mt-8 pt-8 border-t page-border">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-[12px] page-text-muted">Garansi 100%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-[12px] page-text-muted">Respon Cepat</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-[12px] page-text-muted">Rating 4.9/5</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
