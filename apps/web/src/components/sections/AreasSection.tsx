'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ─── Data ──────────────────────────────────────────────────────────────────────

const featured = {
  num: '01',
  label: 'Kota Utama',
  city: 'Surabaya',
  desc: 'Layanan lengkap tersedia di seluruh wilayah',
  services: ['Deep Cleaning', 'Regular', 'Post Construction', 'Office', 'Sofa'],
  serviceColor: 'green',
  stats: ['300+ Rumah Dilayani', 'Respons < 1 jam'],
  cta: 'Lihat jadwal tersedia',
};

const secondaryCities = [
  {
    num: '02',
    label: 'Kab. Sidoarjo',
    city: 'Sidoarjo',
    desc: 'Cepat & responsif, tim siap hari ini',
    services: ['Deep Cleaning', 'Regular'],
    serviceColor: 'blue',
    cta: 'Cek ketersediaan',
  },
  {
    num: '03',
    label: 'Kab. Gresik',
    city: 'Gresik',
    desc: 'Tim terdekat, jadwal fleksibel',
    services: ['Deep Cleaning', 'Regular'],
    serviceColor: 'amber',
    cta: 'Cek ketersediaan',
  },
];

const coverageStats = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M10 2C7.24 2 5 4.24 5 7c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="currentColor" className="dark:text-emerald-400 text-emerald-600" />
      </svg>
    ),
    iconBg: 'dark:bg-emerald-500/10 bg-emerald-50',
    value: '3',
    label: 'Kota Aktif',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M9 12l-4-4 1.41-1.42L9 9.17l7.59-7.58L18 3l-9 9z" fill="currentColor" className="dark:text-blue-400 text-blue-600" />
        <path d="M3 17h14v1.5H3z" fill="currentColor" className="dark:text-blue-400 text-blue-600 opacity-40" />
      </svg>
    ),
    iconBg: 'dark:bg-blue-500/10 bg-blue-50',
    value: '500+',
    label: 'Rumah Dilayani',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M10 1l2.39 6.26H19l-5.19 3.77 1.97 6.26L10 13.51 4.22 17.29l1.97-6.26L1 7.26h6.61z" fill="currentColor" className="dark:text-amber-400 text-amber-500" />
      </svg>
    ),
    iconBg: 'dark:bg-amber-400/10 bg-amber-50',
    value: '4.9',
    label: 'Rating Rata-rata',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" className="dark:text-rose-400 text-rose-500" />
        <path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="dark:text-rose-400 text-rose-500" />
      </svg>
    ),
    iconBg: 'dark:bg-rose-500/10 bg-rose-50',
    value: '<1j',
    label: 'Waktu Respons',
  },
];

// ─── Chip colors ─────────────────────────────────────────────────────────────

const chipVariantsDark: Record<string, string> = {
  green: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  amber: 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
};

const chipVariantsLight: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  blue: 'bg-blue-50 text-blue-600 border border-blue-200',
  amber: 'bg-amber-50 text-amber-600 border border-amber-200',
};

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-block px-2.5 py-[3px] rounded-full text-[11px] font-semibold dark:${chipVariantsDark[color] ?? chipVariantsDark.green} ${chipVariantsLight[color] ?? chipVariantsLight.green}`}>
      {label}
    </span>
  );
}

function ArrowCta({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 mt-5 text-[12px] font-semibold dark:text-white/40 text-slate-500 group-hover:dark:text-emerald-400 group-hover:text-emerald-600 transition-colors duration-200">
      {label}
      <span className="w-7 h-7 rounded-full border dark:border-white/15 dark:group-hover:border-emerald-400 dark:group-hover:bg-emerald-500/10 border-slate-300 group-hover:border-emerald-300 group-hover:bg-emerald-50 flex items-center justify-center text-[13px] transition-all duration-200">
        →
      </span>
    </div>
  );
}

function MapIllustration() {
  return (
    <svg
      className="absolute top-5 left-1/2 -translate-x-1/2 w-44 opacity-25 pointer-events-none select-none dark:block hidden"
      viewBox="0 0 200 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="65" r="55" stroke="#00c98d" strokeWidth="0.8" strokeDasharray="3 4" />
      <circle cx="100" cy="65" r="35" stroke="#00c98d" strokeWidth="0.6" strokeDasharray="2 5" />
      <circle cx="100" cy="65" r="8" fill="#00c98d" opacity="0.6" />
      <circle cx="100" cy="65" r="14" stroke="#00c98d" strokeWidth="1" />
      <line x1="100" y1="10" x2="100" y2="30" stroke="#00c98d" strokeWidth="0.8" />
      <line x1="100" y1="100" x2="100" y2="120" stroke="#00c98d" strokeWidth="0.8" />
      <line x1="45" y1="65" x2="65" y2="65" stroke="#00c98d" strokeWidth="0.8" />
      <line x1="135" y1="65" x2="155" y2="65" stroke="#00c98d" strokeWidth="0.8" />
    </svg>
  );
}

function FeaturedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className="group relative row-span-2 flex flex-col justify-end
                 dark:bg-emerald-500/[0.05] dark:hover:bg-emerald-500/[0.09]
                 dark:border-emerald-500/[0.17] dark:hover:border-emerald-500/[0.33]
                 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300
                 rounded-[28px] p-8 min-h-[400px] overflow-hidden
                 transition-colors duration-350 cursor-pointer"
    >
      <MapIllustration />

      <div className="relative z-10">
        <p className="text-[11px] font-bold tracking-[.12em] uppercase dark:text-white/30 text-slate-400 mb-1.5">
          {featured.num} — {featured.label}
        </p>
        <h3 className="font-serif text-[clamp(28px,3.5vw,42px)] font-normal leading-[1.08] dark:text-white text-slate-900">
          {featured.city}
        </h3>
        <p className="text-[13px] dark:text-white/45 text-slate-500 mt-1.5">{featured.desc}</p>

        <div className="flex flex-wrap gap-1.5 mt-5">
          {featured.services.map((s) => (
            <Chip key={s} label={s} color={featured.serviceColor} />
          ))}
        </div>

        <div className="flex flex-wrap gap-2.5 mt-4">
          {featured.stats.map((s) => (
            <div
              key={s}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                         dark:bg-white/[0.05] dark:border-white/10 dark:text-white/55
                         bg-white border border-slate-200 text-slate-600 text-[12px]"
            >
              <span className="w-1.5 h-1.5 rounded-full dark:bg-emerald-400 bg-emerald-500" />
              {s}
            </div>
          ))}
        </div>

        <ArrowCta label={featured.cta} />
      </div>
    </motion.div>
  );
}

function SmallCard({ city, index }: { city: typeof secondaryCities[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 + 0.15 }}
      className="group relative flex flex-col justify-between
                 dark:bg-white/[0.03] dark:hover:bg-white/[0.07] dark:border-white/[0.08] dark:hover:border-white/[0.15]
                 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300
                 rounded-[22px] px-7 py-6 overflow-hidden
                 transition-colors duration-300 cursor-pointer"
    >
      <div>
        <p className="text-[11px] font-bold tracking-[.12em] uppercase dark:text-white/30 text-slate-400 mb-1.5">
          {city.num} — {city.label}
        </p>
        <h3 className="font-serif text-[clamp(22px,3vw,30px)] font-normal leading-[1.08] dark:text-white text-slate-900">
          {city.city}
        </h3>
        <p className="text-[13px] dark:text-white/45 text-slate-500 mt-1.5">{city.desc}</p>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {city.services.map((s) => (
            <Chip key={s} label={s} color={city.serviceColor} />
          ))}
        </div>
      </div>
      <ArrowCta label={city.cta} />
    </motion.div>
  );
}

function CoverageBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-5 grid grid-cols-2 md:grid-cols-4
                 dark:border-white/[0.08] border border-slate-200 rounded-2xl overflow-hidden"
    >
      {coverageStats.map((s, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-5 py-4
                     dark:border-r-white/[0.06] border-r border-slate-200
                     dark:last:border-r-0 last:border-r-0
                     md:[&:nth-child(2)]:border-r md:[&:nth-child(4)]:border-r-0
                     [&:nth-child(n+3)]:border-b-0 dark:[&:nth-child(n+3)]:border-b-0 border-b border-slate-200"
        >
          <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 ${s.iconBg}`}>
            {s.icon}
          </div>
          <div>
            <div className="text-lg font-bold dark:text-white text-slate-900 leading-none">{s.value}</div>
            <div className="text-[11px] uppercase tracking-wider dark:text-white/35 text-slate-400 mt-1">{s.label}</div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export default function AreasSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section className="relative py-24 dark:bg-[#06060e] bg-white overflow-hidden">
      {/* Ambient orbs - dark mode only */}
      <div className="pointer-events-none select-none dark:block hidden">
        <div className="absolute -top-20 -right-24 w-[420px] h-[420px] rounded-full bg-emerald-500/[0.14] blur-[110px]" />
        <div className="absolute bottom-0 -left-16 w-[300px] h-[300px] rounded-full bg-blue-600/[0.12] blur-[100px]" />
      </div>

      <div className="relative container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                          dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400
                          bg-emerald-50 border border-emerald-200 text-emerald-700
                          text-[11px] font-bold tracking-[.1em] uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full dark:bg-emerald-400 bg-emerald-500 animate-pulse" />
            Area Layanan
          </div>
          <h2 className="font-serif text-4xl md:text-5xl xl:text-[52px] font-normal leading-[1.08] dark:text-white text-slate-900">
            Kami hadir<br />
            di <em className="italic dark:text-emerald-400 text-emerald-600">3 kota</em> terdekat
          </h2>
          <p className="text-[15px] dark:text-white/45 text-slate-500 mt-3.5 max-w-md leading-relaxed">
            Jangkauan layanan kami terus berkembang. Pilih kota dan temukan tim terdekat.
          </p>
        </motion.div>

        {/* City grid */}
        <div className="grid md:grid-cols-2 gap-5">
          <FeaturedCard />
          <div className="grid gap-5">
            {secondaryCities.map((city, i) => (
              <SmallCard key={city.city} city={city} index={i} />
            ))}
          </div>
        </div>

        {/* Coverage stats bar */}
        <CoverageBar />
      </div>
    </section>
  );
}
