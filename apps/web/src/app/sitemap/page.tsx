'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { SectionLoader } from '@/components/ui/Spinner';

const siteMap = [
  {
    section: 'Layanan',
    links: [
      { href: '/services', label: 'Semua Layanan' },
      { href: '/services#deep-cleaning', label: 'Deep Cleaning' },
      { href: '/services#regular-cleaning', label: 'Regular Cleaning' },
      { href: '/services#post-construction', label: 'Post Construction' },
      { href: '/services#sofa-cleaning', label: 'Sofa & Carpet Cleaning' },
      { href: '/services#office-cleaning', label: 'Office Cleaning' },
      { href: '/services#window-cleaning', label: 'Window Cleaning' },
    ],
  },
  {
    section: 'Perusahaan',
    links: [
      { href: '/about', label: 'Tentang Kami' },
      { href: '/gallery', label: 'Galeri' },
      { href: '/blog', label: 'Blog & Tips' },
      { href: '/contact', label: 'Hubungi Kami' },
      { href: '/faq', label: 'FAQ' },
      { href: '/career', label: 'Karir' },
    ],
  },
  {
    section: 'Legal',
    links: [
      { href: '/privacy', label: 'Kebijakan Privasi' },
      { href: '/terms', label: 'Syarat & Ketentuan' },
      { href: '/refund', label: 'Kebijakan Refund' },
    ],
  },
  {
    section: 'Area Layanan',
    links: [
      { href: '/area/surabaya', label: 'Surabaya' },
      { href: '/area/sidoarjo', label: 'Sidoarjo' },
      { href: '/area/gresik', label: 'Gresik' },
    ],
  },
  {
    section: 'Akun',
    links: [
      { href: '/login', label: 'Masuk' },
      { href: '/register', label: 'Daftar' },
      { href: '/forgot-password', label: 'Lupa Password' },
      { href: '/dashboard', label: 'Dashboard' },
    ],
  },
];

export default function SitemapPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SectionLoader />;
  }

  return (
    <div className="min-h-screen page-bg">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full hero-glow-1 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full hero-glow-2 blur-[100px]" />
        </div>

        <div className="relative container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full page-badge mb-6">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span className="text-[12px] font-semibold text-emerald-400 tracking-wider uppercase">
                Sitemap
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl page-text mb-4">
              Peta Situs
            </h1>
            <p className="text-[15px] page-text-muted max-w-xl mx-auto">
              Navigasi lengkap semua halaman di website Ningclean. Temukan apa yang kamu butuhkan dengan cepat.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sitemap Grid */}
      <section className="pb-24">
        <div className="relative container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteMap.map((group, idx) => (
              <motion.div
                key={group.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="page-section-card border rounded-2xl p-6"
              >
                <h2 className="text-[11px] font-bold tracking-[.12em] uppercase text-emerald-400 mb-5">
                  {group.section}
                </h2>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[14px] page-text-muted hover:text-emerald-400 transition-colors duration-200 inline-flex items-center gap-2 group"
                      >
                        <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-emerald-400 transition-colors" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
