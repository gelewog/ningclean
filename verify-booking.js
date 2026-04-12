const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const b = await prisma.booking.findFirst({ 
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  });
  
  console.log('═══════════════════════════════════════════');
  console.log('   BOOKING TERBARU');
  console.log('═══════════════════════════════════════════');
  console.log('Order Number:', b.orderNumber);
  console.log('Customer:', b.customerName);
  console.log('Email:', b.customerEmail);
  console.log('Phone:', b.customerPhone);
  console.log('Notes:', b.notes || '(kosong)');
  console.log('Status:', b.status);
  console.log('Total:', b.totalAmount);
  console.log('Items:', b.items?.length || 0);
  console.log('Created:', b.createdAt);
  
  await prisma.$disconnect();
}

check().catch(console.error);
