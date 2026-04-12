const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
  try {
    // Convert data lama ke format JSONB baru
    const newConfig = {
      whatsapp: {
        enabled: false,
        number: '6281234567890',
        template: `🎉 *Booking Baru!*

📋 *Order:* {orderNumber}
👤 *Nama:* {customerName}
📞 *Telepon:* {customerPhone}
📅 *Tanggal:* {serviceDate}
⏰ *Jam:* {serviceTime}
🏠 *Alamat:* {address}
🧹 *Layanan:* {serviceName}
💰 *Total:* {totalAmount}

---
Dikirim otomatis dari NingClean`,
      },
      email: {
        enabled: false,
        smtp: { host: 'smtp.gmail.com', port: 587, user: '', secure: false },
        from: { name: 'NingClean', address: 'hello@ningclean.id' },
        adminRecipients: ['admin@ningclean.id'],
      },
      twilio: {
        enabled: false,
        accountSid: '',
        fromNumber: '',
      },
    };

    const secrets = {
      emailPassword: '',
      twilioAuthToken: '',
    };

    // Update atau create row
    const result = await prisma.notificationSettings.upsert({
      where: { name: 'default' },
      update: {
        config: newConfig,
        secrets: secrets,
      },
      create: {
        name: 'default',
        config: newConfig,
        secrets: secrets,
      },
    });

    console.log('✅ Migration successful!');
    console.log('New JSONB config:', JSON.stringify(result.config, null, 2));
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
