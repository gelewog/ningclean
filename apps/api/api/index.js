// Debug wrapper untuk check Vercel environment
const fs = require('fs');
const path = require('path');

// Check directory structure
function listDir(dir, depth = 0) {
  if (depth > 3) return '[max depth]';
  try {
    const items = fs.readdirSync(dir);
    return items.map(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        return { [item]: listDir(fullPath, depth + 1) };
      }
      return item;
    });
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

module.exports = async function handler(req, res) {
  const info = {
    message: 'Debug handler',
    url: req.url,
    method: req.method,
    __dirname,
    cwd: process.cwd(),
    env: {
      VERCEL: process.env.VERCEL,
      NODE_ENV: process.env.NODE_ENV,
    }
  };
  
  // Check if dist/main.js exists
  const mainPath = path.join(__dirname, '..', 'dist', 'main.js');
  info.mainPath = mainPath;
  info.mainExists = fs.existsSync(mainPath);
  
  // Check directory structure
  info.rootContents = listDir(__dirname, 0);
  info.parentContents = listDir(path.join(__dirname, '..'), 0);
  
  // Try to load and log module exports
  if (info.mainExists) {
    try {
      const m = require(mainPath);
      info.moduleKeys = Object.keys(m);
      info.hasDefault = !!m.default;
      info.hasHandler = !!m.handler;
      info.hasBootstrap = !!m.bootstrap;
    } catch (e) {
      info.moduleError = e.message;
    }
  }
  
  return res.status(200).json(info);
};

module.exports.default = module.exports;
module.exports.handler = module.exports;
