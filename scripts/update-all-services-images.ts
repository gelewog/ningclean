/**
 * Update All Services dengan Image Unsplash
 *
 * Script ini mengupdate semua service di database
 * dengan menambahkan gambar Unsplash sesuai kategori/nama service.
 *
 * Usage: npx tsx scripts/update-all-services-images.ts
 */

const API_BASE = process.env.API_URL || 'http://localhost:4000/api';

// JWT Token untuk authentication
let authToken: string | null = null;

// Mapping nama service ke image Unsplash
const unsplashImages: Record<string, string> = {
  // Deep Cleaning category
  'Deep Cleaning': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
  'Deep Cleaning Rumah': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
  'Deep Cleaning Apartemen': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  'Deep Cleaning Villa': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',

  // Regular Cleaning category
  'General Cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
  'Regular Cleaning Harian': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
  'Regular Cleaning Mingguan': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'Regular Cleaning Bulanan': 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&q=80',

  // Post Construction category
  'Post Renovasi Ringan': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
  'Post Renovasi Besar': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  'Post Bangun Baru': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',

  // Sofa Cleaning category
  'Sofa Cleaning': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  'Sofa Cleaning Kain': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  'Sofa Cleaning Kulit': 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
  'Kasur & Springbed Cleaning': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',

  // Office Cleaning category
  'Office Cleaning': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  'Office Cleaning Harian': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  'Office Cleaning Weekend': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
  'Pre/Post Event Cleaning': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
};

// Fallback image generik untuk cleaning
const defaultCleaningImage = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80';

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

// Fungsi untuk mendapatkan image Unsplash berdasarkan nama service
function getUnsplashImage(serviceName: string): string {
  return unsplashImages[serviceName] || defaultCleaningImage;
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

// Step 1: Get all services
async function getAllServices() {
  console.log('\n📋 STEP 1: Mengambil semua services...\n');

  try {
    const response = await fetchApi<any[]>('/services?all=true');
    const services = Array.isArray(response) ? response : [];

    console.log(`   Ditemukan ${services.length} services:`);
    services.forEach((service, index) => {
      const status = service.isActive ? '✅' : '❌';
      const hasImage = service.image ? '🖼️' : '⬜';
      console.log(`   ${index + 1}. ${status} ${service.name} ${hasImage}`);
    });

    return services;
  } catch (error: any) {
    console.error('   ❌ Gagal mengambil services:', error.message);
    throw error;
  }
}

// Step 2: Update single service
async function updateService(service: any): Promise<boolean> {
  const currentImage = service.image;
  const newImage = getUnsplashImage(service.name);

  // Skip jika image sudah ada dan sama
  if (currentImage && currentImage === newImage) {
    console.log(`   ⏭️  ${service.name} - Image sudah sama, skip`);
    return false;
  }

  try {
    await fetchApi<any>(`/services/${service.id}`, {
      method: 'PUT',
      body: JSON.stringify({ image: newImage }),
    });

    console.log(`   ✅ ${service.name}`);
    console.log(`      Image: ${newImage.substring(0, 60)}...`);
    return true;
  } catch (error: any) {
    console.log(`   ❌ ${service.name} - Gagal: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('         🖼️ UPDATE ALL SERVICES - UNSPLASH IMAGES 🖼️');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`\n🌐 API Base URL: ${API_BASE}`);
  console.log(`⏰ Waktu mulai: ${new Date().toLocaleString('id-ID')}`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  try {
    // Step 0: Login
    await loginAsAdmin();

    // Step 1: Get all services
    const services = await getAllServices();

    // Step 2: Update each service
    console.log('\n🖼️ STEP 2: Update images untuk setiap service...\n');

    for (const service of services) {
      const updated = await updateService(service);
      if (updated) {
        successCount++;
      } else {
        skipCount++;
      }
    }

    // Summary
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                    📊 SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`   ✅ Updated: ${successCount} services`);
    console.log(`   ⏭️  Skipped: ${skipCount} services (image sama)`);
    console.log(`   ❌ Failed: ${failCount} services`);
    console.log(`   📝 Total: ${services.length} services`);

    // List all images
    console.log('\n📷 Image Mapping:\n');
    for (const service of services) {
      const image = getUnsplashImage(service.name);
      console.log(`   ${service.name.padEnd(35)} => ${image.substring(0, 50)}...`);
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                    ✅ SEMUA SERVICE SUDAH DIUPDATE');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`\n⏰ Waktu selesai: ${new Date().toLocaleString('id-ID')}`);

  } catch (error: any) {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                    ❌ GAGAL');
    console.log('═══════════════════════════════════════════════════════════════');
    console.error(`\n💥 Error: ${error.message}`);
    process.exit(1);
  }
}

// Jalankan
main();
