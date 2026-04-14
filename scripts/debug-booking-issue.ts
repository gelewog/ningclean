/**
 * Debug New Booking Issue
 *
 * Script ini menguji format data yang dikirim frontend vs API yang diharapkan.
 *
 * Usage: npx tsx scripts/debug-booking-issue.ts
 */

const API_BASE = process.env.API_URL || 'http://localhost:4000/api';

let authToken: string | null = null;

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
      ...(options.headers as Record<string, string>),
    },
  });

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${JSON.stringify(json)}`);
  }

  return json;
}

async function login() {
  const response = await fetchApi<{ access_token: string; user: any }>(`/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@ningclean.com', password: 'admin123' }),
  });
  authToken = response.access_token;
  console.log('🔐 Logged in\n');
}

// Test 1: Frontend format (yang saat ini digunakan)
async function testFrontendFormat() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  TEST 1: Frontend Format (current - likely WRONG)');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Ini format yang dikirim frontend berdasarkan page.tsx lines 243-253
  const frontendPayload = {
    guestName: 'Test Customer',
    guestPhone: '081234567890',
    guestEmail: 'test@example.com',
    serviceId: '7868369f-6b59-4543-9b42-93f915ba47ac', // General Cleaning ID
    area: '50 m²',
    address: 'Jl. Test No. 123, Surabaya',
    serviceDate: '2026-04-20',
    serviceTime: '09:00',
    notes: 'Test booking dari debug script',
  };

  console.log('Payload yang dikirim:');
  console.log(JSON.stringify(frontendPayload, null, 2));

  try {
    const response = await fetchApi<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(frontendPayload),
    });
    console.log('\n✅ SUCCESS:', response);
    return response;
  } catch (error: any) {
    console.log('\n❌ FAILED:', error.message);
    return null;
  }
}

// Test 2: Correct format (DTO based)
async function testCorrectFormat() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  TEST 2: Correct Format (DTO based)');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Dapatkan service ID dulu
  const services: any[] = await fetchApi('/services');
  const generalCleaning = Array.isArray(services)
    ? services.find(s => s.name === 'General Cleaning')
    : services.data?.find((s: any) => s.name === 'General Cleaning');

  if (!generalCleaning) {
    console.log('❌ General Cleaning service not found');
    return null;
  }

  console.log(`Using Service: ${generalCleaning.name} (ID: ${generalCleaning.id})\n`);

  // Format yang diharapkan CreateBookingDto
  const correctPayload = {
    serviceDate: '2026-04-20',
    serviceTime: '09:00',
    address: 'Jl. Test No. 123, Surabaya',
    area: '50 m²',
    notes: 'Test booking dari debug script',
    customerName: 'Test Customer',
    customerEmail: 'test@example.com',
    customerPhone: '081234567890',
    items: [
      {
        serviceId: generalCleaning.id,
        quantity: 1,
      },
    ],
  };

  console.log('Payload yang seharusnya dikirim:');
  console.log(JSON.stringify(correctPayload, null, 2));

  try {
    const response = await fetchApi<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(correctPayload),
    });
    console.log('\n✅ SUCCESS:', response.orderNumber);
    return response;
  } catch (error: any) {
    console.log('\n❌ FAILED:', error.message);
    return null;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('         🔍 DEBUG BOOKING ISSUE 🔍');
  console.log('═══════════════════════════════════════════════════════════════\n');

  await login();

  // Test frontend format
  const result1 = await testFrontendFormat();

  console.log('\n');

  // Test correct format
  const result2 = await testCorrectFormat();

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('                    📊 SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Test 1 (Frontend Format):', result1 ? '✅ SUCCESS' : '❌ FAILED');
  console.log('Test 2 (Correct Format):  ', result2 ? '✅ SUCCESS' : '❌ FAILED');

  if (!result1 && result2) {
    console.log('\n💡 ISSUE IDENTIFIED:');
    console.log('   Frontend mengirimkan field yang salah ke API.');
    console.log('   - Field "guestName", "guestPhone", "guestEmail" tidak dikenali');
    console.log('   - Field "serviceId" langsung, bukan dalam array "items"');
    console.log('\n🔧 FIX NEEDED:');
    console.log('   Update handleCreateBooking di page.tsx untuk menggunakan format yang benar.');
  }
}

main();
