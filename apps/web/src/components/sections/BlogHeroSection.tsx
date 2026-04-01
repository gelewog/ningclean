'use client';

import { motion } from 'framer-motion';

interface BlogHeroSectionProps {
  title?: string;
  subtitle?: string;
}

export default function BlogHeroSection({ 
  title = 'Blog & Tips', 
  subtitle = 'Panduan merawat rumah dan tips kebersihan dari tim Ningclean' 
}: BlogHeroSectionProps) {
  return (
    <section className="relative pt-32 pb-20 page-bg overflow-hidden">
      {/* Ambient orbs */}
      <div className="pointer-events-none select-none">
        <div className="absolute -top-20 -left-24 w-[380px] h-[380px] rounded-full hero-glow-1 blur-[110px]" />
        <div className="absolute -bottom-10 -right-16 w-[300px] h-[300px] rounded-full hero-glow-2 blur-[100px]" />
      </div>

      <div className="relative container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Live tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full page-badge text-[12px] font-semibold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Artikel & Tips
          </div>

          <h1 className="font-serif text-4xl md:text-5xl xl:text-[56px] font-normal leading-[1.07] page-text mb-4">
            {title}
          </h1>
          <p className="text-[15px] page-text-muted max-w-md mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
