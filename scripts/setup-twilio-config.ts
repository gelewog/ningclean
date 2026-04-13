import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupTwilioConfig() {
  console.log('Setting up Twilio/WhatsApp configuration...');

  // Read from environment variables
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || '';
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || '';
  const whatsappNumber = process.env.WHATSAPP_NUMBER || '62xxxxxxxxxxx';
  
  if (!twilioAccountSid || !twilioAuthToken) {
    console.error('❌ ERROR: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables are required');
    console.log('   Usage: TWILIO_ACCOUNT_SID=xxx TWILIO_AUTH_TOKEN=xxx WHATSAPP_NUMBER=62xxx npx ts-node scripts/setup-twilio-config.ts');
    process.exit(1);
  }

  // Twilio configuration
  const config = {
    whatsapp: {
      enabled: true,
      number: whatsappNumber,
      defaultMessage: `🎉 *Booking Baru!*

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
Dikirim otomatis dari NingClean`,
    },
    twilio: {
      accountSid: twilioAccountSid,
      fromNumber: '',
    },
  };

  const secrets = {
    twilioAuthToken: twilioAuthToken,
  };

  try {
    const existing = await prisma.$queryRawUnsafe(`
      SELECT id FROM "notification_settings" LIMIT 1
    `) as { id: string }[];

    if (existing.length > 0) {
      await prisma.$executeRawUnsafe(`
        UPDATE "notification_settings" 
        SET 
          "config" = "config" || $1::jsonb,
          "secrets" = COALESCE("secrets", '{}'::jsonb) || $2::jsonb,
          "updatedAt" = NOW()
        WHERE id = $3
      `, JSON.stringify(config), JSON.stringify(secrets), existing[0].id);
      console.log('✅ Twilio settings updated successfully!');
    } else {
      await prisma.$executeRawUnsafe(`
        INSERT INTO "notification_settings" (id, name, config, secrets, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), 'default', $1::jsonb, $2::jsonb, NOW(), NOW())
      `, JSON.stringify({ ...config, email: {} }), JSON.stringify(secrets));
      console.log('✅ Twilio settings created successfully!');
    }

    console.log('\n📱 Twilio/WhatsApp Configuration:');
    console.log(`   WhatsApp Number: ${whatsappNumber}`);
    console.log(`   Account SID: ${twilioAccountSid.substring(0, 12)}...`);
    console.log(`   Status: Enabled`);

  } catch (error) {
    console.error('❌ Failed to setup Twilio configuration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupTwilioConfig();
