const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  });
  
  console.log('Total artikel: ' + posts.length);
  console.log('');
  console.log('List artikel:');
  console.log('================================================================================');
  
  posts.forEach((post, i) => {
    console.log((i + 1) + '. ' + post.title);
    console.log('   Slug: ' + post.slug);
    console.log('   Status: ' + post.status);
    console.log('   Category: ' + (post.category ? post.category.name : 'Uncategorized'));
    console.log('   Published: ' + (post.publishedAt ? post.publishedAt.toISOString().split('T')[0] : 'Draft'));
    console.log('--------------------------------------------------------------------------------');
  });
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
