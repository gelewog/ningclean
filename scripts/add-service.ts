/**
 * Simulasi Add Service di Admin
 *
 * Script ini mensimulasikan proses adding service baru
 * di halaman admin/services dengan image Unsplash.
 *
 * Usage: npx tsx scripts/add-service.ts
 */

const API_BASE = process.env.API_URL || 'http://localhost:4000/api';

// JWT Token untuk authentication
let authToken: string | null = null;

// Data service baru yang akan ditambahkan
const newServiceData = {
  name: 'Premium Home Cleaning',
  slug: 'premium-home-cleaning',
  description: 'Layanan premium cleaning untuk rumah dengan peralatan industrial dan bahan eco-friendly. Cocok untuk rumah dengan anak kecil atau hewan peliharaan.',
  price: 350000,
  duration: 180, // dalam menit
  category: 'Premium Cleaning',
  icon: 'Sparkles',
  features: [
    'Pembersihan dengan peralatan HEPA filter',
    'Bahan cleaning eco-friendly & aman',
    'Sterilisasi dengan UV-C light',
    'Pembersihan area sulit dijangkau',
    'Finishing leather & wood conditioning',
    'Garansi 7 hari untuk hasil',
  ],
  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  isActive: true,
  isFeatured: true,
};

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

    console.log(`   Ditemukan ${services.length} services:`);
    services.forEach((service, index) => {
      const status = service.isActive ? '✅' : '❌';
      console.log(`   ${index + 1}. ${status} ${service.name} - Rp ${service.price?.toLocaleString('id-ID')}`);
    });

    return services;
  } catch (error: any) {
    console.error('   ❌ Gagal mengambil services:', error.message);
    throw error;
  }
}

// Step 2: Check apakah service dengan slug yang sama sudah ada
async function checkExistingService() {
  console.log('\n🔍 STEP 2: Check apakah service sudah ada...\n');

  try {
    const response = await fetchApi<any[]>('/services?all=true');
    const services = Array.isArray(response) ? response : [];
    const existing = services.find(s => s.slug === newServiceData.slug);

    if (existing) {
      console.log(`   ⚠️  Service dengan slug "${newServiceData.slug}" sudah ada!`);
      console.log(`   ID: ${existing.id}`);
      console.log(`   Nama: ${existing.name}`);
      return existing;
    } else {
      console.log(`   ✅ Service "${newServiceData.slug}" belum ada, bisa ditambahkan`);
      return null;
    }
  } catch (error: any) {
    console.error('   ❌ Gagal check service:', error.message);
    throw error;
  }
}

// Step 3: Add new service
async function addNewService() {
  console.log('\n➕ STEP 3: Menambahkan service baru...\n');

  console.log('   📝 Data service yang akan ditambahkan:');
  console.log('   ┌──────────────────────────────────────────────────────────────┐');
  console.log(`   │ Name:        ${newServiceData.name.padEnd(40)} │`);
  console.log(`   │ Slug:        ${newServiceData.slug.padEnd(40)} │`);
  console.log(`   │ Price:       Rp ${newServiceData.price.toLocaleString('id-ID').padEnd(35)} │`);
  console.log(`   │ Duration:    ${newServiceData.duration} menit`.padEnd(50) + '│');
  console.log(`   │ Category:    ${newServiceData.category.padEnd(40)} │`);
  console.log(`   │ Icon:        ${newServiceData.icon.padEnd(40)} │`);
  console.log(`   │ Image:       ${newServiceData.image.substring(0, 40).padEnd(40)} │`);
  console.log(`   │ isActive:    ${String(newServiceData.isActive).padEnd(40)} │`);
  console.log(`   │ isFeatured:  ${String(newServiceData.isFeatured).padEnd(40)} │`);
  console.log('   └──────────────────────────────────────────────────────────────┘');

  console.log('\n   📋 Features:');
  newServiceData.features.forEach((feature, index) => {
    console.log(`      ${index + 1}. ${feature}`);
  });

  try {
    const response = await fetchApi<any>('/services', {
      method: 'POST',
      body: JSON.stringify(newServiceData),
    });

    console.log('\n   ✅ Service berhasil ditambahkan!');
    console.log(`   ID: ${response.id}`);
    console.log(`   Name: ${response.name}`);
    console.log(`   Slug: ${response.slug}`);

    return response;
  } catch (error: any) {
    console.error('\n   ❌ Gagal menambahkan service:', error.message);
    throw error;
  }
}

// Step 4: Verify service sudah ditambahkan
async function verifyService() {
  console.log('\n✅ STEP 4: Verifikasi service sudah ditambahkan...\n');

  try {
    const response = await fetchApi<any[]>('/services?all=true');
    const services = Array.isArray(response) ? response : [];
    const addedService = services.find(s => s.slug === newServiceData.slug);

    if (addedService) {
      console.log('   Service ditemukan di database:');
      console.log('   ┌──────────────────────────────────────────────────────────────┐');
      console.log(`   │ ID:          ${addedService.id.padEnd(40)} │`);
      console.log(`   │ Name:        ${addedService.name.padEnd(40)} │`);
      console.log(`   │ Slug:        ${addedService.slug.padEnd(40)} │`);
      console.log(`   │ Price:       Rp ${addedService.price?.toLocaleString('id-ID')?.padEnd(35)} │`);
      console.log(`   │ Category:    ${addedService.category?.padEnd(40)} │`);
      console.log(`   │ Image:       ${addedService.image?.substring(0, 37).padEnd(40)} │`);
      console.log(`   │ isActive:    ${String(addedService.isActive).padEnd(40)} │`);
      console.log(`   │ isFeatured:  ${String(addedService.isFeatured).padEnd(40)} │`);
      console.log('   └──────────────────────────────────────────────────────────────┘');

      // Tampilkan image URL
      console.log('\n   🖼️ Image URL:');
      console.log(`   ${addedService.image}`);

      return addedService;
    } else {
      console.log('   ❌ Service tidak ditemukan setelah ditambahkan!');
      return null;
    }
  } catch (error: any) {
    console.error('   ❌ Gagal verifikasi:', error.message);
    throw error;
  }
}

// Main function
async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('         ➕ ADD NEW SERVICE - ADMIN SIMULATION ➕');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`\n🌐 API Base URL: ${API_BASE}`);
  console.log(`⏰ Waktu mulai: ${new Date().toLocaleString('id-ID')}`);

  try {
    // Step 0: Login
    await loginAsAdmin();

    // Step 1: Get current services
    await getAllServices();

    // Step 2: Check existing
    const existing = await checkExistingService();

    if (existing) {
      console.log('\n═══════════════════════════════════════════════════════════════');
      console.log('                    ⚠️  SERVICE SUDAH ADA');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(`\n   Service "${newServiceData.name}" sudah ada di database.`);
      console.log('   Tidak perlu menambahkan duplikat.\n');
      return;
    }

    // Step 3: Add new service
    const newService = await addNewService();

    // Step 4: Verify
    await verifyService();

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                    ✅ ADD SERVICE BERHASIL');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`\n   Service "${newServiceData.name}" berhasil ditambahkan ke database!`);
    console.log(`   \n   🖼️ Image Unsplash: ${newServiceData.image}`);
    console.log(`\n⏰ Waktu selesai: ${new Date().toLocaleString('id-ID')}`);

  } catch (error: any) {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                    ❌ ADD SERVICE GAGAL');
    console.log('═══════════════════════════════════════════════════════════════');
    console.error(`\n💥 Error: ${error.message}`);
    process.exit(1);
  }
}

// Jalankan
main();
