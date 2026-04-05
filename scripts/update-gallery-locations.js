const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Updating Gallery Locations...\n')

  const updates = [
    { old: 'Jakarta Selatan', new: 'Surabaya' },
    { old: 'Jakarta Barat', new: 'Sidoarjo' },
    { old: 'Bandung', new: 'Gresik' },
  ]

  for (const update of updates) {
    const result = await prisma.galleryItem.updateMany({
      where: { location: update.old },
      data: { location: update.new }
    })
    console.log(`✅ Updated ${result.count} gallery items: ${update.old} → ${update.new}`)
  }

  console.log('\n✅ Gallery locations update completed!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
