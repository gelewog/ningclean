const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== CHECK LATEST BOOKING ===\n');
  
  // Get latest booking with customer
  const latestBooking = await prisma.booking.findFirst({
    orderBy: { createdAt: 'desc' },
    include: {
      customer: true,
      items: {
        include: {
          service: true
        }
      }
    }
  });
  
  console.log('Latest Booking:');
  console.log(JSON.stringify(latestBooking, null, 2));
  
  // Check Customer table for guest bookings
  console.log('\n=== GUEST CUSTOMERS ===');
  const guestCustomers = await prisma.customer.findMany({
    where: { source: 'guest' },
    include: { bookings: true }
  });
  
  console.log(`Guest customers: ${guestCustomers.length}`);
  guestCustomers.forEach(c => {
    console.log(`  - ${c.name} (${c.email}): ${c.bookings.length} bookings`);
  });
  
  // Verify no guest fields in booking
  console.log('\n=== BOOKING FIELDS ===');
  console.log('Has guestName:', 'guestName' in latestBooking);
  console.log('Has guestEmail:', 'guestEmail' in latestBooking);
  console.log('Has guestPhone:', 'guestPhone' in latestBooking);
  console.log('Has customerId:', 'customerId' in latestBooking);
  
  prisma.$disconnect();
}

main().catch(console.error);
