import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupEmailConfig() {
  console.log('Setting up email configuration...');

  // Read from environment variables
  const emailUser = process.env.EMAIL_USER || 'your-email@gmail.com';
  const emailPassword = process.env.EMAIL_PASSWORD || '';
  
  if (!emailPassword) {
    console.error('❌ ERROR: EMAIL_PASSWORD environment variable is required');
    console.log('   Usage: EMAIL_USER=user@gmail.com EMAIL_PASSWORD=apppass npx ts-node scripts/setup-email-config.ts');
    process.exit(1);
  }

  // Email configuration
  const config = {
    email: {
      enabled: true,
      host: 'smtp.gmail.com',
      port: 587,
      user: emailUser,
      from: `NingClean <${emailUser}>`,
      adminEmail: emailUser,
    },
  };

  const secrets = {
    emailPassword: emailPassword,
  };

  try {
    // Check if settings exist
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
      console.log('✅ Email settings updated successfully!');
    } else {
      await prisma.$executeRawUnsafe(`
        INSERT INTO "notification_settings" (id, name, config, secrets, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), 'default', $1::jsonb, $2::jsonb, NOW(), NOW())
      `, JSON.stringify({ ...config, whatsapp: {}, twilio: {} }), JSON.stringify(secrets));
      console.log('✅ Email settings created successfully!');
    }

    console.log('\n📧 Email Configuration:');
    console.log(`   Host: ${config.email.host}`);
    console.log(`   Port: ${config.email.port}`);
    console.log(`   User: ${config.email.user}`);
    console.log(`   Status: Enabled`);

  } catch (error) {
    console.error('❌ Failed to setup email configuration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupEmailConfig();
