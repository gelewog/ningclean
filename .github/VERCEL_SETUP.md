# Setup GitHub Actions for Vercel Deployment

## Prerequisites

1. **Buat project di Vercel Dashboard** untuk masing-masing app:
   - `ningclean-api` (sudah ada, sesuaikan saja)
   - `ningclean-admin` (Next.js)
   - `ningclean-web` (Next.js)

2. **Dapatkan Vercel Token**:
   ```bash
   vercel login
   vercel whoami
   vercel projects
   vercel teams
   ```
   Token bisa didapatkan di: https://vercel.com/account/tokens

## Setup GitHub Secrets

Tambahkan secrets berikut di GitHub Repository Settings (Settings > Secrets and variables > Actions):

```
VERCEL_TOKEN=<your_vercel_token>
VERCEL_ORG_ID=<your_org_id>
VERCEL_API_PROJECT_ID=<project_id_for_api>
VERCEL_ADMIN_PROJECT_ID=<project_id_for_admin>
VERCEL_WEB_PROJECT_ID=<project_id_for_web>
NEXT_PUBLIC_API_URL=<your_api_url>
```

## Cara mendapatkan Project IDs

1. Buka Vercel Dashboard
2. Pilih project > Settings
3. Project ID ada di bagian General > Project Settings

Atau jalankan:
```bash
vercel project ls
```

## Cara mendapatkan Org ID

```bash
vercel team ls
# atau jika personal:
cat ~/.local/share/vercel/auth.json | grep teamId
```

## Struktur Repo yang Diharapkan

```
ingclean/
├── apps/
│   ├── api/
│   │   └── vercel.json (sudah ada root)
│   ├── admin/
│   │   └── vercel.json (perlu dibuat)
│   └── web/
│       └── vercel.json (perlu dibuat)
└── .github/
    └── workflows/
        └── deploy.yml
```

## Vercel.json untuk Admin dan Web

### apps/admin/vercel.json
```json
{
  "version": 2,
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### apps/web/vercel.json
```json
{
  "version": 2,
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

## Trigger Deployment

Setelah setup selesai, push ke GitHub akan otomatis trigger deployment ke semua 3 apps di Vercel!

```bash
git add .
git commit -m "feat: add GitHub Actions for multi-app deployment"
git push origin master
```

Note: Deployment akan berjalan berurutan - API dulu, lalu Admin dan Web secara paralel.
