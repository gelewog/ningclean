const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Renaming postalCodes to coverage in database...\n')

  try {
    // Step 1: Add new coverage column
    await prisma.$executeRaw`ALTER TABLE service_areas ADD COLUMN coverage TEXT[]`
    console.log('✅ Added coverage column')

    // Step 2: Copy data from postalCodes to coverage
    await prisma.$executeRaw`UPDATE service_areas SET coverage = postal_codes`
    console.log('✅ Copied data from postalCodes to coverage')

    // Step 3: Drop old column
    await prisma.$executeRaw`ALTER TABLE service_areas DROP COLUMN postal_codes`
    console.log('✅ Dropped postal_codes column')

    console.log('\n✅ Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
