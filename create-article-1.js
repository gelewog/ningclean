const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Get category ID for Deep Cleaning
  const category = await prisma.blogCategory.findUnique({
    where: { slug: 'deep-cleaning' }
  });

  if (!category) {
    console.error('Kategori Deep Cleaning tidak ditemukan');
    process.exit(1);
  }

  const article = {
    slug: 'deep-cleaning-rumah-sebelum-lebaran',
    title: 'Deep Cleaning Rumah: Kenapa Harus Dilakukan Sebelum Lebaran?',
    excerpt: 'Persiapkan rumah Anda menyambut Lebaran dengan deep cleaning menyeluruh. Pelajari 5 alasan penting dan checklist lengkap untuk hasil maksimal.',
    content: `<p>Lebaran tinggal menghitung hari. Selain mempersiapkan ketupat dan kue kering, ada satu hal yang tidak kalah penting: <strong>membersihkan rumah secara menyeluruh</strong>. Bukan sekadar sapu-sapu biasa, tapi <em>deep cleaning</em> yang benar-benar menyentuh setiap sudut rumah.</p>

<p>Tahukah Anda? Menurut survei, 78% keluarga Indonesia merasa lebih nyaman dan bahagia menyambut tamu saat rumah dalam kondisi bersih maksimal. Artikel ini akan membahas mengapa deep cleaning sebelum Lebaran itu penting dan bagaimana melakukannya dengan efektif.</p>

<h2>Mengapa Deep Cleaning Sebelum Lebaran Itu Penting?</h2>

<h3>1. Menyambut Tamu dengan Keadaan Rumah Terbaik</h3>

<p>Lebaran identik dengan <strong>silaturahmi</strong>. Keluarga besar, tetangga, hingga teman lama akan berkunjung. Bayangkan betapa nyamannya mereka saat masuk ke rumah yang tidak hanya rapi, tetapi juga <em>wangi</em> dan <em>steril</em>.</p>

<div class="callout callout-info">
  <span class="callout-icon">💡</span>
  <p><strong>Tips:</strong> Fokus pada area yang pertama kali dilihat tamu: ruang tamu, kamar mandi tamu, dan pintu masuk. Area ini memberikan <em>first impression</em> terkuat.</p>
</div>

<h3>2. Menghilangkan Debu dan Alergen Musiman</h3>

<p>Setelah setahun penuh, rumah Anda menumpuk:</p>

<ul>
  <li>Debu halus di sudut-sudut langit-langit</li>
  <li>Tungau di kasur dan sofa</li>
  <li>Bakteri di kamar mandi</li>
  <li>Grease di dapur yang mengeras</li>
</ul>

<p>Deep cleaning menghilangkan semua ini, menciptakan lingkungan yang lebih sehat—terutama jika ada anak kecil atau lansia di rumah.</p>

<div class="callout callout-warning">
  <span class="callout-icon">⚠️</span>
  <p><strong>Perhatian:</strong> Anak-anak dan lansia lebih rentan terhadap alergen. Pastikan area tempat tidur dan ruang keluarga mendapat perhatian ekstra.</p>
</div>

<h3>3. Mencegah Noda Membandel Menetap</h3>

<p>Noda yang dibiarkan berbulan-bulan akan semakin sulit dihilangkan. Noda kopi di sofa, jamur di kamar mandi, atau grease di kompor—semuanya akan semakin <em>setia menemani</em> Anda kalau tidak segera ditangani.</p>

<h3>4. Memberikan "Fresh Start" untuk Tahun Baru</h3>

<p>Secara psikologis, rumah bersih = pikiran bersih. Memulai tahun Hijriah dengan rumah yang benar-benar bersih memberikan energi positif dan motivasi untuk tahun yang lebih baik.</p>

<h3>5. Menjaga Reputasi Keluarga</h3>

<p>Tidak perlu rumah mewah. Rumah <strong>bersih dan terawat</strong> sudah cukup mencerminkan karakter penghuninya. Deep cleaning adalah investasi reputasi keluarga Anda.</p>

<h2>Checklist Deep Cleaning Lengkap Sebelum Lebaran</h2>

<p>Gunakan checklist ini untuk memastikan tidak ada area yang terlewat:</p>

<table>
  <thead>
    <tr>
      <th>Area</th>
      <th>Tugas</th>
      <th>Prioritas</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Ruang Tamu</strong></td>
      <td>Vakum sofa & karpet, lap permukaan, cuci gorden</td>
      <td>🔴 Tinggi</td>
    </tr>
    <tr>
      <td><strong>Kamar Tidur</strong></td>
      <td>Cuci sprei & selimut, vakum kasur, rapikan lemari</td>
      <td>🔴 Tinggi</td>
    </tr>
    <tr>
      <td><strong>Kamar Mandi</strong></td>
      <td>Sikat keramik & grout, bersihkan wastafel & kloset</td>
      <td>🔴 Tinggi</td>
    </tr>
    <tr>
      <td><strong>Dapur</strong></td>
      <td>Degrease kompor & hood, bersihkan kulkas, lap kabinet</td>
      <td>🟡 Medium</td>
    </tr>
    <tr>
      <td><strong>Lantai & Dinding</strong></td>
      <td>Pel semua lantai, lap noda di dinding</td>
      <td>🟡 Medium</td>
    </tr>
    <tr>
      <td><strong>Luar Rumah</strong></td>
      <td>Sapu halaman, bersihkan teras, cuci keset</td>
      <td>🟢 Low</td>
    </tr>
  </tbody>
</table>

<h2>FAQ: Deep Cleaning Sebelum Lebaran</h2>

<details>
  <summary>Kapan waktu terbaik melakukan deep cleaning?</summary>
  <p>Idealnya <strong>3-7 hari sebelum Lebaran</strong>. Jangan terlalu dekat dengan hari H karena Anda perlu waktu untuk istirahat dan persiapan lain. Jangan juga terlalu jauh karena rumah bisa kotor lagi sebelum Lebaran tiba.</p>
</details>

<details>
  <summary>Berapa biaya deep cleaning profesional?</summary>
  <p>Biaya bervariasi tergantung luas rumah dan layanan. Umumnya mulai dari <strong>Rp500.000 - Rp2.000.000</strong> untuk rumah standar. Investasi ini sebanding dengan waktu dan tenaga yang Anda hemat.</p>
</details>

<details>
  <summary>Bisa DIY atau harus profesional?</summary>
  <p>Untuk rumah berkamar 1-2, DIY mungkin cukup dengan bantuan keluarga. Untuk rumah besar atau jika Anda sibuk, <strong>jasa profesional lebih efisien</strong> dan hasilnya lebih maksimal.</p>
</details>

<details>
  <summary>Berapa lama waktu yang dibutuhkan?</summary>
  <p>Deep cleaning rumah standar (2-3 kamar) membutuhkan <strong>4-8 jam</strong> dengan tim profesional. DIY bisa memakan waktu 1-2 hari tergantung tenaga yang tersedia.</p>
</details>

<h2>Kesimpulan</h2>

<p>Deep cleaning sebelum Lebaran bukan sekadar tradisi, tapi <strong>kebutuhan</strong>. Dari menyambut tamu dengan bangga hingga menciptakan lingkungan sehat untuk keluarga—manfaatnya terlalu berharga untuk dilewatkan.</p>

<div class="callout">
  <span class="callout-icon">🎯</span>
  <p><strong>Action Step:</strong> Jadwalkan deep cleaning Anda sekarang juga! Hubungi <strong>NingClean</strong> untuk layanan deep cleaning profesional dan nikmati Lebaran dengan rumah bersih maksimal.</p>
</div>

<p><em>Selamat menunaikan ibadah puasa dan semoga Lebaran Anda penuh berkah! 🌙</em></p>`,
    author: 'NingClean Team',
    category: { connect: { id: category.id } },
    tags: ['deep cleaning', 'lebaran', 'tips', 'spring cleaning', 'rumah bersih'],
    readTime: 6,
    publishedAt: new Date('2026-04-15'),

    isFeatured: true
  };

  // Check if article exists
  const existing = await prisma.blogPost.findUnique({
    where: { slug: article.slug }
  });

  if (existing) {
    console.log('Artikel sudah ada, update...');
    await prisma.blogPost.update({
      where: { slug: article.slug },
      data: article
    });
  } else {
    console.log('Membuat artikel baru...');
    await prisma.blogPost.create({ data: article });
  }

  console.log('✅ Artikel 1 berhasil dibuat/updated!');
  console.log('Title:', article.title);
  console.log('Slug:', article.slug);
  console.log('Category:', category.name);
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
