const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkLatestBooking() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   CEK BOOKING TERAKHIR & NOTIFIKASI');
  console.log('═══════════════════════════════════════════════════\n');

  try {
    // 1. Get latest booking
    const latestBooking = await prisma.booking.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        bookingItems: true,
        customer: true
      }
    });

    if (!latestBooking) {
      console.log('❌ Tidak ada booking di database\n');
      
      // Create a test booking
      console.log('📝 Membuat test booking...\n');
      
      const service = await prisma.service.findFirst();
      if (!service) {
        console.log('❌ Tidak ada service');
        return;
      }

      const orderNumber = `TEST-${Date.now()}`;
      const newBooking = await prisma.booking.create({
        data: {
          orderNumber,
          customerName: 'Test User',
          customerEmail: 'test@example.com',
          customerPhone: '081234567890',
          address: 'Jl. Test No. 123, Jakarta',
          serviceArea: 'Jakarta',
          serviceDate: new Date('2026-04-20'),
          serviceTime: '14:00',
          totalPrice: 500000,
          notes: 'Ini catatan penting dari customer',
          status: 'PENDING',
          source: 'WEBSITE',
          bookingItems: {
            create: {
              serviceId: service.id,
              serviceName: service.name,
              quantity: 1,
              price: service.price,
              total: service.price
            }
          }
        }
      });

      console.log('✅ Test booking dibuat:', newBooking.orderNumber);
      console.log('   Notes:', newBooking.notes);
      console.log('   Semua field tersimpan\n');
    } else {
      console.log('📋 BOOKING TERAKHIR:');
      console.log('   Order Number :', latestBooking.orderNumber);
      console.log('   Customer     :', latestBooking.customerName);
      console.log('   Email        :', latestBooking.customerEmail);
      console.log('   Phone        :', latestBooking.customerPhone);
      console.log('   Address      :', latestBooking.address);
      console.log('   Service Area :', latestBooking.serviceArea);
      console.log('   Service Date :', latestBooking.serviceDate?.toISOString().split('T')[0]);
      console.log('   Service Time :', latestBooking.serviceTime);
      console.log('   Notes        :', latestBooking.notes || '(kosong)');
      console.log('   Total Price  : Rp', latestBooking.totalPrice?.toLocaleString('id-ID'));
      console.log('   Status       :', latestBooking.status);
      console.log('   Source       :', latestBooking.source);
      console.log('   Created At   :', latestBooking.createdAt?.toLocaleString());
      console.log('   Items        :', latestBooking.bookingItems?.length || 0, 'item(s)');
    }

    // 2. Get notification settings
    console.log('\n═══════════════════════════════════════════════════');
    console.log('   NOTIFICATION SETTINGS');
    console.log('═══════════════════════════════════════════════════');
    
    const notif = await prisma.notificationSettings.findFirst();
    if (notif) {
      const email = notif.config?.email;
      const wa = notif.config?.whatsapp;
      const twilio = notif.config?.twilio;
      
      console.log('📧 Email:');
      console.log('   Enabled:', email?.enabled ? '✅' : '❌');
      console.log('   Host    :', email?.host || '-');
      console.log('   User    :', email?.user || '-');
      console.log('   Admin   :', email?.adminEmail || '-');
      console.log('   Pass?   :', notif.secrets?.emailPassword ? '✅ Tersimpan' : '❌');
      
      console.log('\n📱 WhatsApp:');
      console.log('   Enabled :', wa?.enabled ? '✅' : '❌');
      console.log('   Number  :', wa?.number || '-');
      
      console.log('\n🔷 Twilio:');
      console.log('   SID     :', twilio?.accountSid || '-');
      console.log('   From    :', twilio?.fromNumber || '-');
      console.log('   Token?  :', notif.secrets?.twilioAuthToken ? '✅ Tersimpan' : '❌');
      
      // Summary
      console.log('\n═══════════════════════════════════════════════════');
      console.log('   STATUS NOTIFIKASI');
      console.log('═══════════════════════════════════════════════════');
      if (email?.enabled) {
        console.log('✅ Email aktif →', email.adminEmail);
      } else {
        console.log('❌ Email nonaktif');
      }
      
      if (wa?.enabled) {
        console.log('✅ WhatsApp aktif →', wa.number);
      } else {
        console.log('❌ WhatsApp nonaktif');
      }
      
      console.log('\n📌 CATATAN:');
      console.log('   Server API harus running untuk mengirim notifikasi');
      console.log('   Notifikasi dikirim saat booking.create via API');
      console.log('   Pastikan port 4000 tidak bentrok');
      
    } else {
      console.log('❌ Tidak ada notification settings');
    }

    // 3. Check all bookings count
    const bookingCount = await prisma.booking.count();
    console.log('\n📊 Total Booking di Database:', bookingCount);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkLatestBooking();
