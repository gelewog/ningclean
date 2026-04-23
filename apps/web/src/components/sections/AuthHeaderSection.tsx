'use client';

import { motion } from 'framer-motion';

interface AuthHeaderSectionProps {
  title: string;
  subtitle: string;
}

export default function AuthHeaderSection({ title, subtitle }: AuthHeaderSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-8"
    >
      {/* Logo Icon */}
      <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            stroke="#10b981"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1 className="font-serif text-2xl md:text-3xl font-normal page-text mb-2">{title}</h1>
      <p className="text-[14px] page-text-muted">{subtitle}</p>
    </motion.div>
  );
}
