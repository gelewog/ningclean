const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const services = await prisma.service.findMany({ 
    select: { id: true, name: true, slug: true, category: true, image: true } 
  })
  console.log(JSON.stringify(services, null, 2))
}

main().finally(() => prisma.$disconnect())
