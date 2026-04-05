const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Updating service_areas coverage data...\n')

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

  // Note: column still named postalCodes in DB, but we'll update the data
  // After migration, this will be renamed to coverage

  const surabaya = await prisma.serviceArea.findUnique({ where: { slug: 'surabaya' } })
  if (surabaya) {
    // Update using raw query since schema still has postalCodes
    await prisma.$executeRaw`UPDATE service_areas SET postal_codes = ${JSON.stringify(surabayaCoverage)} WHERE slug = 'surabaya'`
    console.log('✅ Updated coverage for Surabaya')
  }

  const sidoarjo = await prisma.serviceArea.findUnique({ where: { slug: 'sidoarjo' } })
  if (sidoarjo) {
    await prisma.$executeRaw`UPDATE service_areas SET postal_codes = ${JSON.stringify(sidoarjoCoverage)} WHERE slug = 'sidoarjo'`
    console.log('✅ Updated coverage for Sidoarjo')
  }

  const gresik = await prisma.serviceArea.findUnique({ where: { slug: 'gresik' } })
  if (gresik) {
    await prisma.$executeRaw`UPDATE service_areas SET postal_codes = ${JSON.stringify(gresikCoverage)} WHERE slug = 'gresik'`
    console.log('✅ Updated coverage for Gresik')
  }

  console.log('\n⚠️  Note: Column still named "postalCodes" in database.')
  console.log('   Run migration separately to rename to "coverage":')
  console.log('   npx prisma migrate dev --name rename_postalcodes_to_coverage')

  console.log('\n✅ Coverage data updated!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
