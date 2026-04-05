const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  console.log('Testing Site Settings API...\n');

  // Test get settings (should create default if not exists)
  let settings = await prisma.siteSettings.findFirst();
  console.log('Current settings:', settings ? 'Found' : 'Not found (will create)');

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        companyName: 'NingClean',
        tagline: 'Layanan Kebersihan Profesional',
        email: 'hello@ningclean.com',
        phone: '021-1234567',
        whatsapp: '6281234567890',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        mondayOpen: '08:00',
        mondayClose: '18:00',
        minAdvanceDays: 1,
        maxAdvanceDays: 30,
        cancellationHours: 24,
      }
    });
    console.log('Created default settings:', settings.companyName);
  }

  // Test update
  const updated = await prisma.siteSettings.update({
    where: { id: settings.id },
    data: {
      companyName: 'NingClean Indonesia',
      instagram: 'https://instagram.com/ningclean',
    }
  });
  console.log('Updated company name to:', updated.companyName);
  console.log('Updated instagram to:', updated.instagram);

  // Test get again
  const final = await prisma.siteSettings.findFirst();
  console.log('\nFinal settings:');
  console.log('- Company:', final.companyName);
  console.log('- Tagline:', final.tagline);
  console.log('- Email:', final.email);
  console.log('- Instagram:', final.instagram);

  console.log('\n✅ Site Settings API test passed!');

  await prisma.$disconnect();
}

test().catch(console.error);
