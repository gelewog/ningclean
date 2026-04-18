'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { BlogPost } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

function getImageUrl(src: string | undefined): string {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  return `${API_URL}${src.startsWith('/') ? '' : '/'}${src}`;
}

interface BlogSectionProps {
  posts: BlogPost[];
}

const badgeStyles = {
  'deep-cleaning': {
    dark: 'dark:bg-emerald-500/10 dark:text-emerald-400 dark:border dark:border-emerald-500/20',
    light: 'bg-emerald-100 text-emerald-700 border border-emerald-300',
  },
  'perawatan-sofa': {
    dark: 'dark:bg-blue-500/10 dark:text-blue-400 dark:border dark:border-blue-500/20',
    light: 'bg-blue-100 text-blue-700 border border-blue-300',
  },
  'tips-harian': {
    dark: 'dark:bg-amber-400/10 dark:text-amber-400 dark:border dark:border-amber-400/20',
    light: 'bg-amber-100 text-amber-700 border border-amber-300',
  },
  default: {
    dark: 'dark:bg-white/[0.06] dark:text-white/70 dark:border dark:border-white/10',
    light: 'bg-slate-200 text-slate-700 border border-slate-400',
  },
};

function getCategoryStyle(slug?: string) {
  const key = slug ?? 'default';
  return badgeStyles[key] ?? badgeStyles.default;
}

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeaturedCard({ post }: { post: BlogPost }) {
  const catStyle = getCategoryStyle(post.category?.slug);

  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="group row-span-2 flex flex-col rounded-[26px] overflow-hidden h-full
                   dark:bg-white/[0.03] dark:border-white/[0.08] dark:hover:bg-white/[0.06] dark:hover:border-white/[0.15]
                   bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300
                   transition-colors duration-300 cursor-pointer"
      >
        {/* Image area */}
        <div className="relative h-[240px] overflow-hidden flex-shrink-0">
          {post.coverImage ? (
            <img
              src={getImageUrl(post.coverImage)}
              alt={post.title}
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br dark:from-[#0d2b1e] dark:to-[#0a1a2e] from-emerald-50 to-blue-50" />
          )}
          <div className="absolute bottom-3 left-4">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold
                             dark:bg-black/50 dark:backdrop-blur-sm dark:border-white/10 dark:text-white/65
                             bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600">
              Featured Post
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 px-6 py-6">
          <span className={`inline-block px-2.5 py-[3px] rounded-full text-[11px] font-semibold mb-3 self-start ${catStyle.dark} ${catStyle.light}`}>
            {post.category?.name ?? 'Artikel'}
          </span>

          <h3 className="font-serif text-[clamp(19px,2.2vw,24px)] font-normal leading-[1.28] dark:text-white text-slate-900 mb-2.5">
            {post.title}
          </h3>

          <p className="text-[13px] leading-relaxed dark:text-white/45 text-slate-500 flex-1 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between mt-5 pt-4 dark:border-t-white/[0.06] border-t border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400
                              bg-emerald-100 border border-emerald-200 text-emerald-600
                              flex items-center justify-center text-[10px] font-bold">
                {typeof post.author === 'string' ? post.author.slice(0, 2).toUpperCase() : post.author?.name?.slice(0, 2).toUpperCase() ?? 'NC'}
              </div>
              <div>
                <p className="text-[12px] font-semibold dark:text-white/60 text-slate-700 leading-tight">{typeof post.author === 'string' ? post.author : post.author?.name ?? 'Ningclean'}</p>
                <p className="text-[11px] dark:text-white/30 text-slate-500">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                </p>
              </div>
            </div>
            {post.readTime && (
              <span className="flex items-center gap-1.5 text-[11px] dark:text-white/30 text-slate-500">
                <ClockIcon />
                {post.readTime} min baca
              </span>
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 mt-4 text-[12px] font-semibold
                          dark:text-white/30 text-slate-500 group-hover:dark:text-emerald-400 group-hover:text-emerald-600 transition-colors duration-200">
            Baca selengkapnya <span>→</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function SmallCard({ post, index }: { post: BlogPost; index: number }) {
  const accent = (['blue', 'amber'] as const)[index % 2];
  const catStyle = getCategoryStyle(post.category?.slug);

  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 + 0.15 }}
        className="group flex rounded-[22px] overflow-hidden h-full
                   dark:bg-white/[0.03] dark:border-white/[0.08] dark:hover:bg-white/[0.06] dark:hover:border-white/[0.15]
                   bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300
                   transition-colors duration-300 cursor-pointer"
      >
        {/* Thumbnail */}
        <div className="relative w-[110px] flex-shrink-0 overflow-hidden">
          {post.coverImage ? (
            <img
              src={getImageUrl(post.coverImage)}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${accent === 'blue' ? 'dark:from-[#0a1a2e] dark:to-[#0e2240] from-blue-50 to-blue-100' : 'dark:from-[#1f1500] dark:to-[#2a1d00] from-amber-50 to-amber-100'}`} />
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col justify-between px-5 py-4 flex-1 min-w-0">
          <div>
            <span className={`inline-block px-2 py-[2px] rounded-full text-[10px] font-semibold mb-2 ${catStyle.dark} ${catStyle.light}`}>
              {post.category?.name ?? 'Artikel'}
            </span>
            <h3 className="font-serif text-[clamp(15px,1.7vw,18px)] font-normal leading-[1.3] dark:text-white text-slate-900 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-[12px] leading-relaxed dark:text-white/40 text-slate-500 line-clamp-2 mt-1.5">
              {post.excerpt}
            </p>
          </div>
          <div className="flex items-center justify-between mt-2.5">
            <span className="text-[11px] dark:text-white/30 text-slate-500">
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : ''}
              {post.readTime ? ` · ${post.readTime} min` : ''}
            </span>
            <span className="text-[12px] dark:text-white/30 text-slate-500 group-hover:dark:text-emerald-400 group-hover:text-emerald-600 transition-colors duration-200">→</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

const bottomStats = [
  { color: 'bg-emerald-400', darkColor: 'dark:bg-emerald-400', label: '12 Artikel Diterbitkan' },
  { color: 'bg-blue-400', darkColor: 'dark:bg-blue-400', label: 'Update Setiap Minggu' },
  { color: 'bg-amber-400', darkColor: 'dark:bg-amber-400', label: 'Tips dari Tim Ahli' },
];

function BottomBar({ total }: { total: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: 0.25 }}
      className="mt-5 flex items-center justify-between flex-wrap gap-4 px-6 py-4 rounded-2xl
                 dark:bg-white/[0.03] dark:border-white/[0.07]
                 bg-white border border-slate-200"
    >
      <div className="flex items-center flex-wrap gap-5">
        {bottomStats.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-[12px] dark:text-white/38 text-slate-600">
            <span className={`w-1.5 h-1.5 rounded-full ${s.darkColor} ${s.color}`} />
            {s.label}
          </div>
        ))}
      </div>

      <Link href="/blog">
        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                           dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400
                           dark:hover:bg-emerald-500/18 dark:hover:border-emerald-500/40
                           bg-emerald-50 border border-emerald-200 text-emerald-600
                           hover:bg-emerald-100 hover:border-emerald-300
                           text-[13px] font-semibold transition-colors duration-200">
          Semua Artikel
          <ArrowIcon />
        </button>
      </Link>
    </motion.div>
  );
}

export default function BlogSection({ posts }: BlogSectionProps) {
  if (posts.length === 0) return null;

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  const [featured, ...rest] = posts;
  const secondaryPosts = rest.slice(0, 2);

  return (
    <section className="relative py-24 dark:bg-[#06060e] bg-slate-50 overflow-hidden">
      {/* Ambient orbs - dark mode only */}
      <div className="pointer-events-none select-none dark:block hidden">
        <div className="absolute -top-16 -left-20 w-[380px] h-[380px] rounded-full bg-emerald-500/[0.1] blur-[110px]" />
        <div className="absolute bottom-10 -right-16 w-[320px] h-[320px] rounded-full bg-blue-700/[0.1] blur-[100px]" />
      </div>

      <div className="relative container mx-auto px-6 max-w-5xl">

        {/* Header row */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between flex-wrap gap-8 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                            dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400
                            bg-emerald-50 border border-emerald-200 text-emerald-700
                            text-[11px] font-bold tracking-[.1em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full dark:bg-emerald-400 bg-emerald-500 animate-pulse" />
              Artikel & Tips
            </div>
            <h2 className="font-serif text-4xl md:text-5xl xl:text-[52px] font-normal leading-[1.07] dark:text-white text-slate-900">
              Panduan merawat<br />
              rumah <em className="italic dark:text-emerald-400 text-emerald-600">dengan benar</em>
            </h2>
            <p className="text-[14px] dark:text-white/40 text-slate-500 mt-3.5 max-w-sm leading-relaxed">
              Konten edukatif seputar kebersihan dan perawatan hunian dari tim Ningclean.
            </p>
          </div>

          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-2.5 text-[13px] font-semibold
                       dark:text-white/45 text-slate-500 hover:dark:text-emerald-400 hover:text-emerald-600 transition-colors duration-200 pb-1 flex-shrink-0"
          >
            Lihat semua artikel
            <span className="w-8 h-8 rounded-full border dark:border-white/15 dark:hover:border-emerald-400 dark:hover:bg-emerald-500/10 border-slate-300 hover:border-emerald-300 hover:bg-emerald-50 flex items-center justify-center text-[14px] transition-all duration-200">
              →
            </span>
          </Link>
        </motion.div>

        {/* Blog grid */}
        <div className="grid md:grid-cols-2 md:grid-rows-2 gap-5">
          <div className="md:row-span-2">
            <FeaturedCard post={featured} />
          </div>
          {secondaryPosts.map((post, i) => (
            <SmallCard key={post.id} post={post} index={i} />
          ))}
        </div>

        {/* Bottom bar */}
        <BottomBar total={posts.length} />
      </div>
    </section>
  );
}
