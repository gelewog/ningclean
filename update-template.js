const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateTemplate() {
  const notif = await prisma.notificationSettings.findFirst();
  if (notif) {
    const config = notif.config || {};
    const whatsapp = config.whatsapp || {};
    
    // Update template dengan field notes
    whatsapp.defaultMessage = `🎉 *Booking Baru!*

📋 *Order:* {orderNumber}
👤 *Nama:* {customerName}
📞 *Telepon:* {customerPhone}
📅 *Tanggal:* {serviceDate}
⏰ *Jam:* {serviceTime}
🏠 *Alamat:* {address}
🧹 *Layanan:* {serviceName}
💰 *Total:* {totalAmount}
📝 *Catatan:* {notes}

---
Dikirim otomatis dari NingClean`;
    
    config.whatsapp = whatsapp;
    
    await prisma.notificationSettings.update({
      where: { id: notif.id },
      data: { config }
    });
    
    console.log('✅ Template WhatsApp diupdate dengan field notes');
    console.log('Template sekarang:');
    console.log(whatsapp.defaultMessage);
  }
  await prisma.$disconnect();
}

updateTemplate().catch(console.error);
