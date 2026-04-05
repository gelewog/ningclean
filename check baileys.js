const baileys = require('baileys');
console.log('Available exports:', Object.keys(baileys).slice(0, 30));
// Check for event types
if (baileys.EventEmitter) {
  console.log('Has EventEmitter');
}