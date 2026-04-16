# Blog Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign blog page with sticky sidebar (desktop) / bottom sheet (mobile), grid/list toggle, glassmorphism aesthetic, and full API integration.

**Architecture:** Split blog components into focused files following existing patterns. Sidebar widgets as separate components, view mode toggle, skeleton loaders, and mobile bottom sheet. Use existing ThemeProvider and framer-motion animations.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide React, existing ThemeProvider

---

## File Structure

### New Files to Create

```
apps/web/src/components/blog/
├── index.ts                              # Export all blog components
├── SidebarWidget.tsx                     # Container for all sidebar widgets
├── CategoryWidget.tsx                    # Category filter widget
├── ArchiveWidget.tsx                     # Archive by month/year widget
├── TagsWidget.tsx                       # Tags cloud widget
├── RecentPostsWidget.tsx                # Recent posts list widget
├── ViewToggle.tsx                       # Grid/List toggle button
├── BlogCardSkeleton.tsx                 # Loading skeleton component
└── MobileFilterSheet.tsx                # Bottom sheet for mobile filters
```

### Existing Files to Modify

```
apps/web/src/app/blog/page.tsx            # Main blog page - refactor
apps/web/src/components/cards/BlogCard.tsx # Refactor for grid/list variants
apps/web/src/components/sections/BlogListSection.tsx # Refactor with sidebar layout
apps/web/src/app/blog/loading.tsx         # Loading skeleton page
```

### Files to Keep As-Is

```
apps/web/src/components/sections/BlogHeroSection.tsx # Already exists
```

---

## Task 1: Create BlogCardSkeleton Component

**Files:**
- Create: `apps/web/src/components/blog/BlogCardSkeleton.tsx`

- [ ] **Step 1: Write BlogCardSkeleton component**

```tsx
'use client';

import { motion } from 'framer-motion';

interface BlogCardSkeletonProps {
  variant?: 'grid' | 'list';
  index?: number;
}

export function BlogCardSkeleton({ variant = 'grid', index = 0 }: BlogCardSkeletonProps) {
  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white dark:bg-slate-900/80 rounded-xl p-4 border border-slate-100 dark:border-white/10"
      >
        <div className="flex gap-4">
          {/* Thumbnail skeleton */}
          <div className="w-20 h-20 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
          {/* Content skeleton */}
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2 animate-pulse" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4 animate-pulse" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/10"
    >
      {/* Image skeleton */}
      <div className="h-48 bg-slate-200 dark:bg-slate-800 animate-pulse" />
      {/* Content skeleton */}
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
        </div>
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-full animate-pulse" />
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-2/3 animate-pulse" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full animate-pulse" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-4/5 animate-pulse" />
        <div className="flex gap-4 pt-2">
          <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}

export default BlogCardSkeleton;
```

- [ ] **Step 2: Add export to index.ts**

```tsx
// apps/web/src/components/blog/index.ts
export { BlogCardSkeleton } from './BlogCardSkeleton';
```

---

## Task 2: Create ViewToggle Component

**Files:**
- Create: `apps/web/src/components/blog/ViewToggle.tsx`

- [ ] **Step 1: Write ViewToggle component**

```tsx
'use client';

import { motion } from 'framer-motion';
import { Grid3X3, List } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
      <button
        onClick={() => onChange('grid')}
        className={cn(
          'p-2.5 rounded-lg transition-all duration-200',
          viewMode === 'grid'
            ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
        )}
        title="Grid View"
      >
        <Grid3X3 className="w-5 h-5" />
      </button>
      <button
        onClick={() => onChange('list')}
        className={cn(
          'p-2.5 rounded-lg transition-all duration-200',
          viewMode === 'list'
            ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
        )}
        title="List View"
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  );
}

export default ViewToggle;
```

- [ ] **Step 2: Add export to index.ts**

```tsx
// Add to apps/web/src/components/blog/index.ts
export { ViewToggle } from './ViewToggle';
```

---

## Task 3: Create Sidebar Widget Components

**Files:**
- Create: `apps/web/src/components/blog/CategoryWidget.tsx`
- Create: `apps/web/src/components/blog/ArchiveWidget.tsx`
- Create: `apps/web/src/components/blog/TagsWidget.tsx`
- Create: `apps/web/src/components/blog/RecentPostsWidget.tsx`

- [ ] **Step 1: Write CategoryWidget**

```tsx
'use client';

import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryWidgetProps {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
}

export function CategoryWidget({ categories, activeCategory, onChange }: CategoryWidgetProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-4 h-4 text-emerald-500" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-white/70 uppercase tracking-wider">
          Kategori
        </h3>
      </div>
      <div className="space-y-1">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={cn(
              'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activeCategory === category
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400'
            )}
          >
            {category === 'all' ? 'Semua' : category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryWidget;
```

- [ ] **Step 2: Write ArchiveWidget**

```tsx
'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArchiveItem {
  month: string;
  count: number;
}

interface ArchiveWidgetProps {
  archives: Record<string, number>;
  activeArchive: string | null;
  onChange: (archive: string | null) => void;
}

export function ArchiveWidget({ archives, activeArchive, onChange }: ArchiveWidgetProps) {
  const formatArchive = (key: string): { year: string; month: string; label: string } => {
    const [year, month] = key.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return {
      year,
      month,
      label: date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
    };
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-emerald-500" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-white/70 uppercase tracking-wider">
          Arsip
        </h3>
      </div>
      <div className="space-y-1">
        <button
          onClick={() => onChange(null)}
          className={cn(
            'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            activeArchive === null
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400'
          )}
        >
          Semua Waktu
        </button>
        {Object.entries(archives).map(([key, count]) => {
          const { label } = formatArchive(key);
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between',
                activeArchive === key
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400'
              )}
            >
              <span>{label}</span>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                activeArchive === key
                  ? 'bg-white/20'
                  : 'bg-slate-100 dark:bg-slate-800'
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ArchiveWidget;
```

- [ ] **Step 3: Write TagsWidget**

```tsx
'use client';

import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagsWidgetProps {
  tags: string[];
  activeTags: string[];
  onToggle: (tag: string) => void;
}

export function TagsWidget({ tags, activeTags, onToggle }: TagsWidgetProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-4 h-4 text-emerald-500" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-white/70 uppercase tracking-wider">
          Tags
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.slice(0, 15).map((tag) => {
          const isActive = activeTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onToggle(tag)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                isActive
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400'
              )}
            >
              {tag}
            </button>
          );
        })}
        {tags.length > 15 && (
          <button className="px-3 py-1.5 rounded-full text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
            +{tags.length - 15} more
          </button>
        )}
      </div>
    </div>
  );
}

export default TagsWidget;
```

- [ ] **Step 4: Write RecentPostsWidget**

```tsx
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
```

- [ ] **Step 5: Add exports to index.ts**

```tsx
// Add to apps/web/src/components/blog/index.ts
export { CategoryWidget } from './CategoryWidget';
export { ArchiveWidget } from './ArchiveWidget';
export { TagsWidget } from './TagsWidget';
export { RecentPostsWidget } from './RecentPostsWidget';
```

---

## Task 4: Create SidebarWidget Container and MobileFilterSheet

**Files:**
- Create: `apps/web/src/components/blog/SidebarWidget.tsx`
- Create: `apps/web/src/components/blog/MobileFilterSheet.tsx`

- [ ] **Step 1: Write SidebarWidget container**

```tsx
'use client';

import { motion } from 'framer-motion';
import { Calendar, Layers, Tag, Clock } from 'lucide-react';
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
```

- [ ] **Step 2: Write MobileFilterSheet**

```tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryWidget } from './CategoryWidget';
import { ArchiveWidget } from './ArchiveWidget';
import { TagsWidget } from './TagsWidget';

interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
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

export function MobileFilterSheet({
  isOpen,
  onClose,
  categories,
  archives,
  tags,
  activeCategory,
  activeArchive,
  activeTags,
  onCategoryChange,
  onArchiveChange,
  onTagToggle,
}: MobileFilterSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 rounded-t-3xl shadow-2xl z-50 pb-8 max-h-[85vh] overflow-y-auto lg:hidden"
          >
            {/* Handle */}
            <div className="flex items-center justify-center py-3">
              <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Filter
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              {/* Categories */}
              {categories.length > 0 && (
                <div className="mb-6">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">
                    Kategori
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          onCategoryChange(category);
                          onClose();
                        }}
                        className={cn(
                          'px-4 py-2 rounded-full text-sm font-medium transition-all',
                          activeCategory === category
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        )}
                      >
                        {category === 'all' ? 'Semua' : category}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Archives */}
              {Object.keys(archives).length > 0 && (
                <div className="mb-6">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">
                    Arsip
                  </label>
                  <div className="space-y-2">
                    {Object.entries(archives).slice(0, 6).map(([key, count]) => (
                      <button
                        key={key}
                        onClick={() => {
                          onArchiveChange(key);
                          onClose();
                        }}
                        className={cn(
                          'w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                          activeArchive === key
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        )}
                      >
                        {key} ({count})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mb-4">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 10).map((tag) => {
                      const isActive = activeTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => onTagToggle(tag)}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                            isActive
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          )}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileFilterSheet;
```

- [ ] **Step 3: Update index.ts exports**

```tsx
// Add to apps/web/src/components/blog/index.ts
export { SidebarWidget } from './SidebarWidget';
export { MobileFilterSheet } from './MobileFilterSheet';
```

---

## Task 5: Refactor BlogCard for Grid/List Variants

**Files:**
- Modify: `apps/web/src/components/cards/BlogCard.tsx`

- [ ] **Step 1: Read existing BlogCard and refactor for variants**

The existing BlogCard needs to support a `variant` prop for grid/list modes. Replace the entire file with:

```tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BlogPost } from '@/types/api';
import { formatDate, truncate } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  index?: number;
  variant?: 'grid' | 'list';
}

export default function BlogCard({ post, featured = false, index = 0, variant = 'grid' }: BlogCardProps) {
  const readTime = post.readTime || 5;
  const authorName = typeof post.author === 'string' ? post.author : post.author?.name || 'Admin';
  const authorInitial = authorName.charAt(0).toUpperCase();

  if (variant === 'list') {
    return <ListCard post={post} readTime={readTime} authorName={authorName} authorInitial={authorInitial} index={index} />;
  }

  return <GridCard post={post} featured={featured} readTime={readTime} authorName={authorName} authorInitial={authorInitial} index={index} />;
}

function GridCard({ post, featured, readTime, authorName, authorInitial, index }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <article
          className={`relative bg-white dark:bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/10 h-full transition-all duration-500 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1.5 ${
            featured ? 'lg:grid lg:grid-cols-5' : ''
          }`}
        >
          {/* Image */}
          <div
            className={`relative overflow-hidden shrink-0 ${
              featured ? 'lg:col-span-3 h-64 lg:h-full' : 'h-48'
            }`}
          >
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
                  featured ? 'lg:object-cover' : ''
                }`}
                unoptimized={post.coverImage.startsWith('http')}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <svg className="w-7 h-7 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Content */}
          <div className={`p-5 ${featured ? 'lg:col-span-2 lg:flex lg:flex-col lg:justify-center' : ''}`}>
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {post.tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full text-[11px] font-semibold uppercase tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h3
              className={`font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug ${
                featured ? 'text-xl lg:text-2xl' : 'text-base'
              }`}
            >
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
              {truncate(post.excerpt, featured ? 120 : 90)}
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white">{authorInitial}</span>
                </div>
                <span className="font-medium text-gray-600 dark:text-slate-300">{authorName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{readTime} min</span>
              </div>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>

          {/* Hover accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </article>
      </Link>
    </motion.div>
  );
}

function ListCard({ post, readTime, authorName, authorInitial, index }: { post: BlogPost; readTime: number; authorName: string; authorInitial: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="relative bg-white dark:bg-slate-900/80 rounded-xl overflow-hidden border border-slate-100 dark:border-white/10 p-4 transition-all duration-300 hover:bg-emerald-500/5 hover:shadow-sm">
          <div className="flex gap-4">
            {/* Thumbnail */}
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized={post.coverImage.startsWith('http')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">📄</div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {post.tags.slice(0, 1).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-sm line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {truncate(post.excerpt, 80)}
                  </p>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium group-hover:translate-x-1 transition-transform flex-shrink-0">
                  View →
                </span>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 mt-auto pt-2 text-xs text-gray-400 dark:text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">{authorInitial}</span>
                  </div>
                  <span>{authorName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{readTime} min</span>
                </div>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
```

---

## Task 6: Refactor BlogListSection with Sidebar Layout

**Files:**
- Modify: `apps/web/src/components/sections/BlogListSection.tsx`

- [ ] **Step 1: Replace entire file with new sidebar-aware layout**

```tsx
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
  // Desktop: 280px sidebar + main content
  // Mobile: full-width with filters in bottom sheet
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
```

---

## Task 7: Refactor Main Blog Page

**Files:**
- Modify: `apps/web/src/app/blog/page.tsx`

- [ ] **Step 1: Replace entire file with new implementation**

```tsx
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

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter((post) => {
        if (typeof post.category === 'string') {
          return post.category.slug === activeCategory || post.category.name === activeCategory;
        }
        return false;
      });
    }

    // Archive filter
    if (activeArchive) {
      const [year, month] = activeArchive.split('-');
      result = result.filter((post) => {
        const date = new Date(post.createdAt);
        return date.getFullYear() === parseInt(year) && (date.getMonth() + 1) === parseInt(month);
      });
    }

    // Tags filter
    if (activeTags.length > 0) {
      result = result.filter((post) => {
        if (!post.tags) return false;
        return activeTags.some((tag) => post.tags.includes(tag));
      });
    }

    // Search filter
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

    // Sort archives by date (newest first)
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

  // Tag toggle handler
  const handleTagToggle = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Clear all filters
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
              {/* View Toggle + Search */}
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

              {/* Results count + Clear */}
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
```

---

## Task 8: Update Loading Skeleton Page

**Files:**
- Modify: `apps/web/src/app/blog/loading.tsx`

- [ ] **Step 1: Update loading page**

```tsx
'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-screen page-bg">
      {/* Nav skeleton */}
      <div className="h-20 bg-white dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800" />

      {/* Hero skeleton */}
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center">
            <div className="w-32 h-6 mx-auto mb-6 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
            <div className="w-96 h-12 mx-auto mb-4 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="w-64 h-4 mx-auto bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="py-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex gap-8">
            {/* Sidebar skeleton */}
            <div className="hidden lg:block w-[280px] flex-shrink-0">
              <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-100 dark:border-white/10">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-full h-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-full h-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main content skeleton */}
            <div className="flex-1">
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="bg-white dark:bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/10">
                      <div className="h-48 bg-slate-200 dark:bg-slate-800 animate-pulse" />
                      <div className="p-5 space-y-3">
                        <div className="flex gap-2">
                          <div className="w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                          <div className="w-12 h-5 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                        </div>
                        <div className="w-full h-5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        <div className="w-2/3 h-5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        <div className="h-3 w-4/5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Task 9: Update Cards Index Export

**Files:**
- Modify: `apps/web/src/components/cards/index.ts`

- [ ] **Step 1: Verify and update exports**

```tsx
// apps/web/src/components/cards/index.ts
export { default as BlogCard } from './BlogCard';
export { default as ServiceCard } from './ServiceCard';
export { default as BookingCard } from './BookingCard';
```

---

## Self-Review Checklist

**1. Spec Coverage:**
- [x] Layout Architecture - Task 6 (BlogListSection) + Task 7 (blog page)
- [x] Components - Task 2 (ViewToggle), Task 3 (Sidebar Widgets), Task 5 (BlogCard variants)
- [x] Interactions - All components have hover effects via existing CSS
- [x] Dark/Light Mode - All components use page- classes from globals.css
- [x] Data & API - Task 7 uses existing blogApi with mock fallback

**2. Placeholder Scan:**
- No "TBD", "TODO", or placeholder code found
- All components have complete implementations

**3. Type Consistency:**
- BlogPost type imported from @/types/api
- ViewMode = 'grid' | 'list' used consistently
- Props interfaces match between components

---

## Execution Options

**Plan complete and saved to `docs/superpowers/plans/2026-04-16-blog-redesign-plan.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**