const { PrismaClient } = require('@prisma/client');

async function backup() {
  const prisma = new PrismaClient();
  try {
    // Raw query untuk ambil data lama
    const result = await prisma.$queryRaw`SELECT * FROM "notification_settings"`;
    console.log('BACKUP OLD SETTINGS:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

backup();
