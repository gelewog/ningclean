// Vercel Serverless Handler for NestJS
// This file loads the compiled main.js and exports the handler

const path = require('path');

// Load the compiled NestJS bundle
const mainModule = require(path.join(__dirname, 'main.js'));

// Export the handler - support both default export and named export
module.exports = mainModule.default || mainModule.handler || mainModule;

// Also export as default for compatibility
module.exports.default = mainModule.default || mainModule.handler || mainModule;

// Export handler explicitly
module.exports.handler = mainModule.default || mainModule.handler || mainModule;

// Debug: log what we found
console.log('[Vercel Handler] Loaded module exports:', Object.keys(mainModule));
console.log('[Vercel Handler] Using handler:', typeof (mainModule.default || mainModule.handler || mainModule));
