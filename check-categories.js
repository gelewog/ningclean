const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: 'asc' }
  });
  
  console.log('Total kategori: ' + categories.length);
  console.log('');
  console.log('List kategori:');
  console.log('========================================');
  
  categories.forEach((cat, i) => {
    console.log((i + 1) + '. ' + cat.name + ' (slug: ' + cat.slug + ')');
  });
  
  // Also check blog posts count
  const postsCount = await prisma.blogPost.count();
  console.log('');
  console.log('Total artikel: ' + postsCount);
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
