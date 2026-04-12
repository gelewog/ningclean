/**
 * Test untuk memeriksa apakah placeholder "••••••••" muncul
 * ketika password sudah tersimpan di database
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPlaceholder() {
  console.log('========================================');
  console.log('TEST PLACEHOLDER DISPLAY');
  console.log('========================================\n');

  try {
    // Get notification settings
    const settings = await prisma.notificationSettings.findUnique({
      where: { name: 'default' }
    });

    if (!settings) {
      console.log('❌ No settings found');
      return;
    }

    const config = typeof settings.config === 'string' 
      ? JSON.parse(settings.config) 
      : settings.config;
    
    const secrets = settings.secrets 
      ? (typeof settings.secrets === 'string' ? JSON.parse(settings.secrets) : settings.secrets)
      : {};

    console.log('--- Data dari Database ---');
    console.log('Email Enabled:', config.email.enabled);
    console.log('SMTP User:', config.email.smtp.user);
    console.log('Has Email Password (dari secrets):', !!secrets.emailPassword);
    console.log('Email Password Length:', secrets.emailPassword ? secrets.emailPassword.length : 0);

    console.log('\n--- Simulasi API Response (FLAT) ---');
    // Simulasi seperti di API getSettingsFlat()
    const apiResponse = {
      emailEnabled: config.email.enabled,
      emailHost: config.email.smtp.host,
      emailPort: config.email.smtp.port,
      emailUser: config.email.smtp.user,
      emailFrom: `${config.email.from.name} <${config.email.from.address}>`,
      adminEmail: config.email.adminRecipients[0] || '',
      hasPassword: !!secrets.emailPassword,  // API return hasPassword
      hasTwilio: !!secrets.twilioAuthToken,
    };
    console.log('API Response:', JSON.stringify(apiResponse, null, 2));

    console.log('\n--- Simulasi Frontend State ---');
    // Simulasi mapping di frontend
    const frontendState = {
      config: {
        email: {
          enabled: apiResponse.emailEnabled,
          smtp: {
            host: apiResponse.emailHost,
            port: apiResponse.emailPort,
            user: apiResponse.emailUser,
          },
          from: {
            name: config.email.from.name,
            address: config.email.from.address,
          },
          adminRecipients: [apiResponse.adminEmail],
        }
      },
      secrets: {
        emailPassword: '',
        twilioAuthToken: '',
      },
      hasEmailPassword: apiResponse.hasPassword,  // Mapping hasPassword -> hasEmailPassword
      hasTwilioAuthToken: apiResponse.hasTwilio,
    };
    console.log('Frontend State:', JSON.stringify(frontendState, null, 2));

    console.log('\n--- Placeholder Logic ---');
    // Simulasi logic di NotificationSettingsPanel
    const hasEmailPassword = frontendState.hasEmailPassword;
    
    console.log('hasEmailPassword:', hasEmailPassword);
    
    if (hasEmailPassword) {
      console.log('✅ Placeholder yang ditampilkan: "••••••••"');
      console.log('✅ Description: "Isi untuk mengubah"');
    } else {
      console.log('❌ Placeholder yang ditampilkan: "App password"');
      console.log('❌ Description: (kosong)');
    }

    console.log('\n========================================');
    console.log('TEST COMPLETE');
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testPlaceholder();