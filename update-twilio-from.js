const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

p.$executeRaw`UPDATE notification_settings SET twiliofromnumber = '+14155238886' WHERE id = 'a75a4fae-1561-4cf6-b76a-709a1ef20b99'`
  .then(() => { 
    console.log('Updated to Twilio sandbox number'); 
    p.$disconnect(); 
  })
  .catch(e => { 
    console.error(e); 
    p.$disconnect(); 
  });