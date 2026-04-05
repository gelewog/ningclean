const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const tables = await prisma.$queryRaw`
    SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
  `
  console.log('Tables in database:')
  tables.forEach(t => console.log('  -', t.table_name))
  
  // Check BookingItem relation name
  const bookingItems = await prisma.$queryRaw`
    SELECT column_name, table_name FROM information_schema.columns 
    WHERE table_name LIKE '%booking%' OR table_name LIKE '%Booking%'
  `
  console.log('\nBooking related tables/columns:')
  bookingItems.forEach(c => console.log('  -', c.table_name + '.' + c.column_name))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
