// Vercel Serverless Handler for NestJS
const fs = require('fs');
const path = require('path');

function safeLog(...args) {
  try { console.log(...args); } catch (e) {}
}

function findAndLoadMain() {
  const possiblePaths = [
    path.join(__dirname, 'main.js'),
    path.join(__dirname, '..', 'main.js'),
    path.join(__dirname, 'dist', 'main.js'),
    path.join(__dirname, '..', 'dist', 'main.js'),
  ];
  
  safeLog('[Vercel] Searching for main.js...');
  safeLog('[Vercel] __dirname:', __dirname);
  
  for (const p of possiblePaths) {
    safeLog('[Vercel] Checking:', p, 'exists:', fs.existsSync(p));
    if (fs.existsSync(p)) {
      safeLog('[Vercel] Found main.js at:', p);
      try {
        const mod = require(p);
        safeLog('[Vercel] Module loaded, exports:', Object.keys(mod));
        return mod;
      } catch (e) {
        safeLog('[Vercel] Error loading module:', e.message);
        throw e;
      }
    }
  }
  
  throw new Error('main.js not found');
}

let handler;

try {
  const mainModule = findAndLoadMain();
  handler = mainModule.default || mainModule.handler || mainModule;
  safeLog('[Vercel] Handler type:', typeof handler);
  
  if (typeof handler !== 'function') {
    throw new Error('Handler is not a function');
  }
} catch (e) {
  safeLog('[Vercel] Fatal error:', e.message);
  handler = async (req, res) => {
    return res.status(500).json({
      error: 'Failed to initialize',
      message: e.message,
    });
  };
}

module.exports = handler;
module.exports.default = handler;
module.exports.handler = handler;
