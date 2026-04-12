const http = require('http');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Test data booking
const testBooking = {
  customerName: 'Test Customer',
  customerEmail: 'test@example.com',
  customerPhone: '081234567890',
  serviceId: '', // akan diisi setelah dapat service
  serviceName: 'Cleaning Service Test',
  bookingDate: new Date().toISOString().split('T')[0],
  bookingTime: '10:00',
  address: 'Jl. Test No. 123, Jakarta',
  notes: 'Ini adalah booking test dari simulasi',
  totalPrice: 250000
};

async function runTest() {
  console.log('═══════════════════════════════════════════');
  console.log('   SIMULASI BOOKING DARI WEBSITE');
  console.log('═══════════════════════════════════════════\n');

  try {
    // 1. Cek apakah ada service di database
    const services = await prisma.service.findMany({ take: 1 });
    if (services.length === 0) {
      console.log('❌ Tidak ada service di database. Buat service dulu.');
      return;
    }
    testBooking.serviceId = services[0].id;
    testBooking.serviceName = services[0].name;
    console.log('✅ Service ditemukan:', testBooking.serviceName);

    // 2. Simulasikan POST /api/bookings
    console.log('\n📝 Mengirim data booking ke API...\n');
    
    const postData = JSON.stringify({
      customerName: testBooking.customerName,
      customerEmail: testBooking.customerEmail,
      customerPhone: testBooking.customerPhone,
      serviceId: testBooking.serviceId,
      bookingDate: testBooking.bookingDate,
      bookingTime: testBooking.bookingTime,
      address: testBooking.address,
      notes: testBooking.notes,
      totalPrice: testBooking.totalPrice
    });

    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/api/bookings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', async () => {
        if (res.statusCode === 201 || res.statusCode === 200) {
          const response = JSON.parse(data);
          console.log('✅ Booking berhasil dibuat!');
          console.log('   Order Number:', response.orderNumber || response.booking?.orderNumber);
          console.log('   Status:', response.status || 'PENDING');
          console.log('   ID:', response.id || response.booking?.id);
          
          // 3. Verifikasi data di database
          console.log('\n🔍 Verifikasi di database...');
          const booking = await prisma.booking.findFirst({
            orderBy: { createdAt: 'desc' },
            include: { bookingItems: true }
          });
          
          if (booking) {
            console.log('\n📋 Data Booking di Database:');
            console.log('   ID           :', booking.id);
            console.log('   Order Number :', booking.orderNumber);
            console.log('   Customer     :', booking.customerName);
            console.log('   Email        :', booking.customerEmail);
            console.log('   Phone        :', booking.customerPhone);
            console.log('   Address      :', booking.address);
            console.log('   Notes        :', booking.notes || '(kosong)');
            console.log('   Total Price  :', booking.totalPrice);
            console.log('   Status       :', booking.status);
            console.log('   Service Date :', booking.serviceDate?.toISOString());
            console.log('   Service Time :', booking.serviceTime);
            console.log('   Created At   :', booking.createdAt?.toISOString());
          }
          
          // 4. Cek notification settings
          const notifSettings = await prisma.notificationSettings.findFirst();
          console.log('\n📧 Notification Settings:');
          console.log('   Email Enabled    :', notifSettings?.config?.email?.enabled);
          console.log('   WhatsApp Enabled :', notifSettings?.config?.whatsapp?.enabled);
          console.log('   Admin Email      :', notifSettings?.config?.email?.adminEmail);
          console.log('   WhatsApp Number  :', notifSettings?.config?.whatsapp?.number);
          
          console.log('\n═══════════════════════════════════════════');
          console.log('   ✅ SIMULASI SELESAI');
          console.log('═══════════════════════════════════════════');
          console.log('\n📌 Selanjutnya:');
          console.log('   1. Cek email kurcool3@gmail.com');
          console.log('   2. Cek WhatsApp 085718779500');
          console.log('   3. Buka Admin Panel → Bookings');
          
        } else {
          console.log('❌ Error:', res.statusCode);
          console.log('   Response:', data);
        }
        
        await prisma.$disconnect();
      });
    });

    req.on('error', async (e) => {
      console.error('❌ Request error:', e.message);
      await prisma.$disconnect();
    });

    req.write(postData);
    req.end();

  } catch (error) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
  }
}

runTest();
