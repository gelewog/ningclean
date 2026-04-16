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