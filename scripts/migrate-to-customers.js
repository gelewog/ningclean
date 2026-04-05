const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('=== MIGRATING CUSTOMER DATA ===\n')

  // Get all existing users with CUSTOMER role
  const existingCustomers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
  })

  console.log(`Found ${existingCustomers.length} existing customers to migrate`)

  // Migrate each customer to new Customer table
  for (const user of existingCustomers) {
    console.log(`Migrating: ${user.name} (${user.email})...`)
    
    try {
      await prisma.customer.create({
        data: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          isVip: user.isVip || false,
          notes: user.notes,
          addresses: user.addresses || [],
          source: 'registered',
          userId: user.id, // Link to original user account
        }
      })
      console.log(`  ✓ Migrated successfully`)
    } catch (e) {
      console.log(`  ✗ Error: ${e.message}`)
    }
  }

  // Also create customers from guest bookings that have emails
  console.log('\n=== CHECKING GUEST BOOKINGS ===')
  
  const bookings = await prisma.booking.findMany({
    where: {
      customerId: null,
      guestEmail: { not: null },
    },
  })

  console.log(`Found ${bookings.length} guest bookings with email`)

  // Get unique guest emails
  const guestEmails = [...new Set(bookings.map(b => b.guestEmail).filter(Boolean))]
  console.log(`Unique guest emails: ${guestEmails.length}`)

  for (const email of guestEmails) {
    // Check if already exists in customers
    const existing = await prisma.customer.findFirst({
      where: { email: email }
    })

    if (existing) {
      console.log(`  Skipping (exists): ${email}`)
      continue
    }

    // Get guest info from first booking
    const guestBooking = bookings.find(b => b.guestEmail === email)
    
    console.log(`Creating guest customer: ${email}...`)
    try {
      await prisma.customer.create({
        data: {
          name: guestBooking.guestName || email.split('@')[0],
          email: email,
          phone: guestBooking.guestPhone,
          source: 'guest',
        }
      })
      console.log(`  ✓ Created successfully`)
    } catch (e) {
      console.log(`  ✗ Error: ${e.message}`)
    }
  }

  console.log('\n=== MIGRATION COMPLETE ===')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
