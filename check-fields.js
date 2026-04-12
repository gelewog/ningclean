const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const booking = await prisma.booking.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { id: true, address: true, city: true, area: true }
  });
  console.log('Latest booking fields:');
  console.log(JSON.stringify(booking, null, 2));
  await prisma.$disconnect();
}
main().catch(console.error);
