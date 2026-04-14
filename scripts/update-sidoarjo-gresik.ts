/**
 * Script to create/update Sidoarjo and Gresik service areas
 * Run: npx ts-node scripts/update-sidoarjo-gresik.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ========== SIDOARJO ==========
  console.log('Checking Sidoarjo area...')

  const sidoarjo = await prisma.serviceArea.findFirst({
    where: { slug: 'sidoarjo' }
  })

  if (sidoarjo) {
    console.log(`Found Sidoarjo (ID: ${sidoarjo.id}), updating...`)
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
    console.log('Sidoarjo area updated successfully!')
  } else {
    console.log('Sidoarjo not found, creating...')
    await prisma.serviceArea.create({
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
    console.log('Sidoarjo area created successfully!')
  }

  // ========== GRESIK ==========
  console.log('')
  console.log('Checking Gresik area...')

  const gresik = await prisma.serviceArea.findFirst({
    where: { slug: 'gresik' }
  })

  if (gresik) {
    console.log(`Found Gresik (ID: ${gresik.id}), updating...`)
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
          'Hargantis',
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
    console.log('Gresik area updated successfully!')
  } else {
    console.log('Gresik not found, creating...')
    await prisma.serviceArea.create({
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
          'Hargantis',
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
    console.log('Gresik area created successfully!')
  }

  console.log('')
  console.log('Summary:')
  console.log('   - Sidoarjo: 19 kecamatan')
  console.log('   - Gresik: 16 kecamatan')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
