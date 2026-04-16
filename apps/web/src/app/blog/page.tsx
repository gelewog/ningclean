'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import BlogCard from '@/components/cards/BlogCard';
import Button from '@/components/ui/Button';
import { SectionLoader } from '@/components/ui/Spinner';
import { blogApi, blogCategoriesApi } from '@/lib/api';
import { BlogPost, BlogCategory } from '@/types/api';
import BlogHeroSection from '@/components/sections/BlogHeroSection';
import { BlogCardSkeleton } from '@/components/blog/BlogCardSkeleton';
import { ViewToggle } from '@/components/blog/ViewToggle';
import { ArrowRight, X, Search, TrendingUp, Calendar, Clock, Mail, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type ViewMode = 'grid' | 'list';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPosts, setTotalPosts] = useState(0);
  const [email, setEmail] = useState('');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await blogCategoriesApi.getAll();
        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await blogApi.getAll({ page, limit: 12 });
        // Handle both paginated response and direct array
        const postsData = response.data || response;
        const total = response.total || postsData.length;
        
        if (postsData && postsData.length > 0) {
          if (page === 1) {
            setPosts(postsData);
          } else {
            setPosts((prev) => [...prev, ...postsData]);
          }
          setHasMore(postsData.length === 12);
          setTotalPosts(total);
        } else {
          setHasMore(false);
          if (page === 1) setPosts([]);
        }
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        if (page === 1) setPosts([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page]);

  // Filter posts based on active filters
  const filteredPosts = useMemo(() => {
    let result = posts;

    if (activeCategory !== 'all') {
      result = result.filter((post) => {
        if (post.category) {
          const catName = typeof post.category === 'string' ? post.category : post.category?.name;
          return catName === activeCategory;
        }
        return false;
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [posts, activeCategory, searchQuery]);

  // Get popular posts (first 4 posts as popular)
  const popularPosts = useMemo(() => posts.slice(0, 4), [posts]);

  const clearAllFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
  };

  const hasActiveFilters = activeCategory !== 'all' || searchQuery.trim() !== '';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    setEmail('');
  };

  if (loading && page === 1) {
    return <SectionLoader />;
  }

  return (
    <div className="min-h-screen page-bg">
      <Navigation />

      <main>
        <BlogHeroSection totalPosts={totalPosts} />

        {/* Main Content with Sidebar */}
        <section className="py-12 page-bg">
          <div className="container mx-auto px-6 max-w-7xl">
            {/* Mobile Search - Only visible on mobile */}
            <div className="lg:hidden mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari artikel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-12 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-sm page-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar - Sticky on desktop */}
              <aside className="lg:w-80 xl:w-96 flex-shrink-0">
                <div className="lg:sticky lg:top-24 space-y-6">
                  {/* Search Widget - Desktop */}
                  <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Search className="w-4 h-4 text-emerald-500" />
                      Cari Artikel
                    </h3>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ketik kata kunci..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 pl-4 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 text-sm page-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Categories Widget */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      Kategori
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveCategory('all')}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          activeCategory === 'all'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'hover:bg-slate-50 dark:hover:bg-white/5 text-gray-600 dark:text-slate-400'
                        }`}
                      >
                        <span>Semua Artikel</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {posts.length}
                        </span>
                      </button>
                      {categories.map((cat) => {
                        const count = posts.filter((p) => {
                          const catName = typeof p.category === 'string' ? p.category : p.category?.name;
                          return catName === cat.name;
                        }).length;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              activeCategory === cat.name
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'hover:bg-slate-50 dark:hover:bg-white/5 text-gray-600 dark:text-slate-400'
                            }`}
                          >
                            <span>{cat.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Popular Posts Widget */}
                  {popularPosts.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        Artikel Populer
                      </h3>
                      <div className="space-y-4">
                        {popularPosts.map((post, index) => (
                          <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group flex gap-3 items-start"
                          >
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                                {post.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400 dark:text-slate-500">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {post.publishedAt
                                    ? new Date(post.publishedAt).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                      })
                                    : '-'}
                                </span>
                                {post.readTime && (
                                  <>
                                    <span>·</span>
                                    <Clock className="w-3 h-3" />
                                    <span>{post.readTime} min</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Newsletter Widget */}
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-2 mb-3">
                      <Mail className="w-5 h-5" />
                      <h3 className="font-semibold">Newsletter</h3>
                    </div>
                    <p className="text-sm text-white/80 mb-4">
                      Dapatkan tips kebersihan dan update artikel terbaru langsung ke email Anda.
                    </p>
                    <form onSubmit={handleSubscribe} className="space-y-3">
                      <input
                        type="email"
                        placeholder="Email Anda"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl bg-white/20 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                      />
                      <button
                        type="submit"
                        className="w-full h-11 rounded-xl bg-white text-emerald-600 font-semibold text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                      >
                        Berlangganan
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </aside>

              {/* Main Content Area */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {activeCategory === 'all' ? 'Semua Artikel' : activeCategory}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      {filteredPosts.length} artikel ditemukan
                    </p>
                  </div>
                  <ViewToggle viewMode={viewMode} onChange={setViewMode} />
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-sm text-gray-500 dark:text-slate-400">Filter aktif:</span>
                    {searchQuery && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                        Pencarian: "{searchQuery}"
                        <button onClick={() => setSearchQuery('')}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {activeCategory !== 'all' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                        Kategori: {activeCategory}
                        <button onClick={() => setActiveCategory('all')}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 underline"
                    >
                      Reset semua
                    </button>
                  </div>
                )}

                {/* Blog Grid/List */}
                {loading && page === 1 ? (
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid md:grid-cols-2 gap-6'
                        : 'flex flex-col gap-4'
                    }
                  >
                    {[...Array(6)].map((_, i) => (
                      <BlogCardSkeleton key={i} variant={viewMode} index={i} />
                    ))}
                  </div>
                ) : filteredPosts.length > 0 ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className={
                        viewMode === 'grid'
                          ? 'grid md:grid-cols-2 gap-6'
                          : 'flex flex-col gap-4'
                      }
                    >
                      {filteredPosts.map((post, index) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.4 }}
                        >
                          <BlogCard post={post} index={index} variant={viewMode} />
                        </motion.div>
                      ))}
                    </motion.div>

                    {hasMore && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                      >
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setPage((p) => p + 1)}
                          isLoading={loading}
                          className="btn-outline-dark min-w-[200px]"
                        >
                          Load More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <span className="text-4xl">📭</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      Tidak ada artikel ditemukan
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                      Coba ubah filter atau kata kunci pencarian Anda
                    </p>
                    <Button variant="outline" onClick={clearAllFilters}>
                      Reset Filter
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
