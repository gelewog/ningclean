const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('[Railway Build] Starting...');

// Copy Prisma schema dari root ke apps/api
const rootPrisma = path.join(__dirname, '..', '..', 'prisma');
const localPrisma = path.join(__dirname, 'prisma');

if (!fs.existsSync(localPrisma)) {
  fs.mkdirSync(localPrisma, { recursive: true });
}

// Copy schema.prisma
const schemaSrc = path.join(rootPrisma, 'schema.prisma');
const schemaDest = path.join(localPrisma, 'schema.prisma');

if (fs.existsSync(schemaSrc)) {
  fs.copyFileSync(schemaSrc, schemaDest);
  console.log('[Railway Build] Copied schema.prisma');
} else {
  console.error('[Railway Build] schema.prisma not found at', schemaSrc);
  process.exit(1);
}

// Copy migrations juga kalau ada
const migrationsSrc = path.join(rootPrisma, 'migrations');
const migrationsDest = path.join(localPrisma, 'migrations');

if (fs.existsSync(migrationsSrc)) {
  fs.cpSync(migrationsSrc, migrationsDest, { recursive: true });
  console.log('[Railway Build] Copied migrations');
}

// Run Prisma generate
console.log('[Railway Build] Running prisma generate...');
execSync('npx prisma generate', { stdio: 'inherit', cwd: __dirname });

// Run Nest build
console.log('[Railway Build] Running nest build...');
execSync('npx nest build', { stdio: 'inherit', cwd: __dirname });

console.log('[Railway Build] Complete!');
