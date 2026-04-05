const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('=== LINKING BOOKINGS TO CUSTOMERS ===\n')

  // Get the guest customer
  const guestCustomer = await prisma.customer.findFirst({
    where: { email: 'gelewog@gmail.com' }
  })

  if (!guestCustomer) {
    console.log('Guest customer not found!')
    return
  }

  console.log(`Guest customer: ${guestCustomer.name} (${guestCustomer.email})`)
  console.log(`Customer ID: ${guestCustomer.id}\n`)

  // Update all bookings with this email to link to customer
  const result = await prisma.booking.updateMany({
    where: {
      guestEmail: 'gelewog@gmail.com',
      customerId: null
    },
    data: {
      customerId: guestCustomer.id
    }
  })

  console.log(`Updated ${result.count} bookings to link to customer`)

  // Verify
  const bookings = await prisma.booking.findMany({
    where: { customerId: guestCustomer.id },
    select: { orderNumber: true, guestName: true }
  })

  console.log(`\nBookings now linked to customer:`)
  bookings.forEach(b => console.log(`  - ${b.orderNumber}: ${b.guestName}`))

  console.log('\n=== DONE ===')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
