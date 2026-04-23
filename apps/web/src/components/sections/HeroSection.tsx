'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';

interface BeforeAfterSlide {
  before: string;
  after: string;
  title: string;
}

interface HeroStats {
  homesCleaned: string;
  rating: string;
  satisfaction: string;
  responseTime: string;
}

interface HeroSectionProps {
  badge?: string;
  headline?: string;
  subheadline?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  heroImage?: string;
  stats?: HeroStats;
  beforeAfterSlides?: BeforeAfterSlide[];
}

// Before/After Slider Component
function BeforeAfterSlider({ before, after, title }: { before: string; after: string; title: string }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-col-resize select-none group dark:invert-0"
      onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
      onMouseMove={(e) => { if (isDragging) handleMove(e.clientX); }}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      {/* BEFORE Image (grayscale - dirty state) */}
      <div className="absolute inset-0 z-0">
        <img
          src={before}
          alt="Before cleaning"
          className="w-full h-full object-cover sepia-[0.3] brightness-75 grayscale dark:sepia-0 dark:brightness-100 dark:grayscale-0"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      {/* AFTER Image (uses clip-path to reveal portion) */}
      <div className="absolute inset-0 z-10">
        <img
          src={after}
          alt="After cleaning"
          className="w-full h-full object-cover"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white cursor-col-resize z-20"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-2xl flex items-center justify-center">
          <div className="flex items-center gap-0.5">
            <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-[12px] font-semibold text-white/80 dark:hidden">
        Before
      </div>
      <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-emerald-500/80 backdrop-blur-sm text-[12px] font-semibold text-white hidden dark:block">
        After ✨
      </div>

      {/* Hover hint */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${isDragging ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
        <div className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-sm text-[13px] text-white/80 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
          Geser untuk bandingkan
        </div>
      </div>
    </div>
  );
}

export default function HeroSection({
  badge = 'Dipercaya 1250+ Pelanggan',
  headline = 'Transformasi Rumah Anda',
  subheadline = 'Layanan kebersihan profesional dengan tim tersertifikasi. Hasil nyata yang bisa kamu lihat langsung — sebelum dan sesudah.',
  ctaPrimaryText = 'Booking Sekarang',
  ctaPrimaryLink = '/booking',
  ctaSecondaryText = 'Lihat Layanan & Paket',
  ctaSecondaryLink = '/services',
  stats = { homesCleaned: '1250+', rating: '4.95', satisfaction: '99%', responseTime: '< 30m' },
  beforeAfterSlides = [
    { before: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', after: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80&sat=-100&brightness=1.15', title: 'Deep Cleaning Ruang Tamu' },
    { before: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', after: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&sat=-100&brightness=1.15', title: 'Pembersihan Dapur' },
    { before: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80', after: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80&sat=-100&brightness=1.15', title: 'Kamar Mandi Kilat' },
  ],
}: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    if (!beforeAfterSlides || beforeAfterSlides.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % beforeAfterSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [beforeAfterSlides]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const springConfig = { stiffness: 100, damping: 30, mass: 0.8 };
  const heroY = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '30%']), springConfig);
  const heroOpacity = useSpring(useTransform(scrollYProgress, [0, 0.6], [1, 0]), springConfig);

  const data = {
    homesCleaned: stats.homesCleaned || '1250+',
    rating: stats.rating || '4.95',
    satisfaction: stats.satisfaction || '99%',
    responseTime: stats.responseTime || '< 30m',
  };

  const slides = beforeAfterSlides && beforeAfterSlides.length > 0 ? beforeAfterSlides : [
    { before: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', after: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80&sat=-100&brightness=1.15', title: 'Deep Cleaning Ruang Tamu' },
    { before: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', after: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&sat=-100&brightness=1.15', title: 'Pembersihan Dapur' },
    { before: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80', after: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80&sat=-100&brightness=1.15', title: 'Kamar Mandi Kilat' },
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden dark:bg-[#06060e] bg-white"
    >
      {/* Ambient orbs - dark mode only */}
      <div className="pointer-events-none select-none dark:block hidden">
        <div className="absolute -top-24 -left-36 w-[480px] h-[480px] rounded-full bg-emerald-500/20 blur-[110px]" />
        <div className="absolute bottom-0 -right-24 w-[380px] h-[380px] rounded-full bg-blue-600/20 blur-[110px]" />
      </div>

      {/* Main Content */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl pt-16 sm:pt-20 md:pt-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-left">
            {/* Live tag */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                         dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400
                         bg-emerald-50 border border-emerald-200 text-emerald-700
                         text-[12px] font-semibold tracking-widest uppercase mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full dark:bg-emerald-400 bg-emerald-500 animate-pulse" />
              {badge}
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.07] font-normal dark:text-white text-slate-900 mb-4 sm:mb-6"
            >
              {headline.split('|').map((part, i) => (
                <span key={i}>{i > 0 ? <><br /><em className="italic dark:text-emerald-400 text-emerald-600">{part}</em></> : part}</span>
              ))}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-[15px] dark:text-white/45 text-slate-500 leading-relaxed mb-8 max-w-lg"
            >
              {subheadline}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 mb-8 sm:mb-12"
            >
              <Link href={ctaPrimaryLink} className="w-full sm:w-auto group">
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full shadow-2xl dark:shadow-accent/30 hover:shadow-accent/50 transition-all duration-300 group-hover:scale-105"
                  rightIcon={
                    <motion.svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </motion.svg>
                  }
                >
                  {ctaPrimaryText}
                </Button>
              </Link>
              <Link href={ctaSecondaryLink} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full dark:border-white/20 dark:text-white dark:hover:bg-white/10 dark:hover:border-white/40
                             border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400
                             backdrop-blur-sm transition-all duration-300"
                >
                  {ctaSecondaryText}
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 lg:flex lg:items-center lg:gap-0 rounded-2xl dark:bg-white/[0.03] dark:border-white/[0.08]
                         bg-white border border-slate-200 p-1.5"
            >
              {[
                { value: `${data.homesCleaned}+`, label: 'Rumah Dilayani', icon: '🏠' },
                { value: data.rating, label: 'Rating', icon: '⭐' },
                { value: `${data.satisfaction}%`, label: 'Kepuasan', icon: '💯' },
                { value: data.responseTime, label: 'Respon', icon: '⚡' },
              ].map((stat, idx, arr) => (
                <div key={idx} className="flex items-center">
                  <div className="flex items-center gap-3 px-4 py-2.5">
                    <span className="text-xl">{stat.icon}</span>
                    <div className="text-left">
                      <p className="text-lg font-bold dark:text-white text-slate-900 leading-none">{stat.value}</p>
                      <p className="text-[11px] dark:text-white/35 text-slate-400 mt-0.5">{stat.label}</p>
                    </div>
                  </div>
                  {idx < arr.length - 1 && idx % 2 === 1 && (
                    <div className="w-px h-8 mx-1 lg:hidden dark:bg-white/[0.08] bg-slate-200" />
                  )}
                  {idx < arr.length - 1 && idx % 2 !== 1 && (
                    <div className="hidden lg:block w-px h-8 dark:bg-white/[0.08] bg-slate-200" />
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Before/After Slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="relative hidden md:block"
          >
            <div className="relative">
              {/* Glow */}
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-transparent to-blue-600/20 rounded-3xl blur-2xl dark:block hidden"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Card */}
              <div className="relative dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/[0.08]
                             bg-white backdrop-blur-none border border-slate-200 rounded-3xl p-3 shadow-xl">
                {/* Slide dots */}
                <div className="flex justify-center gap-2 mb-3">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeSlide === idx
                          ? 'w-8 dark:bg-emerald-400 bg-emerald-500'
                          : 'w-1.5 dark:bg-white/20 bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>

                {/* Before/After Slider */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <BeforeAfterSlider
                      before={slides[activeSlide].before}
                      after={slides[activeSlide].after}
                      title={slides[activeSlide].title}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Slide title */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 text-center"
                  >
                    <p className="text-[13px] dark:text-white/60 text-slate-600">
                      {slides[activeSlide].title}
                    </p>
                    <p className="text-[11px] dark:text-emerald-400 text-emerald-600 mt-0.5">
                      Real results from our customers
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Mini thumbnails */}
                <div className="flex justify-center gap-2 mt-3">
                  {slides.map((slide, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        activeSlide === idx
                          ? 'dark:border-emerald-400 border-emerald-500 dark:shadow-lg dark:shadow-emerald-400/20 shadow-md shadow-emerald-200'
                          : 'dark:border-white/10 border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={slide.after}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full dark:bg-emerald-500 dark:border-emerald-400/30
                           bg-emerald-100 border border-emerald-300 shadow-lg"
              >
                <span className="text-[11px] font-bold dark:text-white text-emerald-700">100% Real Photo</span>
              </motion.div>

              {/* Rating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, type: 'spring' }}
                className="absolute -bottom-3 -left-3 px-3 py-2 rounded-xl dark:bg-black/60 dark:backdrop-blur-xl dark:border-white/10
                           bg-white border border-slate-200 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-sm">★★★★★</span>
                  <div>
                    <p className="text-[12px] font-bold dark:text-white text-slate-900">4.95</p>
                    <p className="text-[10px] dark:text-white/40 text-slate-500">500+ Reviews</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative">
          <div className="w-8 h-14 border-2 dark:border-white/20 border-slate-300 rounded-full flex justify-center pt-3">
            <motion.div
              className="w-1.5 h-3 bg-gradient-to-t from-blue-500 to-emerald-500 rounded-full"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="dark:text-white/30 text-slate-400 text-xs tracking-wider">SCROLL</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
