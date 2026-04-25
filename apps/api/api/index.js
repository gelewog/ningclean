// Vercel Serverless Wrapper for NestJS
// This file wraps the webpack bundle and exports the handler properly

const path = require('path');

// Load the compiled NestJS app from webpack bundle
const mainModule = require(path.join(__dirname, '..', 'dist', 'main.js'));

// Export the handler for Vercel serverless
module.exports = mainModule.default || mainModule.handler || mainModule;
module.exports.default = mainModule.default || mainModule.handler || mainModule;
module.exports.handler = mainModule.default || mainModule.handler || mainModule;
module.exports.bootstrap = mainModule.bootstrap;
