'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Extended feature data with more details
const features = [
  {
    id: 'trusted',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="g-emerald-dark" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10b981" />
            <stop offset="1" stopColor="#14b8a6" />
          </linearGradient>
          <linearGradient id="g-emerald-light" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#059669" />
            <stop offset="1" stopColor="#0d9488" />
          </linearGradient>
        </defs>
        <path stroke="url(#g-emerald-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M20 7l-8.28 8.28c-.83.83-2.17.83-3 0L3 9.5" />
        <path stroke="url(#g-emerald-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M3 15l5.5 5.5c1.13 1.13 2.97 1.13 4.1 0L20 14" />
      </svg>
    ),
    title: 'Terpercaya & Tersertifikasi',
    description: '500+ rumah puas dilayanin',
    longDescription: 'Tim profesional tersertifikasi dengan background check ketat dan pelatihan berkala.',
    stats: { value: '500+', label: 'Pelanggan Puas', trend: '+45% YoY' },
    color: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-500/20 to-teal-500/5',
    tags: ['Sertifikasi BNSP', 'Background Check', 'Asuransi Kerja'],
  },
  {
    id: 'pricing',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="g-blue-dark" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <path stroke="url(#g-blue-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M8 10l4-4 4 4M8 14l4 4 4-4" />
        <circle cx="12" cy="12" r="9" stroke="url(#g-blue-dark)" strokeWidth="1.8" />
      </svg>
    ),
    title: 'Harga Transparan',
    description: 'Tanpa biaya tersembunyi',
    longDescription: 'Kalkulasi harga otomatis berdasarkan luas area & tingkat kekotoran. Gratis survey.',
    stats: { value: '0%', label: 'Biaya Tersembunyi', trend: 'Garansi Harga' },
    color: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/20 to-cyan-500/5',
    tags: ['Gratis Survey', 'Pembayaran Fleksibel', 'Invoice Digital'],
  },
  {
    id: 'punctual',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="g-purple-dark" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a855f7" />
            <stop offset="1" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="9" stroke="url(#g-purple-dark)" strokeWidth="1.8" />
        <path stroke="url(#g-purple-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
        <path stroke="url(#g-purple-dark)" strokeWidth="1.8" strokeLinecap="round" d="M6 3l2 2M18 3l-2 2" />
      </svg>
    ),
    title: 'Ketepatan Waktu 99%',
    description: 'Jadwal sesuai kesepakatan',
    longDescription: 'Sistem tracking real-time & notifikasi otomatis. Telat? Dapat kompensasi.',
    stats: { value: '99%', label: 'Tepat Waktu', trend: '< 15 menit delay' },
    color: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/20 to-pink-500/5',
    tags: ['Live Tracking', 'Notifikasi Otomatis', 'Kompensasi Keterlambatan'],
  },
  {
    id: 'guarantee',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="g-orange-dark" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f97316" />
            <stop offset="1" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <path stroke="url(#g-orange-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 2l1.5 4.5H18l-3.75 2.73L15.75 14 12 11.27 8.25 14l1.5-4.77L6 6.5h4.5L12 2z" />
        <path stroke="url(#g-orange-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M5 19c0-3.87 3.13-7 7-7s7 3.13 7 7" />
      </svg>
    ),
    title: 'Garansi 100% Kepuasan',
    description: 'Tidak puas? Kami ulang gratis',
    longDescription: 'Inspeksi kualitas 2 tahap. Jaminan bersih atau kami kerjakan ulang tanpa biaya.',
    stats: { value: '100%', label: 'Kepuasan Terjamin', trend: '< 1% komplain' },
    color: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-500/20 to-red-500/5',
    tags: ['Quality Control', 'Free Reclean', '24/7 Support'],
  },
];

// Additional value propositions
const valueProps = [
  { icon: '🔬', text: 'Eco-friendly Products', badge: 'Rendah Emisi' },
  { icon: '🤖', text: 'Peralatan Modern', badge: 'Hightech' },
  { icon: '📱', text: 'Aplikasi Mobile', badge: 'Easy Booking' },
  { icon: '🎓', text: 'Training Berkala', badge: 'Certified' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function FeaturesSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Auto-rotate active feature for carousel on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.innerWidth < 1024) {
        setActiveFeature((prev) => {
          const currentIndex = features.findIndex(f => f.id === prev);
          const nextIndex = (currentIndex + 1) % features.length;
          return features[nextIndex].id;
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden dark:bg-[#06060e] bg-slate-50"
    >
      {/* Ambient orbs - dark mode only */}
      <div className="pointer-events-none select-none dark:block hidden">
        <div className="absolute -top-20 -right-24 w-[420px] h-[420px] rounded-full bg-emerald-500/[0.14] blur-[110px]" />
        <div className="absolute bottom-0 -left-16 w-[300px] h-[300px] rounded-full bg-blue-600/[0.12] blur-[100px]" />
      </div>

      <div className="relative container mx-auto px-6 max-w-5xl">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                          dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400
                          bg-emerald-50 border border-emerald-200 text-emerald-700
                          text-[12px] font-semibold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full dark:bg-emerald-400 bg-emerald-500 animate-pulse" />
            Keunggulan Kami
          </div>

          <h2 className="font-serif text-4xl md:text-5xl xl:text-[52px] font-normal leading-[1.07] dark:text-white text-slate-900">
            Lebih dari sekadar<br />
            <em className="italic dark:text-emerald-400 text-emerald-600">Cleaning Service</em>
          </h2>

          <p className="text-[15px] dark:text-white/45 text-slate-500 mt-3.5 max-w-md mx-auto leading-relaxed">
            Kombinasi sempurna antara tenaga profesional dan komitmen terhadap kepuasan pelanggan.
          </p>
        </motion.div>

        {/* Desktop Grid View */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="hidden lg:grid lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={item}
              onHoverStart={() => setHoveredCard(feature.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="group relative"
            >
              <div className="relative h-full dark:bg-gradient-to-br dark:from-white/[0.08] dark:to-white/[0.02]
                             bg-gradient-to-br from-white to-slate-50/50
                             dark:backdrop-blur-xl backdrop-blur-sm
                             dark:border-white/10 border border-slate-200
                             rounded-2xl overflow-hidden transition-all duration-500
                             group-hover:dark:bg-gradient-to-br group-hover:dark:from-zinc-900/95 group-hover:dark:to-black/95
                             group-hover:dark:border-zinc-700 group-hover:dark:shadow-2xl group-hover:dark:shadow-black/50
                             group-hover:bg-white group-hover:border-slate-300 group-hover:shadow-lg group-hover:shadow-slate-200/50">

                <div className="relative p-6">
                  {/* Icon Container */}
                  <motion.div
                    className={`relative w-16 h-16 rounded-2xl dark:bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center mb-5`}
                    animate={hoveredCard === feature.id ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}

                    {/* Animated Pulse Ring */}
                    <motion.div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0`}
                      animate={hoveredCard === feature.id ? { scale: 1.2, opacity: 0.2 } : { scale: 1, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="font-serif text-xl font-normal dark:text-white text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="text-[13px] dark:text-white/45 text-slate-600 leading-relaxed">
                      {feature.longDescription}
                    </p>

                    {/* Stats Highlight */}
                    <div className="pt-3 dark:border-t-white/[0.06] border-t border-slate-100">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold dark:text-white text-slate-900">{feature.stats.value}</span>
                        <span className="text-[11px] dark:text-emerald-400 text-emerald-600">{feature.stats.trend}</span>
                      </div>
                      <p className="text-[11px] dark:text-white/30 text-slate-400 mt-1">{feature.stats.label}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {feature.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-1 rounded-full dark:bg-white/[0.05] dark:text-white/40 dark:border-white/[0.08]
                                     bg-slate-100 text-slate-500 border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover Corner Accent - dark mode only */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} rounded-full opacity-0 dark:group-hover:opacity-10 transition-opacity duration-500 -mr-16 -mt-16`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Carousel View */}
        <div className="lg:hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="dark:bg-slate-900/80 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-2xl dark:shadow-black/30
                         bg-white border border-slate-200 rounded-2xl p-6 shadow-lg"
            >
              {features.find(f => f.id === activeFeature) && (
                <>
                  {(() => {
                    const feature = features.find(f => f.id === activeFeature)!;
                    return (
                      <>
                        <div className={`w-16 h-16 rounded-2xl dark:bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center mb-5`}>
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">{feature.longDescription}</p>
                        <div className="pt-3 dark:border-t-white/10 border-t border-slate-100">
                          <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-bold dark:text-white text-slate-900">{feature.stats.value}</span>
                            <span className="text-xs dark:text-emerald-400 text-emerald-600">{feature.stats.trend}</span>
                          </div>
                          <p className="text-xs dark:text-gray-500 text-slate-400 mt-1">{feature.stats.label}</p>
                        </div>
                      </>
                    );
                  })()}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {features.map((feature, idx) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeFeature === feature.id ? 'w-8 dark:bg-emerald-500 bg-emerald-500' : 'w-2 dark:bg-white/30 bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Additional Value Props Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-8 dark:border-t-white/[0.08] border-t border-slate-200"
        >
          <div className="text-center mb-8">
            <h3 className="font-serif text-xl font-normal dark:text-white text-slate-900 mb-2">Keunggulan Tambahan</h3>
            <p className="text-[13px] dark:text-white/35 text-slate-500">Yang membuat kami berbeda dari yang lain</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {valueProps.map((prop, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="text-center p-4 dark:bg-slate-900/50 dark:border-white/[0.08] dark:shadow-lg dark:shadow-black/20
                           bg-white border border-slate-200 rounded-2xl group"
              >
                <div className="text-2xl mb-2">
                  {prop.icon}
                </div>
                <p className="dark:text-white text-slate-900 text-sm font-normal mb-1">{prop.text}</p>
                <span className="text-[11px] dark:text-emerald-400 text-emerald-600">{prop.badge}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 dark:bg-white/[0.03] dark:border-white/[0.08] bg-white border border-slate-200 rounded-full">
            <span className="text-yellow-400 text-sm">★★★★★</span>
            <span className="dark:text-white/45 text-slate-500 text-[13px]">4.95 dari 500+ ulasan</span>
            <span className="w-1 h-1 dark:bg-white/20 bg-slate-300 rounded-full" />
            <span className="dark:text-emerald-400 text-emerald-600 text-[13px]">✓ Terverifikasi Google</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
