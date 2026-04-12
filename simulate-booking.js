const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function simulateBooking() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   SIMULASI BOOKING LENGKAP');
  console.log('═══════════════════════════════════════════════════\n');

  try {
    // 1. Ambil service
    const service = await prisma.service.findFirst();
    if (!service) {
      console.log('❌ Tidak ada service di database');
      await prisma.$disconnect();
      return;
    }
    console.log('✅ Service:', service.name);

    // 2. Buat customer
    const customer = await prisma.customer.create({
      data: {
        name: 'Budi Santoso',
        email: 'budi' + Date.now() + '@test.com',
        phone: '081234567890',
        address: 'Jl. Mawar No. 45, Jakarta Selatan'
      }
    });
    console.log('✅ Customer dibuat:', customer.name);

    // 3. Buat booking dengan SEMUA field
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
    
    const bookingData = {
      orderNumber,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      address: customer.address,
      serviceArea: 'Jakarta',
      serviceDate: new Date('2026-04-15'),
      serviceTime: '09:00',
      totalPrice: 350000,
      notes: 'Tolong bawa peralatan lengkap dan masker',
      status: 'PENDING',
      source: 'WEBSITE',
      bookingItems: {
        create: [{
          serviceId: service.id,
          serviceName: service.name,
          quantity: 1,
          price: service.price,
          total: service.price
        }]
      }
    };

    const booking = await prisma.booking.create({
      data: bookingData,
      include: {
        bookingItems: true,
        customer: true
      }
    });

    console.log('\n✅ Booking berhasil dibuat!');
    console.log('   Order Number:', booking.orderNumber);
    console.log('   ID:', booking.id);

    // 4. VERIFIKASI SEMUA FIELD
    console.log('\n═══════════════════════════════════════════════════');
    console.log('   VERIFIKASI FIELD BOOKING');
    console.log('═══════════════════════════════════════════════════');
    
    const checks = [
      ['ID', booking.id],
      ['Order Number', booking.orderNumber],
      ['Customer ID', booking.customerId],
      ['Customer Name', booking.customerName],
      ['Customer Email', booking.customerEmail],
      ['Customer Phone', booking.customerPhone],
      ['Address', booking.address],
      ['Service Area', booking.serviceArea],
      ['Service Date', booking.serviceDate?.toISOString()],
      ['Service Time', booking.serviceTime],
      ['Notes', booking.notes],
      ['Total Price', booking.totalPrice],
      ['Status', booking.status],
      ['Source', booking.source],
      ['Booking Items', booking.bookingItems?.length > 0 ? `${booking.bookingItems.length} items` : null],
      ['Created At', booking.createdAt?.toISOString()]
    ];

    checks.forEach(([label, value]) => {
      const status = value ? '✅' : '❌';
      const displayValue = value || '(kosong)';
      console.log(`   ${label.padEnd(20)} ${status} ${displayValue}`);
    });

    // 5. Check notification settings
    console.log('\n═══════════════════════════════════════════════════');
    console.log('   NOTIFICATION SETTINGS');
    console.log('═══════════════════════════════════════════════════');
    
    const notifSettings = await prisma.notificationSettings.findFirst();
    if (notifSettings) {
      const emailConfig = notifSettings.config?.email;
      const waConfig = notifSettings.config?.whatsapp;
      
      console.log('   Email Enabled    :', emailConfig?.enabled ? '✅ YES' : '❌ NO');
      console.log('   Email Host       :', emailConfig?.host || '❌');
      console.log('   Email User       :', emailConfig?.user || '❌');
      console.log('   Admin Email      :', emailConfig?.adminEmail || '❌');
      console.log('   WhatsApp Enabled :', waConfig?.enabled ? '✅ YES' : '❌ NO');
      console.log('   WhatsApp Number  :', waConfig?.number || '❌');
      console.log('   Has Email Pass   :', notifSettings.secrets?.emailPassword ? '✅ YES' : '❌ NO');
      console.log('   Has Twilio Token :', notifSettings.secrets?.twilioAuthToken ? '✅ YES' : '❌ NO');
    } else {
      console.log('   ❌ No notification settings found');
    }

    // 6. Summary
    console.log('\n═══════════════════════════════════════════════════');
    console.log('   ✅ SIMULASI BOOKING BERHASIL');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n📌 CEK:');
    console.log('   • Email → kurcool3@gmail.com (jika email enabled)');
    console.log('   • WhatsApp → 085718779500 (jika WhatsApp enabled)');
    console.log('   • Admin Panel → http://localhost:3000/admin/bookings');
    console.log('\n📊 Data Booking:');
    console.log('   Order:', orderNumber);
    console.log('   Nama:', customer.name);
    console.log('   Total: Rp', booking.totalPrice.toLocaleString('id-ID'));
    console.log('   Catatan:', booking.notes);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

simulateBooking();
