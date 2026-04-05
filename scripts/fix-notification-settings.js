const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Updating notification settings...');
  
  const result = await prisma.notificationSettings.update({
    where: { id: 'a75a4fae-1561-4cf6-b76a-709a1ef20b99' },
    data: {
      emailEnabled: true,
      emailPassword: 'yihxpfpfwehvziqv'
    }
  });
  
  console.log('Updated settings:', JSON.stringify(result, null, 2));
  console.log('\nEmail is now ENABLED with app password set!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
