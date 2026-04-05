const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('=== DATABASE CHECK: Users/Customers ===\n')

  // Check all users
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  console.log(`Total users in database: ${users.length}\n`)

  if (users.length === 0) {
    console.log('⚠️ WARNING: No users found in database!')
    console.log('The customers page expects data in the "users" table.')
  } else {
    console.log('Users found:')
    users.forEach(u => {
      console.log(`  - ${u.name} | ${u.email} | Role: ${u.role} | VIP: ${u.isVip || false}`)
    })
  }

  // Check for customers specifically
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    orderBy: { createdAt: 'desc' },
  })

  console.log(`\nCustomers (role=CUSTOMER): ${customers.length}`)

  // Check if customer table exists (if any)
  try {
    const customerCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM customers`
    console.log(`Legacy "customers" table: ${customerCount[0]?.count || 0} rows`)
  } catch (e) {
    console.log('Legacy "customers" table: Does not exist (OK)')
  }

  // Check bookings table for guest data
  const bookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  })

  console.log(`\nBookings: ${bookings.length} recent bookings`)
  if (bookings.length > 0) {
    console.log('Sample booking:')
    bookings.forEach(b => {
      console.log(`  - ${b.orderNumber} | ${b.guestName || 'No guest name'} | Status: ${b.status}`)
    })
  }

  // Check site_settings for default data
  const siteSettings = await prisma.siteSettings.findFirst()
  console.log(`\nSite Settings: ${siteSettings ? 'Found' : 'Not found'}`)

  console.log('\n=== END CHECK ===')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
