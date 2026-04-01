'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { Service } from '@/types/api';
import ServiceCard from '@/components/cards/ServiceCard';
import Button from '@/components/ui/Button';
import { ArrowRight, Sparkles, Shield, Clock, Award, ChevronRight, TrendingUp } from 'lucide-react';

interface ServicesSectionProps {
  services: Service[];
  title?: string;
  subtitle?: string;
  badge?: string;
  showStats?: boolean;
  showFeaturedBadge?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

// Stats data
const stats = [
  { value: '500+', label: 'Proyek Selesai', icon: Award },
  { value: '98%', label: 'Kepuasan Klien', icon: TrendingUp },
  { value: '24/7', label: 'Dukungan', icon: Clock },
  { value: '30+', label: 'Tim Profesional', icon: Shield },
];

export default function ServicesSection({ 
  services, 
  title = "Layanan", 
  subtitle = "Solusi kebersihan profesional untuk rumah dan bisnis Anda",
  badge = "Layanan Unggulan",
  showStats = true,
  showFeaturedBadge = true
}: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Sort services by popularity or featured status if available
  const sortedServices = [...services].sort((a, b) => {
    if ('isFeatured' in a && 'isFeatured' in b) {
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
    return 0;
  });

  const featuredServices = sortedServices.slice(0, 3);
  const remainingServices = sortedServices.slice(3, 6);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 overflow-hidden dark:bg-[#06060e] bg-white"
    >
      {/* Ambient orbs - dark mode only */}
      <div className="pointer-events-none select-none dark:block hidden">
        <div className="absolute -top-20 -left-24 w-[420px] h-[420px] rounded-full bg-emerald-500/[0.14] blur-[110px]" />
        <div className="absolute bottom-0 -right-16 w-[320px] h-[320px] rounded-full bg-blue-600/[0.12] blur-[100px]" />
      </div>

      <div className="relative container mx-auto px-6 max-w-5xl">
        {/* Section Header */}
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
            {badge}
          </div>
          
          <h2 className="font-serif text-4xl md:text-5xl xl:text-[52px] font-normal leading-[1.07] dark:text-white text-slate-900 mb-4">
            {title}<br />
            <em className="italic dark:text-emerald-400 text-emerald-600">Profesional</em>
          </h2>
          
          <p className="text-[15px] dark:text-white/45 text-slate-500 max-w-md mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Featured Services - Premium Cards */}
        {showFeaturedBadge && featuredServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-xl font-normal dark:text-white text-slate-900 mb-1">Paling Diminati</h3>
                <p className="text-[13px] dark:text-white/40 text-slate-500">Layanan terbaik pilihan pelanggan</p>
              </div>
              <div className="hidden md:flex items-center gap-1 dark:text-white/30 text-slate-400 text-[12px]">
                <span>Rekomendasi</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-5">
              {featuredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  variants={item}
                  custom={index}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 dark:bg-gradient-to-r dark:from-emerald-500 dark:to-emerald-500/50 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                  <ServiceCard 
                    service={service} 
                    index={index} 
                    variant="featured"
                    isHovered={hoveredCard === index}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Services Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {(showFeaturedBadge ? remainingServices : sortedServices.slice(0, 6)).map((service, index) => (
            <motion.div
              key={service.id}
              variants={item}
              custom={index}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ServiceCard service={service} index={index} />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-16 pt-10 dark:border-t-white/[0.08] border-t border-slate-100"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-10 h-10 mx-auto mb-3 rounded-xl dark:bg-emerald-500/10 bg-emerald-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 dark:text-emerald-400 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-bold dark:text-white text-slate-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-[12px] dark:text-white/35 text-slate-500 uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-16"
        >
          <Link href="/services" className="inline-block group">
            <Button 
              variant="accent" 
              size="lg" 
              className="relative overflow-hidden shadow-2xl dark:shadow-emerald-500/25 group-hover:dark:shadow-emerald-500/40 shadow-emerald-200 transition-all"
            >
              <span className="relative z-10 flex items-center gap-3">
                Jelajahi Semua Layanan
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
          </Link>
          
          {/* Additional Info */}
          <p className="dark:text-white/30 text-slate-400 text-[13px] mt-5 flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5" />
            Garansi 100% kepuasan kerja
            <span className="w-1 h-1 dark:bg-white/20 bg-slate-300 rounded-full mx-1" />
            <Clock className="w-3.5 h-3.5" />
            Layanan tepat waktu
          </p>
        </motion.div>
      </div>
    </section>
  );
}
