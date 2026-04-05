const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  console.log('=== NotificationSettings Table ===\n');
  
  const settings = await prisma.notificationSettings.findFirst();
  console.log(JSON.stringify(settings, null, 2));
  
  console.log('\n=== SiteSettings Table ===\n');
  
  const siteSettings = await prisma.siteSettings.findFirst();
  console.log(JSON.stringify(siteSettings, null, 2));
  
  await prisma.$disconnect();
}

check().catch(console.error);
