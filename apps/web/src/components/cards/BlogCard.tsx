'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BlogPost } from '@/types/api';
import { formatDate } from '@/lib/utils';
import { Clock, Calendar, ArrowRight, Star } from 'lucide-react';

// Helper untuk memastikan URL gambar lengkap
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

function getImageUrl(src: string | undefined): string {
  if (!src) return '';
  // Jika sudah URL lengkap (http/https), gunakan langsung
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  // Jika path relatif, tambahkan base URL API
  return `${API_URL}${src.startsWith('/') ? '' : '/'}${src}`;
}

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  variant?: 'grid' | 'list';
}

export default function BlogCard({ post, index = 0, variant = 'grid' }: BlogCardProps) {
  const readTime = post.readTime || 5;
  const authorName = typeof post.author === 'string' ? post.author : post.author?.name || 'Admin';
  const authorInitial = authorName.charAt(0).toUpperCase();
  const categoryName = post.category 
    ? (typeof post.category === 'string' ? post.category : post.category?.name)
    : null;

  if (variant === 'list') {
    return <ListCard post={post} readTime={readTime} authorName={authorName} authorInitial={authorInitial} categoryName={categoryName} index={index} />;
  }

  return <GridCard post={post} readTime={readTime} authorName={authorName} authorInitial={authorInitial} categoryName={categoryName} index={index} />;
}

function GridCard({ post, readTime, authorName, authorInitial, categoryName, index = 0 }: { post: BlogPost; readTime: number; authorName: string; authorInitial: string; categoryName: string | null; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <article className="relative h-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500 hover:-translate-y-1">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            {post.coverImage ? (
              <Image
                src={getImageUrl(post.coverImage)}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                unoptimized={true}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
                  <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Category Badge */}
            {categoryName && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 dark:bg-slate-900/95 text-emerald-600 dark:text-emerald-400 shadow-lg backdrop-blur-sm">
                  {categoryName}
                </span>
              </div>
            )}
            
            {/* Featured Badge */}
            {post.isFeatured && (
              <div className="absolute top-4 right-4">
                <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-lg backdrop-blur-sm">
                  <Star className="w-3 h-3 fill-current" />
                  Featured
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Title */}
            <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-snug mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
              {post.excerpt || 'Tidak ada deskripsi tersedia'}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800/50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
                  <span className="text-[10px] font-bold text-white">{authorInitial}</span>
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-slate-300">{authorName}</span>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{readTime} min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hover Arrow */}
          <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 shadow-lg shadow-emerald-500/30">
            <ArrowRight className="w-4 h-4" />
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

function ListCard({ post, readTime, authorName, authorInitial, categoryName, index = 0 }: { post: BlogPost; readTime: number; authorName: string; authorInitial: string; categoryName: string | null; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`}>
        <article className="relative flex gap-5 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
          {/* Thumbnail */}
          <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
            {post.coverImage ? (
              <Image
                src={getImageUrl(post.coverImage)}
                alt={post.title}
                width={112}
                height={112}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                unoptimized={true}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
            <div>
              {/* Category & Date */}
              <div className="flex items-center gap-2 mb-2">
                {categoryName && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    {categoryName}
                  </span>
                )}
                {post.isFeatured && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </span>
                )}
                <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-base leading-snug line-clamp-1 mb-1">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {post.excerpt || 'Tidak ada deskripsi tersedia'}
              </p>
            </div>

            {/* Meta Row */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50 dark:border-slate-800/50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white">{authorInitial}</span>
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-slate-300">{authorName}</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500">
                <Clock className="w-3 h-3" />
                <span>{readTime} min</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-gray-400 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
            <ArrowRight className="w-4 h-4" />
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
