'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import {
  ArrowRight,
  Shield,
  Clock,
  CheckCircle,
  Calendar,
  MessageCircle,
  Star,
} from 'lucide-react';

interface CTASectionProps {
  title?: string;
  highlightedText?: string;
  subtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  whatsappNumber?: string;
}

const trustBadges = [
  { icon: Shield, text: 'Garansi 100%', description: 'Kepuasan terjamin' },
  { icon: Clock, text: 'Tepat Waktu', description: 'Sesuai jadwal' },
  { icon: CheckCircle, text: 'Profesional', description: 'Tim tersertifikasi' },
];

export default function CTASection({ 
  title = "Siap Rumah Anda",
  highlightedText = "Kinclong Maksimal?",
  subtitle = "Booking sekarang dan rasakan perbedaan. Tim profesional kami siap datang ke lokasi Anda dalam waktu 2 jam!",
  primaryButtonText = "Book Sekarang",
  secondaryButtonText = "WhatsApp",
  whatsappNumber = "6281234567890"
}: CTASectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });
  
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Halo, saya tertarik dengan layanan cleaning service. Bisa info lebih lanjut?");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 overflow-hidden dark:bg-[#06060e] bg-white"
    >
      {/* Ambient orbs - dark mode only */}
      <div className="pointer-events-none select-none dark:block hidden">
        <div className="absolute top-0 left-1/4 w-[420px] h-[420px] rounded-full bg-emerald-500/[0.14] blur-[110px]" />
        <div className="absolute bottom-0 right-1/4 w-[320px] h-[320px] rounded-full bg-blue-600/[0.12] blur-[100px]" />
      </div>

      <div className="relative container mx-auto px-6 max-w-5xl">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Live tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                          dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400
                          bg-emerald-50 border border-emerald-200 text-emerald-700
                          text-[12px] font-semibold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full dark:bg-emerald-400 bg-emerald-500 animate-pulse" />
            Promo Terbatas
          </div>

          {/* Main Title */}
          <h2 className="font-serif text-4xl md:text-5xl xl:text-[52px] font-normal leading-[1.07] dark:text-white text-slate-900 mb-4">
            {title}<br />
            <em className="italic dark:text-emerald-400 text-emerald-600">{highlightedText}</em>
          </h2>
          
          <p className="text-[15px] dark:text-white/45 text-slate-500 leading-relaxed max-w-lg mx-auto mb-10">
            {subtitle}
          </p>

          {/* Pricing hint */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full dark:bg-white/[0.03] dark:border-white/[0.08]
                             bg-slate-100 border border-slate-200">
              <span className="text-amber-500 text-sm">★</span>
              <span className="dark:text-white/45 text-slate-600 text-[12px]">Mulai dari</span>
              <span className="dark:text-emerald-400 text-emerald-600 font-semibold text-sm">Rp 150K</span>
              <span className="dark:text-white/30 text-slate-400 text-[11px]">/sesi</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full dark:bg-white/[0.03] dark:border-white/[0.08]
                             bg-slate-100 border border-slate-200">
              <Clock className="w-3 h-3 dark:text-emerald-400 text-emerald-600" />
              <span className="dark:text-white/45 text-slate-600 text-[12px]">Free cancellation</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking" className="w-full sm:w-auto">
              <Button 
                variant="accent" 
                size="lg" 
                className="w-full sm:w-auto shadow-2xl dark:shadow-emerald-500/30 group"
                rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />}
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {primaryButtonText}
                </span>
              </Button>
            </Link>
            
            <button
              onClick={handleWhatsAppClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
                         dark:bg-white/[0.03] dark:border-white/[0.08] dark:text-white dark:hover:bg-white/[0.06]
                         bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200
                         font-semibold text-sm transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4 dark:text-emerald-400 text-emerald-600" />
              {secondaryButtonText}
              <span className="dark:text-white/30 text-slate-400 text-xs ml-1">| 24/7</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 pt-10 dark:border-t-white/[0.08] border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              {trustBadges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-lg dark:bg-emerald-500/10 bg-emerald-50 flex items-center justify-center">
                      <Icon className="w-4 h-4 dark:text-emerald-400 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <div className="dark:text-white text-slate-900 font-medium text-[13px]">{badge.text}</div>
                      <div className="dark:text-white/35 text-slate-500 text-[11px]">{badge.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Testimonial snippet */}
          <div className="mt-10">
            <div className="inline-flex items-center gap-3 dark:bg-white/[0.03] rounded-full px-4 py-2
                             bg-slate-100 border border-slate-200">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="dark:text-white/50 text-slate-600 text-[12px] max-w-[180px] truncate">
                "Pelayanan sangat profesional, rumah jadi bersih maksimal!"
              </p>
              <div className="w-px h-3 dark:bg-white/10 bg-slate-300" />
              <span className="dark:text-white/35 text-slate-500 text-[11px]">Ibu Rina</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
