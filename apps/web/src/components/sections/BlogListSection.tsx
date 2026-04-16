'use client';

import { motion } from 'framer-motion';
import { SidebarWidget } from '@/components/blog/SidebarWidget';
import { BlogPost } from '@/types/api';

interface BlogListSectionProps {
  children: React.ReactNode;
  posts: BlogPost[];
  categories?: string[];
  archives?: Record<string, number>;
  tags?: string[];
  activeCategory?: string;
  activeArchive?: string | null;
  activeTags?: string[];
  onCategoryChange?: (cat: string) => void;
  onArchiveChange?: (archive: string | null) => void;
  onTagToggle?: (tag: string) => void;
  isMobile?: boolean;
}

export default function BlogListSection({
  children,
  posts,
  categories = [],
  archives = {},
  tags = [],
  activeCategory = 'all',
  activeArchive = null,
  activeTags = [],
  onCategoryChange,
  onArchiveChange,
  onTagToggle,
  isMobile = false,
}: BlogListSectionProps) {
  // Mobile: full-width without sidebar
  if (isMobile) {
    return (
      <section className="py-12 page-bg">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </section>
    );
  }

  // Desktop: sidebar + main content
  return (
    <section className="py-12 page-bg">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex gap-8">
          {/* Sidebar - 280px, sticky */}
          <div className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="sticky top-24">
              <SidebarWidget
                posts={posts}
                categories={categories}
                archives={archives}
                tags={tags}
                activeCategory={activeCategory}
                activeArchive={activeArchive}
                activeTags={activeTags}
                onCategoryChange={onCategoryChange || (() => {})}
                onArchiveChange={onArchiveChange || (() => {})}
                onTagToggle={onTagToggle || (() => {})}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}