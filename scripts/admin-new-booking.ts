/**
 * Simulasi New Booking di Admin
 *
 * Script ini mensimulasikan proses creating new booking
 * di halaman admin/bookings
 *
 * Usage: npx tsx scripts/admin-new-booking.ts
 */

const API_BASE = process.env.API_URL || 'http://localhost:4000/api';

// JWT Token untuk authentication
let authToken: string | null = null;

// Data booking baru
interface NewBookingData {
  serviceDate: string;
  serviceTime: string;
  address: string;
  area: string;
  notes: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
}

// Generate random date dalam 7-30 hari ke depan
function getRandomFutureDate(): string {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + Math.floor(Math.random() * 24) + 7);
  return futureDate.toISOString().split('T')[0];
}

// Generate random time slot
function getRandomTimeSlot(): string {
  const slots = [
    '07:00', '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  return slots[Math.floor(Math.random() * slots.length)];
}

// Generate random customer data
function generateCustomerData() {
  const customers = [
    { name: 'Ratna Sari', email: 'ratna.sari@gmail.com', phone: '081234567001' },
    { name: 'Dimas Pratama', email: 'dimas.pratama@yahoo.com', phone: '081234567002' },
    { name: 'Lisa Permata', email: 'lisa.permata@outlook.com', phone: '081234567003' },
    { name: 'Rizki Ramadhan', email: 'rizki.ramadhan@gmail.com', phone: '081234567004' },
    { name: 'Anita Wijaya', email: 'anita.wijaya@hotmail.com', phone: '081234567005' },
    { name: 'Bayu Setiawan', email: 'bayu.setiawan@gmail.com', phone: '081234567006' },
    { name: 'Dewi Kusuma', email: 'dewi.kusuma@yahoo.com', phone: '081234567007' },
    { name: 'Arief Rahman', email: 'arief.rahman@outlook.com', phone: '081234567008' },
  ];
  return customers[Math.floor(Math.random() * customers.length)];
}

// Generate random address
function generateAddress() {
  const addresses = [
    { street: 'Jl. Sudirman No. 45', city: 'Jakarta Selatan', area: '50 m²' },
    { street: 'Jl. Thamrin No. 78', city: 'Jakarta Pusat', area: '75 m²' },
    { street: 'Jl. Gatot Subroto No. 123', city: 'Jakarta Selatan', area: '100 m²' },
    { street: 'Jl. HR Rasuna Said No. 56', city: 'Jakarta Selatan', area: '60 m²' },
    { street: 'Jl. Kebayoran Baru No. 34', city: 'Jakarta Selatan', area: '80 m²' },
    { street: 'Jl. Ahmad Yani No. 89', city: 'Surabaya', area: '90 m²' },
    { street: 'Jl. Merdeka No. 123', city: 'Bandung', area: '70 m²' },
    { street: 'Jl. Gajahmada No. 67', city: 'Semarang', area: '85 m²' },
  ];
  return addresses[Math.floor(Math.random() * addresses.length)];
}

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

// Step 1: Get all services untuk dipilih
async function getServices() {
  console.log('\n📋 STEP 1: Mengambil daftar services...\n');

  try {
    const response = await fetchApi<any[]>('/services');
    const services = Array.isArray(response) ? response : response.data || [];

    // Filter hanya yang aktif
    const activeServices = services.filter((s: any) => s.isActive);

    console.log(`   Ditemukan ${activeServices.length} services aktif:`);
    activeServices.slice(0, 5).forEach((service: any, index: number) => {
      console.log(`   ${index + 1}. ${service.name} - Rp ${service.price?.toLocaleString('id-ID')} (${service.duration} min)`);
    });
    if (activeServices.length > 5) {
      console.log(`   ... dan ${activeServices.length - 5} services lainnya`);
    }

    return activeServices;
  } catch (error: any) {
    console.error('   ❌ Gagal mengambil services:', error.message);
    throw error;
  }
}

// Step 2: Get existing bookings untuk melihat status
async function getBookings() {
  console.log('\n📋 STEP 2: Mengambil bookings yang sudah ada...\n');

  try {
    const response = await fetchApi<any>('/bookings');
    const bookings = response.data || [];

    console.log(`   Total bookings: ${response.total || bookings.length}`);

    // Count by status
    const statusCount: Record<string, number> = {};
    bookings.forEach((b: any) => {
      const status = b.status || 'UNKNOWN';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    console.log('   Per status:');
    for (const [status, count] of Object.entries(statusCount)) {
      console.log(`      • ${status}: ${count}`);
    }

    return bookings;
  } catch (error: any) {
    console.error('   ❌ Gagal mengambil bookings:', error.message);
    return [];
  }
}

// Step 3: Generate booking data
async function generateBookingData(services: any[]): Promise<NewBookingData> {
  console.log('\n📝 STEP 3: Generate data booking baru...\n');

  // Pilih service secara random
  const randomService = services[Math.floor(Math.random() * services.length)];
  const customer = generateCustomerData();
  const address = generateAddress();

  const bookingData: NewBookingData = {
    serviceDate: getRandomFutureDate(),
    serviceTime: getRandomTimeSlot(),
    address: `${address.street}, ${address.city}`,
    area: address.area,
    notes: 'Booking dari simulasi admin - mohon konfirmasi sebelum datang',
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    serviceId: randomService.id,
    serviceName: randomService.name,
    servicePrice: randomService.price,
  };

  console.log('   📋 Data Booking:');
  console.log('   ┌──────────────────────────────────────────────────────────────┐');
  console.log(`   │ Customer: ${bookingData.customerName.padEnd(43)} │`);
  console.log(`   │ Email:    ${bookingData.customerEmail.padEnd(43)} │`);
  console.log(`   │ Phone:    ${bookingData.customerPhone.padEnd(43)} │`);
  console.log(`   │ Service:  ${bookingData.serviceName.padEnd(43)} │`);
  console.log(`   │ Price:    Rp ${bookingData.servicePrice.toLocaleString('id-ID').padEnd(37)} │`);
  console.log(`   │ Date:     ${bookingData.serviceDate.padEnd(43)} │`);
  console.log(`   │ Time:     ${bookingData.serviceTime.padEnd(43)} │`);
  console.log(`   │ Address:  ${bookingData.address.substring(0, 43).padEnd(43)} │`);
  console.log(`   │ Area:     ${bookingData.area.padEnd(43)} │`);
  console.log('   └──────────────────────────────────────────────────────────────┘');

  return bookingData;
}

// Step 4: Create new booking
async function createBooking(data: NewBookingData) {
  console.log('\n🚀 STEP 4: Membuat booking baru...\n');

  const bookingPayload = {
    serviceDate: data.serviceDate,
    serviceTime: data.serviceTime,
    address: data.address,
    area: data.area,
    notes: data.notes,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    items: [
      {
        serviceId: data.serviceId,
        quantity: 1,
      },
    ],
  };

  console.log('   Payload yang dikirim:');
  console.log(`   ${JSON.stringify(bookingPayload, null, '   ').split('\n').join('\n   ')}`);

  try {
    const response = await fetchApi<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingPayload),
    });

    console.log('\n   ✅ Booking berhasil dibuat!');
    console.log(`   Order Number: ${response.orderNumber}`);
    console.log(`   Booking ID: ${response.id}`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Total: Rp ${response.totalAmount?.toLocaleString('id-ID') || data.servicePrice.toLocaleString('id-ID')}`);

    return response;
  } catch (error: any) {
    console.error('\n   ❌ Gagal membuat booking:', error.message);
    throw error;
  }
}

// Step 5: Verify booking
async function verifyBooking(bookingId: string, orderNumber: string) {
  console.log('\n✅ STEP 5: Verifikasi booking...\n');

  try {
    const response = await fetchApi<any>(`/bookings/${bookingId}`);

    console.log('   📋 Detail Booking:');
    console.log('   ┌──────────────────────────────────────────────────────────────┐');
    console.log(`   │ ID:          ${response.id?.substring(0, 30).padEnd(30)} │`);
    console.log(`   │ Order Num:   ${response.orderNumber?.padEnd(30)} │`);
    console.log(`   │ Status:      ${response.status?.padEnd(30)} │`);
    console.log(`   │ Customer:    ${response.customer?.name?.padEnd(30)} │`);
    console.log(`   │ Email:       ${response.customer?.email?.substring(0, 30).padEnd(30)} │`);
    console.log(`   │ Phone:       ${response.customer?.phone?.padEnd(30)} │`);
    console.log(`   │ Service:     ${response.items?.[0]?.service?.name?.padEnd(30)} │`);
    console.log(`   │ Date:        ${response.serviceDate?.split('T')[0].padEnd(30)} │`);
    console.log(`   │ Time:        ${response.serviceTime?.padEnd(30)} │`);
    console.log(`   │ Address:     ${response.address?.substring(0, 30).padEnd(30)} │`);
    console.log(`   │ Total:       Rp ${response.totalAmount?.toLocaleString('id-ID')?.padEnd(25)} │`);
    console.log('   └──────────────────────────────────────────────────────────────┘');

    return response;
  } catch (error: any) {
    console.error('   ❌ Gagal verifikasi:', error.message);
    throw error;
  }
}

// Main function
async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('         📝 NEW BOOKING - ADMIN SIMULATION 📝');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`\n🌐 API Base URL: ${API_BASE}`);
  console.log(`⏰ Waktu mulai: ${new Date().toLocaleString('id-ID')}`);

  try {
    // Step 0: Login
    await loginAsAdmin();

    // Step 1: Get services
    const services = await getServices();

    if (services.length === 0) {
      console.log('\n   ❌ Tidak ada services tersedia!');
      process.exit(1);
    }

    // Step 2: Get existing bookings
    await getBookings();

    // Step 3: Generate booking data
    const bookingData = await generateBookingData(services);

    // Step 4: Create booking
    const newBooking = await createBooking(bookingData);

    // Step 5: Verify
    await verifyBooking(newBooking.id, newBooking.orderNumber);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                    ✅ BOOKING BERHASIL');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`\n   Order Number: ${newBooking.orderNumber}`);
    console.log(`   Customer: ${bookingData.customerName}`);
    console.log(`   Service: ${bookingData.serviceName}`);
    console.log(`   Date: ${bookingData.serviceDate} at ${bookingData.serviceTime}`);
    console.log(`   Total: Rp ${bookingData.servicePrice.toLocaleString('id-ID')}`);
    console.log(`\n⏰ Waktu selesai: ${new Date().toLocaleString('id-ID')}`);

  } catch (error: any) {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                    ❌ BOOKING GAGAL');
    console.log('═══════════════════════════════════════════════════════════════');
    console.error(`\n💥 Error: ${error.message}`);
    process.exit(1);
  }
}

// Jalankan
main();
