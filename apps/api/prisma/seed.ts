import { PrismaClient, Role, BookingStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ningclean.com' },
    update: {},
    create: {
      email: 'admin@ningclean.com',
      name: 'Admin Ningclean',
      password: adminPassword,
      role: Role.ADMIN,
      phone: '081234567890',
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Create Test Customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      email: 'customer@test.com',
      name: 'Budi Santoso',
      password: customerPassword,
      role: Role.CUSTOMER,
      phone: '081234567891',
    },
  });
  console.log('✅ Customer created:', customerUser.email);

  // Create Customer record linked to User
  const customer = await prisma.customer.upsert({
    where: { userId: customerUser.id },
    update: {},
    create: {
      email: 'customer@test.com',
      name: 'Budi Santoso',
      phone: '081234567891',
      source: 'registered',
      userId: customerUser.id,
    },
  });
  console.log('✅ Customer record created:', customer.email);

  // Create Services
  const services = [
    {
      name: 'Deep Cleaning Rumah',
      slug: 'deep-cleaning-rumah',
      description: 'Pembersihan menyeluruh untuk seluruh area rumah termasuk ruang tamu, kamar, dapur, dan kamar mandi dengan teknik profesional.',
      price: 750000,
      duration: 240,
      category: 'Deep Cleaning',
      icon: 'Sparkles',
      features: ['Pembersihan dinding & langit-langit', 'Sikat & vacuum karpet/sofa', 'Sterilisasi kamar mandi', 'Pembersihan kitchen set'],
    },
    {
      name: 'Deep Cleaning Apartemen',
      slug: 'deep-cleaning-apartemen',
      description: 'Layanan deep cleaning khusus untuk unit apartemen dengan peralatan yang aman untuk furniture dan interior modern.',
      price: 550000,
      duration: 180,
      category: 'Deep Cleaning',
      icon: 'Home',
      features: ['Pembersihan AC & ventilasi', 'Sikat karpet & curtain', 'Poles keramik & marmer'],
    },
    {
      name: 'Deep Cleaning Villa',
      slug: 'deep-cleaning-villa',
      description: 'Layanan premium untuk villa dengan area luas, termasuk pembersihan kolam renang dan taman.',
      price: 1500000,
      duration: 360,
      category: 'Deep Cleaning',
      icon: 'Building',
      features: ['Pembersihan seluruh lantai', 'Perawatan kolam renang', 'Pembersihan taman & outdoor'],
    },
    {
      name: 'Regular Cleaning Harian',
      slug: 'regular-cleaning-harian',
      description: 'Layanan pembersihan rutin harian untuk menjaga kebersihan rumah Anda setiap hari.',
      price: 150000,
      duration: 120,
      category: 'Regular Cleaning',
      icon: 'Home',
      features: ['Penyapuan & pel seluruh ruangan', 'Pembersihan furniture', 'Membersihkan debu'],
    },
    {
      name: 'Regular Cleaning Mingguan',
      slug: 'regular-cleaning-mingguan',
      description: 'Paket hemat pembersihan mingguan untuk rumah yang sudah cukup bersih dan perlu perawatan rutin.',
      price: 250000,
      duration: 180,
      category: 'Regular Cleaning',
      icon: 'Home',
      features: ['Vacuum & pel lantai', 'Pembersihan kamar mandi', 'Pembersihan dapur ringan'],
    },
    {
      name: 'Regular Cleaning Bulanan',
      slug: 'regular-cleaning-bulanan',
      description: 'Paket komplit pembersihan bulanan dengan treatment khusus untuk menjaga rumah tetap nyaman.',
      price: 450000,
      duration: 240,
      category: 'Regular Cleaning',
      icon: 'Home',
      features: ['Deep vacuum karpet & sofa', 'Pembersihan jendela', 'Pembersihan kitchen set detail'],
    },
    {
      name: 'Post Renovasi Ringan',
      slug: 'post-renovasi-ringan',
      description: 'Pembersihan setelah renovasi ringan untuk menghilangkan debu dan sisa material bangunan.',
      price: 500000,
      duration: 300,
      category: 'Post Construction',
      icon: 'HardHat',
      features: ['Penyedotan debu konstruksi', 'Pembersihan sisa cat & semen', 'Pembersihan jendela & kusen'],
    },
    {
      name: 'Post Renovasi Besar',
      slug: 'post-renovasi-besar',
      description: 'Layanan lengkap setelah renovasi besar dengan tenaga ahli dan peralatan industrial.',
      price: 1200000,
      duration: 480,
      category: 'Post Construction',
      icon: 'HardHat',
      features: ['Industrial vacuum debu tebal', 'Pembersihan sisa material', 'Poles lantai baru'],
    },
    {
      name: 'Sofa Cleaning',
      slug: 'sofa-cleaning',
      description: 'Pembersihan sofa dengan teknik steam cleaning dan shampooing profesional.',
      price: 200000,
      duration: 90,
      category: 'Sofa Cleaning',
      icon: 'Sofa',
      features: ['Vacuum dry & wet', 'Shampooing khusus kain', 'Steam cleaning 150°C'],
    },
    {
      name: 'Office Cleaning Harian',
      slug: 'office-cleaning-harian',
      description: 'Layanan pembersihan rutin untuk kantor dengan jadwal fleksibel sesuai jam kerja.',
      price: 300000,
      duration: 150,
      category: 'Office Cleaning',
      icon: 'Building',
      features: ['Pembersihan workstation', 'Vacuum karpet kantor', 'Pembersihan pantry'],
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }
  console.log('✅ Services created:', services.length);

  // Create Blog Posts (linked to admin user as author)
  const blogPosts = [
    {
      slug: 'tips-membersihkan-rumah-setelah-renovasi',
      title: 'Tips Membersihkan Rumah Setelah Renovasi',
      excerpt: 'Panduan lengkap untuk membersihkan rumah setelah renovasi, dari debu konstruksi hingga noda cat.',
      content: `Setelah proses renovasi rumah selesai, tahap pembersihan adalah hal yang tidak boleh dianggap remeh.

1. **Bersihkan Debu Secara Menyeluruh** - Mulai dari bagian atas ke bawah. Gunakan vacuum dengan filter HEPA untuk menangkap partikel halus.

2. **Cuci Seluruh Lantai** - Lantai pasti tertutup debu tebal. Gunakan air hangat campurkan sedikit deterjen.

3. **Hilangkan Noda Cat** - Noda cat di kaca atau keramik bisa dihilangkan dengan sedikit thinner atau cuka hangat.

4. **Sterilisasi Ruangan** - Setelah bersih, semprotkan disinfectant ke seluruh ruangan.

Tips tambahan: Gunakan masker dan sarung tangan saat membersihkan pasca renovasi untuk melindungi diri dari debu dan bahan kimia.`,
      coverImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80',
      author: 'Admin Ningclean',
      tags: ['Cleaning', 'Tips', 'Renovasi'],
      publishedAt: new Date('2026-03-28'),
    },
    {
      slug: 'keunggulan-deep-cleaning',
      title: 'Keunggulan Deep Cleaning Dibanding Cleaning Biasa',
      excerpt: 'Mengapa deep cleaning lebih efektif untuk menjaga kebersihan dan kesehatan rumah Anda.',
      content: `Deep cleaning adalah pembersihan menyeluruh yang mencapai area-area yang sering terlewat dalam cleaning biasa.

**Keunggulan Deep Cleaning:**

1. **Hasil Lebih Maksimal** - Dengan peralatan dan teknik profesional, seluruh kotoran dapat dibersihkan secara optimal.

2. **Hemat Waktu dan Energi** - Anda tidak perlu mengeluarkan tenaga untuk menggosok area yang sulit dijangkau.

3. **Lebih Higienis** - Proses sterilisasi memastikan rumah bebas dari kuman, tungau debu, dan alergen.

4. **Memperpanjang Umur Furnitur** - Perawatan rutin dapat memperpanjang umur furniture dan lantai rumah Anda.

5. **Suasana Rumah Lebih Segar** - Setelah deep cleaning, rumah akan terasa lebih bersih dan wangi.`,
      coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
      author: 'Admin Ningclean',
      tags: ['Deep Cleaning', 'Kebersihan', 'Health'],
      publishedAt: new Date('2026-03-25'),
    },
    {
      slug: 'cara-merawat-sofa',
      title: 'Cara Merawat Sofa Agar Tetap Awet dan Bersih',
      excerpt: 'Tips dan trik merawat sofa kesayangan Anda agar tetap awet dan bersih sepanjang waktu.',
      content: `Sofa adalah salah satu furniture yang paling sering digunakan di rumah.

**Tips Merawat Sofa:**

1. **Vacuum Secara Rutin** - Gunakan vacuum cleaner dengan nosel khusus upholstery untuk mengangkat debu.

2. **Segera Tangani Noda** - Ketika tumpahan terjadi, lap segera dengan kain bersih yang sedikit lembab.

3. **Gunakan Sarung Sofa** - Sarung sofa pelindung dapat membantu menjaga sofa dari noda dan debu.

4. **Jauhkan dari Sinar Matahari Langsung** - Paparan sinar matahari langsung dapat menyebabkan warna sofa memudar.

5. **Deep Cleaning Profesional** - Setidaknya 2-3 kali setahun, berikan sofa Anda treatment deep cleaning profesional.`,
      coverImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
      author: 'Admin Ningclean',
      tags: ['Sofa Cleaning', 'Perawatan', 'Tips'],
      publishedAt: new Date('2026-03-22'),
    },
    {
      slug: '5-tanda-rumah-butuh-deep-cleaning',
      title: '5 Tanda Rumah Anda Butuh Deep Cleaning Segera',
      excerpt: 'Kenali 5 tanda bahwa rumah Anda membutuhkan deep cleaning segera.',
      content: `Rumah yang bersih bukan hanya soal estetika, tapi juga kesehatan.

**5 Tanda Rumah Anda Butuh Deep Cleaning:**

1. **Bau Tidak Sedap yang Persisten** - Jika rumah mulai mengeluarkan bau apek atau bau tidak sedap lainnya meski sudah dibersihkan.

2. **Alergi Sering Kambuh** - Debu, tungau, dan alergen bisa menumpuk di carpet, sofa, dan kasur.

3. **Noda Membandel yang Sulit Dihilangkan** - Noda di lantai atau furniture yang tidak mau hilang dengan cleaning biasa.

4. **Lantai dan Dinding Kusam** - Lantai rumah terlihat kusam meski sudah dipel.

5. **Persiapan Acara atau Tamu** - Deep cleaning sebelum acara memastikan rumah benar-benar bersih.`,
      coverImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80',
      author: 'Admin Ningclean',
      tags: ['Deep Cleaning', 'Health', 'Tips'],
      publishedAt: new Date('2026-03-20'),
    },
    {
      slug: 'panduan-memilih-jasa-cleaning-service',
      title: 'Panduan Memilih Jasa Cleaning Service yang Tepat',
      excerpt: 'Bagaimana memilih jasa cleaning service yang tepat untuk rumah Anda?',
      content: `Memilih jasa cleaning service yang tepat bisa menjadi tantangan tersendiri.

**Tips Memilih Jasa Cleaning Service:**

1. **Cek Review dan Testimoni** - Baca review dari pelanggan sebelumnya.

2. **Pastikan Ada Garansi** - Jasa cleaning yang percaya diri biasanya menawarkan garansi.

3. **Tenaga Kerja Terlatih** - Pastikan perusahaan melakukan pelatihan internal untuk stafnya.

4. **Peralatan dan Bahan Berkualitas** - Perusahaan profesional menggunakan peralatan modern.

5. **Transparansi Harga** - Hindari jasa yang memberikan harga terlalu murah atau tidak jelas.

**Mengapa Memilih Ningclean?**

- ✅ 5+ tahun pengalaman
- ✅ 2000+ pelanggan puas
- ✅ Tim terlatih dan profesional
- ✅ Garansi layanan`,
      coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
      author: 'Admin Ningclean',
      tags: ['Tips', 'Layanan', 'Cleaning'],
      publishedAt: new Date('2026-03-18'),
    },
    {
      slug: 'draft-membersihkan-kamar-mandi',
      title: 'Tips Membersihkan Kamar Mandi Seperti Hotel Bintang 5',
      excerpt: 'Kamar mandi bersih seperti hotel bintang 5? Ini rahasia yang jarang orang tahu.',
      content: `Kamar mandi adalah salah satu area paling penting di rumah yang sering terabaikan.

1. **Gunakan Sarung Tangan** - Lindungi tangan Anda dengan sarung tangan karet.

2. **Mulai dari Atas ke Bawah** - Bersihkan dari ceiling, dinding, sampai lantai.

3. **Siram WC Terakhir** - Ini mencegah kontaminasi silang.

4. **Gunakan Cuka untuk Kerak** - Campuran cuka dan baking soda sangat efektif untuk kerak.

5. **Ventilasi yang Baik** - Pastikan exhaust fan menyala atau jendela terbuka.`,
      coverImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80',
      author: 'Admin Ningclean',
      tags: ['Tips', 'Kamar Mandi', 'Cleaning'],
    },
  ];

  for (const post of blogPosts) {
    const contentLength = post.content.split(' ').length;
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        readTime: Math.ceil(contentLength / 200),
      },
    });
  }
  console.log('✅ Blog posts created:', blogPosts.length);

  // Create Testimonials
  const testimonials = [
    {
      name: 'Sari Dewi',
      content: 'Pelayanan sangat memuaskan! Rumah saya bersih maksimal setelah deep cleaning. Timnya ramah dan profesional.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      isActive: true,
    },
    {
      name: 'Ahmad Rizki',
      content: 'Sudah 3 kali pakai Ningclean, selalu puas dengan hasilnya. Sofa seperti baru lagi!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      isActive: true,
    },
    {
      name: 'Maya Putri',
      content: 'Booking via online gampang, harganya transparan. Recommended!',
      rating: 4,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
      isActive: true,
    },
    {
      name: 'Budi Santoso',
      content: 'Kantor kami selalu dibersihkan setiap minggu. Staff nya tepat waktu dan hasilnya bagus.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
      isActive: true,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial,
    });
  }
  console.log('✅ Testimonials created:', testimonials.length);

  // Create Sample Bookings
  const deepCleaning = await prisma.service.findFirst({ where: { slug: 'deep-cleaning-rumah' } });
  const regularCleaning = await prisma.service.findFirst({ where: { slug: 'regular-cleaning-harian' } });
  const officeCleaning = await prisma.service.findFirst({ where: { slug: 'office-cleaning-harian' } });
  
  if (deepCleaning && regularCleaning && officeCleaning) {
    const bookings = [
      {
        orderNumber: 'NC-2026-0001',
        customerId: customer.id,
        serviceDate: new Date('2026-04-02'),
        serviceTime: '09:00',
        address: 'Jl. Sudirman No. 123, Jakarta Selatan',
        area: 'Jakarta Selatan',
        status: BookingStatus.PENDING,
        totalAmount: 750000,
        notes: 'Minta cleaning crew nya hati-hati dengan furniture antique',
      },
      {
        orderNumber: 'NC-2026-0002',
        customerId: customer.id,
        serviceDate: new Date('2026-03-28'),
        serviceTime: '14:00',
        address: 'Jl. Thamrin No. 456, Jakarta Pusat',
        area: 'Jakarta Pusat',
        status: BookingStatus.COMPLETED,
        totalAmount: 300000,
      },
      {
        orderNumber: 'NC-2026-0003',
        customerId: customer.id,
        serviceDate: new Date('2026-03-30'),
        serviceTime: '10:00',
        address: 'BSD Sector 1, Tangerang',
        area: 'Tangerang',
        status: BookingStatus.IN_PROGRESS,
        totalAmount: 1500000,
      },
    ];

    for (const booking of bookings) {
      const created = await prisma.booking.create({
        data: booking,
      });
      
      // Create booking items
      const serviceMap: Record<string, typeof deepCleaning> = {
        'NC-2026-0001': deepCleaning,
        'NC-2026-0002': regularCleaning,
        'NC-2026-0003': officeCleaning,
      };
      const service = serviceMap[booking.orderNumber];
      
      if (service) {
        await prisma.bookingItem.create({
          data: {
            bookingId: created.id,
            serviceId: service.id,
            quantity: 1,
            price: service.price,
          },
        });
      }
    }
    console.log('✅ Bookings created:', bookings.length);
  }

  console.log('\n🎉 Seeding completed!');
  console.log('\n📧 Login credentials:');
  console.log('   Admin:    admin@ningclean.com / admin123');
  console.log('   Customer: customer@test.com / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
