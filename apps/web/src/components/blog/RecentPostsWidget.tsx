'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { BlogPost } from '@/types/api';
import { formatDate } from '@/lib/utils';

interface RecentPostsWidgetProps {
  posts: BlogPost[];
}

export function RecentPostsWidget({ posts }: RecentPostsWidgetProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-emerald-500" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-white/70 uppercase tracking-wider">
          Post Terbaru
        </h3>
      </div>
      <div className="space-y-4">
        {posts.slice(0, 5).map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="flex gap-3 group"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    unoptimized={post.coverImage.startsWith('http')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    📄
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-slate-700 dark:text-white/80 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default RecentPostsWidget;