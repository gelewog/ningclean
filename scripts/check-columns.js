const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Check column names in booking_items
  const columns = await prisma.$queryRaw`
    SELECT column_name FROM information_schema.columns WHERE table_name = 'booking_items'
  `
  console.log('Columns in booking_items:')
  columns.forEach(c => console.log('  -', c.column_name))
  
  // Check column names in services
  const serviceCols = await prisma.$queryRaw`
    SELECT column_name FROM information_schema.columns WHERE table_name = 'services'
  `
  console.log('\nColumns in services:')
  serviceCols.forEach(c => console.log('  -', c.column_name))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
