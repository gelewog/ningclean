'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { SectionLoader } from '@/components/ui/Spinner';
import { FileText, ChevronRight, Scale } from 'lucide-react';

const sections = [
  {
    id: 'pendahuluan',
    title: 'Pendahuluan',
    content: `Selamat datang di Ningclean. Syarat & Ketentuan ini ("Ketentuan") mengatur penggunaan layanan cleaning profesional yang disediakan oleh PT Ningclean Indonesia ("Ningclean", "kami", "kita") melalui website, aplikasi mobile, dan channel lainnya.

Dengan mengakses atau menggunakan layanan kami, kamu ("Pengguna", "kamu") menyetujui terikat oleh Ketentuan ini. Jika kamu tidak setuju dengan Ketentuan ini, mohon untuk tidak menggunakan layanan kami.

Kami berhak mengubah Ketentuan ini sewaktu-waktu. Perubahan akan efektif sejak tanggal dipublikasikan. Penggunaan berkelanjutan setelah perubahan berarti kamu menyetujui Ketentuan yang sudah diperbarui.`,
  },
  {
    id: 'layanan',
    title: 'Layanan Kami',
    content: `Ningclean menyediakan layanan cleaning profesional termasuk namun tidak terbatas pada:

**Layanan Residential:**
- Home Cleaning (pembersihan rumah rutin)
- Deep Cleaning (pembersihan intensif)
- Post-Construction Cleaning (pembersihan pasca konstruksi)
- Sofa & Carpet Cleaning

**Layanan Commercial:**
- Office Cleaning (pembersihan kantor)
- Industrial Cleaning
- Regular Maintenance

**Syarat Layanan:**
- Layanan dimulai pada waktu yang telah dijadwalkan
- Tim kami akan arrive dalam window waktu ±30 menit dari jadwal
- Keterlambatan karena faktor eksternal (macet, cuaca) bukan tanggung jawab kami
- Waktu layanan adalah estimasi dan bisa berubah tergantung kondisi lapangan

Kualitas layanan kami dijamin sesuai standar yang telah ditetapkan. Jika tidak puas, silakan ajukan komplain dalam 24 jam setelah layanan selesai.`,
  },
  {
    id: 'akun',
    title: 'Akun & Registrasi',
    content: `**Registrasi:**
- Kamu harus registrasi dengan informasi yang valid dan lengkap
- Satu akun per orang; akun bersama tidak diperkenankan
- Kamu bertanggung jawab menjaga kerahasiaan password

**Informasi Akurat:**
- Nama, nomor HP, dan alamat harus benar dan terkini
- Kami tidak bertanggung jawab atas masalah akibat informasi yang tidak akurat
- Perubahan informasi dapat dilakukan di menu Pengaturan

**Keamanan Akun:**
- Segera hubungi kami jika ada aktivitas tidak authorized
- Kami tidak bertanggung jawab atas kerugian akibat kelalaian menjaga password
- Kami berhak suspend atau terminate akun yang melanggar Ketentuan`,
  },
  {
    id: 'booking',
    title: 'Booking & Jadwal',
    content: `**Cara Booking:**
- Melalui website: pilih layanan → jadwal → alamat → konfirmasi
- Melalui WhatsApp: hubungi +62 812-3456-7890
- Through aplikasi mobile (jika tersedia)

**Konfirmasi:**
- Booking dianggap confirmed setelah pembayaran diterima atau deposit dibayar
- Konfirmasi akan dikirim via WhatsApp dan email

**Reschedule:**
- Pengubahan jadwal dapat dilakukan minimal 24 jam sebelum jadwal
- Hubungi kami via WhatsApp untuk reschedule
- Batas reschedule: 3 kali per booking

**Ketentuan Tambahan:**
- Kami berhak menolak booking dengan alamat di luar jangkauan layanan
- Booking dengan jadwal kurang dari 24 jam mungkin dikenakan biaya tambahan
- Kami berhak membatalkan booking dengan pemberitahuan jika kondisi tidak memungkinkan`,
  },
  {
    id: 'pembayaran',
    title: 'Pembayaran',
    content: `**Metode Pembayaran:**
- Transfer bank (BCA, Mandiri, BNI, BRI)
- E-wallet (GoPay, OVO, Dana)
- Credit/Debit Card via Midtrans
- Cash (hanya untuk area tertentu)

**Ketentuan Pembayaran:**
- Pembayaran penuh dilakukan sebelum atau setelah layanan selesai
- Untuk booking besar (>Rp 2.000.000), deposit 50% diperlukan
- Harga yang tertera sudah termasuk PPN 11%

**Harga:**
- Harga bisa berubah sewaktu-waktu; harga yang berlaku adalah harga saat booking
- Harga sudah termasuk ongkos transportasi untuk area dalam jangkauan
- Biaya tambahan mungkin dikenakan untuk:
  - Lokasi di luar jangkauan standar
  - Kondisi kebersihan yang sangat buruk
  - Permintaan khusus di luar lingkup layanan

**Promo & Diskon:**
- Kode promo hanya bisa digunakan sekali dan tidak bersamaan dengan promo lain
- Promo tidak dapat diuangkan
- Kami berhak menarik promo sewaktu-waktu`,
  },
  {
    id: 'pembatalan',
    title: 'Pembatalan & Refund',
    content: `**Kebijakan Pembatalan:**

**Oleh Pengguna:**
- Batal >48 jam sebelum jadwal: refund 100% atau reschedule gratis
- Batal 24-48 jam sebelum jadwal: refund 50% atau reschedule dengan biaya Rp 50.000
- Batal <24 jam sebelum jadwal: tidak ada refund, namun bisa reschedule

**Oleh Ningclean:**
- Jika kami harus membatalkan karena alasan internal: refund 100% + voucher diskon 20%
- Jika tim kami tidak bisa arrive (force majeure): refund 100% + reschedule gratis

**Proses Refund:**
- Refund akan diproses dalam 5-7 hari kerja
- Refund akan dikembalikan ke metode pembayaran awal
- Untuk pembayaran cash, refund bisa berupa transfer bank atau kredit di akun

Selengkapnya lihat Kebijakan Refund kami.`,
  },
  {
    id: 'garansi',
    title: 'Garansi & Komplain',
    content: `**Garansi Layanan:**
- Garansi 100% untuk area yang sudah dibersihkan dan tidak terlewatkan
- Jika ada area yang terlewatkan, tim akan kembali untuk touch-up tanpa biaya tambahan
- Garansi berlaku untuk 24 jam setelah layanan selesai

**Cara Mengajukan Komplain:**
1. Hubungi kami via WhatsApp: +62 812-3456-7890
2. Kirim foto/video sebagai bukti
3. Jelaskan masalah yang dialami
4. Kami akan respond dalam 24 jam

**Syarat Komplain:**
- Komplain harus diajukan dalam 24 jam setelah layanan
- Bukti foto/video diperlukan untuk komplain yang melibatkan kualitas
- Komplain akan ditolak jika:
  - Dajukan setelah 24 jam
  - Kerusakan bukan caused oleh layanan kami
  - Kondisi rumah sudah diubah setelah layanan selesai

**Kompensasi:**
- Touch-up gratis untuk area yang terlewatkan
- Partial refund jika touch-up tidak memungkinkan
- Refund penuh dalam kasus layanan yang tidak bisa dilakukan sama sekali`,
  },
  {
    id: 'hak-kami',
    title: 'Hak Ningclean',
    content: `Ningclean berhak untuk:

1. **Mengubah Layanan** - Memodifikasi, menambah, atau mengurangi layanan yang tersedia dengan pemberitahuan

2. **Menolak Layanan** - Menolak memberikan layanan kepada pengguna yang:
   - Melakukan kekerasan atau pelecehan terhadap tim kami
   - Menyediakan informasi palsu
   - Melanggar Ketentuan ini
   - Memiliki riwayat pembayaran yang buruk

3. **Suspensi Akun** - Memberhentikan sementara atau permanen akun yang melanggar Ketentuan

4. **Harga & Promo** - Mengubah harga dan ketentuan promo sewaktu-waktu

5. **Force Majeure** - Tidak bertanggung jawab untuk kegagalan layanan akibat situasi di luar kendali kami (bencana alam, kebijakan pemerintah, dll)

6. **Keputusan Akhir** - Keputusan dari tim Ningclean adalah final dalam hal sengketa`,
  },
  {
    id: 'hukum',
    title: 'Hukum yang Berlaku',
    content: `Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia.

Setiap sengketa yang timbul dari atau terkait dengan Ketentuan ini akan diselesaikan melalui:

1. **Musyawarah** - Pihak-pihak akan berusaha menyelesaikan secara baik-baik dalam 30 hari

2. **Mediasi** - Jika musyawarah gagal, sengketa akan diajukan ke mediator yang disepakati kedua pihak

3. **Pengadilan** - Jika mediasi gagal, sengketa akan diajukan ke Pengadilan Negeri Surabaya

Dengan menggunakan layanan Ningclean, kamu menyetujui yurisdiksi eksklusif Pengadilan Negeri Surabaya.

Untuk pertanyaan tentang Ketentuan ini, hubungi kami di hello@ningclean.id.`,
  },
];

const tableOfContents = sections.map((s) => ({ id: s.id, title: s.title }));

export default function TermsPage() {
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
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full hero-glow-1 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full hero-glow-2 blur-[100px]" />
        </div>

        <div className="relative container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full page-badge mb-6">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span className="text-[12px] font-semibold text-emerald-400 tracking-wider uppercase">
                Syarat & Ketentuan
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl page-text mb-4">
              Aturan Main<br />
              <em className="italic text-emerald-400">Bersama Ningclean</em>
            </h1>
            <p className="text-[15px] page-text-muted max-w-xl mx-auto">
              Dengan menggunakan layanan kami, kamu setuju dengan syarat dan ketentuan kami. Baca dengan teliti sebelum booking.
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
                        const element = document.getElementById(item.id);
                        if (element) {
                          const offset = 100; // Offset for fixed navbar
                          const elementPosition = element.getBoundingClientRect().top;
                          const offsetPosition = elementPosition + window.pageYOffset - offset;
                          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                        }
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
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl page-icon-bg border flex items-center justify-center">
                        <FileText className="w-5 h-5 text-emerald-400" />
                      </div>
                      <h2 className="text-xl font-semibold page-text">{section.title}</h2>
                    </div>

                    <div className="text-[14px] page-text-muted leading-[1.9] space-y-4 prose dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
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
                  Tim kami siap menjelaskan segala hal tentang syarat dan ketentuan.
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
