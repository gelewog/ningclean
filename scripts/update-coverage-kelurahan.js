const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Updating coverage with kelurahan names...\n')

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

  // Update using coverage field (which matches current schema)
  await prisma.serviceArea.update({
    where: { slug: 'surabaya' },
    data: { coverage: surabayaCoverage }
  })
  console.log('✅ Updated Surabaya coverage')

  await prisma.serviceArea.update({
    where: { slug: 'sidoarjo' },
    data: { coverage: sidoarjoCoverage }
  })
  console.log('✅ Updated Sidoarjo coverage')

  await prisma.serviceArea.update({
    where: { slug: 'gresik' },
    data: { coverage: gresikCoverage }
  })
  console.log('✅ Updated Gresik coverage')

  // Verify
  const areas = await prisma.serviceArea.findMany()
  console.log('\n=== Verification ===')
  areas.forEach(a => {
    console.log(`${a.city}: ${a.coverage?.length || 0} coverage items`)
    console.log(`  First 5: ${a.coverage?.slice(0, 5).join(', ')}`)
  })

  console.log('\n✅ Done! coverage now contains kelurahan names.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
