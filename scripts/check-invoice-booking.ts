import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check directly in DB
  console.log('=== Checking Invoice in DB ===\n');

  const invoices = await prisma.invoice.findMany({
    include: { booking: true }
  });

  console.log(`Total invoices: ${invoices.length}`);
  invoices.forEach(inv => {
    console.log(`- Invoice: ${inv.invoiceNumber}`);
    console.log(`  Booking ID: ${inv.bookingId}`);
    console.log(`  Status: ${inv.status}`);
    console.log(`  Booking Order: ${inv.booking.orderNumber}`);
    console.log('');
  });

  // Check if booking has invoice
  const bookingId = '49acff0f-acb0-4552-b478-df98c9561c1d';
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { invoice: true }
  });

  console.log('=== Single Booking Check ===');
  console.log(`Booking ID: ${booking?.id}`);
  console.log(`Order: ${booking?.orderNumber}`);
  console.log(`Has Invoice: ${booking?.invoice ? 'YES' : 'NO'}`);
  if (booking?.invoice) {
    console.log(`Invoice Number: ${booking.invoice.invoiceNumber}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
