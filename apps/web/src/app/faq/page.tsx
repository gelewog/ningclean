'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Search, ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';
import { getFAQs } from '@/lib/api';

const faqCategories = [
  { id: 'all', label: 'Semua', icon: HelpCircle },
  { id: 'General', label: 'Umum', icon: HelpCircle },
  { id: 'Services', label: 'Layanan', icon: HelpCircle },
  { id: 'Pricing', label: 'Pembayaran', icon: HelpCircle },
  { id: 'Booking', label: 'Booking & Jadwal', icon: HelpCircle },
  { id: 'Technical', label: 'Teknis', icon: HelpCircle },
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const data = await getFAQs();
        setFaqs(data || []);
      } catch (error) {
        console.error('Failed to fetch FAQs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const activeFaqs = faqs.filter(faq => faq.isActive);

  // Group FAQs by category
  const groupedFaqs = activeFaqs.reduce((acc, faq) => {
    const cat = faq.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {} as Record<string, any[]>);

  const filteredFAQs: any[] = searchQuery
    ? activeFaqs.filter((faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : (selectedCategory === 'all' ? activeFaqs : (groupedFaqs[selectedCategory] || []));

  // Sort by order
  filteredFAQs.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  return (
    <div className="min-h-screen page-bg">
      <Navigation />

      <main>
        {/* Hero */}
        <section className="relative py-32 overflow-hidden">
          <div className="pointer-events-none select-none">
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full hero-glow-1 blur-[110px]" />
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full hero-glow-2 blur-[100px]" />
          </div>
          <div className="relative container mx-auto px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full page-badge text-[12px] font-semibold tracking-widest uppercase mb-6">
                FAQ
              </div>
              <h1 className="font-serif text-4xl md:text-5xl page-text mb-6">
                Pertanyaan <em className="italic text-emerald-400">Umum</em>
              </h1>
              <p className="text-[15px] page-text-muted leading-relaxed mb-8">
                Temukan jawaban untuk pertanyaan yang sering diajukan tentang layanan Ningclean.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 page-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari pertanyaan..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-[14px] page-input border
                             focus:outline-none focus:border-emerald-400
                             transition-colors duration-200"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        {!searchQuery && (
          <section className="relative py-8">
            <div className="relative container mx-auto px-6 max-w-5xl">
              <div className="flex flex-wrap gap-3 justify-center">
                {faqCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setOpenIndex(null); }}
                    className={selectedCategory === cat.id
                      ? 'page-tab-selected px-5 py-2.5 rounded-xl text-[13px] font-medium border transition-all duration-200'
                      : 'page-tab-unselected px-5 py-2.5 rounded-xl text-[13px] font-medium border transition-all duration-200'
                    }
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ List */}
        <section className="relative py-12">
          <div className="pointer-events-none select-none">
            <div className="absolute top-1/2 left-0 w-[350px] h-[350px] rounded-full hero-glow-2 blur-[100px]" />
          </div>
          <div className="relative container mx-auto px-6 max-w-3xl">
            {filteredFAQs.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {filteredFAQs.map((faq, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="page-section-card border rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="text-[14px] font-medium page-text pr-4">{faq.question}</span>
                      <motion.div
                        animate={{ rotate: openIndex === idx ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 page-text-muted flex-shrink-0" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openIndex === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-0">
                            <p className="text-[13px] page-text-muted leading-relaxed border-t page-border pt-4">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="page-text-muted">Tidak ada hasil untuk &quot;{searchQuery}&quot;</p>
              </div>
            )}
          </div>
        </section>

        {/* Still Have Questions CTA */}
        <section className="relative py-16">
          <div className="pointer-events-none select-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full hero-glow-1 blur-[110px]" />
          </div>
          <div className="relative container mx-auto px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center page-section-card border rounded-3xl p-10"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
                <MessageCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="font-serif text-2xl page-text mb-3">Tidak menemukan jawaban?</h2>
              <p className="text-[15px] page-text-muted mb-6 max-w-md mx-auto">
                Tim kami siap membantu menjawab semua pertanyaan Anda. Jangan ragu untuk menghubungi kami.
              </p>
              <Link href="/contact">
                <Button
                  variant="accent"
                  size="lg"
                  className="inline-flex"
                  rightIcon={<MessageCircle className="w-4 h-4" />}
                >
                  Hubungi Kami
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
