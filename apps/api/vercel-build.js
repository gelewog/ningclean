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
const dest = path.join(__dirname, 'api', 'main.js');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('Copied dist/main.js to api/main.js');
  
  // Also copy node_modules dependencies that are needed
  // (Vercel handles this automatically)
} else {
  console.error('dist/main.js not found!');
  process.exit(1);
}

console.log('Build complete!');
