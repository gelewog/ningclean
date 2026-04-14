const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   VERIFIKASI BOOKING TERBARU');
  console.log('═══════════════════════════════════════════════════\n');

  // Check latest booking
  const booking = await prisma.booking.findFirst({
    orderBy: { createdAt: 'desc' },
    include: { customer: true, items: { include: { service: true } } }
  });

  if (!booking) {
    console.log('❌ Tidak ada booking di database');
    return;
  }

  console.log('📋 BOOKING DATA:');
  console.log('   Order Number :', booking.orderNumber);
  console.log('   Status       :', booking.status);
  console.log('   Created At   :', booking.createdAt);
  console.log('   Service Date :', booking.serviceDate);
  console.log('   Service Time :', booking.serviceTime);
  console.log('   Total Price  : Rp', booking.totalPrice?.toLocaleString('id-ID'));
  console.log('   Notes        :', booking.notes || '(tidak ada)');
  console.log('   Source       :', booking.source);
  
  console.log('\n👤 CUSTOMER:');
  console.log('   Name         :', booking.customer?.name);
  console.log('   Email        :', booking.customer?.email);
  console.log('   Phone        :', booking.customer?.phone);
  console.log('   Address      :', booking.customer?.address);
  
  console.log('\n🛒 ITEMS:', booking.items?.length || 0);
  booking.items?.forEach((item, i) => {
    console.log(`   ${i+1}. ${item.serviceName} x${item.quantity} = Rp ${item.total?.toLocaleString('id-ID')}`);
  });

  // Check notifications
  console.log('\n═══════════════════════════════════════════════════');
  console.log('   NOTIFICATION STATUS');
  console.log('═══════════════════════════════════════════════════');
  
  const notif = await prisma.notification.findFirst({
    orderBy: { createdAt: 'desc' }
  });
  
  if (notif) {
    console.log('   ✅ Notifikasi ditemukan!');
    console.log('   Title   :', notif.title);
    console.log('   Message :', notif.message?.substring(0, 100) + '...');
    console.log('   Is Read :', notif.isRead);
    console.log('   Type    :', notif.type);
    console.log('   Created :', notif.createdAt);
  } else {
    console.log('   ❌ Tidak ada notifikasi');
  }

  // Check notification settings
  const settings = await prisma.$queryRawUnsafe(`
    SELECT config, secrets FROM notification_settings LIMIT 1
  `).catch(() => []);
  
  if (settings.length > 0) {
    const config = settings[0].config || {};
    const secrets = settings[0].secrets || {};
    
    console.log('\n⚙️  NOTIFICATION SETTINGS:');
    console.log('   Email Enabled    :', config.email?.enabled ? '✅' : '❌');
    console.log('   WhatsApp Enabled :', config.whatsapp?.enabled ? '✅' : '❌');
    console.log('   Admin Email      :', config.email?.adminEmail || '❌');
    console.log('   WhatsApp Number  :', config.whatsapp?.number || '❌');
    console.log('   Has Email Pass   :', secrets.emailPassword ? '✅' : '❌');
    console.log('   Has Twilio Token :', secrets.twilioAuthToken ? '✅' : '❌');
  }

  console.log('\n══════════════════════════════════════════════════');
  console.log('   ✅ BOOKING MASUK DATABASE');
  console.log('═══════════════════════════════════════════════════');
}

check().finally(() => prisma.$disconnect());
