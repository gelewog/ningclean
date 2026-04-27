'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { SectionLoader } from '@/components/ui/Spinner';
import { Lock, ChevronRight, ShieldCheck } from 'lucide-react';

const sections = [
  {
    id: 'pendahuluan',
    title: 'Pendahuluan',
    content: `Ningclean ("kami", "Kita", atau "Perusahaan") berkomitmen untuk melindungi privasi kamu. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, disclose, dan melindungi informasi pribadi kamu ketika menggunakan layanan kami.

Dengan menggunakan layanan Ningclean, kamu menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan ini. Jika kamu tidak setuju dengan kebijakan ini, mohon untuk tidak menggunakan layanan kami.`,
  },
  {
    id: 'data-dikumpulkan',
    title: 'Data yang Kami Kumpulkan',
    content: `Kami mengumpulkan berbagai jenis informasi untuk menyediakan dan meningkatkan layanan kami:

**Data Pribadi:**
- Nama lengkap dan nomor telepon
- Alamat email
- Alamat fisik dan lokasi layanan
- Foto (jika diperlukan untuk verifikasi)

**Data Penggunaan:**
- Riwayat booking dan transaksi
- Preferensi layanan
- Data teknis seperti alamat IP, jenis browser, dan perangkat yang digunakan
- Cookie dan teknologi pelacakan serupa

**Data Keuangan:**
- Informasi pembayaran (处理 oleh pihak ketiga yang terverifikasi)
- Riwayat transaksi

Kami hanya mengumpulkan data yang diperlukan untuk menyediakan layanan kepada kamu.`,
  },
  {
    id: 'penggunaan-data',
    title: 'Penggunaan Data',
    content: `Data yang kami kumpulkan digunakan untuk:

1. **Menyediakan Layanan** - Memproses booking, menjadwalkan layanan cleaning, dan mengomunikasikan jadwal dengan kamu.

2. **Peningkatan Layanan** - Menganalisis pola penggunaan untuk meningkatkan kualitas layanan dan mengembangkan fitur baru.

3. **Komunikasi** - Mengirim notifikasi terkait booking, promosi, dan informasi akun kamu.

4. **Keamanan** - Mendeteksi dan mencegah aktivitas fraudul, spam, dan penyalahgunaan layanan.

5. **Kepatuhan Hukum** - Memenuhi kewajiban hukum dan regulasi yang berlaku di Indonesia.

Kami tidak menjual data pribadi kamu kepada pihak ketiga untuk tujuan marketing.`,
  },
  {
    id: 'penyimpanan-data',
    title: 'Penyimpanan & Keamanan Data',
    content: `**Penyimpanan:**
- Data kamu disimpan di server yang aman di Indonesia
- Kami menggunakan enkripsi industry-standard (SSL/TLS) untuk transmisi data
- Akses ke data dibatasi hanya untuk karyawan yang memerlukan

**Retensi:**
- Data akun disimpan selama akun aktif dan setelahnya sesuai kebutuhan hukum
- Data booking disimpan minimal 5 tahun sesuai regulasi perpajakan Indonesia
- Kamu dapat meminta penghapusan data kapan saja (lihat Hak Pengguna)

**Keamanan:**
- Kami secara rutin melakukan audit keamanan
- Sistem kami dilindungi oleh firewall dan intrusion detection
- Dalam hal terjadi breach, kami akan memberitahu kamu dalam 72 jam`,
  },
  {
    id: 'hak-pengguna',
    title: 'Hak Kamu',
    content: `Sebagai pengguna Ningclean, kamu memiliki hak-hak berikut:

**Hak Akses** - Kamu dapat meminta salinan data pribadi yang kami miliki tentang kamu.

**Hak Koreksi** - Kamu dapat meminta kami mengoreksi informasi yang inaccurate atau tidak lengkap.

**Hak Penghapusan** - Kamu dapat meminta kami menghapus data pribadi kamu, dengan pengecualian untuk kebutuhan hukum.

**Hak Portabilitas** - Kamu dapat meminta data kamu ditransfer ke layanan lain dalam format yang terstruktur dan dapat dibaca mesin.

**Hak Menolak** - Kamu dapat menolak pemrosesan data untuk tujuan marketing langsung.

Untuk menggunakan hak-hak ini, hubungi kami di hello@ningclean.id. Kami akan merespons dalam 30 hari.`,
  },
  {
    id: 'cookies',
    title: 'Cookie & Teknologi Similar',
    content: `Kami menggunakan cookies dan teknologi serupa untuk:

- **Fungsional** - Memahami preferensi kamu dan mengingat login
- **Analitik** - Menganalisis penggunaan situs untuk meningkatkan experience
- **Marketing** - Menampilkan iklan yang relevan (dengan persetujuan)

Kamu dapat mengatur browser untuk menolak semua atau beberapa cookies. Namun, menolak cookies dapat mempengaruhi fungsionalitas situs.`,
  },
  {
    id: 'pihak-ketiga',
    title: 'Penyedia Layanan Pihak Ketiga',
    content: `Kami menggunakan penyedia layanan pihak ketiga untuk:

- **Pembayaran** - Midtrans, Xendit untuk pemrosesan transaksi
- **Cloud Storage** - AWS Indonesia untuk penyimpanan data
- **Analytics** - Google Analytics untuk memahami penggunaan situs
- **Communication** - WhatsApp Business API untuk komunikasi dengan pelanggan

Penyedia ini memiliki kebijakan privasi mereka sendiri dan kami memastikan mereka memenuhi standar keamanan data yang kami terima.`,
  },
  {
    id: 'perubahan',
    title: 'Perubahan Kebijakan',
    content: `Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan diumumkan melalui:

- Email notification ke pengguna terdaftar
- Pengumuman di aplikasi/website
- Tanggal "Terakhir Diperbarui" di bagian bawah kebijakan

Perubahan signifikan akan mendapat notifikasi 30 hari sebelum efektif.`,
  },
  {
    id: 'kontak',
    title: 'Kontak Kami',
    content: `Jika kamu memiliki pertanyaan tentang Kebijakan Privasi ini atau ingin menggunakan hak kamu, hubungi kami:

**Email:** hello@ningclean.id
**WhatsApp:** +62 812-3456-7890
**Alamat:** Jl. Sudirman No. 123, Surabaya, Indonesia

Kami berkomitmen untuk merespons pertanyaan privasi dalam 30 hari kerja.`,
  },
];

const tableOfContents = sections.map((s) => ({ id: s.id, title: s.title }));

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('pendahuluan');
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
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[12px] font-semibold text-emerald-400 tracking-wider uppercase">
                Kebijakan Privasi
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl page-text mb-4">
              Privasi Kamu,<br />
              <em className="italic text-emerald-400">Komitmen Kami</em>
            </h1>
            <p className="text-[15px] page-text-muted max-w-xl mx-auto">
              Kami sangat serius dalam melindungi data pribadi kamu. Baca kebijakan kami untuk memahami bagaimana kami mengelola informasi kamu.
            </p>
            <p className="text-[12px] page-text-muted mt-4">
              Terakhir diperbarui: 31 Maret 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid lg:grid-cols-[240px_1fr] gap-10">
            {/* Sidebar TOC */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:sticky lg:top-32 lg:self-start"
            >
              <div className="page-section-card border rounded-2xl p-5">
                <h3 className="text-[10px] font-bold tracking-[.12em] uppercase page-text-muted mb-4">
                  Daftar Isi
                </h3>
                <nav className="flex flex-col gap-1">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-200 ${
                        activeSection === item.id
                          ? 'page-icon-bg text-emerald-400'
                          : 'page-text-muted hover:page-section-card'
                      }`}
                    >
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeSection === item.id ? 'rotate-90' : ''}`} />
                      <span className="text-[13px]">{item.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              {sections.map((section, idx) => (
                <motion.div
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="page-section-card border rounded-2xl p-6 md:p-8">
                    {/* Section header */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl page-icon-bg border flex items-center justify-center">
                        <Lock className="w-5 h-5 text-emerald-400" />
                      </div>
                      <h2 className="text-xl font-semibold page-text">{section.title}</h2>
                    </div>

                            <div className="prose prose-sm prose-invert max-w-none [&_ol]:list-none [&_ol]:p-0 [&_ol]:m-0 [&_ol]:mb-4 [&_ol]:[counter-reset:item] [&_ol>li]:[counter-increment:item] [&_ol>li]:flex [&_ol>li]:items-start [&_ol>li]:gap-3 [&_ol>li]:mb-2 [&_ol>li]:before:content-[counter(item)_'.'] [&_ol>li]:before:text-emerald-400/70 [&_ol>li]:before:font-medium [&_ol>li]:before:min-w-[24px] [&_ol>li]:before:text-right [&_ol>li]:before:shrink-0 [&_ol>li>p]:m-0 [&_ul]:list-none [&_ul]:p-0 [&_ul]:m-0 [&_ul]:mb-4 [&_ul>li]:flex [&_ul>li]:items-start [&_ul>li]:gap-3 [&_ul>li]:mb-2 [&_ul>li]:before:content-['•'] [&_ul>li]:before:text-emerald-400/50 [&_ul>li]:before:mt-1 [&_ul>li]:before:shrink-0 [&_ul>li>p]:m-0">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ children }) => <h1 className="text-xl font-bold page-text mb-4">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-lg font-semibold page-text mt-6 mb-3">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-base font-semibold page-text mt-4 mb-2">{children}</h3>,
                          p: ({ children }) => <p className="page-text-muted leading-relaxed mb-4">{children}</p>,
                          strong: ({ children }) => <strong className="page-text font-semibold">{children}</strong>,
                          em: ({ children }) => <em className="text-emerald-400/80 italic">{children}</em>,
                          code: ({ children }) => <code className="px-1.5 py-0.5 rounded bg-white/5 text-emerald-400 text-[12px]">{children}</code>,
                          a: ({ children, href }) => <a href={href} className="text-emerald-400 hover:underline">{children}</a>,
                          blockquote: ({ children }) => <blockquote className="border-l-2 border-emerald-400/30 pl-4 my-4 page-text-muted italic">{children}</blockquote>,
                          hr: () => <hr className="border-white/10 my-6" />,
                        }}
                      >
                        {section.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Contact CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="page-section-card border rounded-2xl p-8 text-center"
              >
                <h3 className="text-lg font-semibold page-text mb-2">Ada pertanyaan?</h3>
                <p className="text-[14px] page-text-muted mb-5">
                  Tim Privacy kami siap membantu kamu.
                </p>
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-semibold text-[14px] hover:bg-emerald-500/15 transition-colors"
                  >
                    Hubungi Kami
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
