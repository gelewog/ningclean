// Minimal Vercel handler - works!
module.exports = (req, res) => {
  // Set CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  const url = req.url || '/';
  
  // Health check
  if (url === '/api/health' || url === '/api' || url === '/') {
    res.status(200).json({
      status: 'ok',
      message: 'Ningclean API (minimal)',
      timestamp: new Date().toISOString(),
      path: url,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
      }
    });
    return;
  }
  
  // Other endpoints - return 501 Not Implemented for now
  res.status(501).json({
    status: 'not_implemented',
    message: 'Full API coming soon',
    path: url,
    method: req.method,
  });
};
