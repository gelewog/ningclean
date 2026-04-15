const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.blogCategory.findUnique({
    where: { slug: 'kebersihan-kantor' }
  });

  if (!category) {
    console.error('Kategori tidak ditemukan');
    process.exit(1);
  }

  const contentFile = path.join(__dirname, 'article-14-content.txt');
  let content = fs.existsSync(contentFile) ? fs.readFileSync(contentFile, 'utf8') : '<p>Konten artikel.</p>';

  const article = {
    slug: 'protokol-kebersihan-kantor-new-normal',
    title: 'Protokol Kebersihan Kantor di Era New Normal',
    excerpt: 'Panduan lengkap protokol kebersihan yang harus diterapkan di kantor untuk menjaga kesehatan karyawan di era new normal dan kebiasaan hygiene baru.',
    content: content,
    author: 'NingClean Team',
    category: { connect: { id: category.id } },
    tags: ['protokol kebersihan', 'new normal', 'kantor', 'hygiene', 'covid'],
    readTime: 7,
    publishedAt: new Date(),
    isFeatured: false
  };

  const existing = await prisma.blogPost.findUnique({ where: { slug: article.slug } });
  
  if (existing) {
    await prisma.blogPost.update({ where: { slug: article.slug }, data: article });
    console.log('Artikel diupdate...');
  } else {
    await prisma.blogPost.create({ data: article });
    console.log('Artikel baru dibuat...');
  }

  console.log('✅ Artikel 14 berhasil!');
  console.log('Title:', article.title);
  console.log('Category:', category.name);
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });