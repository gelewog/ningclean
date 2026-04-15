const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.blogCategory.findUnique({
    where: { slug: 'pembersihan-sofa' }
  });

  if (!category) {
    console.error('Kategori Pembersihan Sofa tidak ditemukan');
    process.exit(1);
  }

  const contentFile = path.join(__dirname, 'article-8-content.txt');
  let content = fs.existsSync(contentFile) ? fs.readFileSync(contentFile, 'utf8') : '<p>Konten artikel.</p>';

  const article = {
    slug: 'sofa-fabric-vs-kulit-perawatan-berbeda',
    title: 'Sofa Fabric vs Kulit: Perawatan yang Berbeda',
    excerpt: 'Sofa fabric dan kulit punya karakteristik berbeda yang membutuhkan pendekatan perawatan berbeda. Jangan sampai salah treatment!',
    content: content,
    author: 'NingClean Team',
    category: { connect: { id: category.id } },
    tags: ['sofa fabric', 'sofa kulit', 'perawatan sofa', 'tips', 'furniture care'],
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

  console.log('✅ Artikel 8 berhasil!');
  console.log('Title:', article.title);
  console.log('Category:', category.name);
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
