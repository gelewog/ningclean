/**
 * Simulasi Update Service "General Cleaning" di Admin
 *
 * Script ini mensimulasikan proses update service di apps/admin
 * dengan menambahkan gambar Unsplash sesuai judul service.
 *
 * Usage: npx tsx scripts/update-service-general-cleaning.ts
 */

const API_BASE = process.env.API_URL || 'http://localhost:4000/api';

// JWT Token untuk authentication
let authToken: string | null = null;

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

  const email = 'admin@ningclean.com';
  const password = 'admin123';

  console.log(`   Email: ${email}`);

  try {
    const response = await fetchApi<{ access_token: string; user: any }>(`/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
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

// Mapping nama service ke image Unsplash
const unsplashImages: Record<string, string> = {
  'General Cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
  'Deep Cleaning': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
  'Deep Cleaning Rumah': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
  'Deep Cleaning Apartemen': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  'Deep Cleaning Villa': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
  'Regular Cleaning Harian': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
  'Regular Cleaning Mingguan': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'Regular Cleaning Bulanan': 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&q=80',
  'Post Renovasi Ringan': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
  'Post Renovasi Besar': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  'Post Bangun Baru': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  'Sofa Cleaning Kain': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  'Sofa Cleaning Kulit': 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
  'Kasur & Springbed Cleaning': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  'Office Cleaning Harian': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  'Office Cleaning Weekend': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
  'Pre/Post Event Cleaning': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
};

// Fallback image generik untuk cleaning
const defaultCleaningImage = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80';

// Fungsi untuk mendapatkan image Unsplash berdasarkan nama service
function getUnsplashImage(serviceName: string): string {
  return unsplashImages[serviceName] || defaultCleaningImage;
}

// Step 1: Get all services
async function getAllServices() {
  console.log('\n📋 STEP 1: Mengambil semua services...\n');

  try {
    // Ambil semua services termasuk yang inactive untuk melihat General Cleaning
    const response = await fetchApi<any[]>('/services?all=true');
    const services = Array.isArray(response) ? response : [];

    console.log(`   Ditemukan ${services.length} services:`);
    services.forEach((service, index) => {
      const status = service.isActive ? '✅ Aktif' : '❌ Nonaktif';
      const hasImage = service.image ? '🖼️' : '⬜';
      console.log(`   ${index + 1}. ${service.name} [${status}] ${hasImage}`);
      if (service.image) {
        console.log(`      Image: ${service.image.substring(0, 60)}...`);
      }
    });

    return services;
  } catch (error) {
    console.error('   ❌ Gagal mengambil services:', error);
    throw error;
  }
}

// Step 2: Find "General Cleaning" service
async function findGeneralCleaning(services: any[]) {
  console.log('\n🔍 STEP 2: Mencari service "General Cleaning"...\n');

  // Cari service dengan nama "General Cleaning" atau mirip
  const generalCleaning = services.find(
    (s) =>
      s.name.toLowerCase().includes('general cleaning') ||
      s.name.toLowerCase() === 'general cleaning'
  );

  if (!generalCleaning) {
    // Jika tidak ada, cari service pertama yang tidak memiliki image
    const withoutImage = services.find((s) => !s.image);
    if (withoutImage) {
      console.log(`   ⚠️ Service "General Cleaning" tidak ditemukan, menggunakan: ${withoutImage.name}`);
      return withoutImage;
    }
    console.log('   ❌ Service "General Cleaning" tidak ditemukan');
    return null;
  }

  console.log(`   ✅ Ditemukan: ${generalCleaning.name}`);
  console.log(`   ID: ${generalCleaning.id}`);
  console.log(`   Deskripsi: ${generalCleaning.description}`);
  console.log(`   Harga: Rp ${generalCleaning.price?.toLocaleString('id-ID') || 'N/A'}`);
  console.log(`   Image saat ini: ${generalCleaning.image || 'BELUM ADA'}`);

  return generalCleaning;
}

// Step 3: Update service dengan image baru
async function updateServiceImage(service: any, newImage: string) {
  console.log('\n🖼️ STEP 3: Update image service...\n');

  console.log(`   Service: ${service.name}`);
  console.log(`   Image baru: ${newImage}`);

  try {
    const response = await fetchApi<any>(`/services/${service.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        image: newImage,
      }),
    });

    console.log('\n   ✅ Update berhasil!');
    console.log(`   Service ID: ${response.id}`);
    console.log(`   Image terbaru: ${response.image}`);

    return response;
  } catch (error: any) {
    console.error('\n   ❌ Update gagal:', error.message);
    throw error;
  }
}

// Step 4: Tampilkan hasil
async function showResult(service: any) {
  console.log('\n📊 STEP 4: Hasil Update...\n');

  console.log('   ┌──────────────────────────────────────────────────────────────┐');
  console.log(`   │ Service: ${service.name.padEnd(50)} │`);
  console.log(`   │ Image: ${service.image?.substring(0, 50)?.padEnd(50)} │`);
  console.log('   └──────────────────────────────────────────────────────────────┘');

  // Tampilkan preview image
  console.log('\n   🖼️ Preview Image:');
  console.log(`   ${service.image}`);
}

// Main function
async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('         🖼️ UPDATE SERVICE - GENERAL CLEANING 🖼️');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`\n🌐 API Base URL: ${API_BASE}`);
  console.log(`⏰ Waktu mulai: ${new Date().toLocaleString('id-ID')}`);

  try {
    // Step 0: Login sebagai Admin
    await loginAsAdmin();

    // Step 1: Get all services
    const services = await getAllServices();

    // Step 2: Find General Cleaning
    const generalCleaning = await findGeneralCleaning(services);

    if (!generalCleaning) {
      console.log('\n═══════════════════════════════════════════════════════════════');
      console.log('                    ❌ SERVICE TIDAK DITEMUKAN');
      console.log('═══════════════════════════════════════════════════════════════');
      process.exit(1);
    }

    // Step 3: Get image based on service name
    const newImage = getUnsplashImage(generalCleaning.name);
    console.log(`\n   📌 Image yang akan ditambahkan:`);
    console.log(`   ${newImage}`);

    // Step 4: Update service
    const updatedService = await updateServiceImage(generalCleaning, newImage);

    // Step 5: Show result
    await showResult(updatedService);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                    ✅ UPDATE BERHASIL');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`\n⏰ Waktu selesai: ${new Date().toLocaleString('id-ID')}`);

  } catch (error: any) {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                    ❌ UPDATE GAGAL');
    console.log('═══════════════════════════════════════════════════════════════');
    console.error(`\n💥 Error: ${error.message}`);
    process.exit(1);
  }
}

// Jalankan
main();
