const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== DEBUG: Checking what getSettings() would return ===\n');

  try {
    // Simulate what loadSettings() does
    const result = await prisma.$queryRawUnsafe(`
      SELECT 
        "id",
        "whatsappNumber",
        "whatsappMessage",
        "whatsappEnabled",
        "emailEnabled",
        "emailHost",
        "emailPort",
        "emailUser",
        "emailPassword",
        "emailFrom",
        "adminEmail",
        "twilioaccountsid",
        "twilioauthtoken",
        "twiliofromnumber"
      FROM "notification_settings" 
      LIMIT 1
    `);

    console.log('Raw query result type:', typeof result);
    console.log('Raw query result:', JSON.stringify(result, null, 2));
    
    if (result && result.length > 0) {
      const settings = result[0];
      console.log('\n--- Settings object values ---');
      console.log('id:', settings.id);
      console.log('whatsappNumber:', settings.whatsappNumber);
      console.log('twilioaccountsid:', settings.twilioaccountsid);
      console.log('twilioauthtoken:', settings.twilioauthtoken ? '(has value)' : '(empty)');
      console.log('twiliofromnumber:', settings.twiliofromnumber);
      
      console.log('\n--- Simulated getSettings() response ---');
      console.log({
        whatsappNumber: settings.whatsappNumber,
        twilioAccountSid: settings.twilioaccountsid || '',
        twilioAuthToken: '', // never exposed
        twilioFromNumber: settings.twiliofromnumber || '',
        hasTwilio: !!settings.twilioauthtoken,
        hasPassword: !!settings.emailPassword,
      });
    } else {
      console.log('No settings found!');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
