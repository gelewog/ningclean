'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { PageLoader } from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { blogApi } from '@/lib/api';
import { BlogPost } from '@/types/api';
import { formatDate } from '@/lib/utils';

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const slug = params.slug as string;
        const data = await blogApi.getBySlug(slug);
        setPost(data.data);
      } catch (err) {
        setError('Artikel tidak ditemukan');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.slug]);

  if (loading) {
    return <PageLoader />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container-fluid py-32 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">{error || 'Artikel tidak ditemukan'}</h1>
          <Link href="/blog">
            <Button>Kembali ke Blog</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Extract table of contents from content (basic implementation)
  const headings = post.content.match(/^##\s+(.+)$/gm) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Article Header */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-primary to-primary-700">
        <div className="container-fluid max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link href="/" className="hover:text-white">Beranda</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <span>/</span>
              <span className="text-white">{post.title}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, idx) => (
                <Badge key={idx} variant="primary" className="bg-white/20 text-white">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                {post.author?.avatar && (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <span>{post.author?.name || 'Admin Ningclean'}</span>
              </div>
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
              <span>•</span>
              <span>{post.content.split(/\s+/).length} kata</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <section className="py-8 -mt-8">
          <div className="container-fluid max-w-4xl">
            <div className="relative rounded-2xl overflow-hidden h-64 md:h-96">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="py-12">
        <div className="container-fluid max-w-4xl">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Table of Contents - Desktop */}
            {headings.length > 0 && (
              <div className="hidden lg:block">
                <div className="sticky top-32">
                  <h3 className="font-semibold text-foreground mb-4">Daftar Isi</h3>
                  <nav className="space-y-2">
                    {headings.map((heading, idx) => {
                      const title = heading.replace(/^##\s+/, '');
                      return (
                        <a
                          key={idx}
                          href={`#${title.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block text-sm text-gray-500 hover:text-primary transition-colors"
                        >
                          {title}
                        </a>
                      );
                    })}
                  </nav>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-gray-600 prose-a:text-primary prose-strong:text-foreground"
              >
                <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
              </motion.article>

              {/* Share Buttons */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="font-semibold text-foreground mb-4">Bagikan Artikel</p>
                <div className="flex gap-3">
                  <button className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.885 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-gray-600 text-white flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 bg-gray-50">
        <div className="container-fluid max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-8">Artikel Terkait</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Placeholder for related posts - would be fetched from API */}
            <div className="bg-white rounded-xl p-6 text-center text-gray-400">
              <p>Artikel terkait akan muncul di sini</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center text-gray-400">
              <p>Artikel terkait akan muncul di sini</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}