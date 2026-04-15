const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Get category ID for Tips Kebersihan
  const category = await prisma.blogCategory.findUnique({
    where: { slug: 'tips-kebersihan' }
  });

  if (!category) {
    console.error('Kategori Tips Kebersihan tidak ditemukan');
    process.exit(1);
  }

  const article = {
    slug: '7-kebiasaan-simpel-rumah-bersih-seharian',
    title: '7 Kebiasaan Simpel Agar Rumah Tetap Bersih Seharian',
    excerpt: 'Tak perlu deep cleaning setiap hari! Cukup terapkan 7 kebiasaan sederhana ini dan rasakan bedanya. Rumah tetap rapi tanpa ribet.',
    content: `<p>Pernah merasa rumah baru saja dibersihkan tapi beberapa jam kemudian sudah berantakan lagi? Meja penuh debu, lantai ada kotoran, dan sofa berantakan. Rasanya seperti <em>sisyphus work</em>—bersih-bersih tanpa akhir.</p>

<p>Kabar baiknya: <strong>Anda tidak perlu deep cleaning setiap hari</strong> untuk menjaga rumah tetap bersih. Cukup terapkan 7 kebiasaan sederhana berikut, yang masing-masing hanya membutuhkan waktu 2-5 menit. Hasilnya? Rumah tetap rapi seharian dengan usaha minimal.</p>

<h2>7 Kebiasaan Simpel untuk Rumah Bersih</h2>

<h3>1. 🛏️ Rapikan Tempat Tidur Begitu Bangun</h3>

<p>Sebuah <a href="https://www.apartmenttherapy.com/the-importance-of-making-your-bed-258008" target="_blank">studi dari UC Berkeley</a> menunjukkan bahwa orang yang merapikan tempat tidur setiap pagi cenderung lebih produktif sepanjang hari. Tapi manfaatnya tidak hanya psikologis.</p>

<div class="callout callout-info">
  <span class="callout-icon">💡</span>
  <p><strong>Tips Pro:</strong> Sprei yang dirapikan mengurangi tempat berkumpulnya debu dan tungau di kasur. Waktu yang dibutuhkan: <strong>2 menit</strong>.</p>
</div>

<ul>
  <li>Tepuk-tepuk bantal agar debu jatuh (bukan ke wajah Anda malam nanti)</li>
  <li>Ratakan sprei dengan tangan</li>
  <li>Lipat selimut atau bed cover dengan rapi</li>
  <li>Atur bantal simetris</li>
</ul>

<h3>2. 🧹 "The 2-Minute Rule" - Bereskan yang Bisa Dikerjakan dalam 2 Menit</h3>

<p>Konsep dari buku <em>Getting Things Done</em> karya David Allen: <strong>jika sesuatu bisa diselesaikan dalam 2 menit atau kurang, lakukan sekarang</strong>.</p>

<table>
  <thead>
    <tr>
      <th>Situasi</th>
      <th>Tindakan Langsung (&lt;2 menit)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Pakaian kotor lepas</td>
      <td>Langsung masukkan ke keranjang cucian, bukan ke kursi</td>
    </tr>
    <tr>
      <td>Selesai makan</td>
      <td>Cuci piring atau masukkan ke dishwasher segera</td>
    </tr>
    <tr>
      <td>Surat/buku dibaca</td>
      <td>Simpan kembali ke tempatnya atau buang</td>
    </tr>
    <tr>
      <td>Tumpahan kecil</td>
      <td>Lap segera sebelum menyerap dan mengering</td>
    </tr>
  </tbody>
</table>

<p>Kebiasaan ini mencegah <strong>"efek salju" kotoran</strong>—di mana tumpukan kecil menumpuk menjadi masalah besar.</p>

<h3>3. 🍽️ Dapur Bersih Setelah Setiap Masak</h3>

<p>Memasak itu menyenangkan. Membersihkan setelahnya? Tidak selalu. Tapi membersihkan <strong>sebelum makan</strong> jauh lebih mudah daripada setelah makanan mengering dan lengket.</p>

<div class="callout callout-warning">
  <span class="callout-icon">⚠️</span>
  <p><strong>Hindari:</strong> Menunda pembersihan dapur sampai besok. Minyak dan sisa makanan yang mengering membutuhkan usaha 3x lebih untuk dibersihkan!</p>
</div>

<p><strong>Rutinitas 5 menit setelah masak:</strong></p>
<ol>
  <li>Lap kompor dan backsplash sambil masih hangat</li>
  <li>Cuci peralatan yang digunakan</li>
  <li>Buang sampah sisa sayur/bumbu</li>
  <li>Lap meja dapur</li>
  <li>Gantung lap tangan basah di tempat pengering</li>
</ol>

<h3>4. 🗑️ Kosongkan Sampah Sebelum Penuh</h3>

<p>Tunggu sampah penuh sebelum dibuang? <strong>Itu kesalahan umum.</strong> Sampah yang menumpuk:</p>

<ul>
  <li>Menciptakan bau tak sedap</li>
  <li>Mengundang serangga (kecoa, semut, lalat)</li>
  <li>Membuat tampilan rumah terlihat berantakan</li>
  <li>Berpotensi tumpah kalau terlalu penuh</li>
</ul>

<details>
  <summary>🕐 Jadwal Ideal Buang Sampah</summary>
  <p><strong>Rumah tangga 2-3 orang:</strong> Setiap malam sebelum tidur</p>
  <p><strong>Rumah tangga besar:</strong> 2x sehari (pagi dan malam)</p>
  <p><strong>Sampah dapur:</strong> Setiap hari tanpa terkecuali</p>
</details>

<h3>5. 🧽 "One Touch" Rule untuk Barang</h3>

<p>Setiap barang di rumah seharusnya hanya disentuh <strong>sekali</strong> untuk sampai ke tujuannya. Contoh:</p>

<blockquote>
  <p>❌ Baju kotor diletakkan di kursi → dipindahkan ke meja → akhirnya masuk ke keranjang</p>
  <p>✅ Baju kotor langsung masuk ke keranjang cucian</p>
</blockquote>

<p>Berlaku juga untuk:</p>
<ul>
  <li>Handuk yang sudah kering → langsung gantung, bukan ke kursi</li>
  <li>Remote TV → langsung kembali ke meja, bukan di sofa</li>
  <li>Kunci mobil → langsung ke gantungan, bukan di meja makan</li>
</ul>

<h3>6. 🪞 Cermin Check Sebelum Tidur</h3>

<p>Sebelum ke kamar tidur, lakukan <strong>round check</strong> 5 menit:</p>

<ol>
  <li>Lipat selimut yang berserakan di sofa</li>
  <li>Rapikan bantal dan kursi berantakan</li>
  <li>Lipat atau gantung pakaian yang dilepas</li>
  <li>Lap meja dari debu</li>
  <li>Pastikan tidak ada piring di wastafel</li>
</ol>

<div class="callout">
  <span class="callout-icon">✨</span>
  <p><strong>Manfaat Bonus:</strong> Bangun dengan rumah yang sudah rapi memberikan <em>mood positif</em> untuk memulai hari. Tidak ada yang lebih menyebalkan daripada bangun dan langsung melihat berantakan!</p>
</div>

<h3>7. 📅 Jadikan Deep Cleaning sebagai Event, Bukan Beban</h3>

<p>Kebiasaan-kebiasaan di atas menjaga rumah tetap rapi sehari-hari. Tapi untuk <strong>bersih maksimal</strong>, Anda tetap butuh deep cleaning 2-4 kali setahun.</p>

<p>Cara membuatnya tidak terasa berat:</p>

<ul>
  <li>Jadwalkan sebagai <strong>"Spring Cleaning Party"</strong> dengan keluarga</li>
  <li>Putar musik favorit sambil bersih-bersih</li>
  <li>Atau... serahkan kepada profesional 😉</li>
</ul>

<h2>Challenge: 30 Hari Kebiasaan Bersih</h2>

<p>Tantang diri Anda untuk menerapkan 7 kebiasaan ini selama 30 hari berturut-turut. Menurut penelitian, dibutuhkan rata-rata <strong>66 hari</strong> untuk membentuk kebiasaan baru, tapi Anda akan mulai merasakan perbedaan signifikan dalam 2-3 minggu pertama.</p>

<h3>Daily Checklist:</h3>

<ul>
  <li><input type="checkbox"> Rapikan tempat tidur (2 menit)</li>
  <li><input type="checkbox"> Terapkan 2-minute rule (variatif)</li>
  <li><input type="checkbox"> Dapur bersih setelah masak (5 menit)</li>
  <li><input type="checkbox"> Buang sampah (1 menit)</li>
  <li><input type="checkbox"> One touch rule sepanjang hari</li>
  <li><input type="checkbox"> Cermin check sebelum tidur (5 menit)</li>
</ul>

<p><strong>Total waktu per hari: 10-15 menit</strong> untuk rumah yang tetap bersih seharian.</p>

<h2>FAQ</h2>

<details>
  <summary>Bagaimana kalau rumahnya besar atau punya anak kecil?</summary>
  <p>Prinsipnya tetap sama, tapi frekuensinya meningkat. Anak kecil = lebih banyak aktivitas = lebih sering beres-beres kecil. Tapi dengan kebiasaan ini, deep cleaning tetap bisa dijadwalkan bulanan, bukan mingguan.</p>
</details>

<details>
  <summary>Apa yang terjadi kalau skip satu hari?</summary>
  <p>It's okay! Kebiasaan bukan tentang kesempurnaan, tapi <strong>konsistensi dalam jangka panjang</strong>. Skip satu hari tidak merusak progress. Yang merusak adalah menyerah sepenuhnya.</p>
</details>

<details>
  <summary>Kebiasaan ini berlaku untuk apartemen studio?</summary>
  <p>Sangat! Justru apartemen studio sangat terbantu karena tidak ada banyak ruang untuk berantakan. One-touch rule sangat efektif di space terbatas.</p>
</details>

<h2>Kesimpulan</h2>

<p>Rumah bersih tidak harus memakan waktu berjam-jam setiap hari. Dengan <strong>7 kebiasaan simpel</strong> di atas—yang masing-masing hanya butuh 2-5 menit—Anda bisa menjaga rumah tetap rapi tanpa merasa seperti pekerjaan rumah tangga yang membebani.</p>

<div class="callout">
  <span class="callout-icon">🎯</span>
  <p><strong>Mulai dari sekarang:</strong> Pilih <em>satu</em> kebiasaan dari daftar ini dan terapkan mulai hari ini. Jangan coba semua sekaligus—kebiasaan terbentuk dari konsistensi, bukan intensitas.</p>
</div>

<p>Butuh bantuan deep cleaning profesional untuk "reset" rumah Anda sebelum memulai kebiasaan baru? <strong>NingClean</strong> siap membantu! 🧹✨</p>

<p><em>Bersih itu kebiasaan, bukan sekadar sekali-sekali. 🏠💚</em></p>`,
    author: 'NingClean Team',
    category: { connect: { id: category.id } },
    tags: ['kebiasaan', 'tips kebersihan', 'rumah bersih', 'daily habits', 'cleaning routine'],
    readTime: 8,
    publishedAt: new Date(),
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

  console.log('✅ Artikel 4 berhasil dibuat/updated!');
  console.log('Title:', article.title);
  console.log('Slug:', article.slug);
  console.log('Category:', category.name);
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
