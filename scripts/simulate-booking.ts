/**
 * Simulasi Booking untuk aplikasi NingClean
 *
 * Script ini mensimulasikan proses booking dari mulai pemilihan layanan
 * hingga konfirmasi booking.
 *
 * Usage: npx tsx scripts/simulate-booking.ts
 */

const API_BASE = process.env.API_URL || 'http://localhost:4000/api';

// Helper function untuk fetch API
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Generate random date dalam 7 hari ke depan
function getRandomFutureDate(): string {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + Math.floor(Math.random() * 7) + 1);

  // Format: YYYY-MM-DD
  return futureDate.toISOString().split('T')[0];
}

// Generate random time slot
function getRandomTimeSlot(): string {
  const slots = [
    '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  return slots[Math.floor(Math.random() * slots.length)];
}

// Generate random customer data
function generateCustomerData() {
  const names = ['Budi Santoso', 'Siti Rahayu', 'Ahmad Fauzi', 'Dewi Lestari', 'Rudi Hermawan'];
  const phones = ['081234567890', '087654321098', '081234567891', '085678901234'];
  const emails = ['budi@example.com', 'siti@example.com', 'ahmad@example.com', 'dewi@example.com'];

  return {
    name: names[Math.floor(Math.random() * names.length)],
    email: emails[Math.floor(Math.random() * emails.length)],
    phone: phones[Math.floor(Math.random() * phones.length)],
  };
}

// Step 1: Get all services
async function getServices() {
  console.log('\n📋 STEP 1: Mengambil daftar layanan...\n');

  try {
    const response = await fetchApi<any[]>('/services');
    const services = Array.isArray(response) ? response : [];

    // Filter hanya service yang aktif
    const activeServices = services.filter((s: any) => s.isActive);

    console.log(`   Ditemukan ${activeServices.length} layanan aktif:`);
    activeServices.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.name} - Rp ${service.price?.toLocaleString('id-ID') || 'N/A'}`);
    });

    return activeServices;
  } catch (error) {
    console.error('   ❌ Gagal mengambil layanan:', error);
    throw error;
  }
}

// Step 2: Select a service (we'll pick the first one)
async function selectService(services: any[]) {
  console.log('\n🎯 STEP 2: Memilih layanan...\n');

  if (services.length === 0) {
    throw new Error('Tidak ada layanan tersedia');
  }

  // Pilih layanan pertama
  const selectedService = services[0];
  console.log(`   Layanan dipilih: ${selectedService.name}`);
  console.log(`   ID: ${selectedService.id}`);
  console.log(`   Harga: Rp ${selectedService.price?.toLocaleString('id-ID') || 'N/A'}`);

  return selectedService;
}

// Step 3: Schedule booking (already generated)
function getSchedule() {
  console.log('\n📅 STEP 3: Menentukan jadwal...\n');

  const date = getRandomFutureDate();
  const time = getRandomTimeSlot();

  console.log(`   Tanggal: ${date}`);
  console.log(`   Waktu: ${time}`);

  return { date, time };
}

// Step 4: Address and customer info
function getAddressAndCustomer() {
  console.log('\n🏠 STEP 4: Mengisi data alamat dan pelanggan...\n');

  const customer = generateCustomerData();

  const address = {
    address: 'Jl. Raya Surabaya No. 123',
    city: 'Surabaya',
    area: '50 m²',
    notes: 'Booking otomatis dari simulasi',
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
  };

  console.log(`   Nama: ${address.customerName}`);
  console.log(`   Email: ${address.customerEmail}`);
  console.log(`   Telepon: ${address.customerPhone}`);
  console.log(`   Alamat: ${address.address}`);
  console.log(`   Kota: ${address.city}`);
  console.log(`   Area: ${address.area}`);

  return address;
}

// Step 5: Submit booking
async function submitBooking(
  service: any,
  schedule: { date: string; time: string },
  addressData: ReturnType<typeof getAddressAndCustomer>
) {
  console.log('\n🚀 STEP 5: Mengirim booking...\n');

  const bookingData = {
    serviceDate: schedule.date,
    serviceTime: schedule.time,
    address: `${addressData.address}, ${addressData.city}`,
    area: addressData.area,
    notes: addressData.notes,
    customerName: addressData.customerName,
    customerEmail: addressData.customerEmail,
    customerPhone: addressData.customerPhone,
    items: [
      {
        serviceId: service.id,
        quantity: 1,
      },
    ],
  };

  console.log('   Data booking yang dikirim:');
  console.log(`   ${JSON.stringify(bookingData, null, '   ').split('\n').join('\n   ')}`);

  try {
    const response = await fetchApi<{ success: boolean; message: string; data: any }>(
      '/bookings',
      {
        method: 'POST',
        body: JSON.stringify(bookingData),
      }
    );

    console.log('\n   ✅ Booking berhasil!');
    console.log(`   Message: ${response.message}`);
    if (response.data) {
      console.log(`   Booking ID: ${response.data.id || 'N/A'}`);
    }

    return response;
  } catch (error: any) {
    console.error('\n   ❌ Booking gagal:', error.message);
    throw error;
  }
}

// Main simulation function
async function simulateBooking() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('         🎉 SIMULASI BOOKING NINGCLEAN 🎉');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`\n🌐 API Base URL: ${API_BASE}`);
  console.log(`⏰ Waktu mulai: ${new Date().toLocaleString('id-ID')}`);

  try {
    // Step 1: Get services
    const services = await getServices();

    // Step 2: Select service
    const selectedService = await selectService(services);

    // Step 3: Get schedule
    const schedule = getSchedule();

    // Step 4: Get address and customer
    const addressData = getAddressAndCustomer();

    // Step 5: Submit booking
    const result = await submitBooking(selectedService, schedule, addressData);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                    ✅ SIMULASI BERHASIL');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`\n⏰ Waktu selesai: ${new Date().toLocaleString('id-ID')}`);

    return result;
  } catch (error: any) {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                    ❌ SIMULASI GAGAL');
    console.log('═══════════════════════════════════════════════════════════════');
    console.error(`\n💥 Error: ${error.message}`);
    process.exit(1);
  }
}

// Jalankan simulasi
simulateBooking();
