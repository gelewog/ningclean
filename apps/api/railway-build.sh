#!/bin/bash
set -e

echo "[Railway Build] Starting..."

# Copy Prisma schema from root
mkdir -p prisma
cp ../../prisma/schema.prisma prisma/

# Copy migrations if exist
if [ -d "../../prisma/migrations" ]; then
  cp -r ../../prisma/migrations prisma/
fi

# Install deps and build
npm install
npx prisma generate
npm run build

echo "[Railway Build] Complete!"
