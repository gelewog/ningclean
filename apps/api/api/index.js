// Vercel Serverless Handler for NestJS - with detailed error logging
const fs = require('fs');
const path = require('path');

// Helper to safely log
function safeLog(...args) {
  try {
    console.log(...args);
  } catch (e) {}
}

// Try to find and load main.js
function findAndLoadMain() {
  const possiblePaths = [
    path.join(__dirname, 'main.js'),
    path.join(__dirname, '..', 'main.js'),
    path.join(__dirname, 'dist', 'main.js'),
    path.join(__dirname, '..', 'dist', 'main.js'),
  ];
  
  safeLog('[Vercel] Searching for main.js...');
  safeLog('[Vercel] __dirname:', __dirname);
  safeLog('[Vercel] cwd:', process.cwd());
  
  // List current directory contents
  try {
    safeLog('[Vercel] Current dir contents:', fs.readdirSync(__dirname));
  } catch (e) {
    safeLog('[Vercel] Error reading dir:', e.message);
  }
  
  for (const p of possiblePaths) {
    safeLog('[Vercel] Checking:', p, 'exists:', fs.existsSync(p));
    if (fs.existsSync(p)) {
      safeLog('[Vercel] Found main.js at:', p);
      try {
        const mod = require(p);
        safeLog('[Vercel] Module loaded, exports:', Object.keys(mod));
        return mod;
      } catch (e) {
        safeLog('[Vercel] Error loading module from', p, ':', e.message);
        throw e;
      }
    }
  }
  
  throw new Error('main.js not found in any location');
}

// Create handler
let handler;
let errorInfo = null;

try {
  const mainModule = findAndLoadMain();
  handler = mainModule.default || mainModule.handler || mainModule;
  safeLog('[Vercel] Handler type:', typeof handler);
  
  if (typeof handler !== 'function') {
    throw new Error('Handler is not a function. Got: ' + typeof handler);
  }
} catch (e) {
  safeLog('[Vercel] Fatal error:', e.message);
  errorInfo = {
    message: e.message,
    stack: e.stack,
    cwd: process.cwd(),
    __dirname: __dirname,
  };
  
  // Create fallback error handler
  handler = async (req, res) => {
    return res.status(500).json({
      error: 'Failed to initialize NestJS',
      details: errorInfo,
      hint: 'Check Vercel logs for more details',
    });
  };
}

module.exports = handler;
module.exports.default = handler;
module.exports.handler = handler;
