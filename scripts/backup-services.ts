/**
 * Script to backup services before schema changes
 * Run: npx ts-node scripts/backup-services.ts
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function main() {
  console.log('Fetching all services...')

  const services = await prisma.service.findMany({
    orderBy: { name: 'asc' }
  })

  console.log(`Found ${services.length} services`)

  // Create backup
  const backup = {
    timestamp: new Date().toISOString(),
    count: services.length,
    data: services
  }

  const filename = `scripts/backup-services-${Date.now()}.json`
  fs.writeFileSync(filename, JSON.stringify(backup, null, 2))

  console.log(`Backup saved to ${filename}`)
  console.log('')
  console.log('Sample data (first 2):')
  console.log(JSON.stringify(services.slice(0, 2), null, 2))
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
