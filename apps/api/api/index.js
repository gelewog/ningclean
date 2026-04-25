// Minimal test handler for Vercel
module.exports = (req, res) => {
  res.status(200).json({ 
    message: 'Hello from Vercel!',
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
};
module.exports.default = module.exports;
module.exports.handler = module.exports;
