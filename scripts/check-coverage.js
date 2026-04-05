const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const areas = await prisma.serviceArea.findMany()
  console.log('Full service areas data:')
  areas.forEach(a => {
    console.log(`\n${a.city} (${a.slug}):`)
    console.log(`  coverage: ${JSON.stringify(a.coverage)}`)
    console.log(`  postalCodes: ${JSON.stringify(a.postalCodes)}`)
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())
