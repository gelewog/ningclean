/**
 * Script untuk melihat NotificationSettings di database
 * Run: node scripts-cek-db/view-notification-settings.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function viewSettings() {
  try {
    console.log('📋 NotificationSettings dari Database:\n');

    const settings = await prisma.notificationSettings.findUnique({
      where: { name: 'default' }
    });

    if (!settings) {
      console.log('❌ Tidak ada settings dengan name="default"');
      return;
    }

    console.log('ID:', settings.id);
    console.log('Name:', settings.name);
    console.log('Created At:', settings.createdAt);
    console.log('Updated At:', settings.updatedAt);
    
    console.log('\n📦 CONFIG (JSONB):');
    console.log(JSON.stringify(settings.config, null, 2));
    
    console.log('\n🔒 SECRETS (JSONB):');
    // Tampilkan secrets tanpa menampilkan value lengkap untuk keamanan
    const secrets = settings.secrets || {};
    const maskedSecrets = {};
    for (const [key, value] of Object.entries(secrets)) {
      if (value && typeof value === 'string' && value.length > 8) {
        maskedSecrets[key] = value.substring(0, 4) + '****' + value.substring(value.length - 4);
      } else {
        maskedSecrets[key] = value || '(kosong)';
      }
    }
    console.log(JSON.stringify(maskedSecrets, null, 2));
    
    console.log('\n✅ Settings loaded successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

viewSettings();
