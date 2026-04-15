const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  // Get category ID for Pembersihan Sofa
  const category = await prisma.blogCategory.findUnique({
    where: { slug: 'pembersihan-sofa' }
  });

  if (!category) {
    console.error('Kategori Pembersihan Sofa tidak ditemukan');
    process.exit(1);
  }

  // Load content from file
  const contentFile = path.join(__dirname, 'article-7-content.txt');
  let content = '';
  
  if (fs.existsSync(contentFile)) {
    content = fs.readFileSync(contentFile, 'utf8');
  } else {
    content = '<p>Konten artikel akan ditambahkan.</p>';
  }

  const article = {
    slug: 'jenis-noda-sofa-harus-segera-ditangani',
    title: 'Jenis Noda di Sofa yang Harus Segera Ditangani (Sebelum Menetap!)',
    excerpt: 'Noda di sofa bukan semuanya sama. Beberapa jenis harus ditangani dalam hitungan menit sebelum menetap permanen. Kenali 5 jenis noda berbahaya ini.',
    content: content,
    author: 'NingClean Team',
    category: { connect: { id: category.id } },
    tags: ['noda sofa', 'pembersihan sofa', 'tips', 'emergency cleaning', 'sofa care'],
    readTime: 6,
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

  console.log('✅ Artikel 7 berhasil dibuat/updated!');
  console.log('Title:', article.title);
  console.log('Slug:', article.slug);
  console.log('Category:', category.name);
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
