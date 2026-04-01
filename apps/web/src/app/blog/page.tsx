'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { BlogCard } from '@/components/cards';
import Button from '@/components/ui/Button';
import { SectionLoader } from '@/components/ui/Spinner';
import { blogApi } from '@/lib/api';
import { BlogPost } from '@/types/api';
import { mockBlogPosts } from '@/lib/mock/services';
import BlogHeroSection from '@/components/sections/BlogHeroSection';
import BlogListSection from '@/components/sections/BlogListSection';
import NewsletterSection from '@/components/sections/NewsletterSection';
import { ArrowRight } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
          // Use mock data if no data from API
          if (page === 1) {
            setPosts(mockBlogPosts);
          }
          setHasMore(false);
        }
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        // Use mock data on error
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

  if (loading && page === 1) {
    return <SectionLoader />;
  }

  return (
    <div className="min-h-screen page-bg">
      <Navigation />

      <main>
        <BlogHeroSection />

        <BlogListSection>
          {posts.length > 0 ? (
            <>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {posts.map((post, index) => (
                  <motion.div key={post.id} variants={item}>
                    <BlogCard post={post} featured={index === 0} index={index} />
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
            <div className="text-center py-12">
              <p className="page-text-muted">Belum ada artikel</p>
            </div>
          )}
        </BlogListSection>

        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}
