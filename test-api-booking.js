const http = require('http');

// Data booking dari website form
const bookingData = {
  customerName: 'Siti Rahayu',
  customerEmail: 'siti.rahayu@test.com',
  customerPhone: '089876543210',
  serviceId: '', // akan diisi setelah get service
  bookingDate: '2026-04-25',
  bookingTime: '10:00',
  address: 'Jl. Melati No. 78, Kelapa Gading, Jakarta Utara',
  notes: 'Rumah 2 lantai, mohon bawa tangga. Ada kucing di rumah, tolong hati-hati.',
  totalPrice: 450000
};

// Pertama, ambil service dari API
function getServices() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 4000,
      path: '/api/services',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const services = JSON.parse(data);
          resolve(services);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

// Kirim booking ke API
function createBooking(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const req = http.request({
      hostname: 'localhost',
      port: 4000,
      path: '/api/bookings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data,
          headers: res.headers
        });
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function testBooking() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   SIMULASI BOOKING VIA API');
  console.log('   POST /api/bookings');
  console.log('═══════════════════════════════════════════════════\n');

  try {
    // 1. Get services
    console.log('1️⃣ Mengambil daftar services...');
    const services = await getServices();
    if (!services || services.length === 0) {
      console.log('❌ Tidak ada service tersedia');
      return;
    }
    
    const service = services[0];
    console.log('   ✅ Service:', service.name, '- Rp', service.price);
    bookingData.serviceId = service.id;

    // 2. Kirim booking
    console.log('\n2️⃣ Mengirim POST /api/bookings...');
    console.log('   Data:');
    console.log('   - Nama:', bookingData.customerName);
    console.log('   - Email:', bookingData.customerEmail);
    console.log('   - Phone:', bookingData.customerPhone);
    console.log('   - Alamat:', bookingData.address);
    console.log('   - Notes:', bookingData.notes);
    console.log('   - Total: Rp', bookingData.totalPrice);
    console.log('   - Service ID:', bookingData.serviceId);

    const response = await createBooking(bookingData);
    
    console.log('\n3️⃣ Response dari API:');
    console.log('   Status Code:', response.statusCode);
    
    if (response.statusCode === 201 || response.statusCode === 200) {
      const result = JSON.parse(response.data);
      console.log('   ✅ Booking berhasil dibuat!');
      console.log('   Order Number:', result.orderNumber || result.booking?.orderNumber);
      console.log('   ID:', result.id || result.booking?.id);
      console.log('   Status:', result.status || result.booking?.status);
      
      console.log('\n═══════════════════════════════════════════════════');
      console.log('   🎉 BOOKING BERHASIL!');
      console.log('═══════════════════════════════════════════════════');
      console.log('\n📧 Notifikasi akan dikirim ke:');
      console.log('   Email: kurcool3@gmail.com');
      console.log('   WhatsApp: 085718779500');
      console.log('\n📱 Silakan cek:');
      console.log('   1. Gmail (inbox/spam)');
      console.log('   2. WhatsApp di HP Anda');
      console.log('   3. Admin Panel: http://localhost:3000/admin/bookings');
      
    } else {
      console.log('   ❌ Error:', response.statusCode);
      console.log('   Response:', response.data);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Pastikan API server berjalan di port 4000');
      console.log('   Jalankan: cd ningclean/apps/api && npm run start');
    }
  }
}

testBooking();
