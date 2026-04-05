const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Check service areas
  const areas = await prisma.serviceArea.findMany({ orderBy: { city: 'asc' } })
  console.log('=== Service Areas ===')
  areas.forEach(a => console.log(`- ${a.city} (${a.slug})`))

  // Check booking areas
  const bookings = await prisma.booking.findMany({ select: { area: true } })
  const uniqueAreas = [...new Set(bookings.map(b => b.area))]
  console.log('\n=== Booking Areas ===')
  uniqueAreas.forEach(a => console.log(`- ${a}`))

  // Check gallery locations
  const galleries = await prisma.galleryItem.findMany({ select: { location: true } })
  const uniqueLocations = [...new Set(galleries.map(g => g.location))]
  console.log('\n=== Gallery Locations ===')
  uniqueLocations.forEach(l => console.log(`- ${l}`))
}

main().catch(console.error).finally(() => prisma.$disconnect())
