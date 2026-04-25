# Railway Deployment Guide

## Perubahan yang Dilakukan

### 1. Dockerfile - Build Multi-stage yang Benar

File `Dockerfile` di root sudah diperbarui untuk:
- Menggunakan `node:20-slim` sebagai base image
- Menginstall OpenSSL (required oleh Prisma)
- Meng-copy `package.json` dari root dan `apps/api`
- Meng-copy `prisma` folder dari root
- Menjalankan `prisma generate` untuk generate Prisma Client
- Build aplikasi NestJS

### 2. railway.json - Konfigurasi Deploy

File `railway.json` diperbarui dengan:
- Builder: `DOCKERFILE`
- Health check path: `/api/` (root endpoint dengan prefix `/api`)

### 3. Prisma Schema Location

Schema Prisma berada di `prisma/schema.prisma` (root folder).
Generator output: `../apps/api/node_modules/.prisma/client`

## Langkah Deploy ke Railway

1. **Push perubahan ke GitHub:**
   ```bash
   git add .
   git commit -m "Fix Railway deployment: update Dockerfile and railway.json"
   git push
   ```

2. **Deploy di Railway Dashboard:**
   - Railway akan otomatis membaca `railway.json`
   - Build menggunakan Dockerfile yang diperbarui
   - Health check ke `/api/`

3. **Environment Variables yang Diperlukan:**
   Pastikan variabel berikut sudah di-set di Railway:
   - `DATABASE_URL` - PostgreSQL connection string
   - `SUPABASE_URL` - Supabase project URL
   - `SUPABASE_KEY` - Supabase service key
   - `JWT_SECRET` - JWT secret key
   - `PORT` - 4000 (default)

## Troubleshooting

### Error: Module '@prisma/client' has no exported member 'Role'

Ini terjadi karena Prisma Client belum digenerate. Pastikan:
1. `prisma/schema.prisma` ada di root folder
2. `npx prisma generate` dijalankan sebelum build
3. Dockerfile sudah meng-copy prisma folder dan menjalankan generate

### Build Gagal

Periksa logs di Railway dashboard untuk melihat error spesifik. Biasanya disebabkan oleh:
- Missing environment variables
- Database connection error saat migrate
- TypeScript compilation errors

### Health Check Gagal

Pastikan:
- App berjalan di port 4000
- Endpoint `/api/` merespons dengan status 200
- CORS settings memperbolehkan Railway domain

## Verifikasi Local Build

Untuk test build locally:

```bash
# Generate Prisma Client
npx prisma generate

# Build API
cd apps/api && npm run build

# Test run
node apps/api/dist/main.js
```

## Catatan Penting

- Prisma Client digenerate ke path custom: `apps/api/node_modules/.prisma/client`
- Enum `Role`, `BookingStatus`, `InvoiceStatus` harus tersedia setelah generate
- Railway menggunakan Docker build, bukan Nixpacks
