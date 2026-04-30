@echo off
set NEXT_PUBLIC_API_URL=https://ningcleanapi-production.up.railway.app/api
cd /d C:\Users\user\.openclaw\workspace\ningclean\apps\admin
echo %NEXT_PUBLIC_API_URL% | npx vercel env add NEXT_PUBLIC_API_URL production --yes
