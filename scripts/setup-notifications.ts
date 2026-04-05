// Script to seed initial notification settings
// Run: npx tsx scripts/setup-notifications.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Setting up notification settings...');

  const existing = await prisma.notificationSettings.findFirst();
  
  if (existing) {
    console.log('Notification settings already exist, updating...');
    await prisma.notificationSettings.update({
      where: { id: existing.id },
      data: {
        whatsappNumber: '6285718779500', // Format: 628XXXXXXXXX (no +)
        whatsappMessage: `🎉 *Booking Baru!*

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
        emailEnabled: false,
        adminEmail: 'kurcool3@gmail.com',
        emailHost: 'smtp.gmail.com',
        emailPort: 587,
        emailUser: 'kurcool3@gmail.com',
        emailFrom: 'NingClean <kurcool3@gmail.com>',
      },
    });
    console.log('Notification settings updated!');
  } else {
    console.log('Creating notification settings...');
    await prisma.notificationSettings.create({
      data: {
        whatsappNumber: '6285718779500',
        whatsappMessage: `🎉 *Booking Baru!*

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
        emailEnabled: false,
        adminEmail: 'kurcool3@gmail.com',
        emailHost: 'smtp.gmail.com',
        emailPort: 587,
        emailUser: 'kurcool3@gmail.com',
        emailFrom: 'NingClean <kurcool3@gmail.com>',
      },
    });
    console.log('Notification settings created!');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
