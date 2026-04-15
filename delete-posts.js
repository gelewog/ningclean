const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Get count before deletion
  const beforeCount = await prisma.blogPost.count();
  console.log('Artikel sebelum dihapus: ' + beforeCount);
  
  // Delete all blog posts
  const result = await prisma.blogPost.deleteMany({});
  console.log('Berhasil menghapus: ' + result.count + ' artikel');
  
  // Verify
  const afterCount = await prisma.blogPost.count();
  console.log('Artikel setelah dihapus: ' + afterCount);
}

main()
  .then(() => {
    console.log('Selesai');
    process.exit(0);
  })
  .catch(e => {
    console.error('Error:', e.message);
    console.error(e);
    process.exit(1);
  });
