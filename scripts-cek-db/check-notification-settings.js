/**
 * Script untuk memeriksa data notification_settings di database
 * Run: node scripts-cek-db/check-notification-settings.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkNotificationSettings() {
  try {
    console.log('========================================');
    console.log('CHECK NOTIFICATION SETTINGS IN DATABASE');
    console.log('========================================\n');

    // Check if table exists and has data
    const count = await prisma.notificationSettings.count();
    console.log('Total notification_settings records:', count);

    // Get all records
    const settings = await prisma.notificationSettings.findMany();
    
    if (settings.length === 0) {
      console.log('\n⚠️  No notification_settings found in database!');
      console.log('Creating default settings...\n');
      
      const defaultSettings = await prisma.notificationSettings.create({
        data: {
          name: 'default',
          config: {
            whatsapp: {
              enabled: false,
              number: '',
              template: '🎉 *Booking Baru!*\n\n📋 *Order:* {orderNumber}\n👤 *Nama:* {customerName}\n📞 *Telepon:* {customerPhone}\n📅 *Tanggal:* {serviceDate}\n⏰ *Jam:* {serviceTime}\n🏠 *Alamat:* {address}\n🧹 *Layanan:* {serviceName}\n💰 *Total:* {totalAmount}\n\n---\nDikirim otomatis dari NingClean'
            },
            email: {
              enabled: false,
              smtp: { host: 'smtp.gmail.com', port: 587, user: '', secure: false },
              from: { name: 'NingClean', address: '' },
              adminRecipients: []
            },
            twilio: {
              enabled: false,
              accountSid: '',
              fromNumber: ''
            }
          },
          secrets: {}
        }
      });
      
      console.log('✅ Default settings created:');
      console.log(JSON.stringify(defaultSettings, null, 2));
    } else {
      console.log('\n📊 Found', settings.length, 'record(s):\n');
      
      settings.forEach((record, index) => {
        console.log(`\n--- Record ${index + 1} ---`);
        console.log('ID:', record.id);
        console.log('Name:', record.name);
        console.log('Created At:', record.createdAt);
        console.log('Updated At:', record.updatedAt);
        
        console.log('\n--- CONFIG (JSONB) ---');
        if (record.config) {
          const config = typeof record.config === 'string' ? JSON.parse(record.config) : record.config;
          console.log('Config Type:', typeof config);
          console.log('Config Keys:', Object.keys(config));
          console.log('Config Content:');
          console.log(JSON.stringify(config, null, 2));
        } else {
          console.log('Config: NULL or EMPTY');
        }
        
        console.log('\n--- SECRETS (JSONB) ---');
        if (record.secrets) {
          const secrets = typeof record.secrets === 'string' ? JSON.parse(record.secrets) : record.secrets;
          console.log('Has Email Password:', !!secrets.emailPassword);
          console.log('Has Twilio Auth Token:', !!secrets.twilioAuthToken);
          console.log('Secrets Keys:', Object.keys(secrets));
        } else {
          console.log('Secrets: NULL or EMPTY');
        }
      });
    }

    console.log('\n========================================');
    console.log('CHECK COMPLETE');
    console.log('========================================\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

checkNotificationSettings();
