const { makeWASocket, useMultiFileAuthState } = require('baileys');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const authDir = path.join(__dirname, 'test-wa-auth');

async function testBaileys() {
  console.log('Starting Baileys test...');
  
  // Clean up old auth
  if (fs.existsSync(authDir)) {
    fs.rmSync(authDir, { recursive: true, force: true });
  }
  fs.mkdirSync(authDir, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false, // We'll handle it ourselves
  });

  console.log('Socket created, waiting for events...');

  // Listen to all possible events
  const events = ['qr', 'connection.update', 'creds.update', 'messages.upsert', 'chat.update', 'contact.update'];
  
  for (const event of events) {
    sock.ev.on(event, (...args) => {
      console.log(`Event: ${event}`, args.length > 0 ? JSON.stringify(args[0]).substring(0, 200) : '');
    });
  }

  // Also log all connection updates
  sock.ev.on('connection.update', (update) => {
    console.log('=== CONNECTION UPDATE ===');
    console.log('connection:', update.connection);
    console.log('qr:', update.qr ? 'present' : 'not present');
    console.log('lastDisconnect:', update.lastDisconnect?.error);
    
    if (update.qr) {
      console.log('QR FOUND IN CONNECTION UPDATE!');
      QRCode.toDataURL(update.qr).then(img => {
        fs.writeFileSync(path.join(__dirname, 'test-qr.txt'), img);
        console.log('QR saved to test-qr.txt');
      }).catch(e => console.error('Failed to generate QR:', e));
    }
  });

  // Wait 60 seconds for QR
  console.log('Waiting 60 seconds for QR...');
  await new Promise(resolve => setTimeout(resolve, 60000));
  
  console.log('Test complete');
  process.exit(0);
}

testBaileys().catch(e => {
  console.error('Test error:', e);
  process.exit(1);
});