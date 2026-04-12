const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestBooking() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   MEMBUAT TEST BOOKING & CEK NOTIFIKASI');
  console.log('═══════════════════════════════════════════════════\n');

  try {
    // 1. Get service
    const service = await prisma.service.findFirst();
    if (!service) {
      console.log('❌ Tidak ada service');
      return;
    }
    console.log('✅ Service:', service.name, '- Rp', service.price.toLocaleString('id-ID'));

    // 2. Create test booking dengan SEMUA field yang ada
    const orderNumber = `TEST-${Date.now()}`;
    
    const bookingData = {
      orderNumber,
      status: 'PENDING',
      serviceDate: new Date('2026-04-20'),
      serviceTime: '14:00',
      address: 'Jl. Mawar No. 45, Blok C2, Jakarta Selatan',
      area: 'Jakarta',
      notes: 'Tolong bawa peralatan lengkap. Ada anak kecil di rumah.',
      internalNotes: 'Customer VIP, prioritaskan',
      totalAmount: 500000,
      guestName: 'Budi Santoso',
      guestEmail: 'budi.test@email.com',
      guestPhone: '081234567890',
      items: {
        create: {
          serviceId: service.id,
          quantity: 1,
          price: service.price
        }
      }
    };

    const booking = await prisma.booking.create({
      data: bookingData,
      include: {
        items: true
      }
    });

    console.log('\n✅ Booking berhasil dibuat!');
    console.log('   Order Number :', booking.orderNumber);
    console.log('   ID           :', booking.id);

    // 3. VERIFIKASI SEMUA FIELD
    console.log('\n═══════════════════════════════════════════════════');
    console.log('   VERIFIKASI FIELD BOOKING');
    console.log('═══════════════════════════════════════════════════');
    
    const fieldChecks = [
      ['ID', booking.id],
      ['Order Number', booking.orderNumber],
      ['Status', booking.status],
      ['Guest Name', booking.guestName],
      ['Guest Email', booking.guestEmail],
      ['Guest Phone', booking.guestPhone],
      ['Address', booking.address],
      ['Area', booking.area],
      ['Service Date', booking.serviceDate?.toISOString().split('T')[0]],
      ['Service Time', booking.serviceTime],
      ['Notes', booking.notes],
      ['Internal Notes', booking.internalNotes],
      ['Total Amount', booking.totalAmount?.toLocaleString('id-ID')],
      ['Items Count', booking.items?.length?.toString()],
      ['Created At', booking.createdAt?.toLocaleString()]
    ];

    fieldChecks.forEach(([label, value]) => {
      const status = value ? '✅' : '❌';
      const display = value || '(kosong)';
      console.log(`   ${label.padEnd(18)} ${status} ${display}`);
    });

    // 4. Check Notification Settings
    console.log('\n═══════════════════════════════════════════════════');
    console.log('   NOTIFICATION SETTINGS');
    console.log('═══════════════════════════════════════════════════');
    
    const notif = await prisma.notificationSettings.findFirst();
    if (notif) {
      const cfg = notif.config || {};
      const sec = notif.secrets || {};
      
      console.log('📧 Email:');
      console.log('   Enabled   :', cfg.email?.enabled ? '✅ AKTIF' : '❌ NONAKTIF');
      console.log('   Host      :', cfg.email?.host || '-');
      console.log('   Port      :', cfg.email?.port || '-');
      console.log('   User      :', cfg.email?.user || '-');
      console.log('   From      :', cfg.email?.from || '-');
      console.log('   Admin     :', cfg.email?.adminEmail || '-');
      console.log('   Password? :', sec.emailPassword ? '✅ Ada' : '❌ Tidak ada');
      
      console.log('\n📱 WhatsApp:');
      console.log('   Enabled   :', cfg.whatsapp?.enabled ? '✅ AKTIF' : '❌ NONAKTIF');
      console.log('   Number    :', cfg.whatsapp?.number || '-');
      console.log('   Message   :', cfg.whatsapp?.defaultMessage ? '✅ Ada template' : '❌ Tidak ada');
      
      console.log('\n🔷 Twilio:');
      console.log('   SID       :', cfg.twilio?.accountSid || '-');
      console.log('   From      :', cfg.twilio?.fromNumber || '-');
      console.log('   AuthToken?:', sec.twilioAuthToken ? '✅ Ada' : '❌ Tidak ada');
      
      // Summary
      console.log('\n═══════════════════════════════════════════════════');
      console.log('   STATUS PENGIRIMAN NOTIFIKASI');
      console.log('═══════════════════════════════════════════════════');
      
      if (cfg.email?.enabled && cfg.email?.adminEmail) {
        console.log('✅ Email akan dikirim ke:', cfg.email.adminEmail);
        console.log('   Subject: 🎉 Booking Baru:', orderNumber);
      } else {
        console.log('❌ Email tidak akan dikirim (nonaktif/tidak dikonfigurasi)');
      }
      
      if (cfg.whatsapp?.enabled && cfg.whatsapp?.number) {
        console.log('✅ WhatsApp akan dikirim ke:', cfg.whatsapp.number);
      } else {
        console.log('❌ WhatsApp tidak akan dikirim (nonaktif/tidak dikonfigurasi)');
      }
      
    } else {
      console.log('❌ Tidak ada notification settings di database');
    }

    // 5. Final Summary
    console.log('\n═══════════════════════════════════════════════════');
    console.log('   ✅ TEST SELESAI');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n📌 SILAKAN CEK:');
    console.log('   1. Gmail kurcool3@gmail.com (jika email aktif)');
    console.log('   2. WhatsApp 085718779500 (jika WhatsApp aktif)');
    console.log('   3. Admin Panel: http://localhost:3000/admin/bookings');
    console.log('\n📊 DATA TEST:');
    console.log('   Order:', orderNumber);
    console.log('   Nama:', booking.guestName);
    console.log('   Total: Rp', booking.totalAmount?.toLocaleString('id-ID'));
    console.log('   Notes:', booking.notes);

    // 6. Count total bookings
    const total = await prisma.booking.count();
    console.log('\n📊 Total Booking di Database:', total);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestBooking();
