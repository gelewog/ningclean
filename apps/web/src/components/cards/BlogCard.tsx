'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BlogPost } from '@/types/api';
import { formatDate, truncate } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  index?: number;
  variant?: 'grid' | 'list';
}

export default function BlogCard({ post, featured = false, index = 0, variant = 'grid' }: BlogCardProps) {
  const readTime = post.readTime || 5;
  const authorName = typeof post.author === 'string' ? post.author : post.author?.name || 'Admin';
  const authorInitial = authorName.charAt(0).toUpperCase();

  if (variant === 'list') {
    return <ListCard post={post} readTime={readTime} authorName={authorName} authorInitial={authorInitial} index={index} />;
  }

  return <GridCard post={post} featured={featured} readTime={readTime} authorName={authorName} authorInitial={authorInitial} index={index} />;
}

function GridCard({ post, featured, readTime, authorName, authorInitial, index }: BlogCardProps & { readTime: number; authorName: string; authorInitial: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <article
          className={`relative bg-white dark:bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/10 h-full transition-all duration-500 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1.5 ${
            featured ? 'lg:grid lg:grid-cols-5' : ''
          }`}
        >
          {/* Image */}
          <div
            className={`relative overflow-hidden shrink-0 ${
              featured ? 'lg:col-span-3 h-64 lg:h-full' : 'h-48'
            }`}
          >
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
                  featured ? 'lg:object-cover' : ''
                }`}
                unoptimized={post.coverImage.startsWith('http')}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <svg className="w-7 h-7 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Content */}
          <div className={`p-5 ${featured ? 'lg:col-span-2 lg:flex lg:flex-col lg:justify-center' : ''}`}>
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {post.tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full text-[11px] font-semibold uppercase tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h3
              className={`font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug ${
                featured ? 'text-xl lg:text-2xl' : 'text-base'
              }`}
            >
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
              {truncate(post.excerpt, featured ? 120 : 90)}
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white">{authorInitial}</span>
                </div>
                <span className="font-medium text-gray-600 dark:text-slate-300">{authorName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{readTime} min</span>
              </div>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>

          {/* Hover accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </article>
      </Link>
    </motion.div>
  );
}

function ListCard({ post, readTime, authorName, authorInitial, index }: { post: BlogPost; readTime: number; authorName: string; authorInitial: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="relative bg-white dark:bg-slate-900/80 rounded-xl overflow-hidden border border-slate-100 dark:border-white/10 p-4 transition-all duration-300 hover:bg-emerald-500/5 hover:shadow-sm">
          <div className="flex gap-4">
            {/* Thumbnail */}
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized={post.coverImage.startsWith('http')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">📄</div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {post.tags.slice(0, 1).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-sm line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {truncate(post.excerpt, 80)}
                  </p>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium group-hover:translate-x-1 transition-transform flex-shrink-0">
                  View →
                </span>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 mt-auto pt-2 text-xs text-gray-400 dark:text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">{authorInitial}</span>
                  </div>
                  <span>{authorName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{readTime} min</span>
                </div>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}