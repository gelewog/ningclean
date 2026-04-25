// Debug handler untuk Vercel
const fs = require('fs');
const path = require('path');

function listDir(dir, depth = 0) {
  if (depth > 3) return '[max depth]';
  try {
    const items = fs.readdirSync(dir);
    return items.map(item => {
      const fullPath = path.join(dir, item);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          return { [item]: listDir(fullPath, depth + 1) };
        }
        return item;
      } catch (e) {
        return `${item} (error: ${e.message})`;
      }
    });
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

module.exports = async (req, res) => {
  const info = {
    message: 'Debug handler v2',
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    __dirname,
    cwd: process.cwd(),
    env: {
      VERCEL: process.env.VERCEL,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_REGION: process.env.VERCEL_REGION,
    }
  };
  
  // Check directory structure
  info.rootContents = listDir(__dirname, 0);
  info.parentContents = listDir(path.join(__dirname, '..'), 0);
  
  // Check if main.js exists
  const mainPath = path.join(__dirname, '..', 'dist', 'main.js');
  info.mainPath = mainPath;
  info.mainExists = fs.existsSync(mainPath);
  
  if (info.mainExists) {
    info.mainSize = fs.statSync(mainPath).size;
  }
  
  return res.status(200).json(info);
};
