'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BlogPost } from '@/types/api';
import { formatDate, truncate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  index?: number;
}

export default function BlogCard({ post, featured = false, index = 0 }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <div
          className={`group bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/30 border border-gray-100 h-full hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-500 hover:-translate-y-2 ${
            featured ? 'lg:flex' : ''
          }`}
        >
          {/* Image */}
          <div
            className={`relative overflow-hidden ${
              featured ? 'lg:w-1/2 h-64 lg:h-auto' : 'h-52'
            }`}
          >
            {post.featuredImage ? (
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <svg
                    className="w-8 h-8 text-white/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Read time badge */}
            <div className="absolute bottom-4 right-4">
              <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/10">
                5 min read
              </span>
            </div>
          </div>

          {/* Content */}
          <div className={`p-6 ${featured ? 'lg:w-1/2 lg:flex lg:flex-col lg:justify-center' : ''}`}>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3
              className={`font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 ${
                featured ? 'text-2xl lg:text-3xl' : 'text-lg'
              }`}
            >
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className={`text-gray-500 mb-4 ${featured ? 'text-base' : 'text-sm line-clamp-2'}`}>
              {featured ? truncate(post.excerpt, 150) : truncate(post.excerpt, 100)}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                  {post.author?.name?.charAt(0) || 'A'}
                </div>
                <span className="font-medium text-gray-600">{post.author?.name || 'Admin'}</span>
              </div>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
