# Manual API Deployment Guide

## Overview
API tidak auto-deploy. Deploy manual saat diperlukan.

## Quick Deploy

### 1. Build Locally
```bash
cd apps/api
npm run build
```

### 2. Deploy ke Vercel (Manual)
```bash
cd apps/api
vercel --prod
```

Atau deploy ke platform lain (Railway, VPS, dll).

## Auto-Deploy Apps

GitHub Actions otomatis deploy:
- ✅ Admin Panel (Next.js)
- ✅ Website (Next.js)

## Environment Variables API (Manual Setup)

Set manual di Vercel Dashboard atau platform pilihan:

```
DATABASE_URL=
JWT_SECRET=
SUPABASE_URL=
SUPABASE_KEY=
```
