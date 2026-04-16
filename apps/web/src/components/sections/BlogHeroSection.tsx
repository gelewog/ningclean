'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface BlogHeroSectionProps {
  title?: string;
  subtitle?: string;
  totalPosts?: number;
}

export default function BlogHeroSection({ 
  title = 'Blog & Tips',
  subtitle = 'Panduan merawat rumah dan tips kebersihan dari tim profesional Ningclean',
  totalPosts = 0
}: BlogHeroSectionProps) {
  return (
    <section className="relative pt-28 pb-16 page-bg overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" 
           style={{
             backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
             backgroundSize: '48px 48px'
           }} />

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
      
      {/* Ambient glow */}
      <div className="pointer-events-none select-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-6 border border-emerald-100 dark:border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fresh Content</span>
            {totalPosts > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-emerald-300 dark:bg-emerald-600" />
                <span>{totalPosts} Artikel</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight page-text mb-5 leading-[1.1]">
            {title}
          </h1>
          
          {/* Subtitle */}
          <p className="text-base md:text-lg page-text-muted max-w-xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 max-w-lg mx-auto"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Cari artikel..."
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 text-sm page-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}