/**
 * Script untuk update notification settings
 * Run: node scripts-cek-db/update-notification-settings.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateNotificationSettings() {
  try {
    console.log('========================================');
    console.log('UPDATE NOTIFICATION SETTINGS');
    console.log('========================================\n');

    // Data dari user
    const emailEnabled = true;
    const emailUser = 'kurcool3@gmail.com';
    const emailPassword = 'yihxpfpfwehvziqv'; // App password
    const emailHost = 'smtp.gmail.com';
    const emailPort = 587;
    const emailFromName = 'NingClean';
    const emailFromAddress = 'kurcool3@gmail.com';
    const adminRecipients = ['kurcool3@gmail.com'];

    // Cari existing settings
    let settings = await prisma.notificationSettings.findUnique({
      where: { name: 'default' }
    });

    if (!settings) {
      console.log('⚠️  Settings not found, creating new...\n');
      
      settings = await prisma.notificationSettings.create({
        data: {
          name: 'default',
          config: {
            whatsapp: {
              enabled: false,
              number: '',
              template: '🎉 *Booking Baru!*\n\n📋 *Order:* {orderNumber}\n👤 *Nama:* {customerName}\n📞 *Telepon:* {customerPhone}\n📅 *Tanggal:* {serviceDate}\n⏰ *Jam:* {serviceTime}\n🏠 *Alamat:* {address}\n🧹 *Layanan:* {serviceName}\n💰 *Total:* {totalAmount}\n\n---\nDikirim otomatis dari NingClean'
            },
            email: {
              enabled: emailEnabled,
              smtp: {
                host: emailHost,
                port: emailPort,
                user: emailUser,
                secure: false
              },
              from: {
                name: emailFromName,
                address: emailFromAddress
              },
              adminRecipients: adminRecipients
            },
            twilio: {
              enabled: false,
              accountSid: '',
              fromNumber: ''
            }
          },
          secrets: {
            emailPassword: emailPassword,
            twilioAuthToken: ''
          }
        }
      });
    } else {
      console.log('✅ Settings found, updating...\n');
      
      // Get current config
      const currentConfig = typeof settings.config === 'string' 
        ? JSON.parse(settings.config) 
        : settings.config;
      
      const currentSecrets = settings.secrets 
        ? (typeof settings.secrets === 'string' ? JSON.parse(settings.secrets) : settings.secrets)
        : {};

      // Update config
      const newConfig = {
        ...currentConfig,
        email: {
          enabled: emailEnabled,
          smtp: {
            host: emailHost,
            port: emailPort,
            user: emailUser,
            secure: false
          },
          from: {
            name: emailFromName,
            address: emailFromAddress
          },
          adminRecipients: adminRecipients
        }
      };

      // Update secrets
      const newSecrets = {
        ...currentSecrets,
        emailPassword: emailPassword
      };

      settings = await prisma.notificationSettings.update({
        where: { id: settings.id },
        data: {
          config: newConfig,
          secrets: newSecrets
        }
      });
    }

    console.log('✅ Settings updated successfully!\n');
    console.log('--- Updated Config ---');
    const config = typeof settings.config === 'string' ? JSON.parse(settings.config) : settings.config;
    console.log('Email Enabled:', config.email.enabled);
    console.log('SMTP Host:', config.email.smtp.host);
    console.log('SMTP Port:', config.email.smtp.port);
    console.log('SMTP User:', config.email.smtp.user);
    console.log('From Name:', config.email.from.name);
    console.log('From Address:', config.email.from.address);
    console.log('Admin Recipients:', config.email.adminRecipients);
    
    console.log('\n--- Secrets (masked) ---');
    const secrets = settings.secrets ? (typeof settings.secrets === 'string' ? JSON.parse(settings.secrets) : settings.secrets) : {};
    console.log('Has Email Password:', !!secrets.emailPassword);
    console.log('Email Password Length:', secrets.emailPassword ? secrets.emailPassword.length : 0);

    console.log('\n========================================');
    console.log('UPDATE COMPLETE');
    console.log('========================================\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

updateNotificationSettings();
