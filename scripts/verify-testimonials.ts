/**
 * Script to verify testimonials data after schema update
 * Run: npx ts-node scripts/verify-testimonials.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Fetching all testimonials...')

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' }
  })

  console.log(`Found ${testimonials.length} testimonials`)
  console.log('')

  for (const t of testimonials) {
    console.log(`---`)
    console.log(`ID: ${t.id}`)
    console.log(`Name: ${t.name}`)
    console.log(`Role: ${t.role || '(none)'}`)
    console.log(`Company: ${t.company || '(none)'}`)
    console.log(`Content: ${t.content.substring(0, 50)}...`)
    console.log(`Rating: ${t.rating}`)
    console.log(`Image: ${t.image || '(none)'}`)
    console.log(`Area: ${t.areaSlug || '(all)'}`)
    console.log(`Order: ${t.order}`)
    console.log(`isActive: ${t.isActive}`)
    console.log(`isFeatured: ${t.isFeatured}`)
  }

  console.log('')
  console.log('✅ Schema update verified!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
