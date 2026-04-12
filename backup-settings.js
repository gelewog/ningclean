const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const oldSettings = await prisma.notificationSettings.findFirst();
    console.log('Old settings backup:');
    console.log(JSON.stringify(oldSettings, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}
main();
