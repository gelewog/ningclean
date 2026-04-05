const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('=== Testimonials Data Check ===\n')

  // Check testimonials table
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { order: 'asc' }
  })

  console.log(`Total testimonials in DB: ${testimonials.length}`)
  testimonials.forEach((t, i) => {
    console.log(`${i + 1}. ${t.name} | Role: ${t.role} | Active: ${t.isActive} | Featured: ${t.isFeatured}`)
  })

  // Check if there's a way to identify duplicates (same name and role)
  const seen = new Set()
  const duplicates = testimonials.filter(t => {
    const key = `${t.name}-${t.role}`
    if (seen.has(key)) return true
    seen.add(key)
    return false
  })

  console.log(`\nDuplicate entries: ${duplicates.length}`)
  if (duplicates.length > 0) {
    console.log('Duplicates found - need cleanup')
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
