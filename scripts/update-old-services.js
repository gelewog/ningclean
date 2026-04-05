const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Updating Deep Cleaning and General Cleaning...\n')

  // Update Deep Cleaning
  const deepCleaning = await prisma.service.findUnique({ where: { slug: 'deep-cleaning' } })
  if (deepCleaning) {
    await prisma.service.update({
      where: { id: deepCleaning.id },
      data: {
        name: 'Deep Cleaning Premium',
        description: 'Layanan pembersihan mendalam dengan standar premium. Mencakup seluruh area rumah dengan perhatian khusus pada sudut-sudut yang sering terlewat dan area dengan noda membandel.',
        price: 350000,
        duration: 240,
        category: 'Deep Cleaning',
        icon: 'Sparkles',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
        features: [
          'Pembersihan seluruh ruangan',
          'Sterilisasi kamar mandi',
          'Pembersihan dapur mendalam',
          'Vacuum & pel lantai',
          'Pembersihan jendela',
          'Sanitasi permukaan',
          'Deep scrub lantai',
          'Pembersihan ventilasi'
        ],
        isActive: true,
        isFeatured: true
      }
    })
    console.log('✅ Updated: Deep Cleaning Premium')
  }

  // Update General Cleaning
  const generalCleaning = await prisma.service.findUnique({ where: { slug: 'general-cleaning' } })
  if (generalCleaning) {
    await prisma.service.update({
      where: { id: generalCleaning.id },
      data: {
        name: 'General Cleaning',
        description: 'Layanan pembersihan rutin untuk menjaga kebersihan rumah Anda. Cocok untuk perawatan mingguan dengan hasil bersih dan segar setiap hari.',
        price: 125000,
        duration: 90,
        category: 'Regular Cleaning',
        icon: 'Home',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        features: [
          'Pembersihan ruang tamu',
          'Pel lantai',
          'Pembersihan kamar mandi',
          'Vacuum karpet',
          'Membersihkan dapur',
          'Pembuangan sampah'
        ],
        isActive: true,
        isFeatured: false
      }
    })
    console.log('✅ Updated: General Cleaning')
  }

  console.log('\n✅ Done!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
