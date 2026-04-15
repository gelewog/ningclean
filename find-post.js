const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findPost() {
  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        title: {
          contains: '5 Tips Sederhana Menjaga Kebersihan Rumah Setiap Hari'
        }
      }
    });
    console.log(JSON.stringify(post, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

findPost();
