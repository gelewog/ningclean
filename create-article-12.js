const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.blogCategory.findUnique({
    where: { slug: 'cuci-karpet' }
  });

  if (!category) {
    console.error('Kategori Cuci Karpet tidak ditemukan');
    process.exit(1);
  }

  const contentFile = path.join(__dirname, 'article-12-content.txt');
  let content = fs.existsSync(contentFile) ? fs.readFileSync(contentFile, 'utf8') : '<p>Konten artikel.</p>';

  const article = {
    slug: 'berapa-lama-karpet-dicuci-profesional',
    title: 'Berapa Lama Sekali Karpet Harus Dicuci Profesional?',
    excerpt: 'Tidak semua karpet butuh frekuensi cuci yang sama. Jawaban depends pada usage, household, dan faktor lainnya. Berikut panduan lengkapnya.',
    content: content,
    author: 'NingClean Team',
    category: { connect: { id: category.id } },
    tags: ['frekuensi cuci karpet', 'cuci karpet', 'maintenance', 'tips', 'carpet care'],
    readTime: 5,
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

  console.log('✅ Artikel 12 berhasil!');
  console.log('Title:', article.title);
  console.log('Category:', category.name);
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });