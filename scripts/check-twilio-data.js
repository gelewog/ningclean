const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Checking Twilio data in notification_settings...\n');
  
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        "twilioaccountsid",
        "twilioauthtoken",
        "twiliofromnumber"
      FROM "notification_settings" 
      LIMIT 1
    `;
    
    if (result && result.length > 0) {
      console.log('Twilio settings found:');
      console.log('  twilioaccountsid:', result[0].twilioaccountsid || '(empty)');
      console.log('  twilioauthtoken:', result[0].twilioauthtoken ? '(has value)' : '(empty)');
      console.log('  twiliofromnumber:', result[0].twiliofromnumber || '(empty)');
    } else {
      console.log('No notification_settings row found!');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
