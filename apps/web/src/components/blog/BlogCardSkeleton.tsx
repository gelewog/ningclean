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
        className="flex gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5"
      >
        {/* Thumbnail */}
        <div className="w-28 h-28 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse flex-shrink-0" />
        
        {/* Content */}
        <div className="flex-1 space-y-3 py-1">
          <div className="flex gap-2">
            <div className="w-16 h-5 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="w-20 h-5 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>
          <div className="w-3/4 h-5 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="w-1/2 h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="flex gap-3 pt-2">
            <div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="w-16 h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5"
    >
      {/* Image */}
      <div className="h-48 bg-slate-200 dark:bg-slate-800 animate-pulse" />
      
      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Category */}
        <div className="w-20 h-5 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
        
        {/* Title */}
        <div className="space-y-2">
          <div className="w-full h-5 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="w-2/3 h-5 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
        
        {/* Excerpt */}
        <div className="space-y-2">
          <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="w-4/5 h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
        
        {/* Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="w-16 h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>
          <div className="w-16 h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}

export default BlogCardSkeleton;
