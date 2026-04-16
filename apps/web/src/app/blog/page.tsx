'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import BlogCard from '@/components/cards/BlogCard';
import Button from '@/components/ui/Button';
import { SectionLoader } from '@/components/ui/Spinner';
import { blogApi } from '@/lib/api';
import { BlogPost } from '@/types/api';
import { mockBlogPosts } from '@/lib/mock/services';
import BlogHeroSection from '@/components/sections/BlogHeroSection';
import BlogListSection from '@/components/sections/BlogListSection';
import NewsletterSection from '@/components/sections/NewsletterSection';
import { BlogCardSkeleton } from '@/components/blog/BlogCardSkeleton';
import { ViewToggle } from '@/components/blog/ViewToggle';
import { MobileFilterSheet } from '@/components/blog/MobileFilterSheet';
import { ArrowRight, SlidersHorizontal, X } from 'lucide-react';

type ViewMode = 'grid' | 'list';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeArchive, setActiveArchive] = useState<string | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await blogApi.getAll({ page, limit: 9 });
        if (data.data && data.data.length > 0) {
          if (page === 1) {
            setPosts(data.data);
          } else {
            setPosts((prev) => [...prev, ...data.data]);
          }
          setHasMore(data.data.length === 9);
        } else {
          if (page === 1) {
            setPosts(mockBlogPosts);
          }
          setHasMore(false);
        }
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        if (page === 1) {
          setPosts(mockBlogPosts);
        }
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
          const catName = post.category.name || '';
          return catName === activeCategory || post.category.slug === activeCategory;
        }
        return false;
      });
    }

    if (activeArchive) {
      const [year, month] = activeArchive.split('-');
      result = result.filter((post) => {
        const date = new Date(post.createdAt);
        return date.getFullYear() === parseInt(year) && (date.getMonth() + 1) === parseInt(month);
      });
    }

    if (activeTags.length > 0) {
      result = result.filter((post) => {
        if (!post.tags) return false;
        return activeTags.some((tag) => post.tags.includes(tag));
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query)
      );
    }

    return result;
  }, [posts, activeCategory, activeArchive, activeTags, searchQuery]);

  // Derive sidebar data from posts
  const { categories, archives, tags } = useMemo(() => {
    const cats = new Set<string>();
    const archs: Record<string, number> = {};
    const tagSet = new Set<string>();

    posts.forEach((post) => {
      if (post.category) {
        const catName = typeof post.category === 'string' ? post.category : post.category?.name;
        if (catName) cats.add(catName);
      }
      if (post.tags) {
        post.tags.forEach((tag) => tagSet.add(tag));
      }
      const date = new Date(post.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      archs[key] = (archs[key] || 0) + 1;
    });

    const sortedArchives: Record<string, number> = {};
    Object.keys(archs)
      .sort()
      .reverse()
      .forEach((key) => {
        sortedArchives[key] = archs[key];
      });

    return {
      categories: ['all', ...Array.from(cats)],
      archives: sortedArchives,
      tags: Array.from(tagSet),
    };
  }, [posts]);

  const handleTagToggle = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setActiveCategory('all');
    setActiveArchive(null);
    setActiveTags([]);
    setSearchQuery('');
  };

  const hasActiveFilters = activeCategory !== 'all' || activeArchive !== null || activeTags.length > 0 || searchQuery.trim() !== '';

  if (loading && page === 1) {
    return <SectionLoader />;
  }

  return (
    <div className="min-h-screen page-bg">
      <Navigation />

      <main>
        <BlogHeroSection />

        {/* Filter Bar - Desktop */}
        <div className="hidden lg:block py-6 page-bg">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <ViewToggle viewMode={viewMode} onChange={setViewMode} />
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari artikel..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 h-10 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-100 dark:border-white/10 text-sm page-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
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

              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {filteredPosts.length} artikel
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Bar */}
        <div className="lg:hidden py-4 page-bg">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                <ViewToggle viewMode={viewMode} onChange={setViewMode} />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {filteredPosts.length}
                </span>
              </div>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-100 dark:border-white/10 text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Category Pills */}
        <div className="lg:hidden page-bg">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-white/10'
                  }`}
                >
                  {cat === 'all' ? 'Semua' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Content with Sidebar */}
        <BlogListSection
          posts={filteredPosts}
          categories={categories}
          archives={archives}
          tags={tags}
          activeCategory={activeCategory}
          activeArchive={activeArchive}
          activeTags={activeTags}
          onCategoryChange={setActiveCategory}
          onArchiveChange={setActiveArchive}
          onTagToggle={handleTagToggle}
          isMobile={false}
        >
          {loading && page === 1 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className={viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-5' : 'flex flex-col gap-4'}
            >
              {[...Array(6)].map((_, i) => (
                <BlogCardSkeleton key={i} variant={viewMode} index={i} />
              ))}
            </motion.div>
          ) : filteredPosts.length > 0 ? (
            <>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className={viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-5' : 'flex flex-col gap-4'}
              >
                {filteredPosts.map((post, index) => (
                  <motion.div key={post.id} variants={item}>
                    <BlogCard
                      post={post}
                      featured={index === 0 && viewMode === 'grid'}
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
                    className="btn-outline-dark"
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
        </BlogListSection>

        <NewsletterSection />
      </main>

      {/* Mobile Filter Sheet */}
      <MobileFilterSheet
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        categories={categories}
        archives={archives}
        tags={tags}
        activeCategory={activeCategory}
        activeArchive={activeArchive}
        activeTags={activeTags}
        onCategoryChange={setActiveCategory}
        onArchiveChange={setActiveArchive}
        onTagToggle={handleTagToggle}
      />

      <Footer />
    </div>
  );
}