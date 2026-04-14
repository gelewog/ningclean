/**
 * Script to backup testimonials before schema changes
 * Run: npx ts-node scripts/backup-testimonials.ts
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Fetching all testimonials...')

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' }
  })

  console.log(`Found ${testimonials.length} testimonials`)

  // Create backup
  const backup = {
    timestamp: new Date().toISOString(),
    count: testimonials.length,
    data: testimonials
  }

  const filename = `scripts/backup-testimonials-${Date.now()}.json`
  fs.writeFileSync(filename, JSON.stringify(backup, null, 2))

  console.log(`✅ Backup saved to ${filename}`)
  console.log('')
  console.log('Sample data (first 2):')
  console.log(JSON.stringify(testimonials.slice(0, 2), null, 2))
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
