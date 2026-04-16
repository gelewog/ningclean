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