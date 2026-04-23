'use client';

import { motion } from 'framer-motion';

const reasons = [
  { icon: '🛡️', title: 'Garansi 100%', desc: 'Tidak puas? Kami ulang gratis', color: 'emerald' },
  { icon: '⏰', title: 'Tepat Waktu', desc: 'Kami selalu datang sesuai jadwal', color: 'blue' },
  { icon: '🌿', title: 'Eco-Friendly', desc: 'Produk aman untuk keluarga', color: 'green' },
  { icon: '💰', title: 'Harga Fair', desc: 'Transparan, tanpa biaya tersembunyi', color: 'amber' },
];

const colorVariantsDark: Record<string, string> = {
  emerald: 'dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 bg-emerald-50 text-emerald-600 border-emerald-200',
  blue: 'dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 bg-blue-50 text-blue-600 border-blue-200',
  green: 'dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20 bg-green-50 text-green-600 border-green-200',
  amber: 'dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20 bg-amber-50 text-amber-600 border-amber-200',
};

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

export default function WhyChooseSection() {
  return (
    <section className="relative py-24 dark:bg-[#06060e] bg-white overflow-hidden">
      {/* Ambient orbs - dark mode only */}
      <div className="pointer-events-none select-none dark:block hidden">
        <div className="absolute top-0 right-1/4 w-[320px] h-[320px] rounded-full bg-emerald-500/[0.08] blur-[110px]" />
      </div>

      <div className="relative container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          {/* Live tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                          dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400
                          bg-emerald-50 border border-emerald-200 text-emerald-700
                          text-[12px] font-semibold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full dark:bg-emerald-400 bg-emerald-500 animate-pulse" />
            Keunggulan
          </div>

          <h2 className="font-serif text-3xl md:text-4xl xl:text-[44px] font-normal dark:text-white text-slate-900 mb-4">
            Mengapa <em className="italic dark:text-emerald-400 text-emerald-600">Ningclean?</em>
          </h2>
          <p className="text-[15px] dark:text-white/45 text-slate-500 max-w-md mx-auto leading-relaxed">
            Keunggulan yang membuat kami menjadi pilihan utama
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {reasons.map((point, i) => (
            <motion.div
              key={i}
              variants={item}
              className="group p-6 dark:bg-white/[0.03] dark:border-white/[0.08]
                         hover:dark:bg-white/[0.06] hover:dark:border-white/[0.12]
                         bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300
                         rounded-2xl transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${colorVariantsDark[point.color]}`}>
                <span className="text-2xl">{point.icon}</span>
              </div>
              <h3 className="font-serif text-lg font-normal dark:text-white text-slate-900 mb-2">{point.title}</h3>
              <p className="text-[13px] dark:text-white/40 text-slate-500 leading-relaxed">{point.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
