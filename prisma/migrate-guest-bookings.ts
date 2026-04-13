/**
 * Migration Script: Move guest data from Booking to Customer table
 * Run with: npx ts-node prisma/migrate-guest-bookings.ts
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateGuestBookings() {
  console.log('Starting migration: Guest Bookings → Customer...')

  // 1. Get all bookings with guest data
  const guestBookings = await prisma.$queryRawUnsafe(`
    SELECT id, "guestName", "guestEmail", "guestPhone"
    FROM bookings
    WHERE "guestEmail" IS NOT NULL
    ORDER BY "createdAt" ASC
  `) as { id: string; guestName: string; guestEmail: string; guestPhone: string | null }[]

  console.log(`Found ${guestBookings.length} bookings with guest data`)

  // 2. Group by email to find unique customers
  const emailToCustomer = new Map<string, { name: string; phone: string | null; bookingIds: string[] }>()

  for (const booking of guestBookings) {
    const email = booking.guestEmail.toLowerCase().trim()
    
    if (!emailToCustomer.has(email)) {
      emailToCustomer.set(email, {
        name: booking.guestName,
        phone: booking.guestPhone,
        bookingIds: []
      })
    }
    
    emailToCustomer.get(email)!.bookingIds.push(booking.id)
  }

  console.log(`Found ${emailToCustomer.size} unique guest customers`)

  // 3. Create customers and update bookings
  let migratedCount = 0
  
  for (const [email, data] of emailToCustomer) {
    try {
      // Check if customer already exists
      const existingCustomer = await prisma.customer.findFirst({
        where: { email: email }
      })

      let customerId: string

      if (existingCustomer) {
        console.log(`Customer with email ${email} already exists, using existing customer`)
        customerId = existingCustomer.id
        
        // Update source to guest if not set
        if (existingCustomer.source !== 'guest') {
          await prisma.customer.update({
            where: { id: customerId },
            data: { source: 'guest' }
          })
        }
      } else {
        // Create new customer
        const customer = await prisma.customer.create({
          data: {
            name: data.name,
            email: email,
            phone: data.phone,
            source: 'guest',
            addresses: '[]'
          }
        })
        customerId = customer.id
        console.log(`Created customer: ${email} (ID: ${customerId})`)
      }

      // Update all bookings for this customer
      for (const bookingId of data.bookingIds) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { customerId: customerId }
        })
        migratedCount++
      }

      console.log(`Migrated ${data.bookingIds.length} bookings for ${email}`)
    } catch (error) {
      console.error(`Failed to migrate customer ${email}:`, error)
    }
  }

  // 4. Handle bookings without any customer (edge case - shouldn't happen but safe to handle)
  const orphanedBookings = await prisma.$queryRawUnsafe(`
    SELECT id, "guestName", "guestEmail", "guestPhone"
    FROM bookings
    WHERE "customerId" IS NULL
  `) as { id: string; guestName: string | null; guestEmail: string | null; guestPhone: string | null }[]

  console.log(`Found ${orphanedBookings.length} orphaned bookings`)

  for (const booking of orphanedBookings) {
    try {
      // Create generic customer
      const customer = await prisma.customer.create({
        data: {
          name: booking.guestName || 'Unknown Customer',
          email: booking.guestEmail || `unknown-${booking.id}@temp.com`,
          phone: booking.guestPhone,
          source: 'guest',
          addresses: '[]'
        }
      })

      await prisma.booking.update({
        where: { id: booking.id },
        data: { customerId: customer.id }
      })

      migratedCount++
      console.log(`Created generic customer for orphaned booking ${booking.id}`)
    } catch (error) {
      console.error(`Failed to handle orphaned booking ${booking.id}:`, error)
    }
  }

  console.log(`\n✅ Migration complete!`)
  console.log(`- ${emailToCustomer.size} customers created/linked`)
  console.log(`- ${migratedCount} bookings updated`)
}

migrateGuestBookings()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
