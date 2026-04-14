'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import Button from '@/components/ui/Button';
import { SectionLoader } from '@/components/ui/Spinner';
import Link from 'next/link';
import { ArrowRight, Users, Award, MapPin, Clock, Shield, Heart } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const motionItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const defaultStats = [
  { value: '5+', label: 'Tahun Pengalaman', icon: Clock },
  { value: '1.250+', label: 'Pelanggan Dilayani', icon: Users },
  { value: '25+', label: 'Anggota Tim', icon: Award },
  { value: '3', label: 'Lokasi Area', icon: MapPin },
];

const defaultTeam = [
  {
    name: 'Ahmad Wijaya',
    position: 'CEO & Founder',
    bio: 'Ahmad adalah founders dengan pengalaman 10+ tahun di industri cleaning service. Visi beliau adalah membawa layanan kebersihan profesional ke setiap rumah di Jawa Timur.',
    avatar: null,
  },
  {
    name: 'Siti Nurhaliza',
    position: 'Head of Operations',
    bio: 'Siti memastikan setiap pekerjaan berjalan lancar dari awal hingga akhir. Dia adalah ahli dalam efisiensi operasional dan pelatihan tim.',
    avatar: null,
  },
  {
    name: 'Bayu Pratama',
    position: 'Marketing Manager',
    bio: 'Bayu menghubungkan Ningclean dengan pelanggan setia melalui strategi pemasaran yang inovatif dan hubungan masyarakat yang kuat.',
    avatar: null,
  },
];

const whyChoose = [
  { icon: Shield, title: 'Garansi 100%', desc: 'Tidak puas dengan hasil? Kami akan membersihkan ulang tanpa biaya tambahan.' },
  { icon: Award, title: 'Tim Profesional', desc: 'Semua teknisi kami terlatih, bersertifikat, dan berpengalaman minimal 2 tahun.' },
  { icon: Clock, title: 'Respon Cepat', desc: 'Booking hari ini, tim kami hadir besok. Jaminan datang tepat waktu.' },
  { icon: Heart, title: 'Bahan Aman', desc: 'Kami hanya menggunakan produk cleaning ramah lingkungan yang aman untuk keluarga.' },
];

interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  bio: string | null;
  avatar: string | null;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  order: number;
  socialLinks?: Record<string, string>;
  createdAt: string;
}

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch('http://localhost:4000/api/team-members', {
          cache: 'no-store'
        });
        if (!res.ok) throw new Error('Failed to fetch team');
        const data = await res.json();
        setTeam(data);
      } catch (err) {
        console.error('Team fetch error:', err);
        setTeam([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  if (loading) return <SectionLoader />;

  const displayTeam = team.length > 0 ? team : defaultTeam;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f]">
      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="pointer-events-none select-none">
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/[0.15] dark:bg-emerald-500/[0.1] blur-[110px]" />
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-blue-600/[0.12] dark:bg-blue-600/[0.08] blur-[100px]" />
          </div>

          <div className="relative container mx-auto px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                              bg-emerald-500/10 border border-emerald-500/25
                              text-[12px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase mb-6">
                Tentang Ningclean
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-normal text-slate-900 dark:text-white mb-6">
                Membersihkan Rumah,{' '}
                <em className="italic text-emerald-600 dark:text-emerald-400">Membangun Kepercayaan</em>
              </h1>
              <p className="text-[15px] text-slate-600 dark:text-white/60 leading-relaxed">
                Sejak 2020, Ningclean hadir sebagai solusi kebersihan rumah profesional di Surabaya, Gresik, dan Sidoarjo. 
                Kami percaya bahwa rumah yang bersih adalah fondasi kehidupan yang sehat dan bahagia.
              </p>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
            >
              {defaultStats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={motionItem}
                  className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</p>
                  <p className="text-[13px] text-slate-500 dark:text-white/50">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Company Story */}
        <section className="relative py-24">
          <div className="pointer-events-none select-none">
            <div className="absolute top-1/2 left-0 w-[350px] h-[350px] rounded-full bg-blue-600/[0.1] dark:bg-blue-600/[0.06] blur-[100px]" />
          </div>
          <div className="relative container mx-auto px-6 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-serif text-3xl md:text-4xl font-normal text-slate-900 dark:text-white mb-6">
                  Cerita <em className="italic text-emerald-600 dark:text-emerald-400">Ningclean</em>
                </h2>
                <div className="space-y-4 text-[15px] text-slate-600 dark:text-white/60 leading-relaxed">
                  <p>
                    Ningclean dimulai dari sebuah mimpi sederhana: menciptakan rumah-rumah yang tidak hanya bersih, 
                    tetapi juga sehat dan nyaman untuk dihuni. Pada tahun 2020, di tengah tantangan pandemi, 
                    kami melihat kebutuhan yang semakin meningkat akan layanan kebersihan profesional.
                  </p>
                  <p>
                    Berawal dari satu tim kecil di Surabaya, kini kami telah melayani lebih dari 1.250 rumah 
                    di tiga kota besar Jawa Timur. Setiap hari, 25+ tim profesional kami bekerja dengan satu 
                    tujuan: memberikan hasil pembersihan terbaik untuk setiap pelanggan.
                  </p>
                  <p>
                    Kami tidak sekadar membersihkan — kami memperhatikan detail yang sering terlewat, 
                    menggunakan teknik dan produk terbaik, serta memastikan setiap sudut rumah Anda 
                    kembali bersinar seperti baru.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                  <div className="bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-500/10 dark:to-blue-600/10 rounded-2xl p-8 mb-6">
                    <div className="text-6xl mb-4">🏠</div>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">98%</div>
                      <div className="text-[13px] text-slate-600 dark:text-white/60">
                        pelanggan setia<br />berulang order
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">4.95</p>
                      <p className="text-[12px] text-slate-500 dark:text-white/40">Rating Google</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">500+</p>
                      <p className="text-[12px] text-slate-500 dark:text-white/40">Testimoni Positif</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="relative py-24">
          <div className="pointer-events-none select-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.1] dark:bg-emerald-500/[0.06] blur-[120px]" />
          </div>
          <div className="relative container mx-auto px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-normal text-slate-900 dark:text-white">
                Misi & <em className="italic text-emerald-600 dark:text-emerald-400">Visi</em>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mb-6">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">Misi Kami</h3>
                <p className="text-[15px] text-slate-600 dark:text-white/60 leading-relaxed">
                  Memberikan layanan pembersihan rumah profesional yang konsisten, terpercaya, dan terjangkau 
                  untuk setiap keluarga di Jawa Timur. Kami berkomitmen untuk meningkatkan kualitas hidup 
                  masyarakat melalui lingkungan rumah yang bersih dan sehat.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mb-6">
                  <span className="text-3xl">🔭</span>
                </div>
                <h3 className="font-serif text-2xl font-normal text-slate-900 dark:text-white mb-4">Visi Kami</h3>
                <p className="text-[15px] text-slate-600 dark:text-white/60 leading-relaxed">
                  Menjadi perusahaan cleaning service terdepan di Indonesia yang dikenal luas karena 
                  kualitas layanan absolut dan inovasi berkelanjutan. Kami envision masa depan di mana 
                  setiap rumah dapat menikmati standar kebersihan profesional.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="relative py-24">
          <div className="pointer-events-none select-none">
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-emerald-500/[0.12] dark:bg-emerald-500/[0.07] blur-[110px]" />
          </div>
          <div className="relative container mx-auto px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-normal text-slate-900 dark:text-white mb-4">
                Tim <em className="italic text-emerald-600 dark:text-emerald-400">Kami</em>
              </h2>
              <p className="text-[15px] text-slate-500 dark:text-white/50 max-w-xl mx-auto">
                Di balik layanan Ningclean yang prima, terdapat tim profesional yang berdedikasi tinggi.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6"
            >
              {displayTeam.map((member, idx) => (
                <motion.div
                  key={member.id || idx}
                  variants={motionItem}
                  className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-500/20 dark:to-blue-600/20 flex items-center justify-center mx-auto mb-5 overflow-hidden">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl text-slate-700 dark:text-white">{member.name.charAt(0)}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{member.name}</h3>
                  <p className="text-[13px] text-emerald-600 dark:text-emerald-400 font-medium mb-3">{member.position}</p>
                  <p className="text-[13px] text-slate-500 dark:text-white/50 leading-relaxed">{member.bio || 'Team member'}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="relative py-24">
          <div className="pointer-events-none select-none">
            <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] rounded-full bg-blue-600/[0.08] dark:bg-blue-600/[0.05] blur-[100px]" />
          </div>
          <div className="relative container mx-auto px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-normal text-slate-900 dark:text-white mb-4">
                Mengapa <em className="italic text-emerald-600 dark:text-emerald-400">Memilih Kami</em>
              </h2>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {whyChoose.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={motionItem}
                  className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-colors shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-[13px] text-slate-500 dark:text-white/50 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="pointer-events-none select-none">
            <div className="absolute top-0 left-1/4 w-[380px] h-[380px] rounded-full bg-emerald-500/[0.15] dark:bg-emerald-500/[0.1] blur-[110px]" />
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-blue-600/[0.12] dark:bg-blue-600/[0.08] blur-[100px]" />
          </div>

          <div className="relative container mx-auto px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 shadow-sm"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-normal text-slate-900 dark:text-white mb-4">
                Siap <em className="italic text-emerald-600 dark:text-emerald-400">Booking?</em>
              </h2>
              <p className="text-[15px] text-slate-500 dark:text-white/50 max-w-md mx-auto mb-8">
                Hubungi kami sekarang dan dapatkan layanan cleaning profesional dengan harga terbaik.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/booking">
                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full sm:w-auto"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Booking Sekarang
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Hubungi Kami
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
