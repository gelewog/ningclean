const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const windowCleaning = await prisma.service.findUnique({ where: { slug: 'window-cleaning' } })
  if (windowCleaning) {
    await prisma.service.update({
      where: { id: windowCleaning.id },
      data: {
        image: 'https://images.unsplash.com/photo-1536566482680-fca31930a0bd?w=800&q=80'
      }
    })
    console.log('✅ Updated Window Cleaning image')
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
