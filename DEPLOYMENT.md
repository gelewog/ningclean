# NingClean Deployment Guide

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Admin Panel   │────▶│  Backend API    │────▶│   PostgreSQL   │
│   (Next.js)     │     │   (NestJS)      │     │   (Database)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
     Vercel                  Railway                Railway
```

## Required Environment Variables

### Admin Panel (Next.js) - Vercel
```
NEXT_PUBLIC_API_URL=https://api.ningclean.com/api
```

### Backend API (NestJS) - Railway/Render
```
DATABASE_URL=postgresql://user:pass@host:5432/ningclean
JWT_SECRET=your-jwt-secret
PORT=4000
```

## Deployment Steps

### 1. Deploy Backend API (Railway/Render/Railway)

**Option A: Railway (Recommended)**
1. Push code ke GitHub
2. Connect Railway ke repo
3. Set environment variables
4. Deploy

**Option B: Render**
1. Create new Web Service
2. Connect GitHub repo
3. Set build command: `cd apps/api && npm install && npm run build`
4. Set start command: `cd apps/api && npm run start:prod`
5. Set env variables

### 2. Deploy Admin Panel (Vercel)

1. Push code ke GitHub
2. Import project di Vercel
3. Set root directory: `apps/admin`
4. Set environment variables
5. Deploy

## Database Migration

Setelah deploy API, jalankan migration:
```bash
npx prisma migrate deploy
```

## URL Structure

- **Admin Panel**: https://admin.ningclean.com
- **Backend API**: https://api.ningclean.com
- **Web (Public)**: https://ningclean.com

## Checklist

- [ ] GitHub repo connected
- [ ] Database running (Railway/Supabase)
- [ ] API deployed and healthy
- [ ] Admin panel deployed
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] CORS configured in API
- [ ] Test login works

## Troubleshooting

### CORS Error
Tambahkan di `apps/api/src/main.ts`:
```typescript
app.enableCors({
  origin: ['https://admin.ningclean.com', 'https://ningclean.com'],
  credentials: true,
});
```

### Build Error
Pastikan `package.json` scripts benar:
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

### API Not Found
Pastikan `NEXT_PUBLIC_API_URL` di Vercel points ke deployed API.
