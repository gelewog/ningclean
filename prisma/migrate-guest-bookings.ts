/**
 * Migration Script: Migrate guest booking data to Customer table
 *
 * This script migrates all bookings with guestName/guestEmail/guestPhone
 * to use the normalized Customer table structure.
 *
 * Run: npx ts-node prisma/migrate-guest-bookings.ts
 */

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function migrate() {
  console.log('Starting migration of guest bookings to Customer table...\n');

  // Find all bookings that have guest data but no customerId
  const guestBookings = await prisma.booking.findMany({
    where: {
      customerId: null,
      OR: [
        { guestName: { not: null } },
        { guestEmail: { not: null } },
        { guestPhone: { not: null } },
      ],
    },
    select: {
      id: true,
      guestName: true,
      guestEmail: true,
      guestPhone: true,
    },
  });

  console.log(`Found ${guestBookings.length} guest bookings to migrate\n`);

  if (guestBookings.length === 0) {
    console.log('No guest bookings to migrate. Migration complete.');
    return;
  }

  // Group bookings by email to create one customer per unique email
  const emailGroups = new Map<string, typeof guestBookings>();
  for (const booking of guestBookings) {
    const email = booking.guestEmail || 'anonymous@no-email.local';
    if (!emailGroups.has(email)) {
      emailGroups.set(email, []);
    }
    emailGroups.get(email)!.push(booking);
  }

  console.log(`Found ${emailGroups.size} unique customer emails to create\n`);

  let migratedCustomers = 0;
  let migratedBookings = 0;
  let errors = 0;

  for (const [email, bookings] of emailGroups) {
    try {
      // Get first booking data for customer info
      const firstBooking = bookings[0];
      const customerName = firstBooking.guestName || 'Guest';
      const customerPhone = firstBooking.guestPhone || null;

      // Check if customer with this email already exists
      let customer = email !== 'anonymous@no-email.local'
        ? await prisma.customer.findFirst({
            where: {
              email,
              source: 'guest',
            },
          })
        : null;

      if (customer) {
        // Update existing guest customer
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: {
            name: customerName,
            phone: customerPhone,
          },
        });
      } else {
        // Create new customer
        customer = await prisma.customer.create({
          data: {
            name: customerName,
            email: email,
            phone: customerPhone,
            source: 'guest',
          },
        });
      }

      migratedCustomers++;

      // Update all bookings for this customer
      const bookingIds = bookings.map(b => b.id);
      await prisma.booking.updateMany({
        where: { id: { in: bookingIds } },
        data: {
          customerId: customer.id,
          guestName: null,
          guestEmail: null,
          guestPhone: null,
        },
      });

      migratedBookings += bookings.length;
      console.log(`  ✓ Migrated customer ${customer.email}: ${bookings.length} booking(s)`);
    } catch (error) {
      errors++;
      console.error(`  ✗ Error migrating ${email}:`, error);
    }
  }

  console.log('\n========================================');
  console.log('Migration Summary:');
  console.log(`  - Customers created/updated: ${migratedCustomers}`);
  console.log(`  - Bookings migrated: ${migratedBookings}`);
  console.log(`  - Errors: ${errors}`);
  console.log('========================================\n');

  // Verify migration
  const remainingGuestBookings = await prisma.booking.count({
    where: {
      customerId: null,
      OR: [
        { guestName: { not: null } },
        { guestEmail: { not: null } },
        { guestPhone: { not: null } },
      ],
    },
  });

  if (remainingGuestBookings === 0) {
    console.log('✓ All guest bookings successfully migrated!');
  } else {
    console.log(`⚠ ${remainingGuestBookings} guest bookings still remaining (may have null customerId with null guest fields)`);
  }

  // Show sample of migrated data
  const sampleBookings = await prisma.booking.findMany({
    take: 5,
    select: {
      id: true,
      customerId: true,
      customer: {
        select: { name: true, email: true },
      },
    },
  });

  console.log('\nSample of migrated bookings:');
  for (const booking of sampleBookings) {
    console.log(`  Booking ${booking.id.slice(0, 8)}: customerId=${booking.customerId}, name=${booking.customer?.name}`);
  }
}

migrate()
  .then(() => {
    console.log('\nMigration script completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
