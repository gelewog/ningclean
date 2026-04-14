/**
 * Verify All Bookings (with Auth)
 *
 * Usage: npx tsx scripts/verify-bookings.ts
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
  return response.json();
}

async function login() {
  const response = await fetchApi<{ access_token: string }>(`/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@ningclean.com', password: 'admin123' }),
  });
  authToken = response.access_token;
  console.log('🔐 Logged in as admin\n');
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('         📋 DAFTAR LENGKAP SEMUA BOOKINGS 📋');
  console.log('═══════════════════════════════════════════════════════════════\n');

  await login();

  try {
    const response = await fetchApi<any>('/bookings');
    const bookings = response.data || [];

    // Group by status
    const byStatus: Record<string, any[]> = {};
    bookings.forEach((b: any) => {
      const status = b.status || 'UNKNOWN';
      if (!byStatus[status]) byStatus[status] = [];
      byStatus[status].push(b);
    });

    const statusColors: Record<string, string> = {
      'PENDING': '🟡',
      'CONFIRMED': '🔵',
      'IN_PROGRESS': '🟠',
      'COMPLETED': '🟢',
      'CANCELLED': '🔴',
    };

    let totalIndex = 0;
    let totalAmount = 0;

    for (const [status, items] of Object.entries(byStatus)) {
      const icon = statusColors[status] || '⚪';
      console.log(`\n${icon} ${status} (${items.length} bookings)`);
      console.log('─'.repeat(80));

      items.forEach((item: any) => {
        totalIndex++;
        totalAmount += Number(item.totalAmount) || 0;

        const serviceNames = item.items?.map((i: any) => i.service?.name || 'N/A').join(', ') || 'N/A';
        const date = new Date(item.serviceDate).toLocaleDateString('id-ID');
        const orderNum = item.orderNumber || 'N/A';
        const customerName = item.customer?.name || 'N/A';
        const customerPhone = item.customer?.phone || 'N/A';

        console.log(`   ${String(totalIndex).padStart(2)}. ${orderNum}`);
        console.log(`      Customer : ${customerName} (${customerPhone})`);
        console.log(`      Service  : ${serviceNames}`);
        console.log(`      Schedule : ${date} at ${item.serviceTime}`);
        console.log(`      Address  : ${item.address}`);
        console.log(`      Total    : Rp ${(item.totalAmount || 0).toLocaleString('id-ID')}`);
        console.log('');
      });
    }

    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`         TOTAL: ${totalIndex} BOOKINGS`);
    console.log(`         TOTAL AMOUNT: Rp ${totalAmount.toLocaleString('id-ID')}`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Statistics
    console.log('📊 Statistics:');
    console.log(`   • Total Bookings: ${totalIndex}`);
    for (const [status, items] of Object.entries(byStatus)) {
      const icon = statusColors[status] || '⚪';
      console.log(`   ${icon} ${status}: ${items.length}`);
    }
    console.log('');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
