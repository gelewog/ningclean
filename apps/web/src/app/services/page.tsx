'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { ServiceCard } from '@/components/cards';
import Button from '@/components/ui/Button';
import { SectionLoader } from '@/components/ui/Spinner';
import { servicesApi } from '@/lib/api';
import { Service } from '@/types/api';
import { mockServices } from '@/lib/mock/services';
import ServicesHeroSection from '@/components/sections/ServicesHeroSection';
import CategoryFilter from '@/components/sections/CategoryFilter';
import WhyChooseSection from '@/components/sections/WhyChooseSection';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const categories = ['Semua', 'Deep Cleaning', 'Regular Cleaning', 'Post Construction', 'Sofa Cleaning', 'Office Cleaning'];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesApi.getAll();
        // Use API data if available, otherwise use mock data
        if (data.data && data.data.length > 0) {
          setServices(data.data);
        } else {
          setServices(mockServices);
        }
      } catch (error) {
        console.error('Failed to fetch services, using mock data:', error);
        setServices(mockServices);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = selectedCategory === 'Semua'
    ? services
    : services.filter((s) => s.category === selectedCategory);

  if (loading) {
    return <SectionLoader />;
  }

  return (
    <div className="min-h-screen page-bg">
      <Navigation />

      <main>
        <ServicesHeroSection />
        <CategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* Services Grid */}
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-5xl">
            {filteredServices.length > 0 ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {filteredServices.map((service, index) => (
                  <motion.div key={service.id} variants={item}>
                    <ServiceCard service={service} index={index} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="page-text-muted">Tidak ada layanan dalam kategori ini</p>
              </div>
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
              {/* Live tag */}
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
