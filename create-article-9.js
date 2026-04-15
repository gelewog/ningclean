const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.blogCategory.findUnique({
    where: { slug: 'cuci-spring-bed' }
  });

  if (!category) {
    console.error('Kategori Cuci Spring Bed tidak ditemukan');
    process.exit(1);
  }

  const contentFile = path.join(__dirname, 'article-9-content.txt');
  let content = fs.existsSync(contentFile) ? fs.readFileSync(contentFile, 'utf8') : '<p>Konten artikel.</p>';

  const article = {
    slug: 'tanda-tanda-kasur-butuh-dicuci-profesional',
    title: 'Tanda-Tanda Kasur Anda Butuh Dicuci Profesional',
    excerpt: 'Kasur yang kotor bukan cuma masalah estetika. Kenali 7 tanda warning ini sebelum kesehatan Anda terdampak. Jangan tunggu sampai terlambat!',
    content: content,
    author: 'NingClean Team',
    category: { connect: { id: category.id } },
    tags: ['cuci spring bed', 'kasur kotor', 'tungau', 'kesehatan', 'deep cleaning'],
    readTime: 6,
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

  console.log('✅ Artikel 9 berhasil!');
  console.log('Title:', article.title);
  console.log('Category:', category.name);
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
