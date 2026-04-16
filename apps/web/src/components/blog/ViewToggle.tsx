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