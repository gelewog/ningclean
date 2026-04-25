// Vercel Serverless Entry Point
// Loads the compiled NestJS app and exports handler

const path = require('path');

// Load main.js dari dist
const main = require('./main.js');

// Export handler untuk Vercel
module.exports = main.default || main.handler || main;
module.exports.default = main.default || main.handler || main;
module.exports.handler = main.default || main.handler || main;
