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
    slug: 'atasi-bau-apek-tanpa-parfum-ruangan',
    title: 'Cara Mengatasi Bau Apek di Rumah Tanpa Parfum Ruangan',
    excerpt: 'Parfum ruangan hanya menutupi bau sementara. Temukan cara mengatasi sumber bau secara permanen dengan solusi alami dan ampuh.',
    content: `<p>Anda menyemprotkan parfum ruangan dengan dosis tinggi, tapi beberapa jam kemudian bau aneh muncul lagi. Bau lembab, apek, atau seperti ruangan yang <em>seket</em> tidak terawat.</p>

<p>Ini adalah masalah klasik: <strong>parfum ruangan tidak menghilangkan bau, hanya menutupinya</strong>. Seperti menabur bubuk wangi di sampah—sampahnya tetap ada.</p>

<p>Artikel ini akan membantu Anda mengatasi <strong>sumber bau</strong> secara permanen dengan solusi alami, aman, dan lebih efektif daripada parfum sintetis.</p>

<h2>Kenapa Parfum Ruangan Tidak Cukup?</h2>

<p>Sebelum masuk ke solusi, penting memahami masalah:</p>

<ul>
  <li><strong>Masking, bukan solving:</strong> Parfum menutupi bau, tidak menghilangkan penyebabnya</li>
  <li><strong>Chemical overload:</strong> Banyak parfum mengandung VOCs (Volatile Organic Compounds) yang bisa memicu alergi dan sakit kepala</li>
  <li><strong>Temporary:</strong> Efeknya hilang dalam 1-3 jam, bau asli muncul lagi</li>
  <li><strong>Mixing smells:</strong> Kombinasi parfum + bau asli sering menciptakan aroma yang lebih buruk</li>
</ul>

<div class="callout callout-warning">
  <span class="callout-icon">⚠️</span>
  <p><strong>Fakta:</strong> American Lung Association menyebutkan bahwa parfum ruangan dan pembersih aromatik bisa melepaskan polutan dalam ruangan yang berdampak negatif pada kualitas udara.</p>
</div>

<h2>Identifikasi Sumber Bau (Root Cause Analysis)</h2>

<p>Setiap bau punya sumber. Berikut peta lengkap:</p>

<table>
  <thead>
    <tr>
      <th>Jenis Bau</th>
      <th>Kemungkinan Sumber</th>
      <th>Area Periksa</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Apek/lembab</td>
      <td>Jamur, sirkulasi buruk, kain basah</td>
      <td>Kamar mandi, sudut ruangan, tirai</td>
    </tr>
    <tr>
      <td>Amis/tidak segar</td>
      <td>Sampah dapur, kulkas, wastafel</td>
      <td>Dapur, area memasak</td>
    </tr>
    <tr>
      <td>Bau hewan</td>
      <td>Kandang, bantal hewan, area makan</td>
      <td>Tempat tidur anabul, sudut ruangan</td>
    </tr>
    <tr>
      <td>Bau asap/rokok</td>
      <td>Tembus dinding, furniture, karpet</td>
      <td>Sofa, karpet, gorden</td>
    </tr>
    <tr>
      <td>Bau sepatu</td>
      <td>Bakteri, keringat, sirkulasi buruk</td>
      <td>Rak sepatu, dekat pintu masuk</td>
    </tr>
  </tbody>
</table>

<h2>Solusi Alami Berdasarkan Sumber Bau</h2>

<h3>1. Bau Apek dan Lemab: Baking Soda + Cuka</h3>

<p>Pasangan klasik yang sempurna untuk <strong>absorb bau dan kill bakteri pemicu</strong>.</p>

<details>
  <summary>🧪 Cara Membuat Deodorizer Alami</summary>
  <p><strong>Bahan:</strong></p>
  <ul>
    <li>1 cup baking soda</li>
    <li>10-15 tetes essential oil (pilihan: lemon, lavender, tea tree)</li>
    <li>Wadah kedap udara dengan lubang kecil</li>
  </ul>
  <p><strong>Cara pakai:</strong> Letakkan di sudut ruangan, gantungan lemari, atau dekat sampah. Ganti setiap 2-3 minggu.</p>
</details>

<h3>2. Bau Dapur: Lemon + Garam</h3>

<p>Lemon tidak hanya wangi segar, tapi juga memiliki <strong>sifat antibakteri alami</strong>.</p>

<div class="callout callout-info">
  <span class="callout-icon">🍋</span>
  <p><strong>Hack Dapur:</strong> Rebus irisan lemon, rosemary, dan sedikit kayu manis di kompor. Uapnya akan menyebar kesegaran alami ke seluruh rumah.</p>
</div>

<p><strong>Untuk wastafel yang bau:</strong> Tuangkan 1/2 cup baking soda diikuti 1 cup cuka. Biarkan 15 menit, lalu siram dengan air panas.</p>

<h3>3. Bau Kamar Mandi: Karbon Aktif + Sinar Matahari</h3>

<p>Kamar mandi lembab = surga jamur dan bakteri pemicu bau. Solusi:</p>

<ul>
  <li><strong>Karbon aktif:</strong> Sangat efektif menyerap bau dan kelembaban. Bisa dibeli online atau di toko peralatan aquarium.</li>
  <li><strong>Jemur handuk:</strong> Setidaknya seminggu sekali, jemur handuk di bawah sinar matahari langsung. UV membunuh bakteri pemicu bau.</li>
  <li><strong>Ventilasi:</strong> Nyalakan exhaust fan 15 menit setelah mandi untuk mengurangi kelembaban.</li>
</ul>

<h3>4. Bau dari Hewan Peliharaan: Enzim Cleaner</h3>

<p>Bau hewan sulit dihilangkan karena berasal dari <strong>urine crystals</strong> yang menembus pori-pori karpet dan sofa.</p>

<details>
  <summary>🐾 DIY Enzim Cleaner</summary>
  <p><strong>Bahan:</strong></p>
  <ul>
    <li>2 cups air hangat</li>
    <li>1/2 cup cuka putih</li>
    <li>1/4 cup baking soda</li>
    <li>1 sendok makan sabun cuci piring (tanpa bleaching)</li>
  </ul>
  <p><strong>Cara pakai:</strong> Campur dalam spray bottle. Semprot ke area bermasalah. Biarkan 10 menit, lalu lap dengan kain basah. Ulangi jika perlu.</p>
</details>

<h3>5. Bau Sepatu: Teh Celup + Baking Soda</h3>

<p><strong>Pro tip:</strong> Masukkan 2-3 kantong teh celup kering ke dalam sepatu. Teh menyerap kelembaban dan bau. Tambahkan sedikit baking soda untuk efek maksimal.</p>

<h2>Checklist Pencegahan Bau (Preventive Maintenance)</h2>

<p>Lebih baik mencegah daripada mengatasi. Lakukan rutinitas ini:</p>

<h3>Harian:</h3>
<ul>
  <li><input type="checkbox"> Buang sampah dapur setiap malam</li>
  <li><input type="checkbox"> Buka jendela minimal 15 menit untuk sirkulasi udara</li>
  <li><input type="checkbox"> Lap tumpahan segera sebelum menyerap</li>
  <li><input type="checkbox"> Keringkan handuk setelah pakai (jangan digantung berkumpulan)</li>
</ul>

<h3>Mingguan:</h3>
<ul>
  <li><input type="checkbox"> Cuci sprei dan sarung bantal</li>
  <li><input type="checkbox"> Vacuum karpet dan sofa</li>
  <li><input type="checkbox"> Bersihkan kulkas dari makanan expired</li>
  <li><input type="checkbox"> Cuci tempat sampah dengan sabun</li>
</ul>

<h3>Bulanan:</h3>
<ul>
  <li><input type="checkbox"> Ganti baking soda di deodorizer</li>
  <li><input type="checkbox"> Cuci tirai dan gorden</li>
  <li><input type="checkbox"> Deep cleaning area yang sering terlewat</li>
  <li><input type="checkbox"> Periksa dan bersihkan filter AC</li>
</ul>

<h2>Tanaman Penyerap Bau Alami</h2>

<p>Beberapa tanaman indoor tidak hanya estetik, tapi juga membantu <strong>menyerap polutan dan bau</strong>:</p>

<ul>
  <li><strong>Lidah Mertua (Snake Plant):</strong> Menyerap formaldehyde dan xylene, melepaskan oksigen di malam hari</li>
  <li><strong>Peace Lily:</strong> Menyerap amonia dan spora jamur, cocok untuk kamar mandi</li>
  <li><strong>Lili Paris:</strong> Menyerap benzene dan trichloroethylene</li>
  <li><strong>Pakis:</strong> Menyerap kelembaban, cocok untuk area lembab</li>
</ul>

<div class="callout">
  <span class="callout-icon">🌿</span>
  <p><strong>NASA Clean Air Study</strong> membuktikan bahwa tanaman tertentu bisa menghilangkan hingga 87% toxin udara dalam 24 jam.</p>
</div>

<h2>FAQ</h2>

<details>
  <summary>Berapa lama baking soda efektif menyerap bau?</summary>
  <p>Sekitar <strong>2-4 minggu</strong> tergantung seberapa berat bau di area tersebut. Kalau sudah tidak wangi lagi, ganti dengan yang baru.</p>
</details>

<details>
  <summary>Essential oil aman untuk hewan?</summary>
  <p><strong>Hati-hati!</strong> Beberapa essential oil seperti tea tree, peppermint, dan citrus bisa beracun untuk kucing dan anjing. Gunakan dengan moderasi dan pastikan area berventilasi baik.</p>
</details>

<details>
  <summary>Bagaimana kalau bau sudah menetap bertahun-tahun?</summary>
  <p>Bau yang sudah <em>mentok</em> di furniture atau karpet mungkin membutuhkan <strong>ozone treatment</strong> atau <strong>professional deep cleaning</strong>. NingClean menyediakan layanan ini dengan peralatan khusus.</p>
</details>

<details>
  <summary>Apakah activated charcoal sama dengan arang biasa?</summary>
  <p><strong>Berbeda.</strong> Activated charcoal diproses dengan suhu tinggi untuk membuat pori-pori mikro yang menyerap bau. Arang biasa tidak punya kemampuan absorpsi yang sama.</p>
</details>

<h2>Kesimpulan</h2>

<p>Rumah segar tanpa parfum ruangan bukan impian—itu adalah hasil dari <strong>mengatasi sumber bau</strong> secara sistematis. Dengan solusi alami di atas, Anda tidak hanya menghilangkan bau, tapi juga menciptakan lingkungan yang lebih sehat dan aman untuk keluarga.</p>

<div class="callout">
  <span class="callout-icon">🎯</span>
  <p><strong>Ingat:</strong> Bau adalah <em>signal</em>, bukan masalah. Dia memberitahu ada sesuatu yang perlu diperbaiki. Dengarkan dan atasi sumbernya.</p>
</div>

<p>Masih bingung dengan bau yang sulit dihilangkan? <strong>NingClean</strong> punya tim ahli yang bisa mengidentifikasi dan mengatasi sumber bau secara profesional. 🌿✨</p>

<p><em>Rumah segar = hidup yang lebih sehat. 🍃</em></p>`,
    author: 'NingClean Team',
    category: { connect: { id: category.id } },
    tags: ['bau apek', 'tips kebersihan', 'solusi alami', 'parfum ruangan', 'deodorizer'],
    readTime: 9,
    publishedAt: new Date(),
    isFeatured: false
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

  console.log('✅ Artikel 5 berhasil dibuat/updated!');
  console.log('Title:', article.title);
  console.log('Slug:', article.slug);
  console.log('Category:', category.name);
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
