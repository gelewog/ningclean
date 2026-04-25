const { bootstrap } = require('../dist/main.js');

module.exports = async function handler(req, res) {
  try {
    const app = await bootstrap();
    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
  } catch (error) {
    console.error('[API] Handler error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: error.message,
    });
  }
};
