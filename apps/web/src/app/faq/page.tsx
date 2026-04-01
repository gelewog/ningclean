'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Search, ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';

const faqCategories = [
  { id: 'umum', label: 'Umum', icon: HelpCircle },
  { id: 'booking', label: 'Booking & Jadwal', icon: HelpCircle },
  { id: 'pembayaran', label: 'Pembayaran', icon: HelpCircle },
  { id: 'layanan', label: 'Layanan', icon: HelpCircle },
  { id: 'komplain', label: 'Komplain & Garansi', icon: HelpCircle },
];

const faqData: Record<string, Array<{ q: string; a: string }>> = {
  umum: [
    { q: 'Apa itu Ningclean?', a: 'Ningclean adalah layanan cleaning service profesional yang beroperasi di Surabaya, Gresik, dan Sidoarjo. Kami menyediakan berbagai layanan kebersihan rumah seperti Deep Cleaning, Regular Cleaning, Post Construction Cleaning, dan lainnya.' },
    { q: 'Bagaimana cara booking layanan Ningclean?', a: 'Anda dapat booking melalui website kami di halaman /booking, menghubungi WhatsApp di +62 812-3456-7890, atau mengisi formulir kontak di halaman Hubungi Kami. Proses booking sangat mudah dan cepat.' },
    { q: 'Apakah Ningclean sudah terverifikasi?', a: 'Ya, Ningclean adalah perusahaan yang sudah legal dan terverifikasi. Semua tim kami sudah terlatih dan bersertifikat. Kami juga memiliki izin usaha yang lengkap.' },
    { q: 'Apa area coverage Ningclean?', a: 'Kami saat ini melayani area Surabaya, Gresik, dan Sidoarjo. Untuk area lain, silakan hubungi kami untuk konfirmasi ketersediaan.' },
    { q: 'Apakah aman untuk mempercayakan rumah saya ke Ningclean?', a: 'Sangat aman. Semua tim kami sudah melalui proses seleksi ketat, background check, dan pelatihan profesional. Kami juga memberikan garansi kepuasan 100%.' },
    { q: 'Apa saja jam operasional Ningclean?', a: 'Kami beroperasi Senin-Jumat pukul 08.00-20.00, Sabtu pukul 09.00-18.00, Minggu pukul 09.00-16.00, dan hari libur pukul 10.00-14.00.' },
  ],
  booking: [
    { q: 'Bagaimana sistem booking di Ningclean?', a: 'Pilih layanan yang diinginkan, tentukan tanggal dan waktu, isi alamat lengkap, lakukan pembayaran, dan tim kami akan datang sesuai jadwal. Anda akan mendapat notifikasi melalui WhatsApp.' },
    { q: 'Berapa lama sehari sebelum jadwal pembersihan saya harus booking?', a: 'Disarankan untuk booking minimal 1-2 hari sebelumnya. Namun untuk permintaan mendesak, kami akan berusaha mengakomodasi sesuai ketersediaan tim.' },
    { q: 'Bisakah saya mengubah jadwal setelah booking?', a: 'Ya, Anda dapat mengubah jadwal maksimal 24 jam sebelum jadwal awal. Hubungi kami via WhatsApp untuk perubahan jadwal.' },
    { q: 'Apakah saya perlu di rumah saat tim pembersihan bekerja?', a: 'Tidak harus. Anda bisa menitipkan kunci di tempat aman atau memberikan akses kepada tim kami. Yang penting, pastikan barang berharga sudah diamankan.' },
    { q: 'Bagaimana jika tim tidak datang sesuai jadwal?', a: 'Jika tim tidak datang, silakan hubungi kami segera via WhatsApp. Kami akan menginvestigasi dan memberikan solusi terbaik, termasuk kompensasi jika memang kesalahan dari kami.' },
    { q: 'Apakah bisa booking untuk rutin setiap minggu/bulan?', a: 'Tentu! Kami menyediakan paket langganan mingguan, bulanan, dan kontrak jangka panjang dengan harga spesial. Hubungi kami untuk info lebih lanjut.' },
  ],
  pembayaran: [
    { q: 'Metode pembayaran apa saja yang diterima?', a: 'Kami menerima Transfer Bank (BCA, Mandiri, BRI, BNI), QRIS, dan Cash. Pembayaran dilakukan sebelum atau setelah layanan selesai.' },
    { q: 'Kapan saya harus melakukan pembayaran?', a: 'Untuk booking reguler, pembayaran dapat dilakukan setelah layanan selesai. Untuk paket langganan atau proyek besar, biasanya diminta DP 50%.' },
    { q: 'Apakah ada biaya tambahan di luar harga paket?', a: 'Harga yang tercantum sudah all-in kecuali untuk kondisi khusus seperti tingkat kotoran ekstrem, area yang sangat luas, atau permintaan di luar jam operasional (surcharge 25%).' },
    { q: 'Bagaimana jika saya ingin refund?', a: 'Kebijakan refund dapat dilihat di halaman Kebijakan Refund. Umumnya, refund dapat diajukan dalam 1x24 jam setelah layanan jika ada keluhan yang tidak dapat diselesaikan.' },
    { q: 'Apakah bisa bayar dengan cicilan?', a: 'Untuk paket langganan jangka panjang, kami menyediakan opsi pembayaran bulanan. Hubungi tim kami untuk skema cicilan yang tersedia.' },
    { q: 'Bagaimana bukti pembayaran saya?', a: 'Setelah pembayaran, Anda akan menerima receipt/resi melalui WhatsApp dan email sebagai bukti transaksi yang sah.' },
  ],
  layanan: [
    { q: 'Apa perbedaan Deep Cleaning dan Regular Cleaning?', a: 'Deep Cleaning adalah pembersihan mendalam yang mencakup semua sudut, termasuk area yang sering terlewat seperti ventilasi, langit-langit, dan furniture. Regular Cleaning untuk mantenimiento rutin lebih ringan. Deep Cleaning direkomendasikan 1-2x per tahun.' },
    { q: 'Apa saja yang termasuk dalam layanan Post Construction Cleaning?', a: 'Layanan ini mencakup pembersihan total setelah renovasi/konstruksi: penghilangan debu konstruksi, sisa semen, cat, pembersihan kaca, lantai, dinding, dan seluruh area sampai siap huni.' },
    { q: 'Berapa lama durasi layanan Deep Cleaning untuk rumah type 36-70?', a: 'Untuk rumah type 36-70, Deep Cleaning biasanya memakan waktu 4-8 jam tergantung kondisi dan luas rumah. Rumah type 70-120 sekitar 6-12 jam.' },
    { q: 'Apakah produk cleaning yang digunakan aman?', a: 'Ya, kami menggunakan produk ramah lingkungan yang aman untuk anak-anak, hewan peliharaan, dan tidak merusak permukaan. Produk kami sudah teruji klinis.' },
    { q: 'Apakah Ningclean menyediakan alat sendiri?', a: 'Ya, tim kami membawa semua peralatan dan produk cleaning profesional. Anda hanya perlu menyediakan akses air dan listrik.' },
    { q: 'Bisakah saya minta tim khusus perempuan?', a: 'Untuk permintaan khusus, kami akan berusaha mengakomodasi sesuai ketersediaan tim. Silakan informasikan saat booking.' },
  ],
  komplain: [
    { q: 'Bagaimana jika hasil cleaning tidak memuaskan?', a: 'Jika hasil tidak memuaskan, segera hubungi kami maksimal 1x24 jam setelah layanan. Kami akan mengirim tim untuk cleaning ulang tanpa biaya tambahan.' },
    { q: 'Apa yang harus dilakukan jika ada barang yang hilang atau rusak?', a: 'Segera laporkan ke kami dengan bukti foto/video jika memungkinkan. Kami akan melakukan investigasi. Jika terbukti kesalahan dari tim kami, kami akan memberikan kompensasi sesuai nilai barang.' },
    { q: 'Bagaimana proses komplain di Ningclean?', a: 'Hubungi kami via WhatsApp dengan menyertakan foto hasil kerja, jelaskan masalahnya, tim kami akan merespons dalam 1x24 jam dan memberikan solusi terbaik.' },
    { q: 'Apakah ada garansi untuk layanan Ningclean?', a: 'Ya, kami memberikan garansi kepuasan 100%. Jika tidak puas dengan hasil, cleaning ulang gratis. Garansi ini berlaku maksimal 1x24 jam setelah layanan.' },
    { q: 'Bagaimana jika saya allergic terhadap produk tertentu?', a: 'Kami dapat mengakomodasi permintaan produk khusus yang hypoallergenic atau bebas parfum. Informasikan kebutuhan ini saat booking.' },
    { q: 'Bagaimana cara memberikan feedback untuk peningkatan layanan?', a: 'Kami sangat menghargai feedback. Anda dapat mengisi form rating setelah layanan, atau hubungi kami langsung via WhatsApp/email. Feedback Anda membantu kami meningkatkan layanan.' },
  ],
};

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('umum');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFAQs = searchQuery
    ? Object.values(faqData)
        .flat()
        .filter((faq) => faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase()))
    : faqData[selectedCategory] || [];

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
                      <span className="text-[14px] font-medium page-text pr-4">{faq.q}</span>
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
                              {faq.a}
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
