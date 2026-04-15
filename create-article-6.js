const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

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

  // Load content from file
  const contentFile = path.join(__dirname, 'article-6-content.txt');
  let content = '';
  
  if (fs.existsSync(contentFile)) {
    content = fs.readFileSync(contentFile, 'utf8');
  } else {
    // Default content
    content = '<p>Konten artikel akan ditambahkan.</p>';
  }

  const article = {
    slug: 'jadwal-membersihkan-rumah-ideal-orang-sibuk',
    title: 'Jadwal Membersihkan Rumah Ideal untuk Orang Sibuk',
    excerpt: 'Tak punya waktu bersih-bersih? Jadwal pintar ini membagi tugas harian, mingguan, dan bulanan sehingga rumah tetap bersih tanpa memakan waktu berjam-jam.',
    content: content,
    author: 'NingClean Team',
    category: { connect: { id: category.id } },
    tags: ['jadwal cleaning', 'orang sibuk', 'tips kebersihan', 'time management', 'cleaning schedule'],
    readTime: 7,
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

  console.log('✅ Artikel 6 berhasil dibuat/updated!');
  console.log('Title:', article.title);
  console.log('Slug:', article.slug);
  console.log('Category:', category.name);
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
