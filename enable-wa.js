const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function enableWhatsApp() {
  try {
    const result = await p.notificationSettings.update({
      where: { id: 'a75a4fae-1561-4cf6-b76a-709a1ef20b99' },
      data: { whatsappEnabled: true }
    });
    console.log('WhatsApp enabled successfully!');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await p.$disconnect();
  }
}

enableWhatsApp();