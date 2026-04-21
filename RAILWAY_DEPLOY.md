# Railway Deployment Guide for NingClean API

## Project URL
https://railway.com/project/e718b289-739c-4361-ba04-299e2f767ce8

## Environment Variables (Required)

Set these in Railway Dashboard → Project → Variables:

```
DATABASE_URL=postgresql://postgres:Kurcool@721@db.jdfgbjvzpmcjelwjzfen.supabase.co:5432/postgres
JWT_SECRET=8b6844e897f5547dc8a80dc85e57422435e8952c00057629907e25caa8fb7cd5dbec212ad73f6a38fc8e737ab62906526e1bbe21e730d1a10742af424bce6b68
JWT_EXPIRES_IN=7d
PORT=4000
NODE_ENV=production
SUPABASE_URL=https://jdfgbjvzpmcjelwjzfen.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZmdianZ6cG1jamVsd2p6ZmVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3Mzc0NzYsImV4cCI6MjA5MjMxMzQ3Nn0.BA6UmDQrAeyRxjTwT7-yqVgRHz8EDGz4jdSTkmShUQQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZmdianZ6cG1jamVsd2p6ZmVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjczNzQ3NiwiZXhwIjoyMDkyMzEzNDc2fQ.9EM0gY4fmPbZKbhv1dz1tPLQMnSFY8QE9zjQFZZZq3A
FRONTEND_URL=https://ningclean.vercel.app
```

## Build Settings

In Railway Dashboard → Service → Settings:

- **Root Directory:** `apps/api`
- **Build Command:** `npx prisma generate && npm run build`
- **Start Command:** `npm run start:prod`

## Steps to Deploy

1. Go to https://railway.com/project/e718b289-739c-4361-ba04-299e2f767ce8
2. Click on "ningclean-api" service
3. Go to "Variables" tab
4. Add all environment variables above
5. Go to "Settings" tab
6. Verify build and start commands
7. Click "Deploy" to redeploy

## Verify Deployment

After successful deploy, test:
- https://[railway-domain]/api/health

## Update Frontend URLs

Once Railway API is live, update these:

1. **Web App:** Update `NEXT_PUBLIC_API_URL` to Railway URL
2. **Admin App:** Update `NEXT_PUBLIC_API_URL` to Railway URL
3. **Railway:** Add `FRONTEND_URL` for CORS
