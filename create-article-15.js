const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.blogCategory.findUnique({
    where: { slug: 'kesehatan-hygiene' }
  });

  if (!category) {
    console.error('Kategori Kesehatan & Hygiene tidak ditemukan');
    process.exit(1);
  }

  const contentFile = path.join(__dirname, 'article-15-content.txt');
  let content = fs.existsSync(contentFile) ? fs.readFileSync(contentFile, 'utf8') : '<p>Konten artikel.</p>';

  const article = {
    slug: 'kebersihan-rumah-dan-sistem-imun-tubuh',
    title: 'Hubungan Antara Kebersihan Rumah dan Sistem Imun Tubuh',
    excerpt: 'Terlalu bersih bisa melemahkan imun? Atau justru kurang bersih yang bikin sakit? Mari kita bahas hubungan ilmiah antara kebersihan rumah dan kesehatan immune system.',
    content: content,
    author: 'NingClean Team',
    category: { connect: { id: category.id } },
    tags: ['kebersihan rumah', 'sistem imun', 'kesehatan', 'immune system', 'hygiene hypothesis'],
    readTime: 7,
    publishedAt: new Date(),
    isFeatured: true
  };

  const existing = await prisma.blogPost.findUnique({ where: { slug: article.slug } });
  
  if (existing) {
    await prisma.blogPost.update({ where: { slug: article.slug }, data: article });
    console.log('Artikel diupdate...');
  } else {
    await prisma.blogPost.create({ data: article });
    console.log('Artikel baru dibuat...');
  }

  console.log('✅ Artikel 15 (TERAKHIR) berhasil!');
  console.log('Title:', article.title);
  console.log('Category:', category.name);
  console.log('');
  console.log('🎉 COMPLETE: Semua 15 artikel sudah dibuat!');
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });