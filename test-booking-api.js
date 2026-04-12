const http = require('http');

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: parsed, headers: res.headers });
        } catch {
          resolve({ statusCode: res.statusCode, data: data, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function simulateBooking() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   SIMULASI BOOKING VIA API');
  console.log('   POST /api/bookings');
  console.log('═══════════════════════════════════════════════════\n');

  try {
    // Get services
    console.log('1️⃣  GET /api/services');
    const servicesRes = await request({
      hostname: 'localhost', port: 4000, path: '/api/services', method: 'GET'
    });

    if (servicesRes.statusCode !== 200 || !servicesRes.data.length) {
      console.log('❌ Tidak ada service');
      return;
    }

    const service = servicesRes.data[0];
    console.log('   ✅ Service:', service.name);

    // Booking data sesuai DTO
    const bookingData = {
      serviceDate: '2026-04-25',
      serviceTime: '10:00',
      address: 'Jl. Melati No. 78, Kelapa Gading, Jakarta Utara',
      area: '150 m²',
      notes: 'Rumah 2 lantai, mohon bawa tangga. Ada kucing di rumah.',
      customerName: 'Siti Rahayu',
      customerEmail: 'siti.rahayu@example.com',
      customerPhone: '089876543210',
      items: [{ serviceId: service.id, quantity: 1 }]
    };

    console.log('\n2️⃣  POST /api/bookings');
    console.log('   Data:');
    console.log('   • Nama:', bookingData.customerName);
    console.log('   • Catatan:', bookingData.notes);

    const postData = JSON.stringify(bookingData);
    const bookingRes = await request({
      hostname: 'localhost', port: 4000, path: '/api/bookings', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
    }, postData);

    console.log('\n3️⃣  Response:', bookingRes.statusCode);
    if (bookingRes.statusCode === 201) {
      console.log('   ✅ Booking BERHASIL!');
      console.log('   Order:', bookingRes.data.orderNumber);
      console.log('\n📧 Notifikasi ke: kurcool3@gmail.com & WhatsApp');
    } else {
      console.log('   ❌ Error:', JSON.stringify(bookingRes.data, null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

simulateBooking();
