'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const featured = {
  name: 'Dewi Wulandari',
  location: 'Surabaya Barat',
  service: 'Deep Cleaning',
  comment:
    'Saya awalnya ragu, tapi setelah coba Ningclean sekali langsung jadi pelanggan tetap. Timnya profesional banget, rumah 3 lantai beres dalam 4 jam. Hasilnya luar biasa bersih!',
  avatar: 'DW',
  rating: 5,
};

const reviews = [
  {
    avatar: 'BS',
    name: 'Budi Santoso',
    location: 'Surabaya',
    service: 'Deep Cleaning',
    serviceColor: 'green',
    comment:
      'Rumah kinclong banget! Timnya ramah dan profesional. Recommended banget buat yang mau deep cleaning.',
    rating: 5,
  },
  {
    avatar: 'SR',
    name: 'Siti Rahayu',
    location: 'Sidoarjo',
    service: 'Regular Cleaning',
    serviceColor: 'blue',
    comment: 'Sudah 3x pakai Ningclean dan selalu puas. Harganya worth it dan hasil kerjaannya rapi banget.',
    rating: 5,
  },
  {
    avatar: 'AW',
    name: 'Ahmad Wijaya',
    location: 'Gresik',
    service: 'Post Construction',
    serviceColor: 'amber',
    comment: 'Booking via WhatsApp gampang, datang tepat waktu. Hasilnya memuaskan!',
    rating: 5,
  },
  {
    avatar: 'LN',
    name: 'Linda Natalia',
    location: 'Surabaya Timur',
    service: 'Sofa Cleaning',
    serviceColor: 'purple',
    comment: 'Sofa lama saya kaya baru lagi! Noda bandel yang udah berbulan-bulan hilang semua. Keren!',
    rating: 5,
  },
  {
    avatar: 'RH',
    name: 'Rizal Hakim',
    location: 'Surabaya Utara',
    service: 'Office Cleaning',
    serviceColor: 'red',
    comment: 'Kantor kami sekarang jadi lebih nyaman. Tim Ningclean cepat dan tidak ganggu aktivitas kerja.',
    rating: 5,
  },
  {
    avatar: 'FI',
    name: 'Farida Irawati',
    location: 'Pasuruan',
    service: 'Deep Cleaning',
    serviceColor: 'green',
    comment: 'Pertama kali coba langsung terpesona. Kamar mandi yang berkerak bisa bersih seperti baru.',
    rating: 5,
  },
  {
    avatar: 'YP',
    name: 'Yusuf Pratama',
    location: 'Mojokerto',
    service: 'Regular Cleaning',
    serviceColor: 'blue',
    comment: 'Harga terjangkau untuk hasil yang luar biasa. Sudah rekomendasi ke semua tetangga saya.',
    rating: 5,
  },
];

// ─── Service chip styles ────────────────────────────────────────────────────

const serviceChipVariants: Record<string, string> = {
  green: 'dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 bg-emerald-50 text-emerald-600 border border-emerald-200',
  blue: 'dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 bg-blue-50 text-blue-600 border border-blue-200',
  amber: 'dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20 bg-amber-50 text-amber-600 border border-amber-200',
  purple: 'dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20 bg-purple-50 text-purple-600 border border-purple-200',
  red: 'dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 bg-rose-50 text-rose-600 border border-rose-200',
};

const avatarBgDark: Record<string, string> = {
  BS: '#00564a',
  SR: '#1a3566',
  AW: '#5a3800',
  LN: '#3a1a5a',
  RH: '#5a1a1a',
  FI: '#00564a',
  YP: '#1a3566',
  DW: 'transparent',
};

const avatarBgLight: Record<string, string> = {
  BS: '#d1fae5',
  SR: '#dbeafe',
  AW: '#fef3c7',
  LN: '#ede9fe',
  RH: '#fee2e2',
  FI: '#d1fae5',
  YP: '#dbeafe',
  DW: '#d1fae5',
};

function StarRow({ count = 5, size = 'md' }: { count?: number; size?: 'sm' | 'md' }) {
  const cls = size === 'sm' ? 'text-[11px]' : 'text-[15px]';
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={`${cls} text-amber-400`}>★</span>
      ))}
    </div>
  );
}

function ServiceChip({ label, color }: { label: string; color: string }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${serviceChipVariants[color] ?? serviceChipVariants.green}`}
    >
      {label}
    </span>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 bg-emerald-50 border border-emerald-200 text-emerald-600 text-[11px] font-semibold">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5 0.5L6.2 3.5L9.5 3.8L7.2 5.9L8 9.1L5 7.5L2 9.1L2.8 5.9L0.5 3.8L3.8 3.5L5 0.5Z" fill="currentColor" />
      </svg>
      Terverifikasi
    </span>
  );
}

function FeaturedCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative grid md:grid-cols-[1fr_auto] gap-10 items-center
                 dark:bg-gradient-to-br dark:from-emerald-500/[0.07] dark:to-blue-500/[0.04]
                 dark:border-emerald-500/[0.18] dark:bg-none
                 bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200
                 rounded-3xl px-10 py-10 overflow-hidden mb-7"
    >
      {/* giant quote mark - dark mode */}
      <span
        className="absolute top-4 left-8 font-serif text-[110px] leading-none
                   dark:text-emerald-500/[0.07] text-emerald-200/30
                   select-none pointer-events-none"
        aria-hidden
      >
        "
      </span>

      {/* Comment */}
      <div className="relative z-10">
        <StarRow size="md" />
        <p className="mt-5 font-serif text-xl md:text-2xl leading-relaxed italic dark:text-white/85 text-slate-800">
          "{featured.comment}"
        </p>
      </div>

      {/* Author */}
      <div className="flex md:flex-col items-center gap-3 flex-shrink-0">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full dark:bg-gradient-to-br dark:from-emerald-400 dark:to-blue-500 p-[2px] bg-gradient-to-br from-emerald-400 to-blue-500">
            <div className="w-full h-full rounded-full dark:bg-[#0f1320] bg-white flex items-center justify-center">
              <span className="dark:text-white text-slate-800 font-bold text-lg">{featured.avatar}</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold dark:text-white text-slate-900">{featured.name}</p>
          <p className="text-xs dark:text-white/40 text-slate-500 mt-0.5">{featured.location}</p>
        </div>
        <ServiceChip label={featured.service} color="green" />
        <VerifiedBadge />
      </div>
    </motion.div>
  );
}

function MiniCard({ review }: { review: typeof reviews[0] }) {
  return (
    <div
      className="flex-shrink-0 w-[295px]
                 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:border-white/[0.08] dark:hover:border-white/[0.14]
                 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300
                 rounded-2xl px-6 py-5 transition-colors duration-300 cursor-default"
    >
      {/* Top row */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center
                     text-sm font-bold text-slate-600 flex-shrink-0 dark:hidden"
          style={{ background: avatarBgLight[review.avatar] ?? '#dbeafe' }}
        >
          {review.avatar}
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center
                     text-sm font-bold text-white flex-shrink-0 hidden dark:block"
          style={{ background: avatarBgDark[review.avatar] ?? '#1a3566' }}
        >
          {review.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold dark:text-white text-slate-900 leading-tight">{review.name}</p>
          <p className="text-[12px] dark:text-white/40 text-slate-500">{review.location}</p>
        </div>
      </div>

      {/* Comment */}
      <p className="text-[13.5px] leading-relaxed dark:text-white/65 text-slate-600 mb-4">"{review.comment}"</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <ServiceChip label={review.service} color={review.serviceColor} />
        <StarRow size="sm" count={review.rating} />
      </div>
    </div>
  );
}

function Marquee() {
  const doubled = [...reviews, ...reviews];

  return (
    <div
      className="overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div className="flex gap-5 w-max animate-marquee hover:[animation-play-state:paused]">
        {doubled.map((r, i) => (
          <MiniCard key={i} review={r} />
        ))}
      </div>
    </div>
  );
}

const trustItems = [
  { icon: '✓', bg: 'dark:bg-emerald-500/10 bg-emerald-50', label: '500+ Rumah Dilayani' },
  { icon: '⏱', bg: 'dark:bg-blue-500/10 bg-blue-50', label: 'Tepat Waktu 98%' },
  { icon: '★', bg: 'dark:bg-amber-400/10 bg-amber-50', label: 'Kepuasan Dijamin' },
];

function TrustBar() {
  return (
    <div className="mt-12 flex items-center justify-center flex-wrap gap-6 md:gap-8">
      {trustItems.map((item, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center text-sm dark:text-emerald-400 text-emerald-600`}>
            {item.icon}
          </div>
          <span className="text-[13px] dark:text-white/40 text-slate-500 font-medium">{item.label}</span>
          {i < trustItems.length - 1 && (
            <div className="hidden md:block w-px h-5 dark:bg-white/10 bg-slate-200 ml-2" />
          )}
        </div>
      ))}
    </div>
  );
}

interface TestimonialsSectionProps {
  testimonials?: any[];
}

export default function TestimonialsSection({ testimonials = [] }: TestimonialsSectionProps) {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  // If no testimonials provided, use static data
  const hasExternalTestimonials = testimonials.length > 0;

  return (
    <section className="relative py-24 dark:bg-[#06060e] bg-slate-50 overflow-hidden">
      {/* Ambient orbs - dark mode only */}
      <div className="pointer-events-none select-none dark:block hidden">
        <div className="absolute -top-24 -left-36 w-[480px] h-[480px] rounded-full bg-emerald-500/20 blur-[110px]" />
        <div className="absolute bottom-0 -right-24 w-[380px] h-[380px] rounded-full bg-blue-600/20 blur-[110px]" />
      </div>

      <div className="relative container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            {/* Live tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                            dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400
                            bg-emerald-50 border border-emerald-200 text-emerald-700
                            text-[12px] font-semibold tracking-widest uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full dark:bg-emerald-400 bg-emerald-500 animate-pulse" />
              Testimoni Pelanggan
            </div>

            <h2 className="font-serif text-4xl md:text-5xl xl:text-[56px] leading-[1.07] font-normal dark:text-white text-slate-900">
              Rumah bersih,<br />
              mereka <em className="italic dark:text-emerald-400 text-emerald-600">sudah buktikan</em>
            </h2>
          </div>

          {/* Stats panel */}
          <div className="shrink-0 rounded-2xl dark:bg-white/[0.04] dark:border-white/[0.09] bg-white border border-slate-200 px-7 py-5 text-right">
            <div className="flex justify-end gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-amber-400 text-[16px]">★</span>
              ))}
            </div>
            <div className="text-4xl font-bold dark:text-white text-slate-900 tracking-tight leading-none">4.9</div>
            <div className="text-[11px] uppercase tracking-widest dark:text-white/40 text-slate-500 mt-1">Rating Rata-rata</div>
            <div className="text-[12px] dark:text-white/35 text-slate-400 mt-1.5">dari 500+ ulasan</div>
          </div>
        </motion.div>

        {/* Featured */}
        <FeaturedCard />

        {/* Marquee */}
        <Marquee />

        {/* Trust */}
        <TrustBar />
      </div>
    </section>
  );
}
