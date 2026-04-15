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

  const contentFile = path.join(__dirname, 'article-11-content.txt');
  let content = fs.existsSync(contentFile) ? fs.readFileSync(contentFile, 'utf8') : '<p>Konten artikel.</p>';

  const article = {
    slug: 'karpet-bau-dan-kusam-ini-solusinya',
    title: 'Karpet Bau dan Kusam? Ini Solusinya!',
    excerpt: 'Karpet yang bau dan kusam bukan berarti harus dibuang. Dengan treatment yang tepat, karpet bisa kembali seperti baru. Inilah panduan lengkapnya.',
    content: content,
    author: 'NingClean Team',
    category: { connect: { id: category.id } },
    tags: ['cuci karpet', 'karpet bau', 'karpet kusam', 'tips', 'furniture cleaning'],
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

  console.log('✅ Artikel 11 berhasil!');
  console.log('Title:', article.title);
  console.log('Category:', category.name);
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });