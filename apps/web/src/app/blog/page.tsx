'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import BlogCard from '@/components/cards/BlogCard';
import Button from '@/components/ui/Button';
import { SectionLoader } from '@/components/ui/Spinner';
import { blogApi, blogCategoriesApi } from '@/lib/api';
import { BlogPost } from '@/types/api';
import BlogHeroSection from '@/components/sections/BlogHeroSection';
import NewsletterSection from '@/components/sections/NewsletterSection';
import { BlogCardSkeleton } from '@/components/blog/BlogCardSkeleton';
import { ViewToggle } from '@/components/blog/ViewToggle';
import { ArrowRight, X, Search } from 'lucide-react';

type ViewMode = 'grid' | 'list';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPosts, setTotalPosts] = useState(0);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await blogCategoriesApi.getAll();
        if (data && data.length > 0) {
          setCategories(['all', ...data.map((c: any) => c.name)]);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories(['all']);
      }
    };
    fetchCategories();
  }, []);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await blogApi.getAll({ page, limit: 12 });
        if (data && data.length > 0) {
          if (page === 1) {
            setPosts(data);
          } else {
            setPosts((prev) => [...prev, ...data]);
          }
          setHasMore(data.length === 12);
          setTotalPosts(data.length + (page - 1) * 12);
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

  const clearAllFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
  };

  const hasActiveFilters = activeCategory !== 'all' || searchQuery.trim() !== '';

  if (loading && page === 1) {
    return <SectionLoader />;
  }

  return (
    <div className="min-h-screen page-bg">
      <Navigation />

      <main>
        <BlogHeroSection />

        {/* Main Content */}
        <section className="py-12 page-bg">
          <div className="container mx-auto px-6 max-w-7xl">
            {/* Header & Search Bar */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeCategory === 'all' ? 'Semua Artikel' : activeCategory}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                    {filteredPosts.length} artikel ditemukan
                  </p>
                </div>
                
                {/* Search & View Toggle - Desktop */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari artikel..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 h-10 pl-10 pr-10 rounded-full bg-white dark:bg-slate-900/80 border border-slate-100 dark:border-white/10 text-sm page-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
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
                  <ViewToggle viewMode={viewMode} onChange={setViewMode} />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-white/10 hover:border-emerald-300 dark:hover:border-emerald-500/50'
                    }`}
                  >
                    {cat === 'all' ? 'Semua' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Category Pills */}
            <div className="lg:hidden mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-white/10'
                    }`}
                  >
                    {cat === 'all' ? 'Semua' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Blog Grid/List */}
            {loading && page === 1 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'flex flex-col gap-4'
              }>
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
                      ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
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
                      <BlogCard
                        post={post}
                        index={index}
                        variant={viewMode}
                      />
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
              <div className="text-center py-20">
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
        </section>

        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}
