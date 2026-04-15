// Script untuk membuat 1 blog post detail tentang Deep Cleaning
// Jalankan: npx ts-node scripts/create-sample-post.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const post = {
  slug: 'panduan-lengkap-deep-cleaning-rumah-anda',
  title: 'Panduan Lengkap Deep Cleaning Rumah Anda: Yang Perlu Anda Ketahui',
  excerpt: 'Deep cleaning bukan sekadar membersihkan permukaan. Pelajari seluk-beluk deep cleaning profesional, kapan perlu melakukannya, dan apa saja yangincluded dalam layanan ini.',
  content: `
<h2>Apa Itu Deep Cleaning?</h2>
<p>Deep cleaning adalah proses pembersihan intensif yang menjangkau area-area yang sering terlewat dalam cleaning biasa. Berbeda dengan general cleaning yang fokus pada permukaan visible, deep cleaning mencakuparea tersembunyi, noda membandel, dan kotoran yang menumpuk dalam waktu lama.</p>

<h2>Kapan Saatnya Membutuhkan Deep Cleaning?</h2>
<p>Deep cleaning direkomendasikan untuk dilakukan secara berkala, namun ada tanda-tanda spesifik yang menunjukkan rumah Anda membutuhkan treatment intensif:</p>
<ul>
<li><strong>Setelah musim hujan</strong> - Kelembaban tinggi menyebabkan jamur dan bakteri berkembang biak</li>
<li><strong>Sebelum/Setelah acara besar</strong> - Maksimalkan kebersihan untuk suasana spesial</li>
<li><strong>Setiap 6-12 bulan</strong> - Sebagai perawatan preventif berkala</li>
<li><strong>Saat pindah masuk/keluar</strong> - Pastikan kondisi optimal untuk penghuni baru</li>
<li><strong>Setelah masa quarantine</strong> - Sterilisasi menyeluruh ruangan</li>
</ul>

<h2>Area yang Dicakup Deep Cleaning</h2>

<h3>1. Dapur Profesional</h3>
<p>Dapur adalah jantung rumah namun juga magnet untuk bakteri. Dalam deep cleaning dapur, kami meliputi:</p>
<ul>
<li>Pembersihan penuh oven dan microwave termasuk bagian dalam</li>
<li>Degreasing kompor dan range hood exhaust</li>
<li>Pembersihan refrigerator dari dalam keluar</li>
<li>Sanitasi permukaan countertop dan backsplash</li>
<li>Pembersihan kabinet dapur bagian dalam</li>
<li>Degreasing exhaust fan dan kisi-kisi ventilasi</li>
</ul>

<h3>2. Kamar Mandi Spa-Quality</h3>
<p>Kamar mandi membutuhkan perhatian khusus karena tingkat kelembabannya tinggi:</p>
<ul>
<li>Scouring intensif dinding dan lantai kamar mandi</li>
<li>Penghilangan kerak air (water stain) pada fixture</li>
<li>Pembersihan grout antara keramik dengan steam</li>
<li>Sanitasi toilet dengan treatment anti-bakteri</li>
<li>Pembersihan shower cabin termasuk door seal</li>
<li>Degreasing dan disinfeksi floor drain</li>
</ul>

<h3>3. Ruang Tamu dan Kamar Tidur</h3>
<p>Area tempat berkumpul dan istirahat keluarga:</p>
<ul>
<li>Deep vacuum pada seluruh carpet dan upholstery</li>
<li>Steam cleaning sofa, kursi, dan kelambu</li>
<li>Pembersihan kasur dengan treatment anti dust mite</li>
<li>Pembersihan area belakang furniture berat</li>
<li> dusting pada ventilasi AC dan ceiling fans</li>
<li>Pembersihan window blinds termasuk bagian atas</li>
</ul>

<h3>4. Lantai dan Dinding</h3>
<p>Permukaan yang sering diabaikan:</p>
<ul>
<li>Scrubbing dan polishing lantai keras</li>
<li>Deep cleaning carpet dengan machine extraction</li>
<li>Pembersihan noda pada dinding (scuff marks)</li>
<li>Degreasing baseboard dan door frames</li>
<li>Pembersihan ceiling corners dari sarang laba-laba</li>
</ul>

<h2>Perbedaan Deep Cleaning vs General Cleaning</h2>
<table style="width: 100%; border-collapse: collapse;">
<tr style="background: #f3f4f6;">
<th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Aspek</th>
<th style="padding: 12px; text-align: left; border: 1px solid #ddd;">General Cleaning</th>
<th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Deep Cleaning</th>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #ddd;">Durasi</td>
<td style="padding: 12px; border: 1px solid #ddd;">2-4 jam</td>
<td style="padding: 12px; border: 1px solid #ddd;">6-12 jam</td>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #ddd;">Frekuensi</td>
<td style="padding: 12px; border: 1px solid #ddd;">Mingguan</td>
<td style="padding: 12px; border: 1px solid #ddd;">6-12 bulanan</td>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #ddd;">Area Cakup</td>
<td style="padding: 12px; border: 1px solid #ddd;">Permukaan visible</td>
<td style="padding: 12px; border: 1px solid #ddd;">Menyeluruh + tersembunyi</td>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #ddd;">Equipment</td>
<td style="padding: 12px; border: 1px solid #ddd;">Basic tools</td>
<td style="padding: 12px; border: 1px solid #ddd;">Industrial grade</td>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #ddd;">Noda Membandel</td>
<td style="padding: 12px; border: 1px solid #ddd;">Tidak ditangani</td>
<td style="padding: 12px; border: 1px solid #ddd;">Treatment khusus</td>
</tr>
</table>

<h2>Benefits Deep Cleaning untuk Kesehatan Keluarga</h2>
<p>Deep cleaning bukan sekadar aesthetic, namun berkontribusi langsung pada kesehatan:</p>
<ul>
<li><strong>Mengurangi allergen</strong> - Dust mite, pollen, dan bulu hewan terangkat dari upholstery</li>
<li><strong>Mencegah pertumbuhan jamur</strong> - Area lembab treatment dengan anti-fungal</li>
<li><strong>Meminimalkan bakteri patogen</strong> - Sanitasi intensif pada area kritis</li>
<li><strong>Meningkatkan kualitas udara indoor</strong> - Filter AC dan ventilasi dibersihkan</li>
<li><strong>Memperpanjang umur furniture</strong> - Perawatan preventif terhadap kerusakan material</li>
</ul>

<h2>Mengapa Memilih NingClean Deep Cleaning?</h2>
<p>Tim NingClean dilengkapi dengan:</p>
<ul>
<li><strong>Tim tersertifikasi</strong> - Trained professionals dengan SOP sistematis</li>
<li><strong>Equipment industrial grade</strong> - Mesin steam, extractor, dan chemical yang tidak tersedia untuk consumer market</li>
<li><strong>Eco-friendly products</strong> - aman untuk anak-anak dan hewan peliharaan</li>
<li><strong>Satisfaction guarantee</strong> - Jaminan kepuasan atau money back</li>
<li><strong>Fully insured</strong> - Perlindungan komprehensif untuk furniture dan property Anda</li>
</ul>

<h2>Persiapan Sebelum Tim Profesional Tiba</h2>
<p>Untuk memaksimalkan hasil deep cleaning, Anda bisa melakukan langkah sederhana berikut:</p>
<ol>
<li><strong>Singkirkan barang fragiles</strong> - Foto, patung, barang pecah belah</li>
<li><strong>Kosongkan cabinet kecil</strong> - особливо для kitchen dan bathroom cabinets</li>
<li><strong>Amankan hewan peliharaan</strong> - Terutama yang curious atau nervous dengan stranger</li>
<li><strong>Siapkan access point</strong> - Pastikan semua area bisa dijangkau tim</li>
<li><strong>Komunikasikan special instructions</strong> - Titik mana yang butuh extra attention</li>
</ol>

<h2>Harga dan Paket Deep Cleaning</h2>
<p>Kami menawarkan berbagai opsi deep cleaning sesuai kebutuhan:</p>
<ul>
<li><strong>Deep Cleaning Studio/1BR</strong> - Ideal untuk apartemen kecil</li>
<li><strong>Deep Cleaning 2-3BR</strong> - Cocok untuk rumah tipe menengah</li>
<li><strong>Deep Cleaning 4+BR</strong> - Untuk rumah besar atau villa</li>
<li><strong>Deep Cleaning Custom</strong> - Treatment spesifik sesuai request</li>
</ul>

<h2>Testimoni Pelanggan</h2>
<blockquote>
<p>"Setelah deep cleaning dari NingClean, rumah terasa seperti baru lagi. Yang paling impressive adalah mereka bisa mengangkat noda di sofa yang sudah kami pikir tidak bisa dibersihkan. Highly recommended!"</p>
<p><strong>- Ibu Sari, Surabaya</strong></p>
</blockquote>

<h2>Booking Sekarang</h2>
<p>Jangan tunda lagi untuk memberikan yang terbaik untuk rumah Anda. Hubungi tim NingClean sekarang untuk scheduling deep cleaning profesional.</p>
`,
  coverImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc12fc?w=800',
  author: 'Tim NingClean',
  tags: ['deep cleaning', 'kebersihan', 'tips', 'profesional', 'rumah'],
  readTime: 12,
  isFeatured: true,
  categoryId: null, // Will be set after we find the category ID
}

async function main() {
  console.log('=== CREATE SAMPLE BLOG POST ===\n')

  // Find category ID for "Deep Cleaning"
  const category = await prisma.blogCategory.findUnique({
    where: { slug: 'deep-cleaning' },
  })

  if (category) {
    post.categoryId = category.id
    console.log(`Found category: ${category.name} (${category.id})`)
  } else {
    console.log('Category "deep-cleaning" not found, creating post without category')
  }

  // Check if post with slug already exists
  const existing = await prisma.blogPost.findUnique({
    where: { slug: post.slug },
  })

  if (existing) {
    console.log(`Post with slug "${post.slug}" already exists, skipping...`)
    console.log('Updating instead...')

    const updated = await prisma.blogPost.update({
      where: { id: existing.id },
      data: {
        ...post,
        publishedAt: new Date(), // Mark as published
      },
    })
    console.log(`Updated post: ${updated.title}`)
    console.log(`ID: ${updated.id}`)
    return
  }

  // Create the post
  const created = await prisma.blogPost.create({
    data: {
      ...post,
      publishedAt: new Date(), // Mark as published (publishedAt is now nullable)
    },
  })

  console.log(`\nCreated new post!`)
  console.log(`Title: ${created.title}`)
  console.log(`Slug: ${created.slug}`)
  console.log(`ID: ${created.id}`)
  console.log(`Author: ${created.author}`)
  console.log(`Published: ${created.publishedAt}`)
  console.log(`Tags: ${created.tags.join(', ')}`)
  console.log(`Read Time: ${created.readTime} min`)
  console.log(`Featured: ${created.isFeatured}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
