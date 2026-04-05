const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Cleaning up duplicate testimonials...\n')

  // Get all testimonials
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'asc' }
  })

  // Find duplicates by name + role
  const seen = new Map()
  const toDelete = []

  testimonials.forEach(t => {
    const key = `${t.name}-${t.role}`
    if (seen.has(key)) {
      // This is a duplicate, mark for deletion (keep the first one)
      toDelete.push(t.id)
    } else {
      seen.set(key, t.id)
    }
  })

  console.log(`Found ${toDelete.length} duplicate testimonials to delete`)

  if (toDelete.length > 0) {
    await prisma.testimonial.deleteMany({
      where: { id: { in: toDelete } }
    })
    console.log('✅ Deleted duplicate testimonials')
  }

  // Verify
  const remaining = await prisma.testimonial.findMany({
    orderBy: { order: 'asc' }
  })

  console.log(`\nRemaining testimonials: ${remaining.length}`)
  remaining.forEach((t, i) => {
    console.log(`${i + 1}. ${t.name} (${t.role || 'no role'})`)
  })

  console.log('\n✅ Cleanup completed!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
