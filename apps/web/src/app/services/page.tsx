'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { ServiceCard } from '@/components/cards';
import Button from '@/components/ui/Button';
import { SectionLoader } from '@/components/ui/Spinner';
import { servicesApi } from '@/lib/api';
import { Service } from '@/types/api';
import ServicesHeroSection from '@/components/sections/ServicesHeroSection';
import WhyChooseSection from '@/components/sections/WhyChooseSection';
import { ArrowRight, CheckCircle, Search, Grid3X3, List, X, ChevronDown, MapPin } from 'lucide-react';
import Link from 'next/link';

const categories = [
  'Semua',
  'Deep Cleaning',
  'Regular Cleaning',
  'Post Construction',
  'Sofa Cleaning',
  'Office Cleaning',
  'Carpet Cleaning',
  'Window Cleaning'
];

const cityFilters = [
  { value: 'all', label: 'Semua Kota' },
  { value: 'surabaya', label: 'Surabaya' },
  { value: 'sidoarjo', label: 'Sidoarjo' },
  { value: 'gresik', label: 'Gresik' },
];

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Harga: Rendah ke Tinggi' },
  { value: 'price-desc', label: 'Harga: Tinggi ke Rendah' },
  { value: 'name-asc', label: 'Nama: A-Z' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

type ViewMode = 'grid' | 'list';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000000 });
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesApi.getAll();
        const servicesData = Array.isArray(response) ? response : (response.data || []);
        const activeServices = servicesData.filter((s: any) => s.isActive);
        setServices(activeServices);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Filter services
  let filteredServices = selectedCategory === 'Semua'
    ? services
    : services.filter((s) => s.category === selectedCategory);

  // City filter
  if (selectedCity !== 'all') {
    filteredServices = filteredServices.filter((s) => {
      // Empty availableCities means available in all cities
      if (!s.availableCities || s.availableCities.length === 0) return true;
      return s.availableCities.includes(selectedCity);
    });
  }

  // Search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredServices = filteredServices.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.description?.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
    );
  }

  // Price range filter
  filteredServices = filteredServices.filter((s) => {
    const price = s.price || 0;
    return price >= priceRange.min && price <= priceRange.max;
  });

  // Sort services
  switch (sortBy) {
    case 'price-asc':
      filteredServices = [...filteredServices].sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case 'price-desc':
      filteredServices = [...filteredServices].sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case 'name-asc':
      filteredServices = [...filteredServices].sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const activeFiltersCount = [
    selectedCategory !== 'Semua',
    searchQuery.trim() !== '',
    priceRange.min > 0 || priceRange.max < 5000000,
    sortBy !== 'default'
  ].filter(Boolean).length;

  const clearAllFilters = useCallback(() => {
    setSelectedCategory('Semua');
    setSearchQuery('');
    setPriceRange({ min: 0, max: 5000000 });
    setSortBy('default');
  }, []);

  if (loading) {
    return <SectionLoader />;
  }

  return (
    <div className="min-h-screen page-bg">
      <Navigation />

      <main>
        <ServicesHeroSection />

        {/* Search & Filter Bar */}
        <section className="pb-8 -mt-16 relative z-10">
          <div className="container mx-auto px-6 max-w-6xl">
            
            {/* Main Control Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-3 mb-4">
              <div className="flex flex-col lg:flex-row gap-3">
                
                {/* Search Input */}
                <div className="relative flex-1">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Ketik nama layanan yang dicari..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Controls Row */}
                <div className="flex items-center gap-2">
                  
                  {/* Sort Dropdown */}
                  <div ref={sortDropdownRef} className="relative">
                    <button
                      onClick={() => setShowSortDropdown(!showSortDropdown)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                        sortBy !== 'default'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Desktop Dropdown */}
                    <AnimatePresence>
                      {showSortDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="hidden lg:block absolute top-full mt-2 right-0 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50"
                        >
                          {sortOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSortBy(option.value);
                                setShowSortDropdown(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                sortBy === option.value
                                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium'
                                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Mobile Sort Bottom Sheet */}
                  <AnimatePresence>
                    {showSortDropdown && (
                      <>
                        {/* Backdrop */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="lg:hidden fixed inset-0 bg-black/40 z-40"
                          onClick={() => setShowSortDropdown(false)}
                        />
                        {/* Bottom Sheet */}
                        <motion.div
                          initial={{ y: '100%' }}
                          animate={{ y: 0 }}
                          exit={{ y: '100%' }}
                          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                          className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 rounded-t-3xl shadow-2xl z-50 p-6"
                        >
                          <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Urutkan</h3>
                            <button
                              onClick={() => setShowSortDropdown(false)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex flex-col gap-2">
                            {sortOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  setSortBy(option.value);
                                  setShowSortDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                  sortBy === option.value
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>

                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2.5 rounded-lg transition-all ${
                        viewMode === 'grid'
                          ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                      title="Grid View"
                    >
                      <Grid3X3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2.5 rounded-lg transition-all ${
                        viewMode === 'list'
                          ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                      title="List View"
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 text-sm font-medium"
                  >
                    Filter
                    {activeFiltersCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Panel - Desktop (Always Visible Pills) */}
            <div className="hidden lg:block mb-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* City Filter Pills */}
              <div className="flex items-center gap-2 mt-3">
                <MapPin className="w-4 h-4 text-slate-400" />
                <div className="flex flex-wrap gap-2">
                  {cityFilters.map((city) => (
                    <button
                      key={city.value}
                      onClick={() => setSelectedCity(city.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedCity === city.value
                          ? 'bg-blue-500 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {city.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Panel - Mobile (Collapsible) */}
            <AnimatePresence>
              {showMobileFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="lg:hidden overflow-hidden mb-4"
                >
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-4">
                    
                    {/* Category Pills */}
                    <div className="mb-4">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                        Kategori
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                              selectedCategory === category
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-4">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                        Range Harga
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min || ''}
                          onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-900 dark:text-white text-sm"
                        />
                        <span className="text-slate-400">-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max || ''}
                          onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || 5000000 })}
                          className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-900 dark:text-white text-sm"
                        />
                      </div>
                    </div>

                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                      >
                        Reset Semua Filter
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Count & Clear */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Menampilkan <span className="font-semibold text-slate-900 dark:text-white">{filteredServices.length}</span> layanan
                {selectedCategory !== 'Semua' && (
                  <span> dalam <span className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedCategory}</span></span>
                )}
              </p>
              
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Services Grid/List */}
        <section className="pb-24">
          <div className="container mx-auto px-6 max-w-6xl">
            {filteredServices.length > 0 ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className={
                  viewMode === 'grid'
                    ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'flex flex-col gap-4'
                }
              >
                {filteredServices.map((service, index) => (
                  <motion.div key={service.id} variants={item}>
                    {viewMode === 'grid' ? (
                      <ServiceCard service={service} index={index} />
                    ) : (
                      <ServiceListCard service={service} />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Tidak ada layanan ditemukan</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Coba ubah filter atau kata kunci pencarian Anda
                </p>
                <Button variant="outline" onClick={clearAllFilters}>
                  Reset Filter
                </Button>
              </motion.div>
            )}
          </div>
        </section>

        <WhyChooseSection />

        {/* CTA */}
        <section className="relative py-24 overflow-hidden">
          <div className="pointer-events-none select-none">
            <div className="absolute top-0 left-1/4 w-[380px] h-[380px] rounded-full hero-glow-1 blur-[110px]" />
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full hero-glow-2 blur-[100px]" />
          </div>

          <div className="relative container mx-auto px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center page-card rounded-3xl p-12"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full page-badge text-[12px] font-semibold tracking-widest uppercase mb-5">
                <CheckCircle className="w-3.5 h-3.5" />
                Siap Booking?
              </div>

              <h2 className="font-serif text-3xl md:text-4xl font-normal page-text mb-3">
                Proses booking <em className="italic text-emerald-400">mudah</em> & cepat
              </h2>
              <p className="text-[15px] page-text-muted max-w-md mx-auto mb-8">
                Pilih layanan, tentukan jadwal, dan tim kami akan segera datang ke lokasi Anda
              </p>

              <Link href="/booking">
                <Button
                  variant="accent"
                  size="lg"
                  className="group"
                  rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                >
                  Booking Sekarang
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// List View Card Component
function ServiceListCard({ service }: { service: Service }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group border border-slate-100 dark:border-slate-800">
      <div className="flex gap-5">
        {/* Image */}
        <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
          {service.image ? (
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-2xl">🧹</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1 block">
                {service.category}
              </span>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {service.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {service.description || 'Deskripsi tidak tersedia'}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {formatPrice(service.price || 0)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {service.duration || 60} menit
              </div>
            </div>
          </div>

          {/* Tags & Action */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              {service.isPopular && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-medium">
                  ⭐ Populer
                </span>
              )}
              {service.availableCities && service.availableCities.length > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-medium">
                  <MapPin className="w-3 h-3" />
                  {service.availableCities.length === 1
                    ? service.availableCities[0].charAt(0).toUpperCase() + service.availableCities[0].slice(1)
                    : `${service.availableCities.length} kota`}
                </span>
              )}
            </div>
            <Link 
              href={`/booking?service=${service.id}`}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
            >
              Booking →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
