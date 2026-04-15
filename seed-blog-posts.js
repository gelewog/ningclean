const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const posts = [
  {
    title: "5 Tips Sederhana Menjaga Kebersihan Rumah Setiap Hari",
    slug: "5-tips-sederhana-menjaga-kebersihan-rumah",
    excerpt: "Kebersihan rumah bukan cuma soal menyapu dan mengepel. Ada trik simpel yang bisa kamu lakuin setiap hari biar rumah tetap nyaman.",
    content: `Kebersihan rumah itu nggak harus ribet. Cukup lakukan 5 hal sederhana ini setiap hari, dan rumahmu akan selalu terasa nyaman:

## 1. Buang Sampah Sebelum Tidur
Jangan biarkan sampah menumpuk di malam hari. Buang sebelum tidur biar pagi bangun udah fresh.

## 2. Lap Meja Makan Setelah Makan
Habiskan 2 menit buat lap meja makan. Noda yang dibiarkan bakal makin susah dibersihin.

## 3. Ranjang yang Rapi
Ranjang yang dirapikan pagi-pagi bikin kamar terlihat lebih bersih seketika. Plus, mood langsung naik!

## 4. Cucian Harian
Kalau ada cucian, langsung cuci atau setidaknya rendam. Jangan ditumpuk-tumpuk.

## 5. Ventilasi yang Cukup
Buka jendela minimal 15 menit sehari. Udara segar = rumah yang sehat.

**Kesimpulan:** Konsistensi itu kunci. Lakukan hal-hal kecil setiap hari, dan nggak perlu deep cleaning besar-besaran setiap minggu.`,
    categoryId: "7a912465-e402-4681-a959-2fdfb58342e3",
    coverImage: "https://images.unsplash.com/photo-1558317374-a353980e80b9?w=800",
    author: "Admin NingClean",
    status: "PUBLISHED",
    readTime: 5,
    tags: ["tips", "kebersihan", "rumah", "daily"]
  },
  {
    title: "Deep Cleaning: Kenapa Harus Dilakukan Minimal 2x Setahun?",
    slug: "deep-cleaning-kenapa-harus-dilakukan",
    excerpt: "Deep cleaning bukan cuma soal estetika. Ini soal kesehatan dan perlindungan investasi rumahmu.",
    content: `Banyak yang pikir deep cleaning cuma buat rumah kelihatan bagus. Padahal, manfaatnya jauh lebih dalam:

## Menghilangkan Alergen Tersembunyi
Debu, tungau, dan jamur sering ngumpet di tempat yang nggak kelihatan. Deep cleaning bisa ngebersihin area-area itu.

## Memperpanjang Umur Perabotan
Sofa, karpet, dan spring bed yang dibersihin secara berkala bakal lebih awet. Noda dan debu yang menumpuk bisa merusak material.

## Kesehatan Mental yang Lebih Baik
Ruang yang bersih bikin pikiran lebih jernih. Studi nunjukin korelasi kuat antara kebersihan dan kesejahteraan mental.

## Kapan Waktunya?
- **Musim hujan selesai:** Buat ngilangin jamur yang berkembang biak
- **Sebelum Lebaran/Natal:** Rumah siap buat tamu
- **Setelah renovasi:** Debu konstruksi harus dibersihin total

## DIY atau Panggil Profesional?
Kalau rumah kecil dan waktu luang, DIY bisa. Tapi untuk hasil maksimal dan menghemat waktu, profesional lebih worth it.`,
    categoryId: "020396f6-1f40-4716-b5da-9b8d7d3b539d",
    coverImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
    author: "Admin NingClean",
    status: "PUBLISHED",
    readTime: 7,
    tags: ["deep cleaning", "maintenance", "health"]
  },
  {
    title: "Cara Tepat Merawat Sofa Kulit Agar Tetap Mengkilap",
    slug: "cara-tepat-merawat-sofa-kulit",
    excerpt: "Sofa kulit memang elegan, tapi butuh perawatan khusus. Simak tips merawatnya biar awet bertahun-tahun.",
    content: `Sofa kulit investasi yang cukup mahal. Biar awet dan tetap mengkilap, ikuti panduan perawatan ini:

## Pembersihan Rutin (Mingguan)
- Lap dengan kain microfiber kering
- Gunakan vacuum dengan brush attachment di celah-celah
- Hindari produk berbasis alkohol yang bisa bikin kulit kering

## Perawatan Bulanan
- Aplikasikan leather conditioner setiap 1-2 bulan
- Cek ada noda atau goresan yang perlu diperbaiki
- Jauhkan dari sinar matahari langsung

## Menghilangkan Noda
| Jenis Noda | Solusi |
|------------|--------|
| Tinta | Tepung bedak + alkohol isopropil (hati-hati) |
| Minyak | Bedak bayi, biarkan semalaman |
| Air | Keringkan dengan kain kering, jangan digosok |
| Makanan | Lap basah + sabun mild |

## Kesalahan Umum
- Menggunakan deterjen biasa
- Menyemprot langsung ke kulit
- Menggosok terlalu keras
- Selalu test di area kecil dulu

Perawatan yang benar bisa bikin sofa kulitmu bertahan 10-15 tahun atau lebih!`,
    categoryId: "88da7a3d-0f3a-4afa-9cdc-e3904773e97b",
    coverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
    author: "Admin NingClean",
    status: "PUBLISHED",
    readTime: 6,
    tags: ["sofa", "leather", "furniture", "care"]
  },
  {
    title: "Kenapa Kebersihan Kantor Mempengaruhi Produktivitas Kerja?",
    slug: "kebersihan-kantor-mempengaruhi-produktivitas",
    excerpt: "Penelitian menunjukkan lingkungan kerja yang bersih bisa naikin produktivitas sampai 15%. Ini faktanya.",
    content: `Nggak cuma estetika, kebersihan kantor punya dampak nyata terhadap performa tim:

## Fakta Berdasarkan Penelitian
- **Harvard Business Review:** Karyawan di kantor bersih lebih fokus dan produktif
- **Journal of Neuroscience:** Visual clutter bikin otak lelah dan distracted
- **Indonesia Business Review:** 78% karyawan merasa lebih nyaman di kantor yang teratur

## Area Kritis yang Harus Dijaga
1. **Meja kerja** - Tempat numpuk debu dan bakteri
2. **Keyboard dan mouse** - Bisa lebih kotor dari toilet!
3. **Dapur/pantry** - Area makan harus higienis
4. **Toilet** - Standar kebersihan mempengaruhi mood karyawan
5. **Ruang meeting** - Sering dipake, perlu pembersihan rutin

## Solusi untuk Perusahaan
- **Cleaning service harian:** Buat area umum
- **Weekly deep cleaning:** Weekend biar nggak ganggu kerja
- **Provide hand sanitizer:** Di beberapa titik strategis
- **Waste management:** Sistem sampah yang jelas

**ROI:** Investasi kebersihan itu nggak besar, tapi impactnya ke kesehatan dan produktivitas tim sangat signifikan.`,
    categoryId: "fce4e728-5fd5-49c7-af2d-a060016786e5",
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    author: "Admin NingClean",
    status: "PUBLISHED",
    readTime: 5,
    tags: ["office", "productivity", "workplace", "cleaning"]
  },
  {
    title: "Spring Bed Anda Berjamur? Ini Solusi Ampuhnya!",
    slug: "spring-bed-berjamur-solusi-ampuh",
    excerpt: "Jamur di spring bed bukan cuma bikin bau, tapi juga berbahaya buat kesehatan. Begini cara mengatasinya.",
    content: `Jamur di spring bed masalah serius yang sering diabaikan. Bau musty, bercak hitam, dan alergi adalah tanda-tanda utamanya.

## Kenapa Jamur Bisa Tumbuh di Spring Bed?
- Kelembaban tinggi (udara Indonesia)
- Jarang dijemur
- Spill air yang nggak langsung dikeringin
- Kamar yang kurang ventilasi

## Cara Membersihkan Jamur (DIY)

### Alat yang dibutuhkan:
- Vacuum cleaner
- Baking soda
- Cuka putih + air (1:1)
- Sikat lembut
- Kain microfiber

### Langkah-langkah:
1. **Vacuum** seluruh permukaan kasur
2. **Semprot** campuran cuka ke area berjamur
3. **Biarkan** 10-15 menit
4. **Gosok** perlahan dengan sikat
5. **Taburkan** baking soda, biarkan 30 menit
6. **Vacuum** lagi sampai bersih
7. **Jemur** di bawah sinar matahari minimal 4 jam

## Kalau Sudah Parah?
Kalau jamur sudah menyebar luas atau sudah lama terbengkalai, lebih baik panggil profesional atau pertimbangkan ganti kasur baru.

## Pencegahan:
- Gunakan mattress protector
- Jemur kasur minimal 3 bulan sekali
- Pastikan kamar berventilasi baik
- Lap tumpahan air segera

Jangan biarkan jamur mengganggu kualitas tidurmu!`,
    categoryId: "cf08a7bf-c6d9-417c-8d93-c5f7dbb45709",
    coverImage: "https://images.unsplash.com/photo-1505693416388-b0346efee535?w=800",
    author: "Admin NingClean",
    status: "PUBLISHED",
    readTime: 8,
    tags: ["spring bed", "mattress", "mold", "cleaning", "health"]
  }
];

async function seedPosts() {
  for (const post of posts) {
    try {
      const { categoryId, status, ...postData } = post;
      const created = await prisma.blogPost.create({
        data: {
          ...postData,
          category: {
            connect: { id: categoryId }
          },
          publishedAt: status === "PUBLISHED" ? new Date() : null
        }
      });
      console.log(`✅ Created: ${created.title}`);
    } catch (err) {
      if (err.code === 'P2002') {
        console.log(`⚠️ Skipped (exists): ${post.title}`);
      } else {
        console.error(`❌ Error: ${post.title}`, err.message);
      }
    }
  }
  console.log('\n🎉 Seeding complete!');
}

seedPosts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
