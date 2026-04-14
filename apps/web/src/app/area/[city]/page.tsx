'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { SectionLoader } from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { ServiceCard } from '@/components/cards';
import { MapPin, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { getServiceAreas, getServices, getTestimonials } from '@/lib/api';

const cityData: Record<string, {
  name: string;
  tagline: string;
  description: string;
  stats: { label: string; value: string }[];
  coverage: string[];
  testimonials: { name: string; text: string; service: string; rating: number }[];
}> = {
  surabaya: {
    name: 'Surabaya',
    tagline: 'Kota Pahlawan',
    description: 'Layanan cleaning profesional teratas di Surabaya. Dari rumah minimalis hingga kantor megah, tim Ningclean siap membuat properti kamu kinclong.',
    stats: [
      { label: 'Pelanggan Aktif', value: '2.500+' },
      { label: 'Booking Selesai', value: '15.000+' },
      { label: 'Tim Cleaner', value: '85+' },
      { label: 'Coverage Area', value: '45+' },
    ],
    coverage: [
      'Gubeng', 'Tegalsari', 'Dr. Sutomo', 'Tenggilis', 'Rungkut',
      'Wonokromo', 'Wiyunga', '茉莉', 'Sukolilo', 'Mulyorejo',
      'Simo', 'Tandes', 'Sukomanunggal', 'Asemrowo', 'Benowo',
      'Pakal', 'Lakarsantri', 'Pabean Cantian', 'Bubutan', 'Krembangan',
    ],
    testimonials: [
      { name: 'Sari Wulandari', text: 'Tim Ningclean super rapi dan fast response. Booking via WA, besoknya langsung datang. Recommended!', service: 'Home Cleaning', rating: 5 },
      { name: 'Budi Santoso', text: 'Deep cleaning rumah setelah renovasi, hasilnya bikin amazed. Debu-debu semua hilang.', service: 'Deep Cleaning', rating: 5 },
      { name: 'Maya Putri', text: 'Office cleaning mingguan dari Ningclean bikin lingkungan kerja lebih nyaman dan produktif.', service: 'Office Cleaning', rating: 5 },
    ],
  },
  sidoarjo: {
    name: 'Sidoarjo',
    tagline: 'Kotadelta',
    description: 'Ningclean hadir di Sidoarjo untuk melayani kebutuhan cleaning rumah, apartment, dan komersial kamu dengan harga yang terjangkau.',
    stats: [
      { label: 'Pelanggan Aktif', value: '800+' },
      { label: 'Booking Selesai', value: '5.500+' },
      { label: 'Tim Cleaner', value: '30+' },
      { label: 'Coverage Area', value: '18+' },
    ],
    coverage: [
      'Sidoarjo', 'Tanggulangin', 'Candi', 'Tulangan', 'Krembung',
      'Porong', 'Kedungbendo', 'Ketapang', 'Krian', 'Balongbendo',
      'Waru', 'Sedati', 'Gedangan', 'Budi', 'Jabon',
    ],
    testimonials: [
      { name: 'Ahmad Fauzi', text: 'Kecil-kecilan tapi pelayanannya nggak kecil. Tim-nya ramah dan hasilnya premium.', service: 'Home Cleaning', rating: 5 },
      { name: 'Rina Kumala', text: 'Sofa cleaning di Ningclean bikin sofa seolah baru lagi. Worth it banget!', service: 'Sofa Cleaning', rating: 5 },
      { name: 'Deni Kurniawan', text: 'Post-construction cleaning dari Ningclean super thorough. Builder-nya sampai kagum.', service: 'Post-Construction', rating: 5 },
    ],
  },
  gresik: {
    name: 'Gresik',
    tagline: 'Kota Industri',
    description: 'Melayani area Gresik dan sekitarnya dengan layanan cleaning berkualitas. Coverage sampai ke kawasan industri dan perumahan elite.',
    stats: [
      { label: 'Pelanggan Aktif', value: '400+' },
      { label: 'Booking Selesai', value: '2.800+' },
      { label: 'Tim Cleaner', value: '18+' },
      { label: 'Coverage Area', value: '12+' },
    ],
    coverage: [
      'Gresik Kota', 'Duduk Sampeyan', 'Kebomas', 'Cerme', 'Benjeng',
      'Menganti', 'Kawasan Industri KIEC', 'Kawasan Industri Kuwait', 'Bungah', 'Dukunttg',
    ],
    testimonials: [
      { name: 'Hendra Wijaya', text: 'Warehouse cleaning dari Ningclean rapi dan cepat. Tim-nya kompak dan professional.', service: 'Industrial Cleaning', rating: 5 },
      { name: 'Lisa Handayani', text: 'Rumah saya di Menganti, biasanya susah cari cleaning service yang качественный. Alhamdulillah Ningclean hadir!', service: 'Home Cleaning', rating: 5 },
      { name: 'Agus Prasetyo', text: 'Kami pakai layanan regular untuk kantor di kawasan industri. Konsisten hasilnya.', service: 'Office Cleaning', rating: 5 },
    ],
  },
};

export default function AreaCityPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [area, setArea] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const citySlug = (params?.city as string || 'surabaya').toLowerCase();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areasData, servicesData, testimonialsData] = await Promise.all([
          getServiceAreas(),
          getServices(citySlug),
          getTestimonials(citySlug),
        ]);
        // Find matching area or fallback to first
        const matchedArea = areasData.find((a: any) => a.slug === citySlug) || areasData[0];
        setArea(matchedArea || {
          city: citySlug.charAt(0).toUpperCase() + citySlug.slice(1),
          tagline: 'Area Layanan',
          description: 'Layanan cleaning profesional di area ini.',
          coverage: [],
        });
        setServices(servicesData || []);
        setTestimonials(testimonialsData || []);
      } catch (error) {
        console.error('Failed to fetch area data:', error);
        setArea({
          city: citySlug.charAt(0).toUpperCase() + citySlug.slice(1),
          tagline: 'Area Layanan',
          description: 'Layanan cleaning profesional di area ini.',
          coverage: [],
        });
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [citySlug]);

  if (loading) {
    return <SectionLoader />;
  }

  const stats = [
    { label: 'Pelanggan Aktif', value: '500+' },
    { label: 'Booking Selesai', value: '3.000+' },
    { label: 'Tim Cleaner', value: '25+' },
    { label: 'Coverage Area', value: '15+' },
  ];

  return (
    <div className="min-h-screen page-bg">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[450px] h-[450px] rounded-full bg-emerald-500/[0.07] blur-[130px]" />
          <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full bg-blue-600/[0.05] blur-[110px]" />
        </div>

        <div className="relative container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 page-text-muted text-[13px] mb-6">
              <Link href="/" className="hover:page-text transition-colors">Beranda</Link>
              <span>/</span>
              <span className="page-text">Area Layanan</span>
              <span>/</span>
              <span className="text-emerald-400">{area.city}</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end gap-8">
              {/* Left: Text */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] font-semibold text-emerald-400 tracking-wider uppercase">
                    {area.tagline}
                  </span>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl page-text mb-4">
                  Layanan Cleaning<br />
                  <em className="italic text-emerald-400">di {area.city}</em>
                </h1>
                <p className="text-[15px] page-text-muted45 max-w-lg leading-relaxed">
                  {area.description}
                </p>
              </div>

              {/* Right: CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/booking">
                  <Button variant="accent" size="lg" className="gap-2">
                    Booking Sekarang
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="btn-outline-dark gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    Chat WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-16 -mt-4">
        <div className="relative container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="page-section-card border rounded-2xl p-5 text-center">
                <p className="text-2xl font-bold text-emerald-400 mb-1">{stat.value}</p>
                <p className="text-[12px] page-text-muted">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services available */}
      <section className="pb-16">
        <div className="relative container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold page-text mb-2">Layanan di {area.city}</h2>
            <p className="text-[14px] page-text-muted">Semua layanan Ningclean tersedia di area ini.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.slice(0, 6).map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + idx * 0.06 }}
              >
                <ServiceCard service={service} index={idx} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Link href="/services">
              <Button variant="outline" size="lg" className="btn-outline-dark gap-2">
                Lihat Semua Layanan
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Coverage Area */}
      <section className="pb-16">
        <div className="relative container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="page-section-card border rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/[0.1] border border-emerald-500/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold page-text">Area Coverage di {area.city}</h2>
                <p className="text-[13px] page-text-muted">{area.coverage?.length || 0} wilayah tercover</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(area.coverage || []).map((coverageArea: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full page-section-card border text-[13px] page-text-muted"
                >
                  {coverageArea}
                </span>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t page-border flex items-start gap-3 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-[13px] page-text-muted">
                Area di luar list? Tenang, hubungi kami — tim lapangan kami akan check apakah area kamu masih bisa dilayani.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="pb-24">
        <div className="relative container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold page-text mb-2">Testimoni di {area.city}</h2>
            <p className="text-[14px] page-text-muted">Review asli dari pelanggan kami.</p>
          </motion.div>

          {testimonials.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-5">
              {testimonials.slice(0, 6).map((t, idx) => (
                <motion.div
                  key={t.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + idx * 0.08 }}
                  className="page-section-card border rounded-2xl p-6"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-[14px] page-text leading-relaxed mb-4">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    {t.image ? (
                      <img src={t.image} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold page-text">{t.name}</p>
                      {t.role && <p className="text-xs page-text-muted">{t.role}{t.company ? ` - ${t.company}` : ''}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[14px] page-text-muted">
                Testimoni pelanggan di area ini akan segera ditambahkan.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
