const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('[Vercel Build] Starting...');

// Copy Prisma schema dari root
const rootPrisma = path.join(__dirname, '..', '..', 'prisma');
const localPrisma = path.join(__dirname, 'prisma');

if (!fs.existsSync(localPrisma)) {
  fs.mkdirSync(localPrisma, { recursive: true });
}

const schemaSrc = path.join(rootPrisma, 'schema.prisma');
const schemaDest = path.join(localPrisma, 'schema.prisma');

if (fs.existsSync(schemaSrc)) {
  fs.copyFileSync(schemaSrc, schemaDest);
  console.log('[Vercel Build] Copied schema.prisma');
} else {
  console.error('[Vercel Build] schema.prisma not found!');
  process.exit(1);
}

// Copy migrations
const migrationsSrc = path.join(rootPrisma, 'migrations');
const migrationsDest = path.join(localPrisma, 'migrations');
if (fs.existsSync(migrationsSrc)) {
  fs.cpSync(migrationsSrc, migrationsDest, { recursive: true });
  console.log('[Vercel Build] Copied migrations');
}

// Run Prisma generate
console.log('[Vercel Build] Running prisma generate...');
execSync('npx prisma generate', { stdio: 'inherit', cwd: __dirname });

// Run Nest build
console.log('[Vercel Build] Running nest build...');
execSync('npx nest build', { stdio: 'inherit', cwd: __dirname });

console.log('[Vercel Build] Complete!');
