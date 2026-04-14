/**
 * Script to assign areaSlug to existing testimonials
 * Run: npx ts-node scripts/assign-testimonials-area.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Updating testimonials with areaSlug...')

  // Get all testimonials
  const testimonials = await prisma.testimonial.findMany()

  // Update all to Surabaya as default (since they were created before area feature)
  let updated = 0
  for (const t of testimonials) {
    await prisma.testimonial.update({
      where: { id: t.id },
      data: { areaSlug: 'surabaya' } // Default to Surabaya for existing testimonials
    })
    updated++
    console.log(`  ${t.name} -> surabaya (default)`)
  }

  console.log(`✅ Updated ${updated} testimonials`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
