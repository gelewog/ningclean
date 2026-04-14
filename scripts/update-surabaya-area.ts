/**
 * Script to update Surabaya service area with complete kecamatan data
 * Surabaya has 31 kecamatan officially
 * Run: npx ts-node scripts/update-surabaya-area.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Finding Surabaya area...')

  // Find Surabaya area
  const surabaya = await prisma.serviceArea.findFirst({
    where: { slug: 'surabaya' }
  })

  if (!surabaya) {
    console.log('❌ Surabaya area not found, creating new one...')

    const newSurabaya = await prisma.serviceArea.create({
      data: {
        city: 'Surabaya',
        slug: 'surabaya',
        region: 'East Java',
        description: 'Surabaya adalah ibu kota Provinsi Jawa Timur dan kota terbesar kedua di Indonesia. Sebagai pusat bisnis, perdagangan, dan industri di Jawa Timur, Surabaya menawarkan berbagai layanan kebersihan rumah tangga dan perkantoran. Tim profesional kami siap melayani seluruh penjuru kota dengan waktu respons cepat dan hasil memuaskan.',
        coverage: [
          // Surabaya Utara
          'Asemrowo',
          'Benowo',
          'Bulak Banteng',
          'Kenjeran',
          'Krembangan',
          'Lakarsantri',
          'Pabean Cantikan',
          'Pakal',
          'Sambikerep',
          'Semampir',
          'Sukomanunggal',
          'Tandes',
          // Surabaya Timur
          'Dukuh Pakis',
          'Gayungan',
          'Gubeng',
          'Gunung Anyar',
          'Jambangan',
          'Karangpilang',
          'Rungkut',
          'Tenggilis Mejoyo',
          'Wonocolo',
          'Wonokromo',
          'Wiyung',
          // Surabaya Selatan
          'Bubutan',
          'Citraralar',
          'Gondanglegi',
          'Mulyorejo',
          'Sawahan',
          'Simokali',
          'Tegalsari',
          'Tambaksari'
        ],
        isActive: true,
        isFeatured: true
      }
    })

    console.log('✅ Surabaya area created successfully!')
    console.log(`   ID: ${newSurabaya.id}`)
    console.log(`   Coverage: ${newSurabaya.coverage.length} kecamatan`)
    return
  }

  console.log(`✅ Found Surabaya area with ID: ${surabaya.id}`)

  // Update Surabaya with complete kecamatan data (31 kecamatan resmi Surabaya)
  const updated = await prisma.serviceArea.update({
    where: { id: surabaya.id },
    data: {
      city: 'Surabaya',
      slug: 'surabaya',
      region: 'East Java',
      description: 'Surabaya adalah ibu kota Provinsi Jawa Timur dan kota terbesar kedua di Indonesia. Sebagai pusat bisnis, perdagangan, dan industri di Jawa Timur, Surabaya menawarkan berbagai layanan kebersihan rumah tangga dan perkantoran. Tim profesional kami siap melayani seluruh penjuru kota dengan waktu respons cepat dan hasil memuaskan.',
      coverage: [
        // Surabaya Utara
        'Asemrowo',
        'Benowo',
        'Bulak Banteng',
        'Kenjeran',
        'Krembangan',
        'Lakarsantri',
        'Pabean Cantikan',
        'Pakal',
        'Sambikerep',
        'Semampir',
        'Sukomanunggal',
        'Tandes',
        // Surabaya Timur
        'Dukuh Pakis',
        'Gayungan',
        'Gubeng',
        'Gunung Anyar',
        'Jambangan',
        'Karangpilang',
        'Rungkut',
        'Tenggilis Mejoyo',
        'Wonocolo',
        'Wonokromo',
        'Wiyung',
        // Surabaya Selatan
        'Bubutan',
        'Citraralar',
        'Gondanglegi',
        'Mulyorejo',
        'Sawahan',
        'Simokali',
        'Tegalsari',
        'Tambaksari'
      ],
      isActive: true,
      isFeatured: true
    }
  })

  console.log('✅ Surabaya area updated successfully!')
  console.log(`   City: ${updated.city}`)
  console.log(`   Region: ${updated.region}`)
  console.log(`   Coverage: ${updated.coverage.length} kecamatan`)
  console.log(`   isActive: ${updated.isActive}`)
  console.log(`   isFeatured: ${updated.isFeatured}`)
  console.log(`   Description: ${updated.description?.substring(0, 80)}...`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
