const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const customers = await prisma.customer.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { bookings: true }
  });
  console.log('Customers:');
  console.log(JSON.stringify(customers, null, 2));
  await prisma.$disconnect();
}
main().catch(console.error);
