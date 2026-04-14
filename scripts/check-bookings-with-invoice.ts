import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Simulate what bookings API returns (findAll with include:invoice)
  const bookings = await prisma.booking.findMany({
    include: {
      customer: {
        select: { id: true, name: true, email: true, phone: true },
      },
      items: {
        include: {
          service: {
            select: { id: true, name: true, slug: true, icon: true },
          },
        },
      },
      invoice: {
        select: {
          id: true,
          invoiceNumber: true,
          status: true,
          issuedAt: true,
          paidAt: true,
          total: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  console.log('=== Simulated API Response ===\n');

  bookings.forEach((b: any) => {
    console.log(`Order: ${b.orderNumber}`);
    console.log(`  ID: ${b.id}`);
    console.log(`  Customer: ${b.customer?.name}`);
    console.log(`  Has Invoice: ${b.invoice ? 'YES' : 'NO'}`);
    if (b.invoice) {
      console.log(`  Invoice Number: ${b.invoice.invoiceNumber}`);
      console.log(`  Invoice Status: ${b.invoice.status}`);
    }
    console.log('');
  });

  // Now check specifically for bookings WITH invoices
  console.log('\n=== Bookings WITH Invoices ===');
  const bookingsWithInvoice = await prisma.booking.findMany({
    where: {
      invoice: { isNot: null }
    },
    include: {
      customer: { select: { name: true } },
      invoice: { select: { invoiceNumber: true, status: true } }
    }
  });

  console.log(`Total: ${bookingsWithInvoice.length}`);
  bookingsWithInvoice.forEach((b: any) => {
    console.log(`- ${b.orderNumber} (${b.customer?.name}) -> ${b.invoice?.invoiceNumber} [${b.invoice?.status}]`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
