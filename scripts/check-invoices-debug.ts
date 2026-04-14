import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== DEBUG: Checking Bookings and Invoices ===\n');

  // Check all bookings with their status
  const bookings = await prisma.booking.findMany({
    include: {
      customer: true,
      invoice: true,
      items: {
        include: { service: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  console.log(`Total bookings: ${bookings.length}\n`);

  bookings.forEach((booking) => {
    console.log('---');
    console.log(`ID: ${booking.id}`);
    console.log(`Order Number: ${booking.orderNumber}`);
    console.log(`Status: ${booking.status}`);
    console.log(`Customer: ${booking.customer?.name || 'N/A'}`);
    console.log(`Total Amount: Rp ${Number(booking.totalAmount).toLocaleString('id-ID')}`);
    console.log(`Has Invoice: ${booking.invoice ? 'YES' : 'NO'}`);
    if (booking.invoice) {
      console.log(`Invoice Number: ${booking.invoice.invoiceNumber}`);
      console.log(`Invoice Status: ${booking.invoice.status}`);
    }
    console.log(`Items: ${booking.items.length}`);
    booking.items.forEach(item => {
      console.log(`  - ${item.service.name} (Qty: ${item.quantity}, Price: ${item.price})`);
    });
    console.log('');
  });

  // Check invoices
  console.log('\n=== All Invoices ===');
  const invoices = await prisma.invoice.findMany({
    include: { booking: true },
    orderBy: { createdAt: 'desc' }
  });
  console.log(`Total invoices: ${invoices.length}`);
  invoices.forEach(inv => {
    console.log(`- ${inv.invoiceNumber} | Booking: ${inv.bookingId} | Status: ${inv.status}`);
  });

  // Check invoice templates
  console.log('\n=== Invoice Templates ===');
  const templates = await prisma.invoiceTemplate.findMany();
  console.log(`Total templates: ${templates.length}`);
  templates.forEach(t => {
    console.log(`- ${t.name} | isDefault: ${t.isDefault} | taxRate: ${t.taxRate}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
