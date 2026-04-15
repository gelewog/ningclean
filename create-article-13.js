const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.blogCategory.findUnique({
    where: { slug: 'kebersihan-kantor' }
  });

  if (!category) {
    console.error('Kategori Kebersihan Kantor tidak ditemukan');
    process.exit(1);
  }

  const contentFile = path.join(__dirname, 'article-13-content.txt');
  let content = fs.existsSync(contentFile) ? fs.readFileSync(contentFile, 'utf8') : '<p>Konten artikel.</p>';

  const article = {
    slug: 'kebersihan-kantor-mempengaruhi-mood-kerja',
    title: 'Mengapa Kebersihan Kantor Mempengaruhi Mood Kerja Karyawan',
    excerpt: 'Meja berantakan dan lingkungan kotor bukan cuma mengganggu—ini berdampak langsung pada produktivitas, mood, dan kesehatan mental karyawan. Inilah ilmiahnya.',
    content: content,
    author: 'NingClean Team',
    category: { connect: { id: category.id } },
    tags: ['kebersihan kantor', 'produktivitas', 'mood kerja', 'workplace', 'employee wellness'],
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

  console.log('✅ Artikel 13 berhasil!');
  console.log('Title:', article.title);
  console.log('Category:', category.name);
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });