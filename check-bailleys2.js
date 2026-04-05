const baileys = require('baileys');
console.log('All keys:', Object.keys(baileys));
console.log('EventEmitter type:', typeof baileys.EventEmitter);
console.log('makeWASocket type:', typeof baileys.makeWASocket);

// Check for BaileysEventMap
if (baileys.BaileysEventMap) {
  console.log('BaileysEventMap:', Object.keys(baileys.BaileysEventMap));
}