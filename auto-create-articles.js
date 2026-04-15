const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Progress tracker file
const PROGRESS_FILE = path.join(__dirname, 'articles-progress.json');

// Load progress
function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  }
  return { lastCreatedIndex: 0, completed: [], failed: [] };
}

// Save progress
function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// Articles data (14 articles remaining)
const articles = [
  // Artikel 2 - Deep Cleaning
  {
    slug: 'general-vs-deep-cleaning-mana-yang-anda-butuhkan',
    title: 'Bedanya General Cleaning dan Deep Cleaning - Mana yang Anda Butuhkan?',
    excerpt: 'Bingung memilih antara general cleaning dan deep cleaning? Pelajari perbedaan lengkapnya dan temukan yang paling sesuai dengan kebutuhan rumah Anda.',
    content: `<p>Saat mencari jasa kebersihan, Anda pasti sering menemukan dua istilah: <strong>General Cleaning</strong> dan <strong>Deep Cleaning</strong>. Harganya berbeda, waktunya berbeda, dan hasilnya pun berbeda. Tapi sebenarnya, apa sih bedanya?</p>

<p>Pemilihan jenis cleaning yang salah bisa membuat Anda kecewa—entah karena terlalu mahal untuk kebutuhan sederhana, atau terlalu minimalis untuk masalah yang kompleks. Artikel ini akan membantu Anda membuat keputusan yang tepat.</p>

<h2>Apa Itu General Cleaning?</h2>

<p>General cleaning adalah <strong>pembersihan rutin</strong> yang dilakukan secara berkala (mingguan/bulanan). Fokusnya pada area-area yang sering digunakan dan kotoran yang mudah dijangkau.</p>

<div class="callout callout-info">
  <span class="callout-icon">🧹</span>
  <p><strong>Cakupan General Cleaning:</strong> Menyapu, mengepel, membersihkan debu permukaan, membersihkan kamar mandi dasar, dan merapikan.</p>
</div>

<h3>Kapan General Cleaning Cukup?</h3>

<ul>
  <li>Rumah sudah dalam kondisi relatif bersih</li>
  <li>Membersihkan area lalu lintas tinggi saja</li>
  <li>Perawatan mingguan rutin</li>
  <li>Budget terbatas</li>
  <li>Waktu terbatas</li>
</ul>

<h2>Apa Itu Deep Cleaning?</h2>

<p>Deep cleaning adalah <strong>pembersihan menyeluruh</strong> yang menargetkan kotoran tersembunyi, noda membandel, dan area yang jarang terjangkau. Biasanya dilakukan 2-4 kali setahun.</p>

<div class="callout callout-warning">
  <span class="callout-icon">🧽</span>
  <p><strong>Cakupan Deep Cleaning:</strong> Membersihkan di balik furniture, dalam lemari, grout keramik, di bawah kasur, dalam oven, exhaust hood, dan area tersembunyi lainnya.</p>
</div>

<h3>Kapan Deep Cleaning Diperlukan?</h3>

<ul>
  <li>Sebelum acara besar (Lebaran, Natal, pesta)</li>
  <li>Setelah renovasi atau pindahan</li>
  <li>Ada bau tidak sedap yang sulit dihilangkan</li>
  <li>Noda membandel di berbagai area</li>
  <li>Sudah 3-6 bulan tidak deep cleaning</li>
</ul>

<h2>Tabel Perbandingan Lengkap</h2>

<table>
  <thead>
    <tr>
      <th>Aspek</th>
      <th>General Cleaning</th>
      <th>Deep Cleaning</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Durasi</strong></td>
      <td>2-4 jam</td>
      <td>4-8 jam</td>
    </tr>
    <tr>
      <td><strong>Harga</strong></td>
      <td>Rp150.000-400.000</td>
      <td>Rp500.000-2.000.000</td>
    </tr>
    <tr>
      <td><strong>Area</strong></td>
      <td>Permukaan terbuka</td>
      <td>Seluruh area termasuk tersembunyi</td>
    </tr>
    <tr>
      <td><strong>Peralatan</strong></td>
      <td>Standar</td>
      <td>Profesional (steam, pressure washer)</td>
    </tr>
    <tr>
      <td><strong>Frekuensi</strong></td>
      <td>Mingguan/bulanan</td>
      <td>2-4x per tahun</td>
    </tr>
    <tr>
      <td><strong>Tenaga</strong></td>
      <td>1-2 orang</td>
      <td>2-4 orang</td>
    </tr>
    <tr>
      <td><strong>Hasil</strong></td>
      <td>Bersih sekilas</td>
      <td>Bersih maksimal & steril</td>
    </tr>
  </tbody>
</table>

<h2>Scenarios: Mana yang Anda Butuhkan?</h2>

<h3>Scenario 1: Rumah Baru Pindahan</h3>
<p><strong>Rekomendasi: Deep Cleaning</strong></p>
<p>Rumah baru butuh pembersihan total untuk menghilangkan debu konstruksi, cat sisa, dan memastikan semua area steril sebelum ditempati.</p>

<h3>Scenario 2: Maintenance Rutin</h3>
<p><strong>Rekomendasi: General Cleaning</strong></p>
<p>Jika rumah sudah terawat baik dan Anda hanya perlu menjaga kebersihan, general cleaning 2-4 kali sebulan sudah cukup.</p>

<h3>Scenario 3: Menjelang Lebaran</h3>
<p><strong>Rekomendasi: Deep Cleaning</strong></p>
<p>Sambut tamu dengan rumah dalam kondisi terbaik. Deep cleaning akan memastikan tidak ada sudut yang terlewat.</p>

<h3>Scenario 4: Setelah Renovasi</h3>
<p><strong>Rekomendasi: Deep Cleaning</strong></p>
<p>Debu renovasi bisa tersebar ke seluruh rumah dan masuk ke celah-celah sempit. Hanya deep cleaning yang bisa mengatasinya.</p>

<h2>FAQ: General vs Deep Cleaning</h2>

<details>
  <summary>Bisa general cleaning dulu baru deep cleaning?</summary>
  <p>Sangat disarankan! General cleaning rutin membuat deep cleaning berikutnya lebih mudah dan hasilnya lebih maksimal. Bayangkan seperti perawatan gigi—sikat rutin + scaling berkala.</p>
</details>

<details>
  <summary>Deep cleaning termasuk cuci sofa dan karpet?</summary>
  <p>Standarnya ya, tapi konfirmasi dengan penyedia jasa. Beberapa paket deep cleaning sudah include, beberapa perlu add-on.</p>
</details>

<details>
  <summary>General cleaning bisa upgrade ke deep cleaning?</summary>
  <p>Bisa! Bicarakan dengan tim saat mereka datang. Mereka bisa menyesuaikan scope pekerjaan sesuai kebutuhan.</p>
</details>

<details>
  <summary>Berapa kali deep cleaning ideal per tahun?</summary>
  <p>Minimal <strong>2 kali</strong>: menjelang Lebaran dan menjelang Natal/tahun baru. Jika ada anggota keluarga dengan alergi, 3-4 kali lebih direkomendasikan.</p>
</details>

<h2>Kesimpulan</h2>

<p>Pilihan antara general dan deep cleaning bukan soal mana yang lebih baik, tapi <strong>mana yang lebih sesuai dengan kebutuhan Anda saat ini</strong>.</p>

<div class="callout">
  <span class="callout-icon">🎯</span>
  <p><strong>Rule of Thumb:</strong> General cleaning untuk maintenance rutin, Deep cleaning untuk "reset" total rumah Anda.</p>
</div>

<p>Masih bingung? Hubungi <strong>NingClean</strong> untuk konsultasi gratis dan dapatkan rekomendasi paket yang paling sesuai dengan kondisi rumah Anda!</p>

<p><em>Bersih itu investasi, bukan pengeluaran. 🏠✨</em></p>`,
    author: 'NingClean Team',
    categorySlug: 'deep-cleaning',
    tags: ['general cleaning', 'deep cleaning', 'perbandingan', 'tips', 'cleaning'],
    readTime: 7,
    isFeatured: true
  },

  // Artikel 3 - Deep Cleaning
  {
    slug: 'area-rumah-sering-terlewat-deep-cleaning',
    title: 'Area Rumah yang Paling Sering Terlewat Saat Deep Cleaning',
    excerpt: 'Meski sudah deep cleaning, ada area-area tersembunyi yang sering terlewat. Jangan sampai kotoran menumpuk di tempat-tempat ini!',
    content: `<p>Anda sudah capek-capek deep cleaning seharian penuh, tapi beberapa minggu kemudian bau aneh muncul lagi. Debu masih berjatuhan dari langit-langit. Ada yang salah?</p>

<p>Kemungkinan besar, ada <strong>area tersembunyi</strong> yang terlewat saat cleaning. Area-area ini adalah "kamar kecil" bagi kotoran, debu, dan bakteri untuk berkumpul dan berkembang biak.</p>

<h2>8 Area yang Paling Sering Terlewat</h2>

<h3>1. Di Balik dan Di Bawah Furniture Berat</h3>

<p>Lemari besar, sofa tiga dudukan, tempat tidur king size—furniture yang sulit dipindahkan seringkali diabaikan. Padahal di bawahnya bisa berkumpul:</p>

<ul>
  <li>Debu tebal yang mengendap</li>
  <li>Rambut rontok dan serat kain</li>
  <li>Sisa makanan (jika ada anak/anabul)</li>
  <li>Tungau dan kutu</li>
</ul>

<details>
  <summary>💡 Tips Membersihkan Area Ini</summary>
  <p>Gunakan <strong>vacuum cleaner dengan extension hose</strong> untuk menjangkau area sempit. Untuk furniture berat, geser perlahan dengan bantuan furniture slider atau minta bantuan anggota keluarga. Jangan lupa bersihkan <em>wall</em> di belakang furniture juga!</p>
</details>

<h3>2. Atas Kitchen Cabinet dan Kulkas</h3>

<p>Area ini adalah <strong>magnet debu dan grease</strong> di dapur. Karena tidak terlihat dari bawah, sering terlupakan padahal mengumpulkan kotoran paling banyak.</p>

<div class="callout callout-warning">
  <span class="callout-icon">⚠️</span>
  <p><strong>Bahaya:</strong> Grease yang menumpuk bisa menyebabkan <strong>bau tak sedap</strong> dan bahkan <strong>potensi kebakaran</strong> jika terkena api kompor!</p>
</div>

<h3>3. Dalam Exhaust Hood dan Filter</h3>

<p>Filter hood penyerap asap dapur penuh dengan grease. Jika tidak dibersihkan rutin, efisiensinya menurun dan bisa jadi sumber bau.</p>

<h3>4. Grout dan Celah Keramik</h3>

<p>Grout (senar antar keramik) adalah tempat favorit jamur dan noda membandel. Terutama di kamar mandi dan area dapur.</p>

<table>
  <thead>
    <tr>
      <th>Area</th>
      <th>Masalah Umum</th>
      <th>Solusi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Kamar mandi</td>
      <td>Jamur hitam</td>
      <td>Sikat dengan sikat keras + pembersih khusus grout</td>
    </tr>
    <tr>
      <td>Dapur</td>
      <td>Noda minyak</td>
      <td>Pasta baking soda + cuka</td>
    </tr>
    <tr>
      <td>Teras</td>
      <td>Lumut</td>
      <td>Pressure washer atau sikat keras + air hangat</td>
    </tr>
  </tbody>
</table>

<h3>5. Di Dalam Lemari dan Laci</h3>

<p>Jangan cuma lap luarannya! Dalam lemari dan laci juga mengumpulkan debu, serangga kecil, dan benda-benda yang terlupakan.</p>

<h3>6. Area Plafon dan Sudut Langit-Langit</h3>

<p>Debu dan jaring laba-laba suka berkumpul di sudut langit-langit. Area ini sering terlewat karena sulit dijangkau tanpa tangga.</p>

<h3>7. Belakang dan Bawah Kulkas</h3>

<p>Coil pendingin dan area di belakang kulkas adalah sarang debu. Debu yang menumpuk bisa mengurangi efisiensi pendinginan dan meningkatkan tagihan listrik!</p>

<h3>8. Ventilasi AC dan Exhaust Fan</h3>

<p>Ventilasi yang tersumbat debu tidak hanya mengurangi sirkulasi udara, tapi juga menyebarkan debu kembali ke ruangan.</p>

<h2>Checklist Area Tersembunyi</h2>

<p>Pastikan checklist ini ter-centang saat deep cleaning berikutnya:</p>

<ul>
  <li><input type="checkbox"> Di bawah semua furniture berat</li>
  <li><input type="checkbox"> Di balik furniture menempel dinding</li>
  <li><input type="checkbox"> Atas kitchen cabinet</li>
  <li><input type="checkbox"> Atas kulkas</li>
  <li><input type="checkbox"> Filter exhaust hood</li>
  <li><input type="checkbox"> Semua grout keramik</li>
  <li><input type="checkbox"> Dalam lemari dan laci</li>
  <li><input type="checkbox"> Sudut langit-langit</li>
  <li><input type="checkbox"> Area belakang kulkas</li>
  <li><input type="checkbox"> Ventilasi AC dan exhaust fan</li>
</ul>

<h2>Tips Pro dari NingClean</h2>

<div class="callout callout-info">
  <span class="callout-icon">🎯</span>
  <p><strong>Urutan yang Benar:</strong> Bersihkan dari <strong>atas ke bawah</strong> (langit-langit → dinding → lantai) agar debu yang jatuh bisa terbersihkan di akhir.</p>
</div>

<div class="callout callout-info">
  <span class="callout-icon">🧰</span>
  <p><strong>Peralatan Wajib:</strong> Vacuum dengan berbagai attachment, sikat grout, microfiber cloth, tangga lipat, dan senter (untuk area gelap).</p>
</div>

<h2>Kesimpulan</h2>

<p>Deep cleaning yang sempurna bukan hanya soal membersihkan yang terlihat, tapi juga yang <strong>tersembunyi</strong>. Area-area yang terlewat ini bisa menjadi sumber bau, alergen, dan bahkan masalah kesehatan jika dibiarkan.</p>

<p>Jika terlalu merepotkan untuk mengecek semua area ini sendiri, <strong>NingClean</strong> siap membantu dengan tim profesional yang terlatih untuk tidak melewatkan satu sudut pun!</p>

<p><em>Bersih yang benar-benar bersih, bukan cuma terlihat bersih. 🧹✨</em></p>`,
    author: 'NingClean Team',
    categorySlug: 'deep-cleaning',
    tags: ['deep cleaning', 'area tersembunyi', 'tips', 'checklist', 'rumah bersih'],
    readTime: 6,
    isFeatured: false
  }
];

async function main() {
  const progress = loadProgress();
  
  // Find next article to create
  let nextIndex = progress.lastCreatedIndex;
  
  while (nextIndex < articles.length) {
    const articleData = articles[nextIndex];
    
    // Check if already created
    if (progress.completed.includes(articleData.slug)) {
      console.log(`Skipping ${articleData.slug} (already created)`);
      nextIndex++;
      continue;
    }
    
    // Get category
    const category = await prisma.blogCategory.findUnique({
      where: { slug: articleData.categorySlug }
    });
    
    if (!category) {
      console.error(`Kategori ${articleData.categorySlug} tidak ditemukan`);
      progress.failed.push({ slug: articleData.slug, error: 'Category not found' });
      nextIndex++;
      continue;
    }
    
    // Prepare article
    const article = {
      slug: articleData.slug,
      title: articleData.title,
      excerpt: articleData.excerpt,
      content: articleData.content,
      author: articleData.author,
      category: { connect: { id: category.id } },
      tags: articleData.tags,
      readTime: articleData.readTime,
      publishedAt: new Date(),
      isFeatured: articleData.isFeatured
    };
    
    try {
      // Create article
      await prisma.blogPost.create({ data: article });
      
      console.log(`✅ Created: ${article.title}`);
      
      // Update progress
      progress.completed.push(articleData.slug);
      progress.lastCreatedIndex = nextIndex + 1;
      saveProgress(progress);
      
      break; // Only create 1 article per run
    } catch (error) {
      console.error(`❌ Failed: ${article.title}`);
      console.error(error.message);
      progress.failed.push({ slug: articleData.slug, error: error.message });
      saveProgress(progress);
      break;
    }
  }
  
  if (nextIndex >= articles.length) {
    console.log('🎉 All articles completed!');
    console.log(`Total created: ${progress.completed.length}`);
    if (progress.failed.length > 0) {
      console.log(`Failed: ${progress.failed.length}`);
      console.log(progress.failed.map(f => `- ${f.slug}: ${f.error}`).join('\n'));
    }
  } else {
    console.log(`Progress: ${progress.completed.length}/${articles.length} articles`);
    console.log(`Next run will create article #${nextIndex + 2}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
