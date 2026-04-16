'use client';

import { motion } from 'framer-motion';

interface BlogCardSkeletonProps {
  variant?: 'grid' | 'list';
  index?: number;
}

export function BlogCardSkeleton({ variant = 'grid', index = 0 }: BlogCardSkeletonProps) {
  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white dark:bg-slate-900/80 rounded-xl p-4 border border-slate-100 dark:border-white/10"
      >
        <div className="flex gap-4">
          {/* Thumbnail skeleton */}
          <div className="w-20 h-20 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
          {/* Content skeleton */}
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2 animate-pulse" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4 animate-pulse" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/10"
    >
      {/* Image skeleton */}
      <div className="h-48 bg-slate-200 dark:bg-slate-800 animate-pulse" />
      {/* Content skeleton */}
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
        </div>
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-full animate-pulse" />
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-2/3 animate-pulse" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full animate-pulse" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-4/5 animate-pulse" />
        <div className="flex gap-4 pt-2">
          <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}

export default BlogCardSkeleton;