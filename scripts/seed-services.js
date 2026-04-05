const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const services = [
  {
    name: 'Deep Cleaning Komprehensif',
    slug: 'deep-cleaning-komprehensif',
    description: 'Layanan pembersihan mendalam untuk seluruh rumah. Mencakup semua area termasuk tempat yang sering terlewat seperti ventilasi, fixture, dan sudut-sudut tersembunyi.',
    price: 450000,
    duration: 300,
    category: 'Deep Cleaning',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    features: ['Pembersihan seluruh ruangan', 'Sterilisasi kamar mandi', 'Pembersihan dapur mendalam', 'Vacuum & pel lantai', 'Pembersihan jendela', 'Sanitasi permukaan'],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'House Cleaning Harian',
    slug: 'house-cleaning-harian',
    description: 'Layanan pembersihan rutin untuk menjaga kebersihan rumah Anda setiap hari. Cocok untuk keluarga sibuk yang ingin rumah selalu bersih.',
    price: 150000,
    duration: 120,
    category: 'Regular Cleaning',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    features: ['Pembersihan ruang tamu', 'Pel lantai semua ruangan', 'Pembersihan kamar mandi', 'Vacuum karpet & sofa', 'Membersihkan dapur', 'Pembuangan sampah'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Post Construction Cleaning',
    slug: 'post-construction-cleaning',
    description: 'Pembersihan khusus setelah renovasi atau pembangunan. Menghilangkan debu konstruksi, sisa material, dan kotoran berat lainnya.',
    price: 650000,
    duration: 360,
    category: 'Post Construction',
    icon: 'HardHat',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    features: ['Pengangkatan debu konstruksi', 'Pembersihan sisa material', 'Pencucian jendela berlebih', 'Pembuangan puing-puing', 'Sterilisasi seluruh rumah', 'Cleaning sistem ventilasi'],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Sofa & Karpet Cleaning',
    slug: 'sofa-karpet-cleaning',
    description: 'Layanan deep cleaning khusus untuk sofa, karpet, dan upholstery lainnya. Menghilangkan noda, debu, dan bakteri yang tertanam.',
    price: 250000,
    duration: 180,
    category: 'Sofa Cleaning',
    icon: 'Sofa',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    features: ['Deep extraction vacuum', 'Shampooing khusus sofa', 'Pembersihan noda', 'Deodorizing', 'Pembersihan karpet', 'Anti bacterial treatment'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Office Cleaning',
    slug: 'office-cleaning',
    description: 'Layanan pembersihan untuk kantor dan ruang kerja komersial. Menjaga produktivitas dan kesan profesional tempat kerja Anda.',
    price: 350000,
    duration: 240,
    category: 'Office Cleaning',
    icon: 'Building',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    features: ['Pembersihan meja kerja', 'Vacuum karpet kantor', 'Pembersihan toilet', 'Pel lantai ruang kerja', 'Pembersihan pantry', 'Pembuangan sampah'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'AC & Ventilation Cleaning',
    slug: 'ac-ventilation-cleaning',
    description: 'Pembersihan AC dan sistem ventilasi untuk udara lebih sehat dan AC lebih awet. Reduces energy consumption dan memperpanjang umur AC.',
    price: 200000,
    duration: 90,
    category: 'Deep Cleaning',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
    features: ['Pembersihan filter AC', 'Coil cleaning', 'Drainase AC', 'Pengecekan refrigeran', 'Sterilisasi unit', 'Testing performa'],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Window Cleaning',
    slug: 'window-cleaning',
    description: 'Layanan pembersihan jendela profesional. Kaca bersih tanpa gores untuk pemandangan lebih jernih dan rumah lebih cerah.',
    price: 175000,
    duration: 120,
    category: 'Regular Cleaning',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1523791899534-4cd0d1a7312e?w=800&q=80',
    features: ['Pembersihan kaca dalam', 'Pembersihan frame', 'Penghilangan noda air', 'Pembersihan jendela tinggi', 'Interior cleaning', 'Exterior cleaning'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Bathroom Sanitization',
    slug: 'bathroom-sanitization',
    description: 'Pembersihan dan sterilisasi kamar mandi secara mendalam. Menghilangkan bakteri, jamur, dan bau tidak sedap.',
    price: 125000,
    duration: 90,
    category: 'Deep Cleaning',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
    features: ['Scrubbing lantai & dinding', 'PembersihanCloset', 'Sterilisasi toilet', 'Pembersihan wastafel', 'Anti jamur treatment', 'Deodorizing'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Kitchen Deep Clean',
    slug: 'kitchen-deep-clean',
    description: 'Pembersihan dapur menyeluruh dari lemak, noda, dan bakteri. Membuat dapur lebih higienis dan aman untuk memasak.',
    price: 275000,
    duration: 150,
    category: 'Deep Cleaning',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    features: ['Pembersihan kompor', 'Degreasing exhaust', 'Pembersihan oven', 'Scrubbing kitchen set', 'Pembersihan kulkas luar', 'Sanitasi permukaan'],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Move In/Out Cleaning',
    slug: 'move-in-out-cleaning',
    description: 'Layanan pembersihan khusus untuk properti baru atau yang akan dikosongkan. Siap huni atau serah terima properti.',
    price: 550000,
    duration: 360,
    category: 'Deep Cleaning',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?w=800&q=80',
    features: ['Pembersihan seluruh ruangan', 'Inside cabinet & drawer', 'Pembersihan appliance', 'Window & door cleaning', 'Floor deep cleaning', 'Final inspection'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Carpet Cleaning',
    slug: 'carpet-cleaning',
    description: 'Deep cleaning karpet untuk menghilangkan noda, debu, dan allergen. Carpet lebih bersih dan awet.',
    price: 180000,
    duration: 120,
    category: 'Sofa Cleaning',
    icon: 'Sofa',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    features: ['Pre-treatment noda', 'Hot water extraction', 'Shampooing carpet', 'Grooming fibers', 'Quick dry treatment', 'Deodorizing'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Disinfection Service',
    slug: 'disinfection-service',
    description: 'Layanan sterilisasi dan disinfeksi menggunakan bahan premium. Melindungi keluarga dari virus dan bakteri.',
    price: 225000,
    duration: 120,
    category: 'Deep Cleaning',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=800&q=80',
    features: ['Spray disinfektan', 'Fogging treatment', 'Surface sanitizing', 'Door handle sterilization', 'High-touch area focus', 'Sertifikasi bebas kuman'],
    isActive: true,
    isFeatured: true
  }
]

async function main() {
  console.log('Starting to update/seed services...\n')

  // Get existing services to preserve booking associations
  const existingServices = await prisma.service.findMany()
  const existingMap = new Map(existingServices.map(s => [s.slug, s]))

  let created = 0
  let updated = 0

  for (const service of services) {
    const existing = existingMap.get(service.slug)
    
    if (existing) {
      // Update existing service but keep id and createdAt
      await prisma.service.update({
        where: { id: existing.id },
        data: {
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration,
          category: service.category,
          icon: service.icon,
          image: service.image,
          features: service.features,
          isActive: service.isActive,
          isFeatured: service.isFeatured
        }
      })
      updated++
      console.log(`Updated: ${service.name}`)
    } else {
      // Create new service
      await prisma.service.create({
        data: service
      })
      created++
      console.log(`Created: ${service.name}`)
    }
  }

  console.log(`\n✅ Done! Created: ${created}, Updated: ${updated}`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
