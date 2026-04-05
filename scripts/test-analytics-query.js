const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Test the raw query directly
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        bi."serviceId",
        s.name as "serviceName",
        COUNT(*) as count
      FROM booking_items bi
      JOIN services s ON s.id = bi."serviceId"
      GROUP BY bi."serviceId", s.name
      ORDER BY count DESC
      LIMIT 5
    `
    console.log('Service popularity query result:', JSON.stringify(result, null, 2))
  } catch (err) {
    console.log('Error:', err.message)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
