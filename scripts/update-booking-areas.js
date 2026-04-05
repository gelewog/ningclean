const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Updating Booking Areas...\n')

  const updates = [
    { old: 'Jakarta Selatan', new: 'Surabaya' },
    { old: 'Jakarta Pusat', new: 'Surabaya' },
    { old: 'Tangerang', new: 'Sidoarjo' },
    { old: 'Bekasi', new: 'Gresik' },
  ]

  for (const update of updates) {
    const result = await prisma.booking.updateMany({
      where: { area: update.old },
      data: { area: update.new }
    })
    console.log(`✅ Updated ${result.count} bookings: ${update.old} → ${update.new}`)
  }

  console.log('\n✅ Booking areas update completed!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
