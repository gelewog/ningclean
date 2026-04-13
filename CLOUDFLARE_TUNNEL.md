# Cloudflare Tunnel Setup for NingClean

## Why Cloudflare Tunnel?
- ✅ Free & unlimited bandwidth
- ✅ No connection timeout (ngrok timeout 2 jam free tier)
- ✅ Custom subdomain (ningclean.pages.dev atau subdomain sendiri)
- ✅ HTTPS auto-generated
- ✅ More stable than ngrok

## Prerequisites
1. Akun Cloudflare (free tier ok)
2. Domain di Cloudflare (optional, bisa pakai *.trycloudflare.com)

## Installation

### Windows (PowerShell as Admin)
```powershell
# Download cloudflared
winget install --id Cloudflare.cloudflared

# Atau manual download:
# https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
```

## Setup Steps

### 1. Login ke Cloudflare
```powershell
cloudflared tunnel login
```
- Buka URL yang muncul di browser
- Pilih domain yang mau dipakai
- Authorize

### 2. Create Tunnel
```powershell
cloudflared tunnel create ningclean-local
```
- Ini akan generate tunnel ID dan credentials file
- Catat tunnel ID-nya

### 3. Configure Tunnel
Edit file config di:
`%USERPROFILE%\.cloudflared\config.yml`

Tambahkan:
```yaml
tunnel: <TUNNEL_ID>
credentials-file: %USERPROFILE%\.cloudflared\<TUNNEL_ID>.json

ingress:
  # Admin Panel (Next.js)
  - hostname: admin.ningclean.local
    service: http://localhost:3000
  
  # API Backend (NestJS)
  - hostname: api.ningclean.local
    service: http://localhost:4000
  
  # Web Public (Next.js)
  - hostname: ningclean.local
    service: http://localhost:3001
  
  # Fallback
  - service: http_status:404
```

### 4. Start Tunnel
```powershell
cloudflared tunnel run ningclean-local
```

Atau run as service (Windows):
```powershell
cloudflared service install
cloudflared service start
```

## Quick Connect (Tanpa Domain Sendiri)

Kalau mau cepat tanpa setup domain:

```powershell
# Terminal 1 - API
cd apps/api
npm run start:dev

# Terminal 2 - Admin
cd apps/admin
npm run dev

# Terminal 3 - Cloudflare Tunnel
cloudflared tunnel --url http://localhost:3000
```

Ini akan generate URL random kayak:
`https://some-random-name.trycloudflare.com`

## Multiple Services dengan 1 Tunnel

Cara paling praktis:

```powershell
# Jalankan semua service dulu:
# Terminal 1: npm run dev:api (port 4000)
# Terminal 2: npm run dev:admin (port 3000)

# Terminal 3 - Tunnel:
cloudflared tunnel --url http://localhost:3000 --http-host-header admin.local
```

## Persistent URLs (Recommended)

### 1. Named Tunnel
```powershell
# Create named tunnel
cloudflared tunnel create ningclean-admin
cloudflared tunnel create ningclean-api

# Route ke subdomain
cloudflared tunnel route dns ningclean-admin admin.ningclean.com
cloudflared tunnel route dns ningclean-api api.ningclean.com
```

### 2. Config File (Multi-service)
`%USERPROFILE%\.cloudflared\config.yml`:
```yaml
tunnel: <TUNNEL_ID>
credentials-file: C:\Users\%USERNAME%\.cloudflared\<TUNNEL_ID>.json

ingress:
  - hostname: admin.ningclean.com
    service: http://localhost:3000
    originRequest:
      noTLSVerify: true
  
  - hostname: api.ningclean.com
    service: http://localhost:4000
    originRequest:
      noTLSVerify: true
  
  - service: http_status:404
```

### 3. Run Tunnel
```powershell
cloudflared tunnel run ningclean-admin
```

## Environment Variables untuk Production

File `.env.local` di `apps/admin`:
```
NEXT_PUBLIC_API_URL=https://api.ningclean.com/api
```

Untuk local development dengan tunnel:
```
NEXT_PUBLIC_API_URL=https://api.ningclean.com/api
```

## Troubleshooting

### Error: "Cannot find tunnel"
```powershell
# Check list tunnels
cloudflared tunnel list

# Delete and recreate if needed
cloudflared tunnel delete ningclean-local
cloudflared tunnel create ningclean-local
```

### CORS Error
Tambahkan di `apps/api/src/main.ts`:
```typescript
app.enableCors({
  origin: ['https://admin.trycloudflare.com', 'http://localhost:3000'],
  credentials: true,
});
```

### Port Conflicts
Pastikan port nggak bentrok:
- Admin: 3000
- API: 4000
- Web: 3001

## Shortcut Scripts

Tambahkan di `package.json` root:
```json
{
  "scripts": {
    "tunnel": "concurrently -n API,ADMIN,TUNNEL -c green,blue,yellow \"npm run dev:api\" \"npm run dev:admin\" \"cloudflared tunnel --url http://localhost:3000\"",
    "tunnel:admin": "cloudflared tunnel --url http://localhost:3000",
    "tunnel:api": "cloudflared tunnel --url http://localhost:4000"
  }
}
```

Usage:
```powershell
# Jalankan dev + tunnel sekalian
npm run tunnel
```

## Security Notes

- URL `.trycloudflare.com` random dan secure
- Bisa set password protection via Cloudflare Access
- HTTPS enforced otomatis
- Rate limiting available di Cloudflare dashboard

## Alternatives

| Service | Pros | Cons |
|---------|------|------|
| **Cloudflare Tunnel** | Free, unlimited, stable | Setup lebih kompleks |
| **ngrok** | Gampang setup | Timeout 2 jam (free), limit bandwidth |
| **LocalTunnel** | Open source, simple | Less stable, public nodes |
| **Tailscale** | Mesh network, secure | Perlu install client |

## Recommendation

Pakai **Cloudflare Tunnel** karena:
1. Paling stabil untuk demo/production preview
2. Gratis unlimited
3. Bisa custom domain kalau punya
4. HTTPS otomatis
5. Cloudflare protection (DDoS, etc)

Kalau mau gampang setup sekali pakai: `cloudflared tunnel --url http://localhost:3000`
