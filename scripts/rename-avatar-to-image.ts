/**
 * Script to rename avatar column to image in testimonials table
 * Run: npx ts-node scripts/rename-avatar-to-image.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking current schema...')

  // Check if old column exists
  try {
    await prisma.$queryRaw`SELECT avatar FROM testimonials LIMIT 1`
    console.log('Found old column: avatar')
  } catch (e: any) {
    if (e.message?.includes('avatar')) {
      console.log('❌ Column avatar does not exist, nothing to rename')
      return
    }
    // Column might not exist or other error
    console.log('Checking for avatar column...')
  }

  // Rename avatar to image using raw SQL
  try {
    console.log('Renaming avatar to image...')
    await prisma.$executeRawUnsafe(`
      ALTER TABLE testimonials
      RENAME COLUMN avatar TO image
    `)
    console.log('✅ Successfully renamed avatar to image')
  } catch (e: any) {
    console.log('Error or column already renamed:', e.message)
  }

  // Verify the change
  try {
    await prisma.$queryRaw`SELECT image FROM testimonials LIMIT 1`
    console.log('✅ Verified: image column exists')
  } catch (e: any) {
    console.log('❌ Warning: image column not found:', e.message)
  }
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
