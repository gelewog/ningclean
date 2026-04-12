const http = require('http');

// Helper untuk HTTP request
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
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function simulateBooking() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   SIMULASI BOOKING VIA API');
  console.log('   POST /api/bookings');
  console.log('═══════════════════════════════════════════════════\n');

  try {
    // 1. Get services
    console.log('1️⃣  GET /api/services');
    const servicesRes = await request({
      hostname: 'localhost',
      port: 4000,
      path: '/api/services',
      method: 'GET'
    });

    if (servicesRes.statusCode !== 200 || !servicesRes.data.length) {
      console.log('❌ Tidak ada service tersedia');
      return;
    }

    const service = servicesRes.data[0];
    console.log('   ✅ Service:', service.name, '- Rp', service.price);
    console.log('   ID:', service.id);

    // 2. Create booking dengan NOTES
    const bookingData = {
      customerName: 'Siti Rahayu',
      customerEmail: 'siti.rahayu@example.com',
      customerPhone: '089876543210',
      serviceId: service.id,
      bookingDate: '2026-04-25',
      bookingTime: '10:00',
      address: 'Jl. Melati No. 78, Kelapa Gading, Jakarta Utara',
      notes: 'Rumah 2 lantai, mohon bawa tangga. Ada kucing di rumah, tolong hati-hati. Pintu masuk dari samping.',
      totalPrice: 450000
    };

    console.log('\n2️⃣  POST /api/bookings');
    console.log('   Data yang dikirim:');
    console.log('   • Nama:', bookingData.customerName);
    console.log('   • Email:', bookingData.customerEmail);
    console.log('   • Phone:', bookingData.customerPhone);
    console.log('   • Alamat:', bookingData.address);
    console.log('   • Catatan (NOTES):', bookingData.notes);
    console.log('   • Total: Rp', bookingData.totalPrice.toLocaleString('id-ID'));
    console.log('   • Tanggal:', bookingData.bookingDate);
    console.log('   • Jam:', bookingData.bookingTime);

    const postData = JSON.stringify(bookingData);
    const bookingRes = await request({
      hostname: 'localhost',
      port: 4000,
      path: '/api/bookings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, postData);

    console.log('\n3️⃣  Response:');
    console.log('   Status:', bookingRes.statusCode);

    if (bookingRes.statusCode === 201 || bookingRes.statusCode === 200) {
      const result = bookingRes.data;
      console.log('   ✅ Booking BERHASIL dibuat!');
      console.log('   📋 Order Number:', result.orderNumber || result.booking?.orderNumber);
      console.log('   🆔 ID:', result.id || result.booking?.id);
      console.log('   📊 Status:', result.status || result.booking?.status || 'PENDING');
      
      console.log('\n═══════════════════════════════════════════════════');
      console.log('   🎉 BOOKING BERHASIL!');
      console.log('═══════════════════════════════════════════════════');
      console.log('\n📧 Notifikasi akan dikirim ke:');
      console.log('   • Email: kurcool3@gmail.com');
      console.log('   • WhatsApp: 085718779500');
      console.log('\n📝 Catatan customer:');
      console.log('   "' + bookingData.notes + '"');
      console.log('\n📱 Silakan cek:');
      console.log('   1. Gmail (inbox/spam) untuk email notifikasi');
      console.log('   2. WhatsApp di HP Anda');
      console.log('   3. Admin Panel: http://localhost:3000/admin/bookings');
      
    } else {
      console.log('   ❌ Error:', bookingRes.statusCode);
      console.log('   Response:', JSON.stringify(bookingRes.data, null, 2));
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Pastikan API server berjalan di port 4000');
    }
  }
}

simulateBooking();
