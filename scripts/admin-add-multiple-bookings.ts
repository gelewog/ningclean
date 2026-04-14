/**
 * Simulasi Multiple New Bookings di Admin
 *
 * Script ini membuat beberapa booking sekaligus
 * untuk simulasi load data di admin bookings page.
 *
 * Usage: npx tsx scripts/admin-add-multiple-bookings.ts
 */

const API_BASE = process.env.API_URL || 'http://localhost:4000/api';

// JWT Token untuk authentication
let authToken: string | null = null;

// Sample data
const customers = [
  { name: 'Ratna Sari', email: 'ratna.sari@gmail.com', phone: '081234567001' },
  { name: 'Dimas Pratama', email: 'dimas.pratama@yahoo.com', phone: '081234567002' },
  { name: 'Lisa Permata', email: 'lisa.permata@outlook.com', phone: '081234567003' },
  { name: 'Rizki Ramadhan', email: 'rizki.ramadhan@gmail.com', phone: '081234567004' },
  { name: 'Anita Wijaya', email: 'anita.wijaya@hotmail.com', phone: '081234567005' },
  { name: 'Bayu Setiawan', email: 'bayu.setiawan@gmail.com', phone: '081234567006' },
  { name: 'Dewi Kusuma', email: 'dewi.kusuma@yahoo.com', phone: '081234567007' },
  { name: 'Arief Rahman', email: 'arief.rahman@outlook.com', phone: '081234567008' },
  { name: 'Maya Putri', email: 'maya.putri@gmail.com', phone: '081234567009' },
  { name: 'Fajar Nugroho', email: 'fajar.nugroho@yahoo.com', phone: '081234567010' },
  { name: 'Sari Dewi', email: 'sari.dewi@hotmail.com', phone: '081234567011' },
  { name: 'Bagus Prakoso', email: 'bagus.prakoso@gmail.com', phone: '081234567012' },
];

const addresses = [
  { street: 'Jl. Sudirman No. 45', city: 'Jakarta Selatan', area: '50 m²' },
  { street: 'Jl. Thamrin No. 78', city: 'Jakarta Pusat', area: '75 m²' },
  { street: 'Jl. Gatot Subroto No. 123', city: 'Jakarta Selatan', area: '100 m²' },
  { street: 'Jl. HR Rasuna Said No. 56', city: 'Jakarta Selatan', area: '60 m²' },
  { street: 'Jl. Kebayoran Baru No. 34', city: 'Jakarta Selatan', area: '80 m²' },
  { street: 'Jl. Ahmad Yani No. 89', city: 'Surabaya', area: '90 m²' },
  { street: 'Jl. Merdeka No. 123', city: 'Bandung', area: '70 m²' },
  { street: 'Jl. Gajahmada No. 67', city: 'Semarang', area: '85 m²' },
  { street: 'Jl. Braga No. 45', city: 'Bandung', area: '65 m²' },
  { street: 'Jl. Pemuda No. 90', city: 'Semarang', area: '55 m²' },
];

const timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// Helper functions
function randomDate(daysAheadMin: number, daysAheadMax: number): string {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + Math.floor(Math.random() * (daysAheadMax - daysAheadMin)) + daysAheadMin);
  return futureDate.toISOString().split('T')[0];
}

function randomTime(): string {
  return timeSlots[Math.floor(Math.random() * timeSlots.length)];
}

function randomCustomer() {
  return customers[Math.floor(Math.random() * customers.length)];
}

function randomAddress() {
  return addresses[Math.floor(Math.random() * addresses.length)];
}

// API helper
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

// Login
async function loginAsAdmin() {
  console.log('\n🔐 STEP 0: Login sebagai Admin...\n');

  try {
    const response = await fetchApi<{ access_token: string; user: any }>(`/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@ningclean.com', password: 'admin123' }),
    });

    authToken = response.access_token;
    console.log('   ✅ Login berhasil!');
    return authToken;
  } catch (error: any) {
    console.error('\n   ❌ Login gagal:', error.message);
    throw error;
  }
}

// Get services
async function getServices() {
  console.log('\n📋 STEP 1: Mengambil services...\n');

  try {
    const response = await fetchApi<any[]>('/services');
    const services = Array.isArray(response) ? response : response.data || [];
    const activeServices = services.filter((s: any) => s.isActive);
    console.log(`   Ditemukan ${activeServices.length} services aktif`);
    return activeServices;
  } catch (error: any) {
    console.error('   ❌ Gagal mengambil services:', error.message);
    throw error;
  }
}

// Get current bookings count
async function getCurrentBookingsCount() {
  try {
    const response = await fetchApi<any>('/bookings');
    return response.total || response.data?.length || 0;
  } catch {
    return 0;
  }
}

// Create single booking
async function createBooking(serviceId: string, serviceName: string, servicePrice: number) {
  const customer = randomCustomer();
  const address = randomAddress();

  const payload = {
    serviceDate: randomDate(7, 30),
    serviceTime: randomTime(),
    address: `${address.street}, ${address.city}`,
    area: address.area,
    notes: 'Booking dari simulasi',
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    items: [{ serviceId, quantity: 1 }],
  };

  const response = await fetchApi<any>('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return {
    orderNumber: response.orderNumber,
    customerName: customer.name,
    serviceName,
    servicePrice,
    serviceDate: payload.serviceDate,
    serviceTime: payload.serviceTime,
  };
}

// Main
async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('         📝 MULTIPLE BOOKINGS - ADMIN SIMULATION 📝');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`\n🌐 API Base URL: ${API_BASE}`);
  console.log(`⏰ Waktu mulai: ${new Date().toLocaleString('id-ID')}`);

  const results: { success: boolean; orderNumber?: string; customerName?: string; serviceName?: string; error?: string }[] = [];
  let services: any[] = [];

  try {
    // Login
    await loginAsAdmin();

    // Get services
    services = await getServices();

    if (services.length === 0) {
      console.log('\n   ❌ Tidak ada services!');
      process.exit(1);
    }

    // Get current count
    const beforeCount = await getCurrentBookingsCount();
    console.log(`\n   Bookings sebelum: ${beforeCount}`);

    // Create 10 bookings
    const numBookings = 10;
    console.log(`\n📦 STEP 2: Membuat ${numBookings} bookings baru...\n`);

    for (let i = 0; i < numBookings; i++) {
      const service = services[Math.floor(Math.random() * services.length)];

      process.stdout.write(`   [${i + 1}/${numBookings}] Creating booking... `);

      try {
        const result = await createBooking(service.id, service.name, service.price);
        console.log(`✅ ${result.orderNumber}`);
        console.log(`       Customer: ${result.customerName}`);
        console.log(`       Service: ${result.serviceName} (Rp ${result.servicePrice.toLocaleString('id-ID')})`);
        console.log(`       Schedule: ${result.serviceDate} at ${result.serviceTime}`);
        results.push({ success: true, ...result });
      } catch (error: any) {
        console.log(`❌ Error: ${error.message}`);
        results.push({ success: false, error: error.message });
      }
    }

    // Summary
    const afterCount = await getCurrentBookingsCount();

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                    📊 SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`\n   ✅ Berhasil: ${results.filter(r => r.success).length} bookings`);
    console.log(`   ❌ Gagal: ${results.filter(r => !r.success).length} bookings`);
    console.log(`   📊 Total bookings sebelumnya: ${beforeCount}`);
    console.log(`   📊 Total bookings sekarang: ${afterCount}`);

    if (results.filter(r => r.success).length > 0) {
      console.log('\n   📋 Bookings yang berhasil:');
      results.filter(r => r.success).forEach((r, idx) => {
        console.log(`      ${idx + 1}. ${r.orderNumber} - ${r.customerName} (${r.serviceName})`);
      });
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                    ✅ COMPLETE');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`\n⏰ Waktu selesai: ${new Date().toLocaleString('id-ID')}`);

  } catch (error: any) {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.error('                    ❌ FAILED');
    console.error(`\n💥 Error: ${error.message}`);
    console.log('═══════════════════════════════════════════════════════════════');
    process.exit(1);
  }
}

// Jalankan
main();
