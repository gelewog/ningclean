// Script untuk menambahkan blog categories via API
// Jalankan: npx ts-node scripts/seed-blog-categories.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

// Token dari login admin
const ADMIN_EMAIL = 'admin@ningclean.com'
const ADMIN_PASSWORD = 'admin123'

const categories = [
  {
    name: 'Tips Kebersihan',
    slug: 'tips-kebersihan',
    description: 'Tips dan trik menjaga kebersihan rumah sehari-hari',
    order: 1,
  },
  {
    name: 'Deep Cleaning',
    slug: 'deep-cleaning',
    description: 'Panduan lengkap tentang layanan deep cleaning profesional',
    order: 2,
  },
  {
    name: 'Perawatan Rumah',
    slug: 'perawatan-rumah',
    description: 'Tips merawat rumah agar tetap nyaman dan bersih',
    order: 3,
  },
  {
    name: 'Kebersihan Kantor',
    slug: 'kebersihan-kantor',
    description: 'Menjaga kebersihan dan kenyamanan area kerja',
    order: 4,
  },
  {
    name: 'Pembersihan Sofa',
    slug: 'pembersihan-sofa',
    description: 'Cara merawat dan membersihkan sofa dengan benar',
    order: 5,
  },
  {
    name: 'Cuci Spring Bed',
    slug: 'cuci-spring-bed',
    description: 'Panduan perawatan spring bed dan kasur',
    order: 6,
  },
  {
    name: 'Cuci Karpet',
    slug: 'cuci-karpet',
    description: 'Tips membersihkan dan merawat karpet',
    order: 7,
  },
  {
    name: 'Membersihkan Dinding',
    slug: 'membersihkan-dinding',
    description: 'Teknik membersihkan dinding rumah berbagai jenis',
    order: 8,
  },
  {
    name: 'Kesehatan & Hygiene',
    slug: 'kesehatan-hygiene',
    description: 'Artikel tentang pentingnya kebersihan untuk kesehatan',
    order: 9,
  },
  {
    name: 'Produk Pembersih',
    slug: 'produk-pembersih',
    description: 'Review dan rekomendasi produk pembersih terbaik',
    order: 10,
  },
  {
    name: 'Tutorial Cleaning',
    slug: 'tutorial-cleaning',
    description: 'Video dan panduan tutorial teknik membersihkan',
    order: 11,
  },
  {
    name: 'FAQ',
    slug: 'faq',
    description: 'Pertanyaan yang sering diajukan tentang layanan cleaning',
    order: 12,
  },
]

async function login() {
  console.log('Logging in as admin...')
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  const data = await response.json()
  return data.access_token
}

async function createCategory(token: string, category: typeof categories[0]) {
  const response = await fetch(`${API_BASE}/blog-categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(error.message)
  }

  return response.json()
}

async function main() {
  console.log('=== SEEDING BLOG CATEGORIES ===\n')

  try {
    const token = await login()
    console.log('Login successful!\n')

    let successCount = 0
    let errorCount = 0

    for (const category of categories) {
      try {
        console.log(`Creating: ${category.name}...`)
        await createCategory(token, category)
        console.log(`  ✓ Created: ${category.slug}`)
        successCount++
      } catch (error: any) {
        if (error.message.includes('Unique constraint') || error.message.includes('already exists')) {
          console.log(`  ⚠ Already exists: ${category.slug}`)
        } else {
          console.log(`  ✗ Error: ${error.message}`)
          errorCount++
        }
      }
    }

    console.log(`\n=== RESULT ===`)
    console.log(`Success: ${successCount}`)
    console.log(`Errors: ${errorCount}`)

  } catch (error) {
    console.error('Fatal error:', error)
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit())
