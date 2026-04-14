/**
 * Add Multiple Services ke Database
 *
 * Script ini menambahkan banyak service baru dengan
 * image Unsplash yang sesuai untuk setiap kategori.
 *
 * Usage: npx tsx scripts/add-multiple-services.ts
 */

const API_BASE = process.env.API_URL || 'http://localhost:4000/api';

// JWT Token untuk authentication
let authToken: string | null = null;

// Data services baru yang akan ditambahkan
const newServicesData = [
  // Deep Cleaning Services
  {
    name: 'Deep Cleaning Studio',
    slug: 'deep-cleaning-studio',
    description: 'Layanan deep cleaning khusus untuk studio apartment dengan peralatan modern dan teknik profesional.',
    price: 400000,
    duration: 150,
    category: 'Deep Cleaning',
    icon: 'Sparkles',
    features: [
      'Pembersihan seluruh ruangan studio',
      'Vacuum & steam cleaning lantai',
      'Pembersihan kamar mandi detail',
      'Pembersihan kitchenette',
      'Sterilisasi AC & ventilasi',
    ],
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Deep Cleaning Terrace House',
    slug: 'deep-cleaning-terrace-house',
    description: 'Deep cleaning untuk rumah terrace/townhouse dengan 2-3 lantai termasuk area rooftop jika ada.',
    price: 650000,
    duration: 240,
    category: 'Deep Cleaning',
    icon: 'Home',
    features: [
      'Pembersihan seluruh lantai',
      'Deep vacuum karpet & tangga',
      'Pembersihan balkon & area outdoor',
      'Sterilisasi kamar mandi',
      'Pembersihan jendela dalam',
    ],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    isActive: true,
    isFeatured: false,
  },

  // Regular Cleaning Services
  {
    name: 'Regular Cleaning Apartment',
    slug: 'regular-cleaning-apartment',
    description: 'Layanan cleaning rutin khusus untuk unit apartment dengan jadwal fleksibel.',
    price: 175000,
    duration: 120,
    category: 'Regular Cleaning',
    icon: 'Building',
    features: [
      'Pel & vacuum lantai',
      'Pembersihan dapur ringan',
      'Pengelapan debu furniture',
      'Pembersihan kamar mandi',
      'Pengurasan sampah',
    ],
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Regular Cleaning Komplek',
    slug: 'regular-cleaning-komplek',
    description: 'Paket cleaning rutin untuk komplek perumahan dengan area yang lebih luas.',
    price: 200000,
    duration: 150,
    category: 'Regular Cleaning',
    icon: 'Home',
    features: [
      'Pembersihan seluruh rumah',
      'Pel lantai seluruh area',
      'Pembersihan 2-3 kamar mandi',
      'Pembersihan dapur',
      'Penataan barang',
    ],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    isActive: true,
    isFeatured: false,
  },

  // Post Construction Services
  {
    name: 'Post Renovasi Kantor',
    slug: 'post-renovasi-kantor',
    description: 'Cleaning total setelah renovasi kantor untuk menghilangkan debu konstruksi dan sisa material.',
    price: 900000,
    duration: 360,
    category: 'Post Construction',
    icon: 'Building',
    features: [
      'Industrial vacuum debu tebal',
      'Pembersihan ceiling & ducting',
      'Washing seluruh lantai',
      'Pembersihan partitions & cubicle',
      'Sterilisasi total ruangan',
    ],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Post Bangun Ruko',
    slug: 'post-bangun-ruko',
    description: 'Cleaning untuk ruko baru 2-4 lantai sebelum digunakan untuk usaha.',
    price: 750000,
    duration: 300,
    category: 'Post Construction',
    icon: 'Store',
    features: [
      'Pembersihan lantai & dinding',
      'Vacuum seluruh area',
      'Pembersihan vitrine & showcase',
      'Sterilisasi kamar mandi umum',
      'Pembersihan tangga & lorong',
    ],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    isActive: true,
    isFeatured: false,
  },

  // Sofa & Furniture Cleaning
  {
    name: 'Sofa Cleaning Microfiber',
    slug: 'sofa-cleaning-microfiber',
    description: 'Perawatan khusus untuk sofa berbahan microfiber dengan teknologi foam cleaning.',
    price: 225000,
    duration: 100,
    category: 'Sofa Cleaning',
    icon: 'Sofa',
    features: [
      'Foam cleaning khusus microfiber',
      'Vacuum dengan attachment halus',
      'Penghilang noda water-based',
      'Pengeringan dengan fan',
      'Finishing anti-stain coating',
    ],
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Sofa Cleaning Velvet',
    slug: 'sofa-cleaning-velvet',
    description: 'Cleaning khusus untuk sofa velvet yang memerlukan penanganan lembut dan khusus.',
    price: 275000,
    duration: 120,
    category: 'Sofa Cleaning',
    icon: 'Sofa',
    features: [
      'Dry cleaning khusus velvet',
      'Vacuum dengan sikat halus',
      'Spot treatment noda',
      'Brush lembut satu arah',
      'Pewangi hypoallergenic',
    ],
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Carpette Cleaning',
    slug: 'carpette-cleaning',
    description: 'Pembersihan karpet dinding (wall-to-wall carpet) dengan equipment industrial.',
    price: 350000,
    duration: 180,
    category: 'Sofa Cleaning',
    icon: 'RectangleHorizontal',
    features: [
      'Industrial vacuum deep',
      'Shampooing dengan machine',
      'Spot stain removal',
      'Deodorizing treatment',
      'Quick dry dengan air mover',
    ],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Springbed Sanitization',
    slug: 'springbed-sanitization',
    description: 'Sanitasi kasur springbed untuk menghilangkan tungau, bakteri, dan allergen.',
    price: 200000,
    duration: 90,
    category: 'Sofa Cleaning',
    icon: 'Bed',
    features: [
      'UV-C sanitization',
      'Steam cleaning 180°C',
      'Anti-dust mite treatment',
      'Deodorizing',
      ' Vacuum dengan HEPA filter',
    ],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    isActive: true,
    isFeatured: false,
  },

  // Office Cleaning
  {
    name: 'Office Cleaning Monthly',
    slug: 'office-cleaning-monthly',
    description: 'Paket cleaning bulanan untuk kantor dengan fasilitas lengkap.',
    price: 2500000,
    duration: 480,
    category: 'Office Cleaning',
    icon: 'Building',
    features: [
      'Cleaning 4x seminggu',
      'Deep cleaning mingguan',
      'Restock toiletries',
      'Pembersihanpantry & café',
      'Waste management',
    ],
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Meeting Room Cleaning',
    slug: 'meeting-room-cleaning',
    description: 'Cleaning khusus untuk meeting room sebelum dan sesudah rapat.',
    price: 150000,
    duration: 60,
    category: 'Office Cleaning',
    icon: 'Users',
    features: [
      'Pel & wipe meja meeting',
      'Vacuum kursi & karpet',
      'Pembersihan whiteboard',
      'Setup air & amenities',
      'Quick refresh aroma',
    ],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    isActive: true,
    isFeatured: false,
  },

  // Special Services
  {
    name: 'Stainless Steel Polishing',
    slug: 'stainless-steel-polishing',
    description: 'Pemolesan dan treatment untuk peralatan stainless steel di dapur dan area publik.',
    price: 175000,
    duration: 90,
    category: 'Special Cleaning',
    icon: 'Sparkles',
    features: [
      'Polishing stainless steel',
      'Removal water spots',
      'Fingerprint removal',
      'protective coating',
      'Buffing mirror finish',
    ],
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'AC Cleaning & Maintenance',
    slug: 'ac-cleaning-maintenance',
    description: 'Pembersihan dan perawatan AC untuk meningkatkan performa dan efisiensi.',
    price: 125000,
    duration: 60,
    category: 'Special Cleaning',
    icon: 'Wind',
    features: [
      'Filter cleaning/replacement',
      'Coil cleaning',
      'Blower cleaning',
      'Check refrigerant',
      'Performance testing',
    ],
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Window Cleaning Exterior',
    slug: 'window-cleaning-exterior',
    description: 'Pembersihan kaca jendela bagian luar untuk gedung dan rumah bertingkat.',
    price: 250000,
    duration: 120,
    category: 'Special Cleaning',
    icon: 'Square',
    features: [
      'Exterior window cleaning',
      'Frame wiping',
      'Squeegee finish',
      'High reach equipment',
      'Safety certified team',
    ],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Swimming Pool Maintenance',
    slug: 'swimming-pool-maintenance',
    description: 'Perawatan dan maintenance kolam renang untuk menjaga kualitas air.',
    price: 500000,
    duration: 180,
    category: 'Special Cleaning',
    icon: 'Waves',
    features: [
      'Pool vacuuming',
      'Wall brushing',
      'Skimmer basket cleaning',
      'Water testing & balancing',
      'Chemical treatment',
    ],
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Garden & Landscape Care',
    slug: 'garden-landscape-care',
    description: 'Perawatan taman dan area landscape untuk hunian dan komersial.',
    price: 350000,
    duration: 150,
    category: 'Special Cleaning',
    icon: 'Tree',
    features: [
      'Lawn mowing',
      ' Hedge trimming',
      'Debris collection',
      'Plant watering',
      'Area sweeping',
    ],
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    isActive: true,
    isFeatured: false,
  },

  // Premium Services
  {
    name: 'Premium Deep Clean Package',
    slug: 'premium-deep-clean-package',
    description: 'Paket premium lengkap untuk rumah premium dengan 5+ kamar tidur.',
    price: 1200000,
    duration: 480,
    category: 'Premium Cleaning',
    icon: 'Crown',
    features: [
      'Full house deep cleaning',
      '7+ kamar tidur & mandi',
      'Premium materials',
      'Mobile car vacuum service',
      'Bonus AC cleaning 2 unit',
    ],
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Move In Deep Cleaning',
    slug: 'move-in-deep-cleaning',
    description: 'Deep cleaning khusus untuk rumah/apartment baru sebelum ditinggali.',
    price: 850000,
    duration: 360,
    category: 'Premium Cleaning',
    icon: 'Home',
    features: [
      'Full sanitization',
      'Sticker & residue removal',
      'Cabinet & drawer cleaning',
      'Window & track cleaning',
      'Pest control basic',
    ],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Move Out Cleaning',
    slug: 'move-out-cleaning',
    description: 'Cleaning total untuk rumah/apartment yang akan ditinggalkan.',
    price: 750000,
    duration: 300,
    category: 'Premium Cleaning',
    icon: 'Home',
    features: [
      'Full house cleaning',
      'Inside cabinet & oven',
      'Wall spot cleaning',
      'Final inspection',
      'Deposit protection',
    ],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    isActive: true,
    isFeatured: false,
  },
];

// Helper function untuk fetch API
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
      ...(options.headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Step 0: Login sebagai admin
async function loginAsAdmin() {
  console.log('\n🔐 STEP 0: Login sebagai Admin...\n');

  try {
    const response = await fetchApi<{ access_token: string; user: any }>(`/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@ningclean.com', password: 'admin123' }),
    });

    authToken = response.access_token;
    console.log('   ✅ Login berhasil!');
    console.log(`   User: ${response.user?.name || 'Admin'}`);
    console.log(`   Role: ${response.user?.role || 'ADMIN'}`);

    return authToken;
  } catch (error: any) {
    console.error('\n   ❌ Login gagal:', error.message);
    throw error;
  }
}

// Step 1: Get all services untuk melihat kondisi awal
async function getAllServices() {
  console.log('\n📋 STEP 1: Mengambil semua services sebelum add...\n');

  try {
    const response = await fetchApi<any[]>('/services?all=true');
    const services = Array.isArray(response) ? response : [];

    console.log(`   Ditemukan ${services.length} services di database`);

    return services;
  } catch (error: any) {
    console.error('   ❌ Gagal mengambil services:', error.message);
    throw error;
  }
}

// Step 2: Check existing services
async function getExistingSlugs() {
  try {
    const response = await fetchApi<any[]>('/services?all=true');
    const services = Array.isArray(response) ? response : [];
    return services.map(s => s.slug);
  } catch {
    return [];
  }
}

// Step 3: Add single service
async function addService(serviceData: any): Promise<{ success: boolean; name: string; id?: string; error?: string }> {
  try {
    const response = await fetchApi<any>('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });

    return {
      success: true,
      name: serviceData.name,
      id: response.id,
    };
  } catch (error: any) {
    return {
      success: false,
      name: serviceData.name,
      error: error.message,
    };
  }
}

// Main function
async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('         ➕ ADD MULTIPLE SERVICES - ADMIN SIMULATION ➕');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`\n🌐 API Base URL: ${API_BASE}`);
  console.log(`\n📦 Total services untuk ditambahkan: ${newServicesData.length}`);
  console.log(`⏰ Waktu mulai: ${new Date().toLocaleString('id-ID')}`);

  const successResults: string[] = [];
  const existingResults: string[] = [];
  const failedResults: { name: string; error: string }[] = [];

  try {
    // Step 0: Login
    await loginAsAdmin();

    // Step 1: Get existing services
    const existingSlugs = await getExistingSlugs();

    console.log('\n📋 STEP 2: Memulai penambahan services...\n');

    for (let i = 0; i < newServicesData.length; i++) {
      const service = newServicesData[i];
      const progress = `[${i + 1}/${newServicesData.length}]`;

      // Check if already exists
      if (existingSlugs.includes(service.slug)) {
        console.log(`   ${progress} ⏭️  "${service.name}" - sudah ada, skip`);
        existingResults.push(service.name);
        continue;
      }

      // Add service
      const result = await addService(service);

      if (result.success) {
        console.log(`   ${progress} ✅ "${service.name}" - berhasil ditambahkan`);
        console.log(`       💰 Rp ${service.price.toLocaleString('id-ID')} | 🕐 ${service.duration} menit | 🖼️ ${service.image.split('/').pop()?.split('?')[0]}`);
        successResults.push(service.name);
      } else {
        console.log(`   ${progress} ❌ "${service.name}" - gagal: ${result.error}`);
        failedResults.push({ name: service.name, error: result.error || 'Unknown error' });
      }
    }

    // Summary by category
    const categoryCount: Record<string, number> = {};
    successResults.forEach(name => {
      const service = newServicesData.find(s => s.name === name);
      if (service) {
        categoryCount[service.category] = (categoryCount[service.category] || 0) + 1;
      }
    });

    // Final Summary
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                    📊 FINAL SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`\n   ✅ Berhasil ditambahkan: ${successResults.length} services`);
    console.log(`   ⏭️  Sudah ada (skipped): ${existingResults.length} services`);
    console.log(`   ❌ Gagal: ${failedResults.length} services`);

    console.log('\n   📁 Breakdown per kategori:');
    for (const [category, count] of Object.entries(categoryCount)) {
      console.log(`      • ${category}: ${count} services`);
    }

    if (failedResults.length > 0) {
      console.log('\n   ❌ Services yang gagal:');
      failedResults.forEach(f => {
        console.log(`      • ${f.name}: ${f.error}`);
      });
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                    ✅ ADD SERVICES COMPLETE');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`\n⏰ Waktu selesai: ${new Date().toLocaleString('id-ID')}`);

  } catch (error: any) {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                    ❌ SCRIPT FAILED');
    console.log('═══════════════════════════════════════════════════════════════');
    console.error(`\n💥 Error: ${error.message}`);
    process.exit(1);
  }
}

// Jalankan
main();
