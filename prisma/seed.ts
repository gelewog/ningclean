import { PrismaClient, Role, BookingStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.bookingItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ningclean.id',
      name: 'Admin Ningclean',
      phone: '081234567890',
      password: adminPassword,
      role: Role.ADMIN,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });
  console.log('✅ Created admin user');

  // Create Customer Users
  const customerPassword = await bcrypt.hash('cust123', 10);
  const customers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'customer1@ningclean.id',
        name: 'Budi Santoso',
        phone: '081234567891',
        password: customerPassword,
        role: Role.CUSTOMER,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=budi',
      },
    }),
    prisma.user.create({
      data: {
        email: 'customer2@ningclean.id',
        name: 'Siti Rahayu',
        phone: '081234567892',
        password: customerPassword,
        role: Role.CUSTOMER,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=siti',
      },
    }),
    prisma.user.create({
      data: {
        email: 'customer3@ningclean.id',
        name: 'Ahmad Wijaya',
        phone: '081234567893',
        password: customerPassword,
        role: Role.CUSTOMER,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad',
      },
    }),
  ]);
  console.log('✅ Created 3 customer users');

  // Create Services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Home Cleaning',
        slug: 'home-cleaning',
        description: 'Layanan pembersihan rumah tangga harian. Termasuk menyapu, mengepel, membersihkan kamar mandi, dan menata ruangan. Cocok untuk maintenance kebersihan rumah secara rutin.',
        price: 150000,
        duration: 180,
        icon: 'home',
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Deep Cleaning',
        slug: 'deep-cleaning',
        description: 'Pembersihan menyeluruh dan mendalam untuk seluruh rumah. Membersihkan area yang sulit dijangkau, membersikan noda membandel, dan消毒 seluruh permukaan. Ideal untuk rumah yang jarang dibersihkan atau sebelum/after acara besar.',
        price: 300000,
        duration: 360,
        icon: 'sparkles',
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Move In/Out Cleaning',
        slug: 'move-in-out-cleaning',
        description: 'Layanan pembersihan khusus untuk rumah sebelum ditinggali atau setelah ditinggali. Pastikan rumah dalam kondisi bersih sempurna untuk penghuni baru atau saat menyerahkan kunci.',
        price: 500000,
        duration: 480,
        icon: 'truck',
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Office Cleaning',
        slug: 'office-cleaning',
        description: 'Pembersihan kantor dan ruang kerja profesional. Termasuk pembersihan meja kerja, area bersama, kamar mandi kantor, dan dapur. Jadwal fleksibel bisa disesuaikan dengan jam operasional kantor.',
        price: 200000,
        duration: 240,
        icon: 'building',
        isActive: true,
      },
    }),
  ]);
  console.log('✅ Created 4 services');

  // Create Blog Posts (in Bahasa Indonesia)
  const blogPosts = await Promise.all([
    prisma.blogPost.create({
      data: {
        slug: 'tips-membersihkan-rumah-cepat-dan-efektif',
        title: '10 Tips Membersihkan Rumah dengan Cepat dan Efektif',
        excerpt: '清理 rumah sering kali terasa melelahkan, tapi dengan strategi yang tepat, Anda bisa mendapatkan rumah bersih dalam waktu singkat. Berikut tips terbaik dari tim Ningclean.',
        content: `清理 rumah doesn't have to be a daunting task. Dengan pendekatan yang sistematis, Anda bisa membersihkan seluruh rumah dalam waktu 1-2 jam saja.

## 1. Buat Daftar Tugas
Sebelum mulai, buat daftar areas yang perlu dibersihkan. Ini membantu Anda tetap fokus dan tidak terjebak dalam satu area terlalu lama.

## 2. Mulai dari Atas ke Bawah
Selalu mulai dari area tertinggi (seperti rak dan langit-langit) menuju ke bawah. Debu dan kotoran akan jatuh dan bisa dibersihkan terakhir.

## 3. Gunakan Metode "Top to Bottom"
Bersihkan rak terlebih dahulu, lalu meja, dan terakhir lantai. Ini mencegah membersihkan ulang area yang sudah bersih.

## 4. Siapkan Semua Perlengkapan
Pastikan Anda memiliki semua alat pembersih sebelum mulai. Tidak ada yang lebih menyebalkan daripada setengah jalan kemudian sadar Anda lupa membawa kain pel.

## 5. Terapkan Metode 15 Menit
Tetapkan timer 15 menit untuk setiap area. Tekanan waktu membantu Anda tetap efisien.

## 6. Bersihkan Satu Ruangan Sekaligus
Jangan beralih ke ruangan lain sebelum satu ruangan selesai. Ini memberi kepuasan visual yang memotivasi.

## 7. Gunakan Musik sebagai Timer
Pilih playlist dengan lagu-lagu 3-4 menit. Setiap lagu = satu tugas kecil selesai.

## 8. Delegasi Jika Perlu
Jika tinggal bersama keluarga, bagi tugas. Anak-anak bisa membantu merapihkan mainan, pasangan bisa mengepel.

## 9. Maintenance Harian
Lakukan sedikit pembersihan setiap hari. 10-15 menit sehari lebih baik daripada 2 jam di akhir pekan.

## 10. Jasa Profesional
Untuk hasil maksimal, gunakan jasa cleaning profesional seperti Ningclean. Tim kami terlatih dan menggunakan peralatan terbaik.

---

清理 rumah dengan cepat membutuhkan latihan dan konsistensi. Mulailah dengan menerapkan tips di atas, dan tingkatkan efisiensi Anda dari waktu ke waktu!`,
        coverImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
        author: 'Tim Ningclean',
        tags: ['tips', 'cleaning', 'rumah-tangga'],
        readTime: 5,
      },
    }),
    prisma.blogPost.create({
      data: {
        slug: 'perbedaan-home-cleaning-dan-deep-cleaning',
        title: 'Apa Bedanya Home Cleaning dan Deep Cleaning?',
        excerpt: 'Banyak yang bingung memilih antara home cleaning dan deep cleaning. Ningclean jelaskan perbedaannya agar Anda bisa memilih layanan yang tepat sesuai kebutuhan.',
        content: `Ketika mencari jasa pembersihan rumah, Anda mungkin sering menemukan dua istilah: home cleaning dan deep cleaning. Keduanya terdengar mirip, tapi sebenarnya sangat berbeda.

## Home Cleaning: Perawatan Rutin

Home cleaning adalah layanan pembersihan rutin yang menjaga kebersihan rumah sehari-hari. Ini termasuk:

- **Menyapu dan mengepel lantai**
- **Membersihkan debu di permukaan**
- **Merapikan ruangan**
- **Membersihkan kamar mandi**
- **Mengosongkan tempat sampah**
- **Membersihkan dapur поверхностный**

### Kapan Waktu yang Tepat?
Home cleaning ideal untuk:
- Mingguan atau dua minggu sekali
- Sebelum atau dopo acara kecil
- Maintenance kebersihan rumah

---

## Deep Cleaning: Pembersihan Menyeluruh

Deep cleaning adalah pembersihan intensif yang mencapai area yang sering terlewatkan. Ini termasuk:

- **Membersihkan bagian belakang dan bawah perabotan**
- **Menghilangkan noda membandel**
- **Membersihkan ventilasi AC**
- **Mencuci window (bagian dalam)**
- **Membersihkan karpet dan sofa secara mendalam**
- **Menghilangkan debu di sudut-sudut tersembunyi**
- **Desinfektan menyeluruh**

### Kapan Waktu yang Tepat?
Deep cleaning diperlukan untuk:
- Primero membersihkan rumah baru
-Setelah renovasi atau pembangunan
- Musim hujan dove humidity tinggi
- Sebelum acara besar atau setelah guests panjang
- Rumah yang tidak berpenghuni lama

---

## Perbandingan Ringkas

| Aspek | Home Cleaning | Deep Cleaning |
|-------|---------------|---------------|
| Durasi | 2-3 jam | 4-8 jam |
| Area cakupan | Permukaan terlihat | Seluruh rumah termasuk area tersembunyi |
| Frekuensi ideal | Mingguan | Bulanan atau sesuai kebutuhan |
| Harga | Lebih terjangkau | Lebih tinggi |
| Peralatan | Basic | Specialized + chemical |

---

## Rekomendasi dari Ningclean

Untuk rumah tangga dengan anak kecil atau hewan peliharaan, kami sarankan:
- **Home cleaning mingguan** untuk maintenance
- **Deep cleaning bulanan** untuk kebersihan mendalam

Dengan kombinasi keduanya, rumah Anda akan selalu dalam kondisi bersih dan sehat!

Hubungi Ningclean di 0812-3456-7890 untuk konsultasi gratis.`,
        coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        author: 'Tim Ningclean',
        tags: ['deep-cleaning', 'home-cleaning', 'jasa-cleaning'],
        readTime: 6,
      },
    }),
    prisma.blogPost.create({
      data: {
        slug: 'tips-merawat-kebersihan-kamar-mandi',
        title: '5 Tips Merawat Kebersihan Kamar Mandi yang Sering Dilewatkan',
        excerpt: 'Kamar mandi adalah area palingjenuh bakteria di rumah. Berikut tips completa untuk menjaga kamar mandi tetap bersih dan sehat.',
        content: `Kamar mandi adalah tempat paling lembab di rumah Anda, مما menjadikannya sarang ideal untuk bakteri, jamur, dan bau tidak sedap. Dengan perawatan yang tepat, Anda bisa menjaga kamar mandi tetap bersih dan higienis.

## 1. Bersihkan grout (nat) Secara Rutin

Grout atau nat adalaharea yang sering ditumbuhi jamur. Solusinya:
- Gunakan campuran baking soda + cuka
- Sikat dengan sikat gigi bekas setiap minggu
- APLICEOn anti-jamur secara berkala

## 2. Jaga Ventilasi Kamar Mandi

Air genangan dan kelembaban tinggi adalah masalah utama. Pastikan:
- Exhaust fan menyala saat dan dopo mandi
- Buka jendel jika ada
- Gunakan dehumidifier jika kamar mandi tanpa jendela
- Lap dinding dan floor después de cada uso

## 3. Bersihkan Shower Head

Shower head sering kali penuh dengan endapan mineral dan bakteri:
- Rendam dalam cuka selama 30 menit
- Sikat bagian dalam dengan sikat kecil
- Bilas dengan air bersih
- Lakukan ini setiap bulan

## 4. Jangan Lupakanembersihkan Dispenser Sabun

Dispenser sabun cair bisa menjadi tempat perkembangbiakan bakteri:
- Bersihkan bagian luar setiap minggu
- Isi ulang dengan sabun segar secara berkala
- Cuci container setiap kali refill
- Pertimbangkan penggunaan soap dispenser otomatis

## 5. Membersihkan WC dengan Benar

Toilet adalah sumber bakteri utama:
- Sikat bagian dalam setiap 2-3 hari
- Bersihkan under rim setiap minggu
- Gunakan tablet cleaner dalam tangki
- Jangan lupa membersihkan flush handle
- Semprot Disinfektan pada seat dan outer

---

## Bonus: Checklist Kebersihan Kamar Mandi

Harian:
- [ ] Flush dan semprot permukaan
- [ ] Lap counter dan sink
- [ ] Gantung handuk dengan benar

Mingguan:
- [ ] Sikat toilet
- [ ] Bersihkan mirror
- [ ] Cuci floor dengan disinfektan
- [ ] Bersihkan grout

Bulanan:
- [ ] Deep clean shower/tub
- [ ] Bersihkan exhaust fan
- [ ] Cuci curtain shower
- [ ] inventory perlengkapan kamar mandi

---

Dengan mengikuti tips ini, kamar mandi Anda akan selalu dalam kondisi bersih dan menyegarkan. Jika Anda tidak punya waktu untuk cleaning mendalam, Ningclean siap membantu dengan layanan deep cleaning khusus kamar mandi!`,
        coverImage: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800',
        author: 'Tim Ningclean',
        tags: ['kamar-mandi', 'cleaning', 'higiene'],
        readTime: 7,
      },
    }),
    prisma.blogPost.create({
      data: {
        slug: 'manfaat-jasa-cleaning-profesional',
        title: 'Kenapa Harus Pakai Jasa Cleaning Profesional? Ini 7 Manfaatnya!',
        excerpt: '清理 sendiri atau panggil profesional? Berikut 7 alasan mengapa jasa cleaning profesional like Ningclean adalah investasi yang worth it для дома.',
        content: `Di era yang sibuk ini, waktu adalah commodities paling valuable. Banyak orang mempertanyakan apakah menggunakan jasa cleaning profesional worth the investment. Jawabannya? Jelas iya! Berikut 7 manfaat menggunakan jasa cleaning profesional.

## 1. Hemat Waktu dan Energi

Dengan menggunakan jasa profesional, Anda bisa fokus pada hal-hal yang lebih penting:
- Kerjaan yang produktif
- Quality time bersama keluarga
- Hobby dan self-improvement
- Istirahat yang cukup

Bayangkan: 4 jam cleaning weekend = 4 jam quality time dengan keluarga

## 2. Hasil yang Lebih Bersih dan Mendalam

Tim professional memiliki:
- Pengalaman dan teknik yang terasah
- Peralatan industry-grade
- Cleaning solutions yang efektif
- Standar operating procedures yang ketat

Hasilnya? Rumah benar-benar bersih, bukan hanya terlihat bersih.

## 3. Kesehatan yang Lebih Baik

Rumah yang bersih = lingkungan yang lebih sehat:
- Mengurangi alergen (debu, serbuk sari, bulu hewan)
- Menghilangkan bakteri dan virus
- Mencegah pertumbuhan jamur dan lumut
- Kualitas udara dalam ruangan lebih baik

## 4. Mengurangi Stres

Tahukah Anda bahwa rumah berantakan meningkatkan cortisol (hormon stres)? Dengan rumah yang selalu bersih:
- Pikiran lebih tenang
- Fokus meningkat
- Kualitas tidur lebih baik
- Produktivitas meningkat

## 5. Perawatan Proaktif

Tim cleaning profesional bisa mendeteksi masalah awal:
- Kebocoran air yang tersembunyi
- Kerusakan permukaan yang perlu diperbaiki
- Area yang butuh maintenance khusus
- Potensi hazard keselamatan

## 6. Fleksibilitas dan Konsistensi

Jasa professional menawarkan:
- Jadwal yang fleksibel (harian, mingguan, bulanan)
- Customisasi layanan sesuai kebutuhan
- Konsistensi kualitas
- Garansi kepuasan

## 7. Efisiensi Biaya

Meskipun terlihat como biaya tambahan:
- Tidak perlu beli peralatan cleaning mahal
- Tidak perlu beli cleaning supplies berkualitas tinggi
- Nilai tambah property lebih tinggi
- Menghindari biaya perbaikan akibat kurang cleaning

---

## Data yang Perlu Anda Tahu

- Rata-rata orang menghabiskan **6 hours per minggu** untuk cleaning
- 65% orang merasa stressed ketika rumah berantakan
- Rumah yang bersih dapat meningkatkan productivity hingga **20%**
- Jasa cleaning profesional bisa menghemat hingga **100+ hours per tahun**

---

## Mulai Sekarang!

Jangan biarkan cleaning menjadi beban. Biarkan profesional menangani enquanto Anda fokus pada hal-hal yang lebih penting.

**Ningclean** menawarkan:
- ✅ Team terlatih dan professional
- ✅ Peralatan dan produk berkualitas
- ✅ Harga transparan, tanpa biaya tersembunyi
- ✅ Satisfaction guarantee
- ✅ Konsultasi gratis

Hubungi kami di 0812-3456-7890 atau visit ningclean.id untuk informasi lebih lanjut!

清理 rumah bukan lagi beban. Biarkan profesional yang handle!`,
        coverImage: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800',
        author: 'Tim Ningclean',
        tags: ['jasa-cleaning', 'profesional', 'benefits'],
        readTime: 6,
      },
    }),
    prisma.blogPost.create({
      data: {
        slug: 'cleaning-rumah-sebelum-pindah',
        title: 'Cleaning Rumah Sebelum Pindah: Checklist Lengkap yang Perlu Anda Siapkan',
        excerpt: 'Bergerak ke rumah baru? Cleaning sebelum pergi非常重要! Berikut checklist lengkap agar rumah lama bersih sempurna dan Anda bisa serah terima dengan tenang.',
        content: `Memindahkan rumah adalah proses yang melelahkan. Di antara semua tugas persiapan, cleaning rumah lama sering diabaikan. Padahal, rumah bersih saat ditinggalkan adalah etika dan akan memudahkan proses serah terima.

## Checklist Cleaning Move-Out

### Kitchen (Dapur) 🍳

1. **Lemari dan Drawer**
   - [ ] Kosongkan semua lemari
   - [ ] Bersihkan shelf dengan disinfektan
   - [ ] Hilangkan semua food items
   - [ ] Bersihkan drawer dari remah dan kotoran

2. **Equipment**
   - [ ] Bersihkan stove/kompor
   - [ ] Deep clean oven
   - [ ] Bersihkan microwave
   - [ ] Kuras dan bersihkan kulkas
   - [ ] Bersihkan dishwasher (jika ada)
   - [ ] Lap permukaan counter

3. **Sink dan Faucet**
   - [ ] Bersihkan wastafel
   - [ ] Hilangkan noda waterhardness
   - [ ] Pastikan faucet dalam kondisi baik

### Kamar Mandi 🛁

1. **Toilet**
   - [ ] Sikat dan bersihkan thoroughly
   - [ ] Gunakan tablet cleaner
   - [ ] Bersihkan outer dan flush

2. **Shower/Tub**
   - [ ] Deep clean shower area
   - [ ] Hilangkan jamur dan noda
   - [ ] Bersihkan curtain/shower door

3. **General**
   - [ ] Bersihkan mirror
   - [ ] Lap dinding dan floor
   - [ ] Kosongkan dan bersihkan storage

### Living Areas (Area Tamu) 🛋️

1. **General**
   - [ ] Singkirkan semua furniture
   - [ ] Vakum seluruh lantai
   - [ ] Mop semua lantai
   - [ ] Bersihkan jendela (bagian dalam)

2. **Detail**
   - [ ] Bersihkan switch dan outlet covers
   - [ ] Lap baseboards
   - [ ] Hilangkan cobwebs
   - [ ] Bersihkan ceiling fans (jika ada)

### Kamar Tidur 🛏️

1. **Space**
   - [ ] Kosongkan closet
   - [ ] Vakum carpet/ lantai
   - [ ] Bersihkan wardrobes inside

2. **Windows**
   - [ ] Bersihkan windows
   - [ ] Cuci curtains/blinds
   - [ ] Lap sill windows

### Outside Area (Area Luar) 🌳

1. **Yard (if applicable)**
   - [ ] Bersihkan leaves/debris
   - [ ] Potong rumput
   - [ ] Rapi kan tanaman

2. **Garasi/Patio**
   - [ ] Kosongkan dan sweep
   - [ ] Bersihkan oil stains (jika ada)
   - [ ] Rapikan tools

### Final Walkthrough 🔍

Sebelum serah terima final:
- [ ] Ambil foto semua area
- [ ] Buat video walkthrough
- [ ] Pastikan semua kunci tersedia
- [ ] Cabut semua utility accounts
- [ ] Beri tahu neighbor tentang moving date

---

## Tips Pro dari Ningclean

1. **Mulai Early** - Jangan tunggu last minute. Mulai cleaning 1-2 minggu sebelum moving date.

2. **Room by Room** - Fokus satu ruangan penuh sebelum pindah ke berikutnya.

3. **Dokumentasi** - Ambil foto sebelum dan dopo cleaning untuk comparison.

4. **Professional Help** - Untuk hasil terbaik, gunakan jasa deep cleaning profesional.

---

## Kenapa Move-Out Cleaning Penting?

- **Deposit Return** - Banyak landlord требует rumah bersih untuk refund deposit
- **Etika** - Hormati penghuni berikutnya dengan rumah bersih
- **Peace of Mind** - Anda bisa pindah dengan tenang tanpa kekhawatiran
- **Reputation** - Rumah bersih meningkatkan reputation Anda sebagai penyewa

---

## Layanan Ningclean untuk Move-Out

Ningclean menawarkan special **Move In/Out Cleaning Package**:
- ✅ Deep cleaning menyeluruh
- ✅ Tim experienced dan professional
- ✅ Peralatan lengkap
- ✅ Garansi kepuasan
- ✅ Harga transparan

Untuk reservasi dan konsultasi, hubungi 0812-3456-7890 atau booking melalui website kami!

Moving doesn't have to be stressful. Mulai dengan rumah bersih, akhiri dengan tenang!`,
        coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        author: 'Tim Ningclean',
        tags: ['move-in-out', 'cleaning', 'pindah-rumah'],
        readTime: 8,
      },
    }),
  ]);
  console.log('✅ Created 5 blog posts');

  // Create Bookings (10 sample bookings with various statuses)
  const orderNumbers = ['NC-2024-0001', 'NC-2024-0002', 'NC-2024-0003', 'NC-2024-0004', 'NC-2024-0005', 'NC-2024-0006', 'NC-2024-0007', 'NC-2024-0008', 'NC-2024-0009', 'NC-2024-0010'];
  const statuses = [BookingStatus.COMPLETED, BookingStatus.COMPLETED, BookingStatus.COMPLETED, BookingStatus.CONFIRMED, BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS, BookingStatus.PENDING, BookingStatus.PENDING, BookingStatus.CANCELLED, BookingStatus.PENDING];

  const bookingsData = [
    {
      orderNumber: orderNumbers[0],
      customerId: customers[0].id,
      status: statuses[0],
      serviceDate: new Date('2024-01-15'),
      serviceTime: '09:00',
      address: 'Jl. Melati No. 12, RT 01/RW 05, Jakarta Selatan',
      area: '50 m²',
      notes: 'Mohon arriving tepat waktu',
      totalAmount: 300000,
      items: [
        { serviceId: services[1].id, quantity: 1, price: 300000 },
      ],
    },
    {
      orderNumber: orderNumbers[1],
      customerId: customers[0].id,
      status: statuses[1],
      serviceDate: new Date('2024-01-22'),
      serviceTime: '10:00',
      address: 'Jl. Melati No. 12, RT 01/RW 05, Jakarta Selatan',
      area: '50 m²',
      notes: 'Weekly maintenance cleaning',
      totalAmount: 150000,
      items: [
        { serviceId: services[0].id, quantity: 1, price: 150000 },
      ],
    },
    {
      orderNumber: orderNumbers[2],
      customerId: customers[1].id,
      status: statuses[2],
      serviceDate: new Date('2024-01-20'),
      serviceTime: '08:00',
      address: 'Jl. Anggrek Blok C3 No. 8, Bandung',
      area: '75 m²',
      notes: 'Deep cleaning sebelum acara keluarga',
      totalAmount: 300000,
      items: [
        { serviceId: services[1].id, quantity: 1, price: 300000 },
      ],
    },
    {
      orderNumber: orderNumbers[3],
      customerId: customers[2].id,
      status: statuses[3],
      serviceDate: new Date('2024-02-01'),
      serviceTime: '13:00',
      address: 'Jl. Sudirman No. 45, RT 02/RW 03, Surabaya',
      area: '120 m²',
      notes: 'Cleaning kantor lantai 2',
      totalAmount: 400000,
      items: [
        { serviceId: services[3].id, quantity: 2, price: 200000 },
      ],
    },
    {
      orderNumber: orderNumbers[4],
      customerId: customers[1].id,
      status: statuses[4],
      serviceDate: new Date('2024-02-05'),
      serviceTime: '09:00',
      address: 'Jl. Anggrek Blok C3 No. 8, Bandung',
      area: '75 m²',
      notes: 'Pembersihan setelah acara ulang tahun',
      totalAmount: 500000,
      items: [
        { serviceId: services[2].id, quantity: 1, price: 500000 },
      ],
    },
    {
      orderNumber: orderNumbers[5],
      customerId: customers[0].id,
      status: statuses[5],
      serviceDate: new Date('2024-02-10'),
      serviceTime: '08:00',
      address: 'Jl. Melati No. 12, RT 01/RW 05, Jakarta Selatan',
      area: '50 m²',
      notes: 'Monthly deep cleaning',
      totalAmount: 300000,
      items: [
        { serviceId: services[1].id, quantity: 1, price: 300000 },
      ],
    },
    {
      orderNumber: orderNumbers[6],
      customerId: customers[2].id,
      status: statuses[6],
      serviceDate: new Date('2024-02-15'),
      serviceTime: '10:00',
      address: 'Jl. Sudirman No. 45, RT 02/RW 03, Surabaya',
      area: '120 m²',
      notes: 'Kantor akan buka jam 8 pagi',
      totalAmount: 200000,
      items: [
        { serviceId: services[3].id, quantity: 1, price: 200000 },
      ],
    },
    {
      orderNumber: orderNumbers[7],
      customerId: customers[1].id,
      status: statuses[7],
      serviceDate: new Date('2024-02-20'),
      serviceTime: '14:00',
      address: 'Jl. Anggrek Blok C3 No. 8, Bandung',
      area: '75 m²',
      notes: 'Weekly home cleaning',
      totalAmount: 150000,
      items: [
        { serviceId: services[0].id, quantity: 1, price: 150000 },
      ],
    },
    {
      orderNumber: orderNumbers[8],
      customerId: customers[0].id,
      status: statuses[8],
      serviceDate: new Date('2024-01-10'),
      serviceTime: '09:00',
      address: 'Jl. Melati No. 12, RT 01/RW 05, Jakarta Selatan',
      area: '50 m²',
      notes: 'Cancelled due to scheduling conflict',
      totalAmount: 150000,
      items: [
        { serviceId: services[0].id, quantity: 1, price: 150000 },
      ],
    },
    {
      orderNumber: orderNumbers[9],
      customerId: customers[2].id,
      status: statuses[9],
      serviceDate: new Date('2024-02-25'),
      serviceTime: '11:00',
      address: 'Jl. Sudirman No. 45, RT 02/RW 03, Surabaya',
      area: '120 m²',
      notes: 'Move out cleaning - handover tanggal 26 Feb',
      totalAmount: 500000,
      items: [
        { serviceId: services[2].id, quantity: 1, price: 500000 },
      ],
    },
  ];

  for (const bookingData of bookingsData) {
    const { items, ...booking } = bookingData;
    await prisma.booking.create({
      data: {
        ...booking,
        items: {
          create: items,
        },
      },
    });
  }
  console.log('✅ Created 10 bookings with various statuses');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
