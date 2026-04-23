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
import { blogApi, blogPostLikeApi } from '@/lib/api';
import { BlogPost } from '@/types/api';
import { formatDate } from '@/lib/utils';
import './blog-post.css';
import { BlogContent } from './BlogContent';
import { Eye, Heart, Share2, Facebook, Twitter, Link as LinkIcon, Bookmark, Printer, Check } from 'lucide-react';

const SAVED_POSTS_KEY = 'ningclean_saved_posts';

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const rawSlug = params.slug as string;
        const slug = decodeURIComponent(rawSlug);
        
        const data = await blogApi.getBySlug(slug);
        
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response from API');
        }
        
        setPost(data);
        
        // Check if post is saved in localStorage
        const savedPosts = JSON.parse(localStorage.getItem(SAVED_POSTS_KEY) || '[]');
        setIsSaved(savedPosts.some((p: any) => p.id === data.id));
      } catch (err: any) {
        console.error('[Blog Post] Error:', err);
        setError('Artikel tidak ditemukan');
      } finally {
        setLoading(false);
      }
    };
    
    if (params.slug) {
      fetchPost();
    }
  }, [params.slug]);

  const handleLike = async () => {
    if (!post || isLiking) return;
    
    setIsLiking(true);
    try {
      if (post.isLiked) {
        await blogPostLikeApi.unlike(post.id);
        setPost(prev => prev ? {
          ...prev,
          isLiked: false,
          likeCount: Math.max(0, (prev.likeCount || 0) - 1)
        } : null);
      } else {
        await blogPostLikeApi.like(post.id);
        setPost(prev => prev ? {
          ...prev,
          isLiked: true,
          likeCount: (prev.likeCount || 0) + 1
        } : null);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = () => {
    if (!post) return;
    
    const savedPosts = JSON.parse(localStorage.getItem(SAVED_POSTS_KEY) || '[]');
    
    if (isSaved) {
      // Remove from saved
      const filtered = savedPosts.filter((p: any) => p.id !== post.id);
      localStorage.setItem(SAVED_POSTS_KEY, JSON.stringify(filtered));
      setIsSaved(false);
    } else {
      // Add to saved
      const postToSave = {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        author: post.author,
        publishedAt: post.publishedAt,
        readTime: post.readTime,
        savedAt: new Date().toISOString(),
      };
      savedPosts.unshift(postToSave);
      localStorage.setItem(SAVED_POSTS_KEY, JSON.stringify(savedPosts));
      setIsSaved(true);
    }
    
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async (platform: string) => {
    if (!post) return;
    
    const url = window.location.href;
    const text = `Baca artikel: ${post.title}`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
        break;
    }
  };

  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (!post?.category?.slug) {
        return;
      }
      
      setRelatedLoading(true);
      
      try {
        // Fetch posts from same category, excluding current post
        const response = await blogApi.getAll({ 
          limit: 10, 
          category: post.category.slug 
        });
        
        const posts = response.data || response;
        const filtered = posts.filter((p: BlogPost) => p.id !== post.id).slice(0, 3);
        
        setRelatedPosts(filtered);
      } catch (err) {
        console.error('[Related Posts] Failed to fetch:', err);
      } finally {
        setRelatedLoading(false);
      }
    };
    
    if (post) {
      fetchRelatedPosts();
    }
  }, [post?.id, post?.category?.slug]);

  if (loading) {
    return <PageLoader />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <Navigation />
        <div className="container-fluid py-32 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{error || 'Artikel tidak ditemukan'}</h1>
          <Link href="/blog">
            <Button>Kembali ke Blog</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const headings = post.content?.match(/^##\s+(.+)$/gm) || [];
  const imageUrl = post.coverImage?.startsWith('http') 
    ? post.coverImage
    : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}${post.coverImage}`;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navigation />

      {/* Article Header */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-900 dark:to-teal-950">
        <div className="container-fluid max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/70 text-sm mb-6">
              <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              <span className="text-white/50">/</span>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <span className="text-white/50">/</span>
              <span className="text-white font-medium truncate max-w-[200px]">{post.title}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags?.map((tag, idx) => (
                <Link
                  key={idx}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white border border-white/20 hover:bg-white/30 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                {typeof post.author === 'string' ? (
                  <span className="font-medium">{post.author}</span>
                ) : post.author ? (
                  <>
                    {post.author.avatar && (
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                        unoptimized={post.author.avatar?.startsWith('http')}
                      />
                    )}
                    <span className="font-medium">{post.author.name}</span>
                  </>
                ) : (
                  <span className="font-medium">Admin Ningclean</span>
                )}
              </div>
              <span className="text-white/50">•</span>
              <span>{formatDate(post.createdAt)}</span>
              <span className="text-white/50">•</span>
              <span>{post.readTime || 5} menit baca</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {post.coverImage && (
        <section className="py-8 -mt-6 relative z-10">
          <div className="container-fluid max-w-4xl">
            <div className="relative rounded-2xl overflow-hidden h-64 md:h-96 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50">
              <img
                src={imageUrl}
                alt={post.title}
                className="object-cover w-full h-full"
                loading="eager"
              />
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="py-12">
        <div className="container-fluid max-w-4xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Table of Contents - Desktop */}
            {headings.length > 0 && (
              <div className="hidden lg:block">
                <div className="sticky top-32 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wide">Daftar Isi</h3>
                  <nav className="space-y-2">
                    {headings.map((heading, idx) => {
                      const title = heading.replace(/^##\s+/, '');
                      return (
                        <a
                          key={idx}
                          href={`#${title.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-1 border-l-2 border-transparent hover:border-emerald-500 pl-3 -ml-0.5"
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
                className="prose prose-lg max-w-none blog-content
                  prose-headings:text-slate-900 dark:prose-headings:text-slate-50
                  prose-p:text-slate-700 dark:prose-p:text-slate-300
                  prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-slate-900 dark:prose-strong:text-slate-50
                  prose-em:text-slate-600 dark:prose-em:text-slate-400
                  prose-li:text-slate-700 dark:prose-li:text-slate-300
                  prose-blockquote:border-l-emerald-500 dark:prose-blockquote:border-l-emerald-500
                  prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900/30
                  prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                  prose-code:text-pink-600 dark:prose-code:text-pink-400
                  prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:text-slate-100
                  dark:prose-h1:text-slate-50 dark:prose-h2:text-slate-50 dark:prose-h3:text-slate-50
                  dark:prose-h4:text-slate-50 dark:prose-h5:text-slate-50 dark:prose-h6:text-slate-50
                  dark:prose-ol:text-slate-300 dark:prose-ul:text-slate-300"
              >
                <BlogContent content={post.content} />
              </motion.article>

              {/* Engagement Bar */}
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* View Count & Like */}
                  <div className="flex items-center gap-4">
                    {/* View Count */}
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Eye className="w-5 h-5" />
                      <span className="text-sm font-medium">{(post.viewCount || 0).toLocaleString('id-ID')} views</span>
                    </div>
                    
                    {/* Like Button */}
                    <button
                      onClick={handleLike}
                      disabled={isLiking}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                        post.isLiked
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 border border-transparent'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''} ${isLiking ? 'animate-pulse' : ''}`} />
                      <span className="text-sm font-medium">{(post.likeCount || 0).toLocaleString('id-ID')}</span>
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Save Button */}
                    <button
                      onClick={handleSave}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                        isSaved
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400 border border-transparent'
                      }`}
                      title={isSaved ? 'Hapus dari simpanan' : 'Simpan artikel'}
                    >
                      <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium hidden sm:inline">{isSaved ? 'Tersimpan' : 'Simpan'}</span>
                    </button>

                    {/* Print Button */}
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 border border-transparent"
                      title="Print artikel"
                    >
                      <Printer className="w-5 h-5" />
                      <span className="text-sm font-medium hidden sm:inline">Print</span>
                    </button>

                    <span className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2" />

                    {/* Share Buttons */}
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#166fe5] transition-colors hover:scale-110"
                      title="Share ke Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:bg-[#1a91da] transition-colors hover:scale-110"
                      title="Share ke Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-10 h-10 rounded-full bg-slate-600 dark:bg-slate-700 text-white flex items-center justify-center hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors hover:scale-110"
                      title="Copy link"
                    >
                      <LinkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Share Toast */}
                {showShareToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Link berhasil disalin!
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/30">
        <div className="container-fluid max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Artikel Terkait</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedPosts.length > 0 ? (
              relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <article className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all duration-300 h-full">
                      {/* Thumbnail */}
                      <div className="relative h-40 overflow-hidden">
                        {relatedPost.coverImage ? (
                          <Image
                            src={relatedPost.coverImage.startsWith('http') 
                              ? relatedPost.coverImage 
                              : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}${relatedPost.coverImage}`}
                            alt={relatedPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            unoptimized={true}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                          <span>{relatedPost.readTime || 5} menit baca</span>
                          <span>{formatDate(relatedPost.createdAt)}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 text-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
                <p>Tidak ada artikel terkait</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
