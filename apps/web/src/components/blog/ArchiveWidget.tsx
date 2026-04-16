'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArchiveWidgetProps {
  archives: Record<string, number>;
  activeArchive: string | null;
  onChange: (archive: string | null) => void;
}

export function ArchiveWidget({ archives, activeArchive, onChange }: ArchiveWidgetProps) {
  const formatArchive = (key: string): string => {
    const [year, month] = key.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
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
        {Object.entries(archives).map(([key, count]) => (
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
            <span>{formatArchive(key)}</span>
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full',
              activeArchive === key
                ? 'bg-white/20'
                : 'bg-slate-100 dark:bg-slate-800'
            )}>
              {count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ArchiveWidget;