/**
 * Script to update Sidoarjo and Gresik with correct kecamatan names
 * Run: npx ts-node scripts/update-sidoarjo-gresik-v2.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ========== SIDOARJO - Official 19 Kecamatan ==========
  console.log('Updating Sidoarjo area...')

  const sidoarjo = await prisma.serviceArea.findFirst({
    where: { slug: 'sidoarjo' }
  })

  if (sidoarjo) {
    await prisma.serviceArea.update({
      where: { id: sidoarjo.id },
      data: {
        city: 'Sidoarjo',
        slug: 'sidoarjo',
        region: 'East Java',
        description: 'Sidoarjo adalah kabupaten di Provinsi Jawa Timur yang berbatasan langsung dengan Surabaya. Kabupaten ini dikenal sebagai sentra industri kecil, pertanian, dan permukiman. Layanan kebersihan kami mencakup seluruh wilayah Sidoarjo dengan waktu respons cepat dari Surabaya.',
        coverage: [
          'Sidoarjo',
          'Jabon',
          'Tulangan',
          'Tanggulangin',
          'Porong',
          'Krembung',
          'Candi',
          'Prambon',
          'Sedati',
          'Waru',
          'Gedangan',
          'Taman',
          'Krian',
          'Balongbendo',
          'Wonoayu',
          'Tarik',
          'Selat',
          'Sukodono',
          'Buduran'
        ],
        isActive: true,
        isFeatured: true
      }
    })
    console.log('Sidoarjo updated with 19 kecamatan')
  }

  // ========== GRESIK - Official Kecamatan ==========
  console.log('Updating Gresik area...')

  const gresik = await prisma.serviceArea.findFirst({
    where: { slug: 'gresik' }
  })

  if (gresik) {
    await prisma.serviceArea.update({
      where: { id: gresik.id },
      data: {
        city: 'Gresik',
        slug: 'gresik',
        region: 'East Java',
        description: 'Gresik adalah kabupaten di Provinsi Jawa Timur yang terkenal dengan kawasan industri miliknya. Kabupaten ini terletak di pesisir utara Jawa Timur dan berbatasan dengan Surabaya. Layanan kebersihan kami mencakup area residensial dan industri di Gresik.',
        coverage: [
          'Gresik',
          'Kebomas',
          'Manyar',
          'Dukun',
          'Sidayu',
          'Benjeng',
          'Balongpanggang',
          'Campurejo',
          'Duduksampeyan',
          'Hargantono',
          'Ujungpangkah',
          'Wringinanom',
          'Tambak',
          'Bungah',
          'Menganti',
          'Kedamean'
        ],
        isActive: true,
        isFeatured: true
      }
    })
    console.log('Gresik updated with 16 kecamatan')
  }

  // Show all areas
  console.log('')
  console.log('All Service Areas:')
  const allAreas = await prisma.serviceArea.findMany({
    select: { city: true, coverage: true, isActive: true, isFeatured: true }
  })

  for (const area of allAreas) {
    console.log(`  - ${area.city}: ${area.coverage.length} kecamatan (Active: ${area.isActive}, Featured: ${area.isFeatured})`)
  }
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
