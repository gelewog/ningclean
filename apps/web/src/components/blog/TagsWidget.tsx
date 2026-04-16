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