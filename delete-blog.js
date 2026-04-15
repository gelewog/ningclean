const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.blogPost.count();
    console.log('Total artikel yang akan dihapus: ' + count);
    
    if (count === 0) {
      console.log('Tidak ada artikel untuk dihapus');
      return;
    }
    
    const result = await prisma.blogPost.deleteMany({});
    
    console.log('Berhasil menghapus ' + result.count + ' artikel');
    
    const remaining = await prisma.blogPost.count();
    console.log('Sisa artikel: ' + remaining);
  } catch (e) {
    console.error('Error:', e.message);
    if (e.code) console.error('Code:', e.code);
  } finally {
    await prisma.$disconnect();
  }
}

main();
