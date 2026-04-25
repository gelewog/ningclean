// Vercel Serverless Handler for NestJS
// Loads the compiled NestJS bundle

const fs = require('fs');
const path = require('path');

// Try to find and load main.js
function findMainJs() {
  // Check multiple possible locations
  const possiblePaths = [
    path.join(__dirname, 'main.js'),           // Same directory
    path.join(__dirname, '..', 'main.js'),   // Parent directory
    path.join(__dirname, 'dist', 'main.js'), // dist subdirectory
    path.join(__dirname, '..', 'dist', 'main.js'), // Parent/dist
  ];
  
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      console.log('[Vercel] Found main.js at:', p);
      return require(p);
    }
  }
  
  throw new Error('main.js not found in any of: ' + possiblePaths.join(', '));
}

let mainModule;
try {
  mainModule = findMainJs();
  console.log('[Vercel] Module exports:', Object.keys(mainModule));
} catch (e) {
  console.error('[Vercel] Error loading main.js:', e.message);
  // Fallback to debug handler
  module.exports = async (req, res) => {
    return res.status(500).json({
      error: 'Failed to load main.js',
      message: e.message,
      cwd: process.cwd(),
      __dirname,
      contents: fs.readdirSync(__dirname).filter(f => !f.startsWith('.')),
    });
  };
  module.exports.default = module.exports;
  module.exports.handler = module.exports;
  return;
}

// Export the handler - support both default export and named export
const handler = mainModule.default || mainModule.handler || mainModule;

module.exports = handler;
module.exports.default = handler;
module.exports.handler = handler;
module.exports.bootstrap = mainModule.bootstrap;

console.log('[Vercel] Handler type:', typeof handler);
