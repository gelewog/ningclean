const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  // Create test notification
  const notification = await prisma.notification.create({
    data: {
      type: 'BOOKING_NEW',
      title: 'Booking Baru!',
      message: 'Order NC-2026-0001 dari John Doe - Cuci AC',
      data: {
        bookingId: 'test-123',
        orderNumber: 'NC-2026-0001',
        customerName: 'John Doe',
        customerPhone: '08123456789',
        serviceName: 'Cuci AC',
        totalAmount: 150000
      }
    }
  });
  console.log('Created notification:', notification);
  
  // Check count
  const count = await prisma.notification.count({ where: { isRead: false } });
  console.log('Unread count:', count);
  
  await prisma.$disconnect();
}

test().catch(console.error);
