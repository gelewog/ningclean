const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('=== STEP 1: Break old FK constraints ===\n')
  
  // First, set all bookings customerId to null to break old FK
  await prisma.booking.updateMany({
    data: { customerId: null }
  })
  console.log('✓ Cleared customerId in bookings (FK broken)')
  
  console.log('\n=== STEP 2: Check current users ===\n')
  
  // Get all existing users
  const users = await prisma.user.findMany({})
  console.log(`Found ${users.length} total users`)
  
  console.log('\n=== STEP 3: Migration complete - schema can now be pushed ===')
  console.log('Run: npx prisma db push --accept-data-loss')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
