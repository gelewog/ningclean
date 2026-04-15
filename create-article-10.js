const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.blogCategory.findUnique({
    where: { slug: 'cuci-spring-bed' }
  });

  if (!category) {
    console.error('Kategori tidak ditemukan');
    process.exit(1);
  }

  const contentFile = path.join(__dirname, 'article-10-content.txt');
  let content = fs.existsSync(contentFile) ? fs.readFileSync(contentFile, 'utf8') : '<p>Konten artikel.</p>';

  const article = {
    slug: 'dampak-debu-tungau-kasur-kesehatan-anak',
    title: 'Dampak Debu Tungau di Kasur bagi Kesehatan Anak',
    excerpt: 'Anak-anak lebih rentan terhadap alergen di kasur. Pelajari risiko kesehatan dan cara melindungi buah hati Anda dari tungau debu.',
    content: content,
    author: 'NingClean Team',
    category: { connect: { id: category.id } },
    tags: ['debu tungau', 'kesehatan anak', 'alergi', 'cuci spring bed', 'parenting'],
    readTime: 6,
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

  console.log('✅ Artikel 10 berhasil!');
  console.log('Title:', article.title);
  console.log('Category:', category.name);
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
