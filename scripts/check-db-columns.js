const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Check columns in service_areas table
  const result = await prisma.$queryRaw`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'service_areas'`
  console.log('Columns in service_areas table:')
  console.log(JSON.stringify(result, null, 2))

  // Check current data
  const areas = await prisma.serviceArea.findMany()
  console.log('\nCurrent service areas data:')
  areas.forEach(a => console.log(`- ${a.city}: ${JSON.stringify(a).substring(0, 100)}`))
}

main().catch(console.error).finally(() => prisma.$disconnect())
