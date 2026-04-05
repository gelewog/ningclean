const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const bookings = await prisma.booking.findMany({ 
    include: { customer: true, items: true } 
  });
  console.log('Total bookings:', bookings.length);
  console.log(JSON.stringify(bookings, null, 2));
  await prisma.$disconnect();
}

main().catch(console.error);
