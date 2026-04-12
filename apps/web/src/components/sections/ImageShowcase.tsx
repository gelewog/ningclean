'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ArrowRight, ZoomIn } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  beforeImage?: string;
  afterImage?: string;
  location?: string;
  category?: string;
}

interface ImageShowcaseProps {
  title?: string;
  subtitle?: string;
  galleryItems?: GalleryItem[];
}

// Fallback static data
const FALLBACK_SHOWCASE: GalleryItem[] = [
  {
    id: 'fallback-1',
    beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80&sat=-100&brightness=1.15',
    title: 'Ruang Tamu',
    location: 'Surabaya',
    category: 'Home Cleaning',
    description: 'Deep cleaning ruang tamu minimalis dengan hasil mengkilap.',
  },
  {
    id: 'fallback-2',
    beforeImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&sat=-100&brightness=1.15',
    title: 'Dapur',
    location: 'Sidoarjo',
    category: 'Deep Cleaning',
    description: 'Pembersihan dapur setelah acara catering besar.',
  },
  {
    id: 'fallback-3',
    beforeImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80&sat=-100&brightness=1.15',
    title: 'Kamar Mandi',
    location: 'Surabaya',
    category: 'Deep Cleaning',
    description: 'Kamar mandi bebas kerak dan jamur.',
  },
  {
    id: 'fallback-4',
    beforeImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80&sat=-100&brightness=1.15',
    title: 'Sofa',
    location: 'Gresik',
    category: 'Sofa Cleaning',
    description: 'Sofa kulit kembali seperti baru.',
  },
  {
    id: 'fallback-5',
    beforeImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&sat=-100&brightness=1.15',
    title: 'Ruang Meeting',
    location: 'Surabaya',
    category: 'Office Cleaning',
    description: 'Office cleaning mingguan dengan hasil premium.',
  },
  {
    id: 'fallback-6',
    beforeImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&sat=-100&brightness=1.15',
    title: 'Rumah Baru',
    location: 'Sidoarjo',
    category: 'Post Construction',
    description: 'Post-construction cleaning rumah baru 2 lantai.',
  },
];

function ComparisonCard({ image, index }: { image: GalleryItem; index: number }) {
  const [showAfter, setShowAfter] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group relative"
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden dark:bg-white/[0.03] bg-slate-100">
        {/* Image */}
        <img
          src={showAfter ? image.afterImage : image.beforeImage}
          alt={image.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Before/After toggle */}
        <button
          onClick={() => setShowAfter(!showAfter)}
          className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 backdrop-blur-sm"
          style={{
            backgroundColor: showAfter ? 'rgba(16, 185, 129, 0.85)' : 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            border: showAfter ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {showAfter ? '✨ After' : '📷 Before'}
        </button>

        {/* Category badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full dark:bg-black/40 bg-white/80 backdrop-blur-sm text-[11px] dark:text-white/80 text-slate-700">
          {image.category}
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-semibold dark:text-white text-slate-900 text-[15px] mb-0.5">{image.title}</h3>
          <p className="dark:text-white/60 text-slate-600 text-[12px] flex items-center gap-1.5">
            <span>📍</span> {image.location}
          </p>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 dark:bg-emerald-500/90 bg-emerald-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="dark:text-white text-slate-900 text-[14px] leading-relaxed">{image.description}</p>
            <Link href="/gallery" className="inline-flex items-center gap-1.5 mt-3 dark:text-white/80 text-slate-800 text-[13px] hover:text-white dark:hover:text-white transition-colors">
              <ZoomIn className="w-4 h-4" />
              Lihat Detail
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ImageShowcase({
  title = "Hasil Nyata",
  subtitle = "Bukti hasil kerja tim profesional kami. Setiap foto adalah real customer results.",
  galleryItems = [],
}: ImageShowcaseProps) {
  // Use API data if available, otherwise use fallback
  const displayItems = galleryItems.length > 0 ? galleryItems : FALLBACK_SHOWCASE;
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden dark:bg-[#06060e] bg-white"
    >
      {/* Ambient orbs - dark mode only */}
      <div className="pointer-events-none select-none dark:block hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/[0.05] blur-[140px]" />
      </div>

      <div className="relative container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full dark:bg-emerald-500/[0.08] dark:border-emerald-500/20 bg-emerald-50 border border-emerald-200 mb-6">
            <svg className="w-4 h-4 dark:text-emerald-400 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[12px] font-semibold dark:text-emerald-400 text-emerald-700 tracking-wider uppercase">
              Gallery Hasil Kerja
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl dark:text-white text-slate-900 mb-4">
            {title}
            <br />
            <em className="italic dark:text-emerald-400 text-emerald-600">yang Bisa Kamu Lihat</em>
          </h2>

          <p className="text-[15px] dark:text-white/40 text-slate-500 max-w-md mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-8 mb-10"
        >
          {[
            { value: '1200+', label: 'Project Selesai' },
            { value: '3 Kota', label: 'Coverage Area' },
            { value: '100%', label: 'Garansi' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-xl font-bold dark:text-emerald-400 text-emerald-600">{stat.value}</p>
              <p className="text-[12px] dark:text-white/35 text-slate-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Horizontal scroll gallery */}
        <motion.div
          ref={scrollRef}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Fade edges - dark mode */}
          <div className="absolute left-0 top-0 bottom-0 w-12 dark:bg-gradient-to-r dark:from-[#06060e] dark:to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 dark:bg-gradient-to-l dark:from-[#06060e] dark:to-transparent z-10 pointer-events-none" />
          {/* Fade edges - light mode */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none dark:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none dark:hidden" />

          {/* Scrollable grid */}
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
            {displayItems.map((image, idx) => (
              <div key={image.id} className="flex-shrink-0 w-[300px]" style={{ scrollSnapAlign: 'start' }}>
                <ComparisonCard image={image} index={idx} />
              </div>
            ))}

            {/* View all card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="flex-shrink-0 w-[300px]"
            >
              <Link href="/gallery">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden dark:bg-white/[0.03] bg-slate-100 border dark:border-white/[0.08] border-slate-200 flex items-center justify-center group hover:dark:border-emerald-500/30 hover:border-emerald-300 transition-all duration-300">
                  <div className="text-center p-6">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl dark:bg-emerald-500/[0.1] dark:border-emerald-500/20 bg-emerald-50 border border-emerald-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowRight className="w-6 h-6 dark:text-emerald-400 text-emerald-600" />
                    </div>
                    <p className="dark:text-white text-slate-900 font-semibold text-[15px] mb-1">Lihat Semua</p>
                    <p className="dark:text-white/40 text-slate-500 text-[12px]">1200+ foto hasil kerja</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <Link href="/gallery">
            <Button
              variant="outline"
              size="lg"
              className="dark:border-white/[0.12] dark:text-white/60 dark:hover:bg-white/[0.05]
                         border-slate-300 text-slate-600 hover:bg-slate-100 gap-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Eksplorasi Galeri Lengkap
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
