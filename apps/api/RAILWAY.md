# Railway Deployment Configuration

## Prerequisites

1. Daftar akun Railway di https://railway.app
2. Install Railway CLI: `npm i -g @railway/cli`
3. Login: `railway login`

## Deployment Steps

### Option 1: Deploy dari GitHub (Recommended)

1. Buka https://railway.app/dashboard
2. Klik "New Project"
3. Pilih "Deploy from GitHub repo"
4. Pilih repo `gelewog/ningclean`
5. Pilih root directory: `apps/api`
6. Tambah environment variables (lihat bawah)
7. Deploy!

### Option 2: Deploy dari CLI

```bash
cd apps/api
railway login
railway init
railway up
```

## Environment Variables

Tambahkan di Railway Dashboard → Variables:

```
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...
PORT=3000
NODE_ENV=production
```

## Health Check

Railway akan cek endpoint `/api` untuk health check.

## Troubleshooting

- Kalau build gagal, cek logs di Railway Dashboard
- Pastikan `DATABASE_URL` valid dan database accessible
- Railway akan auto-restart kalau app crash
