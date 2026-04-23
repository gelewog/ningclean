'use client';

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <section className="py-6 sticky-bg sticky top-16 z-30">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelect(category)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
                selected === category
                  ? 'dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'dark:bg-white/[0.03] dark:text-white/50 dark:border-white/[0.06] dark:hover:bg-white/[0.06] dark:hover:text-white/70 bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
