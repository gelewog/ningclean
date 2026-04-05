const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function checkSettings() {
  try {
    const settings = await p.notificationSettings.findFirst();
    console.log('Current Notification Settings:');
    console.log(JSON.stringify(settings, null, 2));
    
    // Check if WhatsApp is enabled
    if (settings) {
      console.log('\n--- WhatsApp Status ---');
      console.log('whatsappEnabled:', settings.whatsappEnabled);
      console.log('whatsappNumber:', settings.whatsappNumber);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await p.$disconnect();
  }
}

checkSettings();