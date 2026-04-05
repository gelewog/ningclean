'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { SectionLoader } from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { BeforeAfterSlider } from '@/components/gallery/BeforeAfterSlider';
import { ChevronLeft, ChevronRight, Grid3X3, LayoutGrid, ZoomIn, X } from 'lucide-react';
import { getGalleryItems } from '@/lib/api';

// Gallery data
const galleryCategories = [
  { id: 'all', label: 'Semua' },
  { id: 'Residential', label: 'Home Cleaning' },
  { id: 'Deep Cleaning', label: 'Deep Cleaning' },
  { id: 'Post Construction', label: 'Post Construction' },
  { id: 'Commercial', label: 'Office Cleaning' },
];

export default function GalleryPage() {
  const [loading, setLoading] = useState(true);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'before-after'>('grid');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await getGalleryItems();
        setGalleryItems(data || []);
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredItems = selectedCategory === 'all'
    ? galleryItems.filter(item => item.isActive)
    : galleryItems.filter((item) => item.category === selectedCategory && item.isActive);

  // Transform API data to match BeforeAfterSlider expected format
  const transformedItems = filteredItems.map(item => ({
    id: item.id,
    title: item.title,
    location: item.location || '',
    beforeImage: item.imageUrl,
    afterImage: item.imageUrl,
    description: item.description || '',
    category: item.category,
  }));

  const handlePrev = () => {
    if (!selectedItem) return;
    const idx = transformedItems.findIndex((i) => i.id === selectedItem.id);
    const newIdx = idx > 0 ? idx - 1 : transformedItems.length - 1;
    setSelectedItem(transformedItems[newIdx]);
    setSelectedIndex(newIdx);
  };

  const handleNext = () => {
    if (!selectedItem) return;
    const idx = transformedItems.findIndex((i) => i.id === selectedItem.id);
    const newIdx = idx < transformedItems.length - 1 ? idx + 1 : 0;
    setSelectedItem(transformedItems[newIdx]);
    setSelectedIndex(newIdx);
  };

  if (loading) {
    return <SectionLoader />;
  }

  return (
    <div className="min-h-screen page-bg">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[450px] h-[450px] rounded-full hero-glow-1 blur-[130px]" />
          <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full hero-glow-2 blur-[110px]" />
        </div>

        <div className="relative container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full page-badge mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[12px] font-semibold tracking-wider uppercase">
                Galeri Hasil Kerja
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl page-text mb-4">
              Bukti Nyata<br />
              <em className="italic text-emerald-400">Hasil Kerja Kami</em>
            </h1>
            <p className="text-[15px] page-text-muted max-w-xl mx-auto leading-relaxed">
              Lihat langsung hasil cleaning dari tim profesional kami. Before vs After — transparan tanpa edit-edit-an.
            </p>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-10 grid grid-cols-3 gap-3 max-w-lg mx-auto"
          >
            {[
              { value: galleryItems.length + '0+', label: 'Project Selesai' },
              { value: '3 Kota', label: 'Coverage' },
              { value: '100%', label: 'Garansi' },
            ].map((stat, idx) => (
              <div key={idx} className="page-card rounded-2xl p-4 text-center">
                <p className="text-lg font-bold text-emerald-400">{stat.value}</p>
                <p className="text-[11px] page-text-muted">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filters & Controls */}
      <section className="sticky top-16 z-30 sticky-bg py-4">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-thin scrollbar-hide">
              {galleryCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-500/[0.15] text-emerald-400 border border-emerald-500/25'
                      : 'bg-slate-100 dark:bg-white/[0.03] text-slate-600 dark:text-white/45 border-slate-200 dark:border-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.06]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* View mode toggle */}
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-slate-400 dark:text-white/30 mr-1">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-emerald-500/[0.15] text-emerald-400 border border-emerald-500/25' : 'bg-slate-100 dark:bg-white/[0.03] text-slate-500 dark:text-white/40 border-slate-200 dark:border-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.06]'}`}
                title="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('before-after')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'before-after' ? 'bg-emerald-500/[0.15] text-emerald-400 border border-emerald-500/25' : 'bg-slate-100 dark:bg-white/[0.03] text-slate-500 dark:text-white/40 border-slate-200 dark:border-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.06]'}`}
                title="Before/After Slider"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-12">
        <div className="container mx-auto px-6 max-w-5xl">
          {viewMode === 'grid' ? (
            <>
              {/* Count */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[13px] page-text-muted mb-6"
              >
                Menampilkan {transformedItems.length} foto
              </motion.p>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {transformedItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => {
                      setSelectedItem(item);
                      setSelectedIndex(idx);
                      setViewMode('before-after');
                    }}
                    className="group cursor-pointer page-card rounded-2xl overflow-hidden hover:border-emerald-500/20 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={item.afterImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {/* Zoom icon */}
                      <div className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                      {/* Badge */}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-[11px] text-white/80">
                        {item.category}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold page-text mb-1 group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                      <p className="text-[12px] page-text-muted">{item.location}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Before/After Slider View */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[13px] page-text-muted mb-6"
              >
                {transformedItems.length} project dengan before/after
              </motion.p>

              <div className="space-y-8">
                {transformedItems.map((item, idx) => (
                  <BeforeAfterSlider key={item.id} item={item} index={idx} />
                ))}
              </div>
            </>
          )}

          {/* Empty state */}
          {transformedItems.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white dark:bg-white/[0.04] flex items-center justify-center">
                <svg className="w-8 h-8 text-white/20 dark:text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="page-text-muted">Belum ada foto untuk kategori ini</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="relative container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-emerald-500/[0.08] to-blue-500/[0.08] border border-emerald-500/15 rounded-2xl p-8 md:p-12 text-center"
          >
            <h3 className="text-2xl font-semibold page-text mb-3">
              Mau Properti Kamu Se-clean Ini?
            </h3>
            <p className="text-[14px] page-text-muted mb-6 max-w-md mx-auto">
              Booking sekarang dan rasakan sendiri hasilnya. Garansi 100% — jika tidak puas, kami ulang gratis.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/booking">
                <Button variant="accent" size="lg" className="gap-2">
                  Booking Sekarang
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="btn-outline-dark">
                  Lihat Layanan
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox - always dark */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 text-[12px] text-white/50 z-10">
              {selectedIndex + 1} / {transformedItems.length}
            </div>

            {/* Prev/Next */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Content */}
            <motion.div
              key={selectedItem.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full"
            >
              {/* Before/After in lightbox */}
              <BeforeAfterSlider item={selectedItem} index={0} large />

              {/* Info */}
              <div className="mt-6 text-center">
                <h3 className="text-xl font-semibold page-text mb-1">{selectedItem.title}</h3>
                <p className="text-[13px] page-text-muted">{selectedItem.location}</p>
                <p className="text-[13px] page-text-muted mt-2 max-w-md mx-auto">{selectedItem.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
