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