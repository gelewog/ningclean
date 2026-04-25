const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Build and copy to api directory for Vercel
console.log('Building for Vercel...');

// Run prisma generate
execSync('npx prisma generate', { stdio: 'inherit', cwd: __dirname });

// Run nest build  
execSync('npx nest build', { stdio: 'inherit', cwd: __dirname });

// Copy main.js to api directory
const src = path.join(__dirname, 'dist', 'main.js');
const destMain = path.join(__dirname, 'api', 'main.js');
const destIndex = path.join(__dirname, 'api', 'index.js');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, destMain);
  console.log('Copied dist/main.js to api/main.js');
  
  // Ensure api/index.js exists (wrapper that exports handler from main.js)
  if (!fs.existsSync(destIndex)) {
    console.log('Warning: api/index.js not found. Creating fallback...');
    const wrapper = `// Vercel Serverless Handler for NestJS
const mainModule = require('./main.js');
module.exports = mainModule.default || mainModule.handler || mainModule;
module.exports.default = mainModule.default || mainModule.handler || mainModule;
module.exports.handler = mainModule.default || mainModule.handler || mainModule;
`;
    fs.writeFileSync(destIndex, wrapper);
    console.log('Created api/index.js wrapper');
  }
} else {
  console.error('dist/main.js not found!');
  process.exit(1);
}

console.log('Build complete!');
