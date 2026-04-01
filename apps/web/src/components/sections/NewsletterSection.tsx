'use client';

import { motion } from 'framer-motion';

interface NewsletterSectionProps {
  title?: string;
  subtitle?: string;
}

export default function NewsletterSection({ 
  title = 'Tetap Update', 
  subtitle = 'Dapatkan tips cleaning dan promo eksklusif langsung ke inbox kamu' 
}: NewsletterSectionProps) {
  return (
    <section className="py-24 section-alt overflow-hidden">
      {/* Ambient orbs */}
      <div className="pointer-events-none select-none">
        <div className="absolute -bottom-20 left-1/4 w-[380px] h-[380px] rounded-full hero-glow-1 blur-[110px]" />
      </div>

      <div className="relative container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto text-center"
        >
          {/* Live tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full page-badge text-[12px] font-semibold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Newsletter
          </div>

          <h2 className="font-serif text-3xl md:text-4xl font-normal page-text mb-3">
            {title}
          </h2>
          <p className="text-[15px] page-text-muted mb-8 leading-relaxed">
            {subtitle}
          </p>

          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="email@kamu.com"
              className="flex-1 px-4 py-3.5 rounded-xl page-input border
                         text-[14px]
                         focus:outline-none focus:border-emerald-400
                         transition-colors duration-200"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25
                         text-[14px] font-semibold text-emerald-400
                         hover:bg-emerald-500/18 hover:border-emerald-500/40
                         transition-colors duration-200 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>

          <p className="text-[12px] page-text-muted mt-4 flex items-center justify-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 14 16" fill="none">
              <rect x="2" y="7" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M4.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            Email kamu aman. Tidak ada spam, berhenti kapan saja.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
