'use client';

import { motion } from 'framer-motion';

export default function ServicesHeroSection() {
  return (
    <section className="relative pt-32 pb-20 dark:bg-[#06060e] bg-slate-50 overflow-hidden">
      {/* Ambient orbs - dark mode only */}
      <div className="pointer-events-none select-none dark:block hidden">
        <div className="absolute -top-20 -right-24 w-[380px] h-[380px] rounded-full bg-emerald-500/[0.14] blur-[110px]" />
        <div className="absolute -bottom-10 -left-16 w-[300px] h-[300px] rounded-full bg-blue-600/[0.12] blur-[100px]" />
      </div>

      <div className="relative container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Live tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                          dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400
                          bg-emerald-50 border border-emerald-200 text-emerald-700
                          text-[12px] font-semibold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full dark:bg-emerald-400 bg-emerald-500 animate-pulse" />
            Layanan Unggulan
          </div>

          <h1 className="font-serif text-4xl md:text-5xl xl:text-[56px] font-normal leading-[1.07] dark:text-white text-slate-900 mb-4">
            Layanan <em className="italic dark:text-emerald-400 text-emerald-600">Cleaning</em><br />
            Profesional
          </h1>
          <p className="text-[15px] dark:text-white/45 text-slate-500 max-w-md mx-auto leading-relaxed">
            Pilihan lengkap jasa cleaning untuk rumah, kantor, dan apartemen Anda di Surabaya, Gresik, dan Sidoarjo
          </p>
        </motion.div>
      </div>
    </section>
  );
}
