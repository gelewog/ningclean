const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Populating coverage column from postalCodes...\n')

  // Surabaya coverage
  const surabayaCoverage = [
    'Gubeng', 'Tegalsari', 'Dr. Sutomo', 'Tenggilis', 'Rungkut',
    'Wonokromo', 'Wiyunga', 'Sukolilo', 'Mulyorejo', 'Simo',
    'Tandes', 'Sukomanunggal', 'Asemrowo', 'Benowo', 'Pakal',
    'Lakarsantri', 'Pabean Cantian', 'Bubutan', 'Krembangan', 'Semampir',
    'Kota Surabaya', 'Sawahan', 'Genteng', 'Karangpilang', 'Wonocolo',
    'Tenggilis Mejoyo', 'Babatan', 'Balongsari', 'Bangsri', 'Banyu URang',
  ]

  // Sidoarjo coverage
  const sidoarjoCoverage = [
    'Sidoarjo', 'Tanggulangin', 'Candi', 'Tulangan', 'Krembung',
    'Porong', 'Kedungbendo', 'Ketapang', 'Krian', 'Balongbendo',
    'Waru', 'Sedati', 'Gedangan', 'Budi', 'Jabon', 'Kasek',
    'Panggreh', 'Jenggala', 'Kemang', 'Manukan', 'Buluk Batur',
  ]

  // Gresik coverage
  const gresikCoverage = [
    'Gresik Kota', 'Duduk Sampeyan', 'Kebomas', 'Cerme', 'Benjeng',
    'Menganti', 'Kawasan Industri KIEC', 'Kawasan Industri Kuwait', 'Bungah',
    'Dukunttg', 'Sidayu', 'Dumljaya', 'Ganting', 'Kramat', 'Gulomantung',
  ]

  // Update using raw SQL with proper column names
  await prisma.$executeRaw`UPDATE service_areas SET coverage = ${surabayaCoverage} WHERE slug = 'surabaya'`
  console.log('✅ Updated coverage for Surabaya')

  await prisma.$executeRaw`UPDATE service_areas SET coverage = ${sidoarjoCoverage} WHERE slug = 'sidoarjo'`
  console.log('✅ Updated coverage for Sidoarjo')

  await prisma.$executeRaw`UPDATE service_areas SET coverage = ${gresikCoverage} WHERE slug = 'gresik'`
  console.log('✅ Updated coverage for Gresik')

  // Verify
  const areas = await prisma.serviceArea.findMany()
  console.log('\n=== Verification ===')
  areas.forEach(a => {
    console.log(`${a.city}: ${a.coverage?.length || 0} coverage areas`)
  })

  console.log('\n✅ Coverage data populated!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
