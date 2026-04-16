'use client';

import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { BlogPost } from '@/types/api';
import { CategoryWidget } from './CategoryWidget';
import { ArchiveWidget } from './ArchiveWidget';
import { TagsWidget } from './TagsWidget';
import { RecentPostsWidget } from './RecentPostsWidget';

interface SidebarWidgetProps {
  posts: BlogPost[];
  categories: string[];
  archives: Record<string, number>;
  tags: string[];
  activeCategory: string;
  activeArchive: string | null;
  activeTags: string[];
  onCategoryChange: (category: string) => void;
  onArchiveChange: (archive: string | null) => void;
  onTagToggle: (tag: string) => void;
}

export function SidebarWidget({
  posts,
  categories,
  archives,
  tags,
  activeCategory,
  activeArchive,
  activeTags,
  onCategoryChange,
  onArchiveChange,
  onTagToggle,
}: SidebarWidgetProps) {
  return (
    <aside className="w-full">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-100 dark:border-white/10 p-5"
      >
        {/* Widget Header */}
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100 dark:border-white/10">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Filter
          </h2>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <CategoryWidget
            categories={categories}
            activeCategory={activeCategory}
            onChange={onCategoryChange}
          />
        )}

        {/* Archives */}
        {Object.keys(archives).length > 0 && (
          <ArchiveWidget
            archives={archives}
            activeArchive={activeArchive}
            onChange={onArchiveChange}
          />
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <TagsWidget
            tags={tags}
            activeTags={activeTags}
            onToggle={onTagToggle}
          />
        )}

        {/* Recent Posts */}
        {posts.length > 0 && (
          <>
            <div className="border-t border-slate-100 dark:border-white/10 pt-5 mt-2">
              <RecentPostsWidget posts={posts} />
            </div>
          </>
        )}
      </motion.div>
    </aside>
  );
}

export default SidebarWidget;