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
    <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-100 dark:border-white/10 shadow-sm">
      <button
        onClick={() => onChange('grid')}
        className={cn(
          'p-2 rounded-lg transition-all duration-200',
          viewMode === 'grid'
            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        )}
        title="Grid View"
      >
        <Grid3X3 className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange('list')}
        className={cn(
          'p-2 rounded-lg transition-all duration-200',
          viewMode === 'list'
            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        )}
        title="List View"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}

export default ViewToggle;
