const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Checking notification_settings columns...\n');
  
  try {
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'notification_settings'
      ORDER BY ordinal_position
    `;
    
    console.log('Columns in notification_settings:');
    result.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });
    
    console.log('\nChecking Twilio fields specifically:');
    const twilioCheck = await prisma.$queryRaw`
      SELECT 
        "twilioAccountSid",
        "twilioAuthToken", 
        "twilioFromNumber",
        twilioaccountsid,
        twilioauthtoken,
        twiliofromnumber
      FROM "notification_settings" 
      LIMIT 1
    `;
    console.log('Twilio raw query result:', JSON.stringify(twilioCheck, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
