/**
 * Script to update all existing services to have empty availableCities (all cities)
 * Run: npx ts-node scripts/update-services-cities.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Updating all services with availableCities = [] (all cities)...')

  const services = await prisma.service.findMany()

  let updated = 0
  for (const s of services) {
    await prisma.service.update({
      where: { id: s.id },
      data: { availableCities: [] }
    })
    updated++
    console.log(`  ${s.name} -> all cities`)
  }

  console.log(`✅ Updated ${updated} services`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
