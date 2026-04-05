const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function resetWhatsApp() {
  try {
    // First, get current settings
    const settings = await p.notificationSettings.findFirst();
    console.log('Current settings:', JSON.stringify(settings, null, 2));

    // Disable WhatsApp
    if (settings?.whatsappEnabled) {
      await p.notificationSettings.update({
        where: { id: settings.id },
        data: { whatsappEnabled: false }
      });
      console.log('WhatsApp disabled');
    }

    console.log('Done!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await p.$disconnect();
  }
}

resetWhatsApp();