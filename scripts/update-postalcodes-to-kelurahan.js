const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Updating postalCodes with kelurahan names...\n')

  // Surabaya coverage (kelurahan names)
  const surabayaCoverage = [
    'Gubeng', 'Tegalsari', 'Dr. Sutomo', 'Tenggilis', 'Rungkut',
    'Wonokromo', 'Wiyunga', 'Sukolilo', 'Mulyorejo', 'Simo',
    'Tandes', 'Sukomanunggal', 'Asemrowo', 'Benowo', 'Pakal',
    'Lakarsantri', 'Pabean Cantian', 'Bubutan', 'Krembangan', 'Semampir',
    'Kota Surabaya', 'Sawahan', 'Genteng', 'Karangpilang', 'Wonocolo',
    'Tenggilis Mejoyo', 'Babatan', 'Balongsari', 'Bangsri', 'Banyu URang',
  ]

  // Sidoarjo coverage (kelurahan names)
  const sidoarjoCoverage = [
    'Sidoarjo', 'Tanggulangin', 'Candi', 'Tulangan', 'Krembung',
    'Porong', 'Kedungbendo', 'Ketapang', 'Krian', 'Balongbendo',
    'Waru', 'Sedati', 'Gedangan', 'Budi', 'Jabon', 'Kasek',
    'Panggreh', 'Jenggala', 'Kemang', 'Manukan', 'Buluk Batur',
  ]

  // Gresik coverage (kelurahan names)
  const gresikCoverage = [
    'Gresik Kota', 'Duduk Sampeyan', 'Kebomas', 'Cerme', 'Benjeng',
    'Menganti', 'Kawasan Industri KIEC', 'Kawasan Industri Kuwait', 'Bungah',
    'Dukunttg', 'Sidayu', 'Dumljaya', 'Ganting', 'Kramat', 'Gulomantung',
  ]

  // Update using Prisma's update
  await prisma.serviceArea.update({
    where: { slug: 'surabaya' },
    data: { postalCodes: surabayaCoverage }
  })
  console.log('✅ Updated Surabaya postalCodes with kelurahan names')

  await prisma.serviceArea.update({
    where: { slug: 'sidoarjo' },
    data: { postalCodes: sidoarjoCoverage }
  })
  console.log('✅ Updated Sidoarjo postalCodes with kelurahan names')

  await prisma.serviceArea.update({
    where: { slug: 'gresik' },
    data: { postalCodes: gresikCoverage }
  })
  console.log('✅ Updated Gresik postalCodes with kelurahan names')

  // Verify
  const areas = await prisma.serviceArea.findMany()
  console.log('\n=== Verification ===')
  areas.forEach(a => {
    console.log(`${a.city}: ${a.postalCodes?.length || 0} items`)
    console.log(`  First 5: ${a.postalCodes?.slice(0, 5).join(', ')}`)
  })

  console.log('\n✅ Done! postalCodes now contains kelurahan names.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
