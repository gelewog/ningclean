// Vercel Serverless Entry Point
// Standalone file - tidak depend ke source TypeScript

const path = require('path');

// Load built modules dari dist
const mainModule = require(path.join(__dirname, '../dist/main.js'));

module.exports = async function handler(req, res) {
  try {
    // Get the bootstrap function and handler from built module
    const { bootstrap, handler: mainHandler } = mainModule;
    
    if (mainHandler) {
      return mainHandler(req, res);
    }
    
    // Fallback: call bootstrap and get server instance
    if (bootstrap) {
      const app = await bootstrap();
      const server = app.getHttpAdapter().getInstance();
      return server(req, res);
    }
    
    throw new Error('No handler or bootstrap found in main.js');
  } catch (error) {
    console.error('[API] Handler error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: error.message,
    });
  }
};
